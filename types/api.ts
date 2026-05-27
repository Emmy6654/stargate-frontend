export interface Merchant {
  id: string;
  email: string;
  name: string;
  status: 'pending' | 'active' | 'suspended';
  tier: 'standard' | 'pro' | 'enterprise';
  stellar_address?: string;
  settlement_cadence?: 'daily' | 'weekly';
  created_at: string;
}

export interface RegisterDto {
  email: string;
  name: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthTokens {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  merchant?: Merchant;
}

export type InvoiceStatus = 'pending' | 'paid' | 'expired' | 'cancelled';

export interface CreateInvoiceDto {
  amount_usdc: number;
  description?: string;
  expires_in_minutes?: number;
}

export interface Invoice {
  id: string;
  merchant_id: string;
  amount_usdc: string;
  gross_usdc: string;
  fee_usdc: string;
  net_usdc: string;
  description?: string;
  status: InvoiceStatus;
  muxed_address: string;
  payment_url: string;
  expires_at: string;
  paid_at?: string;
  created_at: string;
}

export interface InvoiceListResponse {
  page: number;
  limit: number;
  total: number;
  items: Invoice[];
}

export interface PublicInvoice {
  id: string;
  gross_usdc: string;
  description?: string;
  merchant_name: string;
  status: InvoiceStatus;
  muxed_address: string;
  expires_at: string;
}

export type KYCDocumentType = 'passport' | 'drivers_license' | 'national_id' | 'business_license';

export type KYCSubmissionStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'pending_review';

export interface KYCDocument {
  id: string;
  document_type: KYCDocumentType;
  file_name: string;
  file_size: number;
  file_url?: string;
  uploaded_at: string;
}

export interface KYCSubmission {
  id: string;
  merchant_id: string;
  status: KYCSubmissionStatus;
  documents: KYCDocument[];
  submitted_at?: string;
  reviewed_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface UploadDocumentDto {
  document_type: KYCDocumentType;
  file: File;
}

export interface SubmitKYCDto {
  document_ids: string[];
}
