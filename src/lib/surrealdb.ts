import { Surreal } from "surrealdb.js";

const connectionString = process.env.NEXT_PUBLIC_SURREALDB_URL as string;
const user = process.env.NEXT_PUBLIC_SURREALDB_USER as string;
const pass = process.env.NEXT_PUBLIC_SURREALDB_PASSWORD as string;
const ns = process.env.NEXT_PUBLIC_SURREALDB_NAMESPACE as string;
const db = process.env.NEXT_PUBLIC_SURREALDB_DATABASE as string;

export const surrealDatabase = new Surreal();

export const surrealConnection = async (): Promise<Surreal> => {
    try {
        if (!connectionString) {
            throw new Error("Connection string is undefined or invalid.");
        }
        await surrealDatabase.connect(connectionString);
        console.log("got this far");
        
        if (!user || !pass || !ns || !db) {
            throw new Error("Authentication details are missing.");
        }

        await surrealDatabase.signin({
            username: user,
            password: pass,
            namespace: ns,
            database: db,
        });
        console.log("authenticated");
        return surrealDatabase;
    } catch (e) {
        console.error("Failed to connect to SurrealDB:", e);
        throw e;
    }
};
