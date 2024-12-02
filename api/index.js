import express from "express";
import cors from "cors";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) {
        return cachedDb;
    }

    const client = new MongoClient(process.env.DATABASE_URL, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    });

    try {
        await client.connect();
        const db = client.db("coffeeDB");
        cachedDb = db;
        return db;
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        throw error;
    }
}

async function getAllCoffee(db) {
    return db.collection("coffee").find().toArray();
}

async function addNewCoffee(db, newCoffee) {
    return db.collection("coffee").insertOne(newCoffee);
}

async function deleteCoffee(db, id) {
    return db.collection("coffee").deleteOne({ _id: new ObjectId(id) });
}

app.get("/api", (req, res) => {
    res.send("Hello World");
});

app.get("/api/coffee", async (req, res) => {
    try {
        const db = await connectToDatabase();
        const data = await getAllCoffee(db);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error retrieving coffee data" });
    }
});

app.post("/api/coffee", async (req, res) => {
    try {
        const db = await connectToDatabase();
        const newCoffee = req.body;
        const result = await addNewCoffee(db, newCoffee);
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error adding new coffee" });
    }
});

app.delete("/api/coffee/:id", async (req, res) => {
    try {
        const db = await connectToDatabase();
        const id = req.params.id;
        const result = await deleteCoffee(db, id);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error deleting coffee" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;

