# CONTEXT.md

## Project Overview

**InvoiceBox** is a complete invoice management application built with Next.js and SQLite. It allows users to manage clients, create quotes and invoices with automatic numbering, section-based billing with multiple units, and automatic VAT calculation.

## Technology Stack

- **Framework**: Next.js 15.5.0 (App Router)
- **Runtime**: React 19.1.0
- **Database**: SQLite 3 (via sqlite3 package)
- **Styling**: Tailwind CSS 4
- **TypeScript**: Version 5 with strict mode
- **Build Tool**: Turbopack (via Next.js)

## Project Structure

```
/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes (REST endpoints)
│   │   │   ├── clients/       # Client CRUD operations
│   │   │   ├── invoices/      # Invoice operations
│   │   │   └── quotes/        # Quote operations
│   │   ├── clients/           # Client management pages
│   │   ├── documents/         # Document viewing pages
│   │   ├── invoices/          # Invoice pages
│   │   ├── quotes/            # Quote pages
│   │   ├── layout.tsx         # Root layout with fonts
│   │   ├── page.tsx           # Homepage/dashboard
│   │   └── globals.css        # Global styles
│   ├── lib/                   # Shared utilities and services
│   │   ├── database.ts        # Database connection and schema
│   │   └── services/          # Business logic services
│   │       ├── clientService.ts
│   │       └── documentService.ts
│   └── types/                 # TypeScript type definitions
│       └── index.ts
├── invoicebox.db              # SQLite database file
├── package.json
├── tsconfig.json
├── CLAUDE.md                  # AI assistant instructions
└── README.md
```

## Database Schema

### Tables

1. **clients**
   - `id` (INTEGER PRIMARY KEY)
   - `name` (TEXT NOT NULL)
   - `address` (TEXT NOT NULL)
   - `created_at`, `updated_at` (DATETIME)

2. **documents** (unified table for quotes and invoices)
   - `id` (INTEGER PRIMARY KEY)
   - `type` (TEXT: 'quote' | 'invoice')
   - `number` (TEXT UNIQUE) - Format: YYYYMM-XXXX
   - `client_id` (INTEGER FK to clients)
   - `my_address`, `client_address` (TEXT)
   - `subtotal`, `vat_rate`, `vat_amount`, `total` (REAL)
   - `created_at`, `updated_at` (DATETIME)

3. **document_sections** (line items for documents)
   - `id` (INTEGER PRIMARY KEY)
   - `document_id` (INTEGER FK to documents)
   - `name`, `description` (TEXT)
   - `unit` (TEXT: 'day' | 'hour' | 'mission')
   - `quantity`, `unit_price`, `total` (REAL)
   - `sort_order` (INTEGER)

4. **document_counters** (auto-incrementing counters)
   - `type` (TEXT PRIMARY KEY: 'quote' | 'invoice')
   - `counter` (INTEGER)

## Key Features

### Client Management
- Full CRUD operations for clients
- Client listing with search/filter capabilities
- Address management for billing

### Document Management
- **Quote Creation**: Generate quotes with automatic numbering
- **Invoice Creation**: Convert quotes to invoices or create new invoices
- **Auto-numbering**: Format YYYYMM-XXXX (year-month-sequence)
- **Section-based Billing**: Multiple line items per document
- **Unit Types**: day, hour, mission billing units
- **VAT Calculation**: Automatic VAT calculation (default 20%)
- **Document Viewing**: Print-friendly document display

### Business Logic
- **Number Generation**: Automatic sequential numbering by type and month
- **Total Calculation**: Automatic subtotal, VAT, and total calculation
- **Address Copying**: Client addresses copied to documents for historical accuracy

## API Endpoints

### Client Endpoints
- `GET /api/clients` - List all clients
- `POST /api/clients` - Create new client
- `GET /api/clients/[id]` - Get client by ID
- `PUT /api/clients/[id]` - Update client
- `DELETE /api/clients/[id]` - Delete client

