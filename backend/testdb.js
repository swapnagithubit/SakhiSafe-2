const mongoose = require('mongoose');

const uri = "mongodb+srv://moulkarswapna_db_user:nK4sTsL3fQR2m69H@safesakhi.hs0awm4.mongodb.net/sakhiDB?retryWrites=true&w=majority";

console.log("Connecting...");

mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch(err => console.log("❌ Failed:", err.message));