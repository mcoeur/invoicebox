import sqlite3 from 'sqlite3';
import { promisify } from 'util';

const DATABASE_PATH = './invoicebox.db';

class Database {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(DATABASE_PATH);
  }

  async init() {
    const run = promisify(this.db.run.bind(this.db));
    
    // Clients table
    await run(`
      CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        siren TEXT,
        vat_number TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add new columns to existing clients table if they don't exist
    await run(`ALTER TABLE clients ADD COLUMN siren TEXT`).catch(() => {});
    await run(`ALTER TABLE clients ADD COLUMN vat_number TEXT`).catch(() => {});

    // Documents table (for both quotes and invoices)
    await run(`
      CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL CHECK (type IN ('quote', 'invoice')),
        number TEXT UNIQUE NOT NULL,
        client_id INTEGER NOT NULL,
        my_address TEXT NOT NULL,
        my_name TEXT DEFAULT '',
        my_email TEXT DEFAULT '',
        my_phone TEXT DEFAULT '',
        my_website TEXT DEFAULT '',
        my_siren TEXT DEFAULT '',
        my_vat_number TEXT DEFAULT '',
        client_address TEXT NOT NULL,
        subtotal REAL NOT NULL DEFAULT 0,
        vat_rate REAL NOT NULL DEFAULT 0.20,
        vat_amount REAL NOT NULL DEFAULT 0,
        total REAL NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients (id)
      )
    `);

    // Add new columns to existing documents table if they don't exist
    await run(`ALTER TABLE documents ADD COLUMN my_name TEXT DEFAULT ''`).catch(() => {});
    await run(`ALTER TABLE documents ADD COLUMN my_email TEXT DEFAULT ''`).catch(() => {});
    await run(`ALTER TABLE documents ADD COLUMN my_phone TEXT DEFAULT ''`).catch(() => {});
    await run(`ALTER TABLE documents ADD COLUMN my_website TEXT DEFAULT ''`).catch(() => {});
    await run(`ALTER TABLE documents ADD COLUMN my_siren TEXT DEFAULT ''`).catch(() => {});
    await run(`ALTER TABLE documents ADD COLUMN my_vat_number TEXT DEFAULT ''`).catch(() => {});

    // Document sections table
    await run(`
      CREATE TABLE IF NOT EXISTS document_sections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        document_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        unit TEXT NOT NULL CHECK (unit IN ('day', 'hour', 'mission')),
        quantity REAL NOT NULL DEFAULT 1,
        unit_price REAL NOT NULL,
        total REAL NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE
      )
    `);

    // Document counter table
    await run(`
      CREATE TABLE IF NOT EXISTS document_counters (
        type TEXT PRIMARY KEY CHECK (type IN ('quote', 'invoice')),
        counter INTEGER NOT NULL DEFAULT 0
      )
    `);

    // Initialize counters
    await run(`INSERT OR IGNORE INTO document_counters (type, counter) VALUES ('quote', 0)`);
    await run(`INSERT OR IGNORE INTO document_counters (type, counter) VALUES ('invoice', 0)`);

    // User profile table (for storing "From:" information)
    await run(`
      CREATE TABLE IF NOT EXISTS user_profile (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        name TEXT NOT NULL DEFAULT '',
        address TEXT NOT NULL DEFAULT '',
        email TEXT DEFAULT '',
        phone TEXT DEFAULT '',
        website TEXT DEFAULT '',
        siren TEXT DEFAULT '',
        vat_number TEXT DEFAULT '',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add new columns to existing user_profile table if they don't exist
    await run(`ALTER TABLE user_profile ADD COLUMN siren TEXT DEFAULT ''`).catch(() => {});
    await run(`ALTER TABLE user_profile ADD COLUMN vat_number TEXT DEFAULT ''`).catch(() => {});

    // Insert default profile if it doesn't exist
    await run(`INSERT OR IGNORE INTO user_profile (id, name, address) VALUES (1, '', '')`);
  }

  getDb() {
    return this.db;
  }

  async close() {
    return new Promise<void>((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

let dbInstance: Database | null = null;

export async function getDatabase() {
  if (!dbInstance) {
    dbInstance = new Database();
    await dbInstance.init();
  }
  return dbInstance;
}