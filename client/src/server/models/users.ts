import z from "zod";
import { getDB } from "../config/db";
import { IUser, loginUser, User } from "../interfaces/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
const userSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["admin", "vendor", "buyer"]).default("buyer"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default class UserModel {
  static getCollection() {
    const db = getDB();
    const collection = db.collection<User>("users");
    return collection;
  }

  static async registerUser(payload: User) {
    userSchema.parse(payload);
    const collection = this.getCollection();
    const { username, email, password, role } = payload;
    const hashedPassword = bcrypt.hashSync(password);
    const user = {
      username,
      email,
      password: hashedPassword,
      role,
    };
    const newUser = await collection.insertOne(user);
    
    return newUser;
  }

  static async loginUser(payload: loginUser) {
    loginSchema.parse(payload);
    const collection = this.getCollection();
    const { email, password } = payload;

    const user = await collection.findOne({
      email,
    });
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    const userToken = {
      id: user._id,
      email: user.email,
    };
    const comparedPass = bcrypt.compareSync(password, user.password);
    if (!comparedPass) {
      throw new Error("Invalid password");
    }
    const secret = process.env.JWT_SECRET as string;
    const access_token = jwt.sign(userToken, secret);

    return access_token;
  }
  static async userById(id: string) {
    const collection = this.getCollection();
    const user = await collection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}
