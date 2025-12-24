/**
 * Types for Sendr Email API
 */

export interface Recipient {
  email: string;
  name?: string;
  substitutions?: Record<string, any>;
}

export interface EmailConfig {
  subject: string;
  from: string;
  fromName?: string;
  body: string;
  headers?: Record<string, string>;
}

export interface SendEmailRequest {
  recipients: Recipient[];
  emailConfig: EmailConfig;
}

export interface EmailLimits {
  limit: number;
  used: number;
  remaining: number;
  requested: number;
}

export interface SendEmailResponse {
  status: string;
  message: string;
  limits: EmailLimits;
  batchId?: string;
}

// Domain API Types
export interface DNSRecord {
  type?: string;
  name?: string;
  value?: string;
  ttl?: number;
}

export interface Domain {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description?: string;
  sendingEmail: string;
  dnsRecords: DNSRecord[];
  isActive: boolean;
  isApproved: boolean;
  isVerified: boolean;
}

export interface DomainListResponse {
  domains: Domain[];
  count: number;
}

export interface DomainVerifyResponse {
  isVerified: boolean;
}

// Tenant API Types
export interface CreateTenantRequest {
  name: string;
  domain: string;
  sendingEmail: string;
}

export interface Tenant {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  domain: string;
  sendingEmail: string;
  currentEmailCount: number;
}

// Stats API Types
export interface TenantStatistics {
  totalSent: number;
  totalDelivered: number;
  totalBounced: number;
  totalOpened: number;
  totalClicked: number;
  [key: string]: any;
}

// Logs API Types
export interface EmailLog {
  id: string;
  email: string;
  subject: string;
  status: string;
  sentAt: string;
  deliveredAt?: string;
  openedAt?: string;
  clickedAt?: string;
  bouncedAt?: string;
  [key: string]: any;
}

export interface EmailLogsResponse {
  logs: EmailLog[];
  count: number;
  [key: string]: any;
}

export interface GetLogsOptions {
  limit?: number;
  offset?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface SendrClientOptions {
  apiKey: string;
  baseUrl?: string;
  statsBaseUrl?: string;
  logsBaseUrl?: string;
}

export class SendrError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message);
    this.name = "SendrError";
    Object.setPrototypeOf(this, SendrError.prototype);
  }
}

