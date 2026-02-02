import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { region, category, description, sentiment } = body;

        if (!description) {
            return NextResponse.json({ error: 'Description required' }, { status: 400 });
        }

        // In a real app we would save to DB here.
        // Since we are using client-side localStorage store, this API route 
        // actually CANNOT access the client's localStorage. 
        // This is a limitation of this prototype architecture.
        // PROTOTYPE LIMITATION: The API route will just return success 
        // and log received data, but it won't persist to the user's browser 
        // unless we use a real database (SQLite/Postgres).
        //
        // For this prototype, I will just mock the success response.
        // The user asked for "API Routes (para futura integração)".

        console.log('Webhook Received:', body);

        return NextResponse.json({
            success: true,
            id: `fb-${Date.now()}`,
            message: "Data received (Prototype: not saved to localStorage specific user browser)"
        });

    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 500 });
    }
}
