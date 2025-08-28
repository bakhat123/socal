import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }
  const normalizedEmail = String(email).trim().toLowerCase();
  console.log("email", normalizedEmail);

  try {
    // First try MongoDB authentication (ensure same DB as other admin APIs)
    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne({ email });
    if(!user){
      console.log("User not found", normalizedEmail);
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    }
    console.log("user info after login")
    console.log(user);
    
    if (user && user.password) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        return NextResponse.json({ success: true, email, role: user.role });
      }
    }
  } catch (dbError) {
    console.error("❌ MongoDB authentication failed:", dbError);
    return NextResponse.json({ 
      error: "Authentication service unavailable - database connection failed" 
    }, { status: 500 });
  }
}