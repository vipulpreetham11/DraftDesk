import { createClient } from '@insforge/sdk';
import fs from 'fs';

const insforge = createClient(
  'https://swkc8nwa.ap-southeast.insforge.app',
  'ik_098892420fbc88d64de249c7e6881d23'
);

async function testUpload() {
  const dummyContent = 'Hello World';
  const file = new Blob([dummyContent], { type: 'text/plain' });

  console.log("Trying to upload to 'Thumbnail'...");
  const { data, error } = await insforge.storage
    .from('Thumbnail')
    .upload('test/dummy.txt', file, { upsert: true });

  if (error) {
    console.error("ERROR Response:", error);
  } else {
    console.log("SUCCESS:", data);
  }
}

testUpload();
