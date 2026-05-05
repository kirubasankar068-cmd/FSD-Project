const jwt = require('jsonwebtoken');
require('dotenv').config({ path: __dirname + '/../config/.env' });

const adminToken = jwt.sign(
  { id: '69d241aeb11ff6a450c61000', role: 'admin' }, 
  process.env.JWT_SECRET || 'secretkey', 
  { expiresIn: '1h' }
);

console.log(adminToken);
