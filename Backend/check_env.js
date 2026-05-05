require('dotenv').config({ path: __dirname + '/config/.env' });
console.log("STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY);
console.log("MONGO_URI:", process.env.MONGO_URI ? "SET" : "NOT SET");
process.exit();
