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
