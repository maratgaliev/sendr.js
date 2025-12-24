/**
 * Sendr Email Platform SDK
 * 
 * Official SDK for sending emails through the Sendr platform
 * 
 * @example
 * ```typescript
 * import { SendrClient } from 'sendr-js';
 * 
 * const client = new SendrClient({ apiKey: 'your-api-key' });
 * 
 * const response = await client.sendEmail({
 *   recipients: [{ email: 'recipient@example.com' }],
 *   emailConfig: {
 *     subject: 'Welcome!',
 *     from: 'noreply@yourdomain.com',
 *     fromName: 'Your Company',
 *     body: '<html><body><h1>Hello!</h1></body></html>'
 *   }
 * });
 * ```
 */

export { SendrClient } from "./client";
export * from "./types";

