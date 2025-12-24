/**
 * Local test script for the Sendr package
 * 
 * Run with: node test-local.js
 * Make sure to set SENDR_API_KEY environment variable
 */

const { SendrClient } = require('./dist/index.js');

async function testPackage() {
  const apiKey = process.env.SENDR_API_KEY;
  
  if (!apiKey) {
    console.error('Error: SENDR_API_KEY environment variable is not set');
    console.log('Set it with: export SENDR_API_KEY=your-api-key');
    process.exit(1);
  }

  console.log('Testing Sendr package...\n');
  const client = new SendrClient({ apiKey });

  try {
    // Test 1: Get domains
    console.log('1. Testing getDomains()...');
    try {
      const domains = await client.getDomains();
      console.log('✓ Success! Found', domains.count, 'domain(s)');
      if (domains.domains.length > 0) {
        console.log('  First domain:', domains.domains[0].name);
      }
    } catch (error) {
      console.log('✗ Error:', error.message);
    }

    // Test 2: Get statistics
    console.log('\n2. Testing getStatistics()...');
    try {
      const stats = await client.getStatistics();
      console.log('✓ Success! Statistics retrieved');
      console.log('  Total sent:', stats.totalSent || 0);
    } catch (error) {
      console.log('✗ Error:', error.message);
    }

    // Test 3: Get logs
    console.log('\n3. Testing getLogs()...');
    try {
      const logs = await client.getLogs({ limit: 5 });
      console.log('✓ Success! Retrieved', logs.count || 0, 'log(s)');
    } catch (error) {
      console.log('✗ Error:', error.message);
    }

    // Test 4: Send email (commented out to avoid sending real emails)
    console.log('\n4. Testing sendEmail()...');
    console.log('  (Skipped - uncomment in test-local.js to test email sending)');
    /*
    try {
      const response = await client.sendEmail({
        recipients: [{ email: 'test@example.com' }],
        emailConfig: {
          subject: 'Test Email',
          from: 'noreply@yourdomain.com',
          fromName: 'Test',
          body: '<html><body><h1>Test</h1></body></html>'
        }
      });
      console.log('✓ Success! Email sent, batchId:', response.batchId);
    } catch (error) {
      console.log('✗ Error:', error.message);
    }
    */

    console.log('\n✓ All tests completed!');
  } catch (error) {
    console.error('\n✗ Unexpected error:', error);
    process.exit(1);
  }
}

testPackage();

