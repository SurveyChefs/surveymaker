// Home.tsx or page.tsx
"use client";  // This line tells Next.js that this component uses client-side features

import { useEffect, useState } from "react";
import { connectToDatabase, createPerson, queryPeople, updatePerson } from "@/lib/surrealdb"; // Adjust import path as needed

export default function Home() {
    const [dbStatus, setDbStatus] = useState<string>("Loading...");
    const [people, setPeople] = useState<any[]>([]); // Store people records
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const connectAndQuery = async () => {
            try {
                const db = await connectToDatabase();
                setDbStatus("Database Connected Successfully!");

                // Query and set people records
                const peopleData = await queryPeople(db);
                setPeople(peopleData);


            } catch (err) {
                setDbStatus("Failed to connect to the database.");
                setError("Error: " + (err instanceof Error ? err.message : err));
            }
        };

        connectAndQuery();
    }, []);

    return (
        <div>
            <h1>SurrealDB Connection Status</h1>
            <p>{dbStatus}</p>

            {error && <p>Error: {error}</p>}

            <h2>People Records:</h2>
            <ul>
                {people.map((person, index) => (
                    <li key={index}>
                        {person.name.first} {person.name.last} - {person.title}
                    </li>
                ))}
            </ul>
        </div>
    );
}
