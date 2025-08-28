import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();
    // Example: count documents in collections (replace with your actual collections)
    const appointments = await db.collection("appointments").countDocuments();
    const blogs = await db.collection("blogs").countDocuments();
    const testimonials = await db.collection("testimonials").countDocuments();
    const videos = await db.collection("videos").countDocuments();
    const properties = await db.collection("properties").countDocuments();
    const teamMembers = await db.collection("team").countDocuments();
    const courses = await db.collection("courses").countDocuments();
    const successStories = await db.collection("successStories").countDocuments();
    const chatbotLeads = await db.collection("chatbotLeads").countDocuments();

    return NextResponse.json({
      appointments,
      blogs,
      testimonials,
      videos,
      properties,
      teamMembers,
      courses,
      successStories,
      chatbotLeads,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}