import { getDatabase } from '../database';
import { Document, DocumentSection, CreateDocumentRequest, CreateDocumentSectionRequest } from '@/types';
import { promisify } from 'util';

export class DocumentService {
  static async generateDocumentNumber(type: 'quote' | 'invoice'): Promise<string> {
    const db = await getDatabase();
    const get = promisify(db.getDb().get.bind(db.getDb()));

    // Get current counter and increment it
    const counterRow = await get(
      'SELECT counter FROM document_counters WHERE type = ?',
      [type]
    ) as { counter: number };

    const newCounter = counterRow.counter + 1;

    return new Promise((resolve, reject) => {
      db.getDb().run(
        'UPDATE document_counters SET counter = ? WHERE type = ?',
        [newCounter, type],
        function(err) {
          if (err) {
            reject(err);
            return;
          }

          // Generate number with type prefix: F- for invoices, D- for quotes
          const prefix = type === 'invoice' ? 'F-' : 'D-';
          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const sequence = String(newCounter).padStart(4, '0');

          resolve(`${prefix}${year}${month}-${sequence}`);
        }
      );
    });
  }

  static async createDocument(data: CreateDocumentRequest): Promise<Document> {
    const db = await getDatabase();
    const get = promisify(db.getDb().get.bind(db.getDb()));

    // Get client address
    const client = await get('SELECT address FROM clients WHERE id = ?', [data.client_id]);
    if (!client) {
      throw new Error('Client not found');
    }

    // Generate document number
    const number = await this.generateDocumentNumber(data.type);

    // Calculate totals
    const subtotal = data.sections.reduce((sum, section) => 
      sum + (section.quantity * section.unit_price), 0
    );
    const vatRate = data.vat_rate || 0.20;
    const vatAmount = subtotal * vatRate;
    const total = subtotal + vatAmount;

    return new Promise((resolve, reject) => {
      // Create document
      db.getDb().run(
        `INSERT INTO documents (type, number, client_id, quote_id, my_address, my_name, my_email, my_phone, my_website, my_siren, my_vat_number, my_bank, my_iban, my_bic, my_terms_conditions, client_address, subtotal, vat_rate, vat_amount, total)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.type, number, data.client_id, data.quote_id || null, data.my_address, data.my_name || '', data.my_email || '', data.my_phone || '', data.my_website || '', data.my_siren || '', data.my_vat_number || '', data.my_bank || '', data.my_iban || '', data.my_bic || '', data.my_terms_conditions || '', client.address, subtotal, vatRate, vatAmount, total],
        function(err) {
          if (err) {
            reject(err);
            return;
          }

          const documentId = this.lastID;

          // Create sections
          const sectionPromises = data.sections.map((section, i) => {
            const sectionTotal = section.quantity * section.unit_price;
            
            return new Promise((sectionResolve, sectionReject) => {
              db.getDb().run(
                `INSERT INTO document_sections (document_id, name, description, unit, quantity, unit_price, total, sort_order)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [documentId, section.name, section.description, section.unit, section.quantity, section.unit_price, sectionTotal, i],
                function(sectionErr) {
                  if (sectionErr) {
                    sectionReject(sectionErr);
                  } else {
                    sectionResolve(this.lastID);
                  }
                }
              );
            });
          });

          Promise.all(sectionPromises)
            .then(() => {
              DocumentService.getDocumentById(documentId)
                .then(resolve)
                .catch(reject);
            })
            .catch(reject);
        }
      );
    });
  }

  static async getDocumentById(id: number): Promise<Document> {
    const db = await getDatabase();
    const get = promisify(db.getDb().get.bind(db.getDb()));
    const all = promisify(db.getDb().all.bind(db.getDb()));

    const document = await get(
      `SELECT d.*, c.name as client_name, c.siren as client_siren, c.vat_number as client_vat_number,
              q.number as quote_number, q.id as quote_document_id,
              i.number as invoice_number, i.id as invoice_document_id
       FROM documents d 
       LEFT JOIN clients c ON d.client_id = c.id 
       LEFT JOIN documents q ON d.quote_id = q.id
       LEFT JOIN documents i ON i.quote_id = d.id AND i.type = 'invoice'
       WHERE d.id = ?`,
      [id]
    ) as Document;

    if (!document) {
      throw new Error('Document not found');
    }

    const sections = await all(
      'SELECT * FROM document_sections WHERE document_id = ? ORDER BY sort_order',
      [id]
    ) as DocumentSection[];

    document.sections = sections;

    return document;
  }

  static async getAllDocuments(type?: 'quote' | 'invoice'): Promise<Document[]> {
    const db = await getDatabase();
    const all = promisify(db.getDb().all.bind(db.getDb()));

    let query = `
      SELECT d.*, c.name as client_name, c.siren as client_siren, c.vat_number as client_vat_number 
      FROM documents d 
      LEFT JOIN clients c ON d.client_id = c.id
    `;
    const params: any[] = [];

    if (type) {
      query += ' WHERE d.type = ?';
      params.push(type);
    }

    query += ' ORDER BY d.created_at DESC';

    const documents = await all(query, params) as Document[];
    return documents;
  }

  static async createInvoiceFromQuote(quoteId: number): Promise<Document> {
    const db = await getDatabase();
    
    // Get the original quote with all its data
    const quote = await this.getDocumentById(quoteId);
    
    if (!quote) {
      throw new Error('Quote not found');
    }
    
    if (quote.type !== 'quote') {
      throw new Error('Document is not a quote');
    }

    // Create invoice data based on quote
    const invoiceData: CreateDocumentRequest = {
      type: 'invoice',
      client_id: quote.client_id,
      quote_id: quoteId,
      my_address: quote.my_address,
      my_name: quote.my_name,
      my_email: quote.my_email,
      my_phone: quote.my_phone,
      my_website: quote.my_website,
      my_siren: quote.my_siren,
      my_vat_number: quote.my_vat_number,
      my_bank: quote.my_bank,
      my_iban: quote.my_iban,
      my_bic: quote.my_bic,
      my_terms_conditions: quote.my_terms_conditions,
      sections: quote.sections?.map(section => ({
        name: section.name,
        description: section.description,
        unit: section.unit,
        quantity: section.quantity,
        unit_price: section.unit_price
      })) || [],
      vat_rate: quote.vat_rate
    };

    return this.createDocument(invoiceData);
  }

  static async deleteDocument(id: number): Promise<boolean> {
    const db = await getDatabase();

    return new Promise((resolve, reject) => {
      db.getDb().run(
        'DELETE FROM documents WHERE id = ?',
        [id],
        function(err) {
          if (err) {
            reject(err);
            return;
          }

          // 'this' context contains changes in SQLite3
          const changes = this.changes;
          console.log('Delete document result - changes:', changes);
          resolve(changes > 0);
        }
      );
    });
  }
}