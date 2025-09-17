const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://Abhikr1872:Abhikr%401872@cluster0.vx97gpe.mongodb.net/Fleet_flex?retryWrites=true&w=majority&tls=true";


async function run() {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        console.log("✅ Connected to MongoDB Atlas!");
        await client.close();
    } catch (error) {
        console.error("❌ Connection error:", error.message);
    }
}

run();
