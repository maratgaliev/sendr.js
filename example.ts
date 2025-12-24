/**
 * Example usage of the Sendr SDK
 * 
 * Run with: npx ts-node example.ts
 */

import { SendrClient } from "./src/index";

async function main() {
  // Initialize the client
  const client = new SendrClient({
    apiKey: process.env.SENDR_API_KEY || "your-api-key-here",
  });

  try {
    // Example 1: Send email to multiple recipients
    const response = await client.sendEmail({
      recipients: [
        { email: "user1@example.com" },
        { email: "user2@example.com" },
      ],
      emailConfig: {
        subject: "Welcome to Our Platform – Your Account Is Ready",
        from: "noreply@yourdomain.com",
        fromName: "Your Company",
        body: `
          <html>
            <body>
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
                  Welcome to Sendr!
                </h1>
                <p>Hi there,</p>
                <p>Your account is now ready and you can start sending emails.</p>
                <p>If you have any questions, feel free to reach out to our support team.</p>
                <p><strong>The Sendr Team</strong></p>
              </div>
            </body>
          </html>
        `,
      },
    });

    console.log("Email sent successfully!");
    console.log("Batch ID:", response.batchId);
    console.log("Status:", response.status);
    console.log("Limits:", response.limits);

    // Example 2: Send email to a single recipient (convenience method)
    const singleResponse = await client.sendEmailTo("user@example.com", {
      subject: "Test Email",
      from: "noreply@yourdomain.com",
      fromName: "Your Company",
      body: "<html><body><h1>Hello!</h1><p>This is a test email.</p></body></html>",
    });

    console.log("\nSingle email sent!");
    console.log("Batch ID:", singleResponse.batchId);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
      if ("statusCode" in error) {
        console.error("Status Code:", (error as any).statusCode);
      }
    } else {
      console.error("Unknown error:", error);
    }
  }
}

// Run the example
if (require.main === module) {
  main();
}

