const http = require('http');

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/stats',
    method: 'GET',
    headers: {
        'Authorization': 'Bearer test-token' // Will probably fail auth but let's see
    }
};

const req = http.request(options, (res) => {
    console.log(`>> Status: ${res.statusCode}`);
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log('>> Body:', body);
    });
});

req.on('error', (e) => {
    console.error(`>> Request Error: ${e.message}`);
});

req.end();
