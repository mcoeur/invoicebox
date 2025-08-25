import { getDatabase } from '../database';
import { Client, CreateClientRequest, UpdateClientRequest } from '@/types';
import { promisify } from 'util';

export class ClientService {
  static async createClient(data: CreateClientRequest): Promise<Client> {
    const db = await getDatabase();
    const get = promisify(db.getDb().get.bind(db.getDb()));

    return new Promise((resolve, reject) => {
      db.getDb().run(
        'INSERT INTO clients (name, address, siren, vat_number) VALUES (?, ?, ?, ?)',
        [data.name, data.address, data.siren || null, data.vat_number || null],
        function(err) {
          if (err) {
            reject(err);
            return;
          }

          // 'this' context contains lastID in SQLite3
          const lastId = this.lastID;
          console.log('Insert successful, lastID:', lastId);

          get('SELECT * FROM clients WHERE id = ?', [lastId])
            .then(client => resolve(client as Client))
            .catch(reject);
        }
      );
    });
  }

  static async getClientById(id: number): Promise<Client | null> {
    const db = await getDatabase();
    const get = promisify(db.getDb().get.bind(db.getDb()));

    const client = await get('SELECT * FROM clients WHERE id = ?', [id]);
    return client as Client | null;
  }

  static async getAllClients(): Promise<Client[]> {
    const db = await getDatabase();
    const all = promisify(db.getDb().all.bind(db.getDb()));

    const clients = await all('SELECT * FROM clients ORDER BY name');
    return clients as Client[];
  }

  static async updateClient(id: number, data: UpdateClientRequest): Promise<Client | null> {
    const db = await getDatabase();
    const run = promisify(db.getDb().run.bind(db.getDb()));
    const get = promisify(db.getDb().get.bind(db.getDb()));

    const updates = [];
    const values = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.address !== undefined) {
      updates.push('address = ?');
      values.push(data.address);
    }
    if (data.siren !== undefined) {
      updates.push('siren = ?');
      values.push(data.siren);
    }
    if (data.vat_number !== undefined) {
      updates.push('vat_number = ?');
      values.push(data.vat_number);
    }

    if (updates.length === 0) {
      return this.getClientById(id);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    await run(
      `UPDATE clients SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return this.getClientById(id);
  }

  static async deleteClient(id: number): Promise<boolean> {
    const db = await getDatabase();

    return new Promise((resolve, reject) => {
      db.getDb().run(
        'DELETE FROM clients WHERE id = ?',
        [id],
        function(err) {
          if (err) {
            reject(err);
            return;
          }

          // 'this' context contains changes in SQLite3
          const changes = this.changes;
          console.log('Delete result - changes:', changes);
          resolve(changes > 0);
        }
      );
    });
  }
}