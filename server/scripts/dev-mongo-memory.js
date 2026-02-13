// Start an in-memory MongoDB (mongodb-memory-server) for local dev
// Usage: node scripts/dev-mongo-memory.js
const { MongoMemoryServer } = require('mongodb-memory-server');

async function start() {
  const mongod = await MongoMemoryServer.create({ instance: { port: 27018 } });
  const uri = mongod.getUri();
  console.log('In-memory MongoDB started');
  console.log('URI:', uri);
  console.log('Use this in another terminal, e.g.:');
  console.log('  export MONGODB_URI=' + uri);
  console.log('  node scripts/seed-orgs.js');
  console.log('Stop with Ctrl+C');
  process.on('SIGINT', async () => {
    console.log('\nStopping in-memory MongoDB...');
    await mongod.stop();
    process.exit(0);
  });
  // Keep process alive
  setInterval(() => {}, 1 << 30);
}

start().catch(err => {
  console.error('Failed to start in-memory MongoDB:', err);
  process.exit(1);
});
