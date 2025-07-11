import { MongoClient, Db } from "mongodb";

const uri: string =
  process.env.MONGODB_URI || "mongodb://localhost:27017/mydatabase";

const client: MongoClient = new MongoClient(uri);

let db: Db;

function connect() {
  client.connect();
  db = client.db("procurement");
}


export function getDB () {
    if (!db) {
        connect();
    }
    return db;
}