import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
    const query = request.nextUrl.searchParams.get("query")

    const uri = "mongodb+srv://jatin04gupta2004:JG4011JGKA@sms.6hpx952.mongodb.net/";

    const client = new MongoClient(uri);
    try {
        const database = client.db('stock');
        const inventory = database.collection('Inventory');

        const products = await inventory.aggregate([{
            $match: {
                $or: [
                    { name: { $regex: query, $options: "i" } },
                    // { quantity: { $regex: query, $options: "i" } },
                    // { price: { $regex: query, $options: "i" } }
                ]
            }
        }]).toArray()

        return NextResponse.json({ products })

    } finally {
        await client.close();
    }
}

