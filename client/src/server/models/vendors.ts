import { getDB } from "../config/db";



export default class VendorModel {

    static getCollection() {
        const db = getDB();
        const collection = db.collection("vendors");
        return collection;
    }
}