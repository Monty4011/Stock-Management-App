import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {

    const uri = "mongodb+srv://jatin04gupta2004:JG4011JGKA@sms.6hpx952.mongodb.net/";

    const client = new MongoClient(uri);
    try {
        const database = client.db('Jatin');
        const movies = database.collection('Inventory');

        const query = {};
        const movie = await movies.find(query).toArray();
        console.log(movie);
        return NextResponse.json({ "a": 10, movie })

    } finally {
        await client.close();
    }
}