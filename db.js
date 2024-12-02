import {MongoClient, ObjectId, ServerApiVersion} from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.DATABASE_URL, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB!");
        return client.db("coffeeDB").collection("coffee");
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function getAllCoffee() {
    const coffeeCollection = await connectToDatabase();
    return coffeeCollection.find().toArray();
}

async function addNewCoffee(newCoffee) {
    const coffeeCollection = await connectToDatabase();
    return coffeeCollection.insertOne(newCoffee);
}
async function deleteCoffee(id) {
    const coffeeCollection = await connectToDatabase();
    console.log(id)
    return coffeeCollection.deleteOne({ _id: new ObjectId(id)});
}

export { getAllCoffee, addNewCoffee ,deleteCoffee};