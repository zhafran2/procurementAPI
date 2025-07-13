import { ObjectId } from "mongodb";

export interface IVendor {
  userId: ObjectId; // reference to User._id
  companyName: string;
  companyAddress: string;
  contactPerson: string;
  phoneNumber: string;
  businessLicense: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}
export interface IVendorCreate {
  userId: ObjectId
    companyName: string;
    companyAddress: string;         
    contactPerson: string;
    phoneNumber: string;    
    businessLicense: string; // URL or path to the business license document
    status?: "pending" | "approved" | "rejected"; // default is pending
}

export interface IVendorUpdate {
    companyName?: string;
    companyAddress?: string;
    contactPerson?: string;
    phoneNumber?: string;
    businessLicense?: string; // URL or path to the business license document
    status?: "pending" | "approved" | "rejected"; // default is pending
}


