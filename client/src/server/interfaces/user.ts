import { ObjectId } from "mongodb";

export interface IUser {
  _id :ObjectId
  email: string;
  password: string; // hashed password
  username: string;
  role: "admin" | "vendor" | "buyer";
  createdAt: string;
  updatedAt: string;
}

export interface User {
  email: string;
  password: string; // hashed password
  username: string;
  role: "admin" | "vendor" | "buyer";
}
export interface registerUser {
  username: string;
  email: string;
  password: string;
}

export interface loginUser {
  email: string;
  password: string;
}
