import { ObjectId } from "mongodb";
import { getDB } from "../config/db";
import { IVendorCreate } from "../interfaces/vendor";



export default class VendorModel {

    static getCollection() {
        const db = getDB();
        const collection = db.collection("vendors");
        return collection;
    }

    static async userVendors(userId: string) {
        const collection = this.getCollection();
        const vendor = await collection.aggregate([
            {
                $match: {
                    userId: new ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                path: "$Vendor"
                
            }
        ]).toArray();
        
        return vendor
    }
    static async createVendor(payload:IVendorCreate) {
        const collection = this.getCollection();
        const newVendor = await collection.insertOne(payload);
       
        return newVendor;
    }
    static async getVendorById(vendorId: string) {
        const collection = this.getCollection();
        const vendor = await collection.findOne({ _id: new ObjectId(vendorId) });
        return vendor;
    }

    
}