const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const dbConnection = async() =>{

    try {
        const db = await mongoose.connect("mongodb+srv://antoniodjss2000:21558269H@tramites.exizvzf.mongodb.net/Mind", 
            {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            }
        );

        const url = `${db.connection.host}:${db.connection.port}`;
        console.log(`MongoDB conectado en: ${url}`);
    } catch (error) {
        console.log(`error: ${error.message}`);
        process.exit(1);
    }

}

module.exports = {
    dbConnection 
}
