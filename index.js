import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {getAllCoffee, addNewCoffee, deleteCoffee} from "./db.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({limit: '10mb', extended: true}));

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/coffee", async (req, res) => {
    try {
        const data = await getAllCoffee();
        res.send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving coffee data");
    }
});

app.post("/coffee", async (req, res) => {
    try {
        const newCoffee = req.body;
        const result = await addNewCoffee(newCoffee);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding new coffee");
    }
});


app.delete("/coffee/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const result = await deleteCoffee(id);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting coffee");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});