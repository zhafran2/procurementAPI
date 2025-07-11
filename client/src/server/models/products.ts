import { ObjectId } from "mongodb";
import { getDB } from "../config/db";
import { IProduct } from "../interfaces/product";



export default class ProductModel {
    static getCollection() {
        const db = getDB();
        const collection = db.collection("products");
        return collection;
    }

    static async findAll() {
        const collection = this.getCollection();
        return await collection.find({}).toArray();
    }

    static async findById(id: string) {
        const collection = this.getCollection();
        return await collection.findOne({ _id: new ObjectId(id) });
    }   

    static async create(product: IProduct) {
        const collection = this.getCollection();
        const result = await collection.insertOne(product);
        // Fetch and return the inserted document using the insertedId
        return await collection.findOne({ _id: result.insertedId });
    }
}