// Run this script to generate the password hash for the admin user
// Usage: node scripts/generate-admin-hash.js

const bcrypt = require('bcryptjs');

const password = 'dija123@';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    return;
  }
  
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\nUse this SQL to insert the admin user:');
  console.log(`INSERT INTO admins (username, password_hash) VALUES ('dija', '${hash}');`);
});







