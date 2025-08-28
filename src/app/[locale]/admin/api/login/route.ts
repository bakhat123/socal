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
  } catch {
    console.log("MongoDB authentication failed, trying JSON fallback...");
  }

  // Fallback to JSON file authentication
  try {
    const usersPath = path.join(process.cwd(), 'src', 'data', 'users.json');
    const usersData = fs.readFileSync(usersPath, 'utf8');
    const users = JSON.parse(usersData);
    
    const user = users.find((u: any) => u.email === email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    if (!user.password) {
      return NextResponse.json({ error: "User account not properly configured" }, { status: 401 });
    }
    
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
    
    return NextResponse.json({ success: true, email, role: user.role });
  } catch (error) {
    console.error("JSON authentication error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}