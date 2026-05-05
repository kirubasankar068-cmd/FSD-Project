const jwt = require('jsonwebtoken');
const http = require('http');
require('dotenv').config({ path: __dirname + '/config/.env' });

async function testMe() {
    const token = jwt.sign({ id: "69f60ded5e034464146f8c94", role: "user" }, process.env.JWT_SECRET || "supersecretjwtkey_123_jobgroxdummy");
    
    const req = http.request({
        hostname: 'localhost', port: 5000, path: '/api/auth/me', method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    }, (res) => {
        console.log(`>> Status: ${res.statusCode}`);
        let body = '';
        res.on('data', c => body += c);
        res.on('end', () => {
            console.log(`>> Body: ${body}`);
            process.exit();
        });
    });
    req.end();
}
testMe();
