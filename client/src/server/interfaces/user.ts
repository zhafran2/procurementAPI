import { ObjectId } from "mongodb";

export interface IUser {
  _id :ObjectId
  email: string;
  password: string; // hashed password
  name: string;
  role: "admin" | "vendor" | "buyer";
  createdAt: string;
  updatedAt: string;
}

export interface registerUser {
  username: string;
  email: string;
  password: string;
}

export interface loginUser {
  username: string;
  password: string;
}
