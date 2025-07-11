import { getDB } from "../config/db";

export default class UserModel {
  static getCollection() {
    const db = getDB();
    const collection = db.collection("users");
    return collection;
  }
}
