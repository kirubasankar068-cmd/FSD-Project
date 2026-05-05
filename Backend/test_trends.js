const http = require('http');

async function testTrends() {
    const req = http.request({
        hostname: 'localhost', port: 5000, path: '/api/analytics/market-trends', method: 'GET'
    }, (res) => {
        console.log(`>> Status: ${res.statusCode}`);
        let body = '';
        res.on('data', c => body += c);
        res.on('end', () => {
            console.log(`>> Body: ${body}`);
            process.exit();
        });
    });
    req.on('error', (e) => {
        console.error(`Problem with request: ${e.message}`);
        process.exit(1);
    });
    req.end();
}
testTrends();
