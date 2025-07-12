import { ObjectId } from "mongodb";
import { getDB } from "../config/db";
import { IProduct, IProductUpdate } from "../interfaces/product";
import { IVendorUpdate } from "../interfaces/vendor";

export default class ProductModel {
  static getCollection() {
    const db = getDB();
    const collection = db.collection("products");
    return collection;
  }

  static async findVendorProducts(vendorId: string) {
    const collection = this.getCollection();
    const products = await collection.aggregate([
      {
        $match: {
          vendorId: new ObjectId(vendorId),
        },
      },
      {
        $lookup: {
          from: "vendors",
          localField: "vendorId",
          foreignField: "_id",
          as: "vendor",
        },
      },
      {
        $unwind: {
          path: "$Vendor",
        },
      },
    ]).toArray();

    return products;
  }

  static async findById(id: string) {
    const collection = this.getCollection();
    return await collection.findOne({ _id: new ObjectId(id) });
  }

  static async createProduct(product: IProduct) {
    const collection = this.getCollection();
    const result = await collection.insertOne(product);
    // Fetch and return the inserted document using the insertedId
    return await collection.findOne({ _id: result.insertedId });
  }
  static async updateVendor(payload: IVendorUpdate, vendorId: string) {
    const collection = this.getCollection();
    const result = await collection.updateOne(
        { _id: new ObjectId(vendorId) },
        { 
            $set: { 
                ...payload,
                updatedAt: new Date().toISOString()
            }
        }
    );
    return result;
}

static async deleteProduct(id: string) {
    const collection = this.getCollection();
    return await collection.deleteOne({ _id: new ObjectId(id) });
}
}
