// surrealdb.ts
import { Surreal, RecordId, Table } from "surrealdb";

// Create a new instance of SurrealDB
const db = new Surreal();

export async function connectToDatabase() {
    try {
        // Connect to the database
        await db.connect("http://127.0.0.1:8000/rpc");

        // Select a specific namespace / database
        await db.use({
            namespace: "test",
            database: "test"
        });

        // Sign in with credentials
        await db.signin({
            username: "root",
            password: "root",
        });

        console.log("Connected to SurrealDB");

        return db; // Return the db instance for further use
    } catch (err) {
        console.error("Failed to connect:", err);
        throw err;
    }
}

export async function createPerson(db: Surreal) {
    const created = await db.create("person", {
        title: "Founder & CEO",
        name: { first: "BOBBY", last: "Morgan Hitchcock" },
        marketing: true,
    });
    return created;
}

export async function queryPeople(db: Surreal) {
    const people = await db.select("person");
    return people;
}

export async function updatePerson(db: Surreal, personId: string) {
    const updated = await db.merge(new RecordId('person', personId), {
        marketing: false,
    });
    return updated;
}
