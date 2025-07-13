import { ObjectId } from "mongodb";
import { getDB } from "../config/db";
import { IProduct, IProductUpdate } from "../interfaces/product";
import { IVendorUpdate } from "../interfaces/vendor";

export default class ProductModel {
  static getCollection() {
    const db = getDB();
    const collection = db.collection<IProduct>("products");
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
  // This method should update a vendor, not a product; move it to the VendorModel if needed.
  // If you intend to update a product, use IProductUpdate and ensure status matches IProduct's type.
  static async updateProduct(payload: IProductUpdate, vendorId: string) {
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

static async allProducts() {
  const collection = this.getCollection()
  const products = await collection.find().toArray();
  return products;
}
}
