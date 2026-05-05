const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const http = require('http');
require('dotenv').config({ path: __dirname + '/config/.env' });

async function diagnose() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobgrox');
        const User = require('./models/User');
        let admin = await User.findOne({ role: 'admin' });
        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET || "secretkey");

        const endpoints = [
            '/api/admin/stats',
            '/api/admin/users',
            '/api/admin/jobs',
            '/api/financial/ledger',
            '/api/financial/analytics'
        ];

        for (const path of endpoints) {
            await new Promise((resolve) => {
                const req = http.request({
                    hostname: 'localhost', port: 5000, path, method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                }, (res) => {
                    console.log(`>> Path: ${path} | Status: ${res.statusCode}`);
                    let body = '';
                    res.on('data', c => body += c);
                    res.on('end', () => {
                        if (res.statusCode !== 200) console.log(`>> ERR BODY: ${body}`);
                        resolve();
                    });
                });
                req.end();
            });
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
diagnose();
