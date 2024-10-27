import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {

    const uri = "mongodb+srv://jatin04gupta2004:JG4011JGKA@sms.6hpx952.mongodb.net/";

    const client = new MongoClient(uri);
    try {
        const database = client.db('stock');
        const inventory = database.collection('Inventory');

        const query = {};
        const products = await inventory.find(query).toArray();
        return NextResponse.json({ products })

    } finally {
        await client.close();
    }
}

export async function POST(request) {
    let body = await request.json()
    const uri = "mongodb+srv://jatin04gupta2004:JG4011JGKA@sms.6hpx952.mongodb.net/";

    const client = new MongoClient(uri);
    try {
        const database = client.db('stock');
        const inventory = database.collection('Inventory');


        const product = await inventory.insertOne(body);
        return NextResponse.json({ product, ok: true })

    } finally {
        await client.close();
    }
}