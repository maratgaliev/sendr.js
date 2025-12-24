# sendr-js

Official Sendr email platform SDK for Node.js and TypeScript. Send transactional emails easily with a simple, type-safe API.

## Installation

```bash
npm install sendr-js
```

**Requirements:** Node.js 18.0.0 or higher (uses native `fetch` API)

## Quick Start

```typescript
import { SendrClient } from 'sendr-js';

// Initialize the client with your API key
const client = new SendrClient({
  apiKey: 'your-api-key-here'
});

// Send an email
const response = await client.sendEmail({
  recipients: [
    { email: 'user1@example.com' },
    { email: 'user2@example.com' }
  ],
  emailConfig: {
    subject: 'Welcome to Sendr',
    from: 'noreply@yourdomain.com',
    fromName: 'Your Company',
    body: '<html><body><h1>Hello!</h1><p>Welcome to our platform.</p></body></html>'
  }
});

console.log('Email sent!', response.batchId);
```

## API Reference

### SendrClient

The main client class for interacting with the Sendr API.

#### Constructor

```typescript
new SendrClient(options: SendrClientOptions)
```

**Options:**
- `apiKey` (required): Your Sendr API key
- `baseUrl` (optional): Custom API base URL (defaults to `https://sending.sendrapp.org`)
- `statsBaseUrl` (optional): Custom stats API base URL (defaults to `https://stats.sendrapp.org`)
- `logsBaseUrl` (optional): Custom logs API base URL (defaults to `https://logs.sendrapp.org`)

#### Methods

##### `sendEmail(request: SendEmailRequest): Promise<SendEmailResponse>`

Send an email to one or more recipients.

**Parameters:**
- `request.recipients`: Array of recipient objects (max 100)
  - `email`: Recipient email address (required)
  - `name`: Recipient name (optional)
  - `substitutions`: Template variable substitutions (optional)
- `request.emailConfig.subject`: Email subject line (required)
- `request.emailConfig.from`: Sender email address (must be verified domain) (required)
- `request.emailConfig.fromName`: Sender display name (optional)
- `request.emailConfig.body`: HTML email body (required)
- `request.emailConfig.headers`: Custom email headers (optional)

**Returns:** Promise resolving to `SendEmailResponse` with:
- `status`: Processing status
- `message`: Status message
- `limits`: Current usage limits
- `batchId`: Unique batch identifier

**Throws:** `SendrError` if the request fails

**Example:**
```typescript
const response = await client.sendEmail({
  recipients: [
    { email: 'user@example.com' }
  ],
  emailConfig: {
    subject: 'Welcome!',
    from: 'noreply@yourdomain.com',
    fromName: 'Your Company',
    body: '<html><body><h1>Welcome!</h1></body></html>'
  }
});
```

##### `sendEmailTo(recipientEmail: string, emailConfig: EmailConfig): Promise<SendEmailResponse>`

Convenience method to send an email to a single recipient.

**Example:**
```typescript
const response = await client.sendEmailTo('user@example.com', {
  subject: 'Welcome!',
  from: 'noreply@yourdomain.com',
  fromName: 'Your Company',
  body: '<html><body><h1>Welcome!</h1></body></html>'
});
```

##### `getDomains(): Promise<DomainListResponse>`

Get a list of all domains associated with your tenant.

**Returns:** Promise resolving to `DomainListResponse` with:
- `domains`: Array of domain objects
- `count`: Total number of domains

**Example:**
```typescript
const response = await client.getDomains();
console.log(`You have ${response.count} domain(s)`);
response.domains.forEach(domain => {
  console.log(`${domain.name} - Verified: ${domain.isVerified}`);
});
```

##### `verifyDomain(domainId: string): Promise<DomainVerifyResponse>`

Verify a domain's DNS settings.

**Parameters:**
- `domainId`: Domain ID to verify (required)

**Returns:** Promise resolving to `DomainVerifyResponse` with:
- `isVerified`: Whether the domain is verified

