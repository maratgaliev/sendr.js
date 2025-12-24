import {
  SendEmailRequest,
  SendEmailResponse,
  SendrClientOptions,
  SendrError,
  DomainListResponse,
  DomainVerifyResponse,
  CreateTenantRequest,
  Tenant,
  TenantStatistics,
  EmailLogsResponse,
  GetLogsOptions,
} from "./types";

/**
 * Sendr Email API Client
 */
export class SendrClient {
  private apiKey: string;
  private baseUrl: string;
  private statsBaseUrl: string;
  private logsBaseUrl: string;

  constructor(options: SendrClientOptions) {
    if (!options.apiKey) {
      throw new Error("API key is required");
    }
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl || "https://sending.sendrapp.org";
    this.statsBaseUrl = options.statsBaseUrl || "https://stats.sendrapp.org";
    this.logsBaseUrl = options.logsBaseUrl || "https://logs.sendrapp.org";
  }

  /**
   * Make an authenticated API request
   */
  private async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: this.apiKey,
          ...options.headers,
        },
      });

      const data = (await response.json()) as any;

      if (!response.ok) {
        throw new SendrError(
          data.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          data
        );
      }

      return data as T;
    } catch (error) {
      if (error instanceof SendrError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new SendrError(
          `API request failed: ${error.message}`,
          undefined,
          error
        );
      }

      throw new SendrError("API request failed: Unknown error");
    }
  }

  /**
   * Send an email to one or more recipients
   * @param request Email request with recipients and email configuration
   * @returns Promise resolving to the send email response
   * @throws SendrError if the request fails
   */
  async sendEmail(request: SendEmailRequest): Promise<SendEmailResponse> {
    // Validate recipients
    if (!request.recipients || request.recipients.length === 0) {
      throw new Error("At least one recipient is required");
    }

    if (request.recipients.length > 100) {
      throw new Error(
        "Maximum 100 recipients per API call. You provided " +
          request.recipients.length
      );
    }

    // Validate email config
    if (!request.emailConfig) {
      throw new Error("emailConfig is required");
    }

    if (!request.emailConfig.subject) {
      throw new Error("emailConfig.subject is required");
    }

    if (!request.emailConfig.from) {
      throw new Error("emailConfig.from is required");
    }

    if (!request.emailConfig.body) {
      throw new Error("emailConfig.body is required");
    }

    const url = `${this.baseUrl}/email`;

    return this.request<SendEmailResponse>(url, {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  /**
   * Send an email to a single recipient (convenience method)
   * @param recipientEmail Email address of the recipient
   * @param emailConfig Email configuration
   * @returns Promise resolving to the send email response
   */
  async sendEmailTo(
    recipientEmail: string,
    emailConfig: SendEmailRequest["emailConfig"]
  ): Promise<SendEmailResponse> {
    return this.sendEmail({
      recipients: [{ email: recipientEmail }],
      emailConfig,
    });
  }

  /**
   * Get a list of all domains associated with your tenant
   * @returns Promise resolving to the domain list response
   * @throws SendrError if the request fails
   */
  async getDomains(): Promise<DomainListResponse> {
    const url = `${this.baseUrl}/v2/domain`;
    return this.request<DomainListResponse>(url, {
      method: "GET",
    });
  }

  /**
   * Verify a domain's DNS settings
   * @param domainId Domain ID to verify
   * @returns Promise resolving to the verification response
   * @throws SendrError if the request fails
   */
  async verifyDomain(domainId: string): Promise<DomainVerifyResponse> {
    if (!domainId) {
      throw new Error("Domain ID is required");
    }

    const url = `${this.baseUrl}/v2/domain/${domainId}/verify`;
    return this.request<DomainVerifyResponse>(url, {
      method: "POST",
    });
  }

  /**
   * Create a new tenant/workspace
   * @param request Tenant creation request
   * @returns Promise resolving to the created tenant
   * @throws SendrError if the request fails
   */
  async createTenant(request: CreateTenantRequest): Promise<Tenant> {
    if (!request.name) {
      throw new Error("Tenant name is required");
    }
    if (!request.domain) {
      throw new Error("Domain is required");
    }
    if (!request.sendingEmail) {
      throw new Error("Sending email is required");
    }

    const url = `${this.baseUrl}/v2/tenant`;
    return this.request<Tenant>(url, {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  /**
   * Get tenant statistics
   * @returns Promise resolving to tenant statistics
   * @throws SendrError if the request fails
   */
  async getStatistics(): Promise<TenantStatistics> {
    const url = `${this.statsBaseUrl}/stats`;
    return this.request<TenantStatistics>(url, {
      method: "GET",
    });
  }

  /**
   * Get email logs
   * @param options Optional query parameters for filtering logs
   * @returns Promise resolving to email logs response
   * @throws SendrError if the request fails
   */
  async getLogs(options?: GetLogsOptions): Promise<EmailLogsResponse> {
    const params = new URLSearchParams();
    if (options) {
      if (options.limit) params.append("limit", options.limit.toString());
      if (options.offset) params.append("offset", options.offset.toString());
      if (options.status) params.append("status", options.status);
      if (options.startDate) params.append("startDate", options.startDate);
      if (options.endDate) params.append("endDate", options.endDate);
    }

    const queryString = params.toString();
    const url = `${this.logsBaseUrl}/logs${queryString ? `?${queryString}` : ""}`;
    return this.request<EmailLogsResponse>(url, {
      method: "GET",
    });
  }
}

