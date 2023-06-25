import mongoose from "mongoose";

const connection = {};

async function dbConnect() {
    // Use existing database connection
    if (connection.isConnected) {
        return;
    }

    // Use new database connection
    const db = await mongoose.connect(process.env.MONGODB_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    mongoose.set('strictQuery', true);
    connection.isConnected = db.connections[0].readyState;
    console.log(connection.isConnected);
}

export default dbConnect;