### Document Endpoints
- `GET /api/quotes` - List all quotes
- `POST /api/quotes` - Create new quote
- `GET /api/quotes/[id]` - Get quote by ID
- `DELETE /api/quotes/[id]` - Delete quote
- `GET /api/invoices` - List all invoices
- `POST /api/invoices` - Create new invoice
- `GET /api/invoices/[id]` - Get invoice by ID
- `DELETE /api/invoices/[id]` - Delete invoice

## TypeScript Types

### Core Interfaces
```typescript
interface Client {
  id: number;
  name: string;
  address: string;
  created_at: string;
  updated_at: string;
}

interface Document {
  id: number;
  type: 'quote' | 'invoice';
  number: string;
  client_id: number;
  my_address: string;
  client_address: string;
  subtotal: number;
  vat_rate: number;
  vat_amount: number;
  total: number;
  created_at: string;
  updated_at: string;
  client?: Client;
  sections?: DocumentSection[];
}

interface DocumentSection {
  id: number;
  document_id: number;
  name: string;
  description: string;
  unit: 'day' | 'hour' | 'mission';
  quantity: number;
  unit_price: number;
  total: number;
  sort_order: number;
}
```

## Services Architecture

### ClientService
- `createClient()` - Create new client with validation
- `getClientById()` - Fetch client by ID
- `getAllClients()` - List all clients ordered by name
- `updateClient()` - Update client with partial data
- `deleteClient()` - Delete client by ID

### DocumentService
- `generateDocumentNumber()` - Auto-generate sequential document numbers
- `createDocument()` - Create document with sections and calculations
- `getDocumentById()` - Fetch document with client and sections
- `getAllDocuments()` - List documents with optional type filtering
- `deleteDocument()` - Delete document and cascade sections

## Frontend Architecture

### Page Structure
- **App Router**: Using Next.js 13+ App Router structure
- **Client Components**: Interactive components with 'use client' directive
- **Server Components**: Default server-side rendering for pages
- **Responsive Design**: Tailwind CSS with mobile-first approach

### Key Pages
- `/` - Dashboard with navigation cards
- `/clients` - Client management with table view
- `/clients/new` - Client creation form
- `/clients/[id]/edit` - Client editing form
- `/quotes` - Quote listing and management
- `/quotes/new` - Quote creation form
- `/quotes/[id]` - Quote detail and print view
- `/invoices` - Invoice listing and management
- `/invoices/new` - Invoice creation form
- `/invoices/[id]` - Invoice detail and print view
- `/documents` - Combined view of all quotes and invoices

## Development Commands

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production with Turbopack
npm run start        # Start production server
npm run lint         # Run ESLint checks
```

## Database Connection

- **File**: SQLite database stored as `invoicebox.db` in project root
- **Connection**: Singleton pattern with automatic initialization
- **Schema**: Auto-created tables with IF NOT EXISTS clauses
- **Migration**: Manual schema updates in `database.ts`

## Styling Approach

- **Tailwind CSS**: Utility-first CSS framework
- **Design System**: Consistent spacing, colors, and typography
- **Responsive**: Mobile-first responsive design
- **Components**: Reusable component patterns
- **Print Styles**: Print-friendly document layouts

## Error Handling

- **API Errors**: Consistent error responses with status codes
- **Client Errors**: User-friendly error messages and alerts
- **Database Errors**: Proper error propagation and logging
- **Validation**: Input validation on both client and server

## State Management

- **React State**: Using useState and useEffect for component state
- **No External State**: No Redux, Zustand, or other state management
- **Server State**: API calls with fetch and manual state updates
- **Local State**: Form state managed locally in components

## Key Implementation Notes

1. **Document Numbering**: Auto-incremented counters per type, format YYYYMM-XXXX
2. **VAT Handling**: Default 20% VAT rate, configurable per document
3. **Address Snapshots**: Client addresses copied to documents for historical accuracy
4. **Cascade Deletes**: Document sections deleted automatically with documents
5. **Sort Order**: Document sections maintain display order via sort_order field
6. **Type Safety**: Full TypeScript coverage with strict mode enabled
7. **Database Promises**: Promisified SQLite operations for async/await patterns
8. **Error Boundaries**: Comprehensive error handling throughout the application

This application follows modern Next.js patterns with a clean separation between presentation, business logic, and data access layers.