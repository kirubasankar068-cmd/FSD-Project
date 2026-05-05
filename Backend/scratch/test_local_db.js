const mongoose = require('mongoose');
async function test() {
    try {
        await mongoose.connect('mongodb://localhost:27017/jobgrox');
        console.log('Connected to local MongoDB');
        process.exit(0);
    } catch (err) {
        console.error('Failed to connect to local MongoDB', err);
        process.exit(1);
    }
}
test();
