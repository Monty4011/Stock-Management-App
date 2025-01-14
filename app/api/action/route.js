import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {

    let { action, name, initialQuantity } = await request.json()
    const uri = "mongodb+srv://jatin04gupta2004:JG4011JGKA@sms.6hpx952.mongodb.net/";
    const client = new MongoClient(uri);

    try {
        const database = client.db('stock');
        const inventory = database.collection('Inventory');

        const filter = { name: name };

        let newQuantity = action == "plus" ? (parseInt(initialQuantity) + 1) : (parseInt(initialQuantity) - 1)


        const updateDoc = {
            $set: {
                quantity: newQuantity
            },
        };

        const result = await inventory.updateOne(filter, updateDoc, {});

        return NextResponse.json({ success: true, message: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)` })

    } finally {

        await client.close();
    }
}

