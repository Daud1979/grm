const mongoose = require('mongoose'); 

const dbConnect = async () => {
  try {
    // Connect to MongoDB using the URI from environment variables
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🟢 MongoDB conectado'); // Success message
  } catch (err) {
    // Log the error and exit the process if connection fails
    console.error('🔴 Error de conexión', err);
    process.exit(1); 
  }
};
module.exports = dbConnect;
