export interface Client {
  id: number;
  name: string;
  address: string;
  siren?: string;
  vat_number?: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentSection {
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

export interface Document {
  id: number;
  type: 'quote' | 'invoice';
  number: string;
  client_id: number;
  quote_id?: number;
  my_address: string;
  my_name?: string;
  my_email?: string;
  my_phone?: string;
  my_website?: string;
  my_siren?: string;
  my_vat_number?: string;
  my_bank?: string;
  my_iban?: string;
  my_bic?: string;
  my_terms_conditions?: string;
  client_address: string;
  subtotal: number;
  vat_rate: number;
  vat_amount: number;
  total: number;
  created_at: string;
  updated_at: string;
  client?: Client;
  sections?: DocumentSection[];
  client_name?: string;
  client_siren?: string;
  client_vat_number?: string;
  quote_number?: string;
  quote_document_id?: number;
  invoice_number?: string;
  invoice_document_id?: number;
}

export interface CreateClientRequest {
  name: string;
  address: string;
  siren?: string;
  vat_number?: string;
}

export interface UpdateClientRequest {
  name?: string;
  address?: string;
  siren?: string;
  vat_number?: string;
}

export interface CreateDocumentSectionRequest {
  name: string;
  description: string;
  unit: 'day' | 'hour' | 'mission';
  quantity: number;
  unit_price: number;
}

export interface CreateDocumentRequest {
  type: 'quote' | 'invoice';
  client_id: number;
  quote_id?: number;
  my_address: string;
  my_name?: string;
  my_email?: string;
  my_phone?: string;
  my_website?: string;
  my_siren?: string;
  my_vat_number?: string;
  my_bank?: string;
  my_iban?: string;
  my_bic?: string;
  my_terms_conditions?: string;
  sections: CreateDocumentSectionRequest[];
  vat_rate?: number;
}

export interface UserProfile {
  id: number;
  name: string;
  address: string;
  email?: string;
  phone?: string;
  website?: string;
  siren?: string;
  vat_number?: string;
  bank?: string;
  iban?: string;
  bic?: string;
  terms_conditions?: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateUserProfileRequest {
  name?: string;
  address?: string;
  email?: string;
  phone?: string;
  website?: string;
  siren?: string;
  vat_number?: string;
  bank?: string;
  iban?: string;
  bic?: string;
  terms_conditions?: string;
}