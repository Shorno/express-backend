import { ObjectId } from "mongodb";

export async function getAllCoffee(db) {
    return db.collection("coffee").find().toArray();
}

export async function addNewCoffee(db, newCoffee) {
    return db.collection("coffee").insertOne(newCoffee);
}

export async function deleteCoffee(db, id) {
    return db.collection("coffee").deleteOne({ _id: new ObjectId(id) });
}


