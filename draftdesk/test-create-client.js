import { createClient } from '@insforge/sdk';

try {
  const client1 = createClient('url', 'key');
  console.log("client1 options:", client1.auth.options);
} catch (e) { console.log(e.message) }

try {
  const client2 = createClient({ baseUrl: 'url', anonKey: 'key' });
  console.log("client2 options:", client2.auth.options);
} catch (e) { console.log(e.message) }