**Example:**
```typescript
const response = await client.verifyDomain('domain-id-here');
if (response.isVerified) {
  console.log('Domain is verified!');
}
```

##### `createTenant(request: CreateTenantRequest): Promise<Tenant>`

Create a new tenant/workspace in the system.

**Parameters:**
- `request.name`: Workspace/tenant name (required)
- `request.domain`: Default domain name (required)
- `request.sendingEmail`: Default sending email address (required)

**Returns:** Promise resolving to `Tenant` object

**Example:**
```typescript
const tenant = await client.createTenant({
  name: 'mycompany',
  domain: 'mycompany.com',
  sendingEmail: 'noreply@mycompany.com'
});
console.log('Tenant created:', tenant.id);
```

##### `getStatistics(): Promise<TenantStatistics>`

Get tenant statistics including email delivery metrics.

**Returns:** Promise resolving to `TenantStatistics` with:
- `totalSent`: Total emails sent
- `totalDelivered`: Total emails delivered
- `totalBounced`: Total emails bounced
- `totalOpened`: Total emails opened
- `totalClicked`: Total emails clicked

**Example:**
```typescript
const stats = await client.getStatistics();
console.log(`Sent: ${stats.totalSent}, Delivered: ${stats.totalDelivered}`);
```

##### `getLogs(options?: GetLogsOptions): Promise<EmailLogsResponse>`

Get email delivery logs for your domain.

**Parameters (optional):**
- `options.limit`: Maximum number of logs to return
- `options.offset`: Number of logs to skip
- `options.status`: Filter by status
- `options.startDate`: Start date for filtering
- `options.endDate`: End date for filtering

**Returns:** Promise resolving to `EmailLogsResponse` with:
- `logs`: Array of email log objects
- `count`: Total number of logs

**Example:**
```typescript
// Get all logs
const allLogs = await client.getLogs();

// Get logs with filters
const filteredLogs = await client.getLogs({
  limit: 50,
  status: 'delivered',
  startDate: '2024-01-01',
  endDate: '2024-01-31'
});
```

## Types

### Recipient

```typescript
interface Recipient {
  email: string;
  name?: string;
  substitutions?: Record<string, any>;
}
```

### EmailConfig

```typescript
interface EmailConfig {
  subject: string;
  from: string;
  fromName?: string;
  body: string;
  headers?: Record<string, string>;
}
```

### SendEmailResponse

```typescript
interface SendEmailResponse {
  status: string;
  message: string;
  limits: {
    limit: number;
    used: number;
    remaining: number;
    requested: number;
  };
  batchId?: string;
}
```

### Domain

```typescript
interface Domain {
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
```

### Tenant

```typescript
interface Tenant {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  domain: string;
  sendingEmail: string;
  currentEmailCount: number;
}
```

### TenantStatistics

```typescript
interface TenantStatistics {
  totalSent: number;
  totalDelivered: number;
  totalBounced: number;
  totalOpened: number;
  totalClicked: number;
  [key: string]: any;
}
```

### EmailLog

```typescript
interface EmailLog {
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
```

## Error Handling

The SDK throws `SendrError` for API errors:

```typescript
import { SendrError } from 'sendr-js';

try {
  await client.sendEmail({ ... });
} catch (error) {
  if (error instanceof SendrError) {
    console.error('API Error:', error.message);
    console.error('Status Code:', error.statusCode);
    console.error('Response:', error.response);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Limits

- **Maximum recipients per API call**: 100 subscribers
- **Maximum sending rate**: 250 emails per hour (default, custom rates available)
- **Email content**: HTML format supported
- **From address**: Must be a verified domain email address

## Getting Your API Key

1. Sign up at [https://platform.sendr.app/auth/sign-up](https://platform.sendr.app/auth/sign-up)
2. Verify your email address
3. Complete domain verification (you'll receive DNS settings via email)
4. Your API key will be automatically generated and sent to your email after domain onboarding

## Documentation

For more information, visit the [Sendr API Documentation](https://docs.sendr.app/api-reference/introduction).

## License

MIT

