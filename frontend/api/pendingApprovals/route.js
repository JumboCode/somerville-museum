// frontend/src/app/api/pendingApprovals/route.js
import { NextResponse } from "next/server.js";
import { Webhook } from "svix";

const SVIX_SECRET = "whsec_alqtrJOEWUyQ8PuEzYq238v1qKKqkb+t"; // Replace with your real secret

// In-memory store (resets on server restart)
let pendingApprovals = [];

export async function POST(req) {
  try {
    const payload = await req.text();
    const svixHeaders = {
      "svix-id": req.headers.get("svix-id"),
      "svix-timestamp": req.headers.get("svix-timestamp"),
      "svix-signature": req.headers.get("svix-signature"),
    };

    const webhook = new Webhook(SVIX_SECRET);
    const event = webhook.verify(payload, svixHeaders);

    if (event.type === "user.created") {
      const user = event.data;
      console.log("✅ Verified new user:", user.email_addresses[0].email_address);
      console.log(" first name:", user.first_name);
      console.log("last name", user.last_name);
      console.log("id:", user.id);
    
      pendingApprovals.push({
        id: user.id,
        name: `${user.first_name || "User"} ${user.last_name || ""}`.trim(),
        email: user.email_addresses[0].email_address,
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ message: "Unhandled event type" }, { status: 400 });
  } catch (err) {
    console.error("❌ Webhook error:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 400 });
  }
}

export async function GET() {
    console.log("📦 Current pendingApprovals:", pendingApprovals);
    return NextResponse.json(pendingApprovals);
}