import express from "express";
import cors from "cors";
import {connectToDatabase} from "./utils/db.js";
import {addNewCoffee, deleteCoffee, getAllCoffee} from "./utils/queries.js";

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

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
        res.status(500).json({error: "Error retrieving coffee data"});
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
        res.status(500).json({error: "Error adding new coffee"});
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
        res.status(500).json({error: "Error deleting coffee"});
    }
});

app.listen(PORT, () => {
    console.log(`Local sever running on http://localhost:${PORT}/api `);
});

export default app;