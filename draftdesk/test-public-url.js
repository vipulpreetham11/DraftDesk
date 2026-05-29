import { createClient } from '@insforge/sdk';

const insforge = createClient(
  'https://swkc8nwa.ap-southeast.insforge.app',
  'ik_098892420fbc88d64de249c7e6881d23'
);

console.log(insforge.storage.from('Thumbnail').getPublicUrl('test/dummy.txt'));
