import { ObjectId } from "mongodb";
import { getDB } from "../config/db";
import { IVendor, IVendorCreate } from "../interfaces/vendor";
import z from "zod";

const vendorSchema = z.object({
  companyName: z
    .string()
    .min(3, "Company name must be at least 3 characters long"),
  companyAddress: z
    .string()
    .min(5, "Company address must be at least 5 characters long"),
  contactPerson: z
    .string()
    .min(3, "Contact person must be at least 3 characters long"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters long"),
  businessLicense: z.string().url("Business license must be a valid URL"),
});

export default class VendorModel {
  static getCollection() {
    const db = getDB();
    const collection = db.collection<IVendor>("vendors");
    return collection;
  }

  static async userVendors(userId: string) {
    const collection = this.getCollection();
    const vendor = await collection
      .aggregate([
        {
          $match: {
            userId: new ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          path: "$Vendor",
        },
      ])
      .toArray();

    return vendor;
  }
  static async createVendor(payload: IVendorCreate) {
    vendorSchema.parse(payload);
    const collection = this.getCollection();
    const {
        userId,
      companyName,
      companyAddress,
      contactPerson,
      phoneNumber,
      businessLicense,
    } = payload;
    const newVendor:IVendor = {
         userId: new ObjectId(userId),
        companyName,
        companyAddress,
        contactPerson,
        phoneNumber,
        businessLicense,
        status: "pending", // Default status
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
    const result = await collection.insertOne(newVendor);

    // Return the newly created vendor

    return result;
  }
  static async getVendorById(vendorId: string) {
    const collection = this.getCollection();
    const vendor = await collection.findOne({ _id: new ObjectId(vendorId) });
    return vendor;
  }
}
