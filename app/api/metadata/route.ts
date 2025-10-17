import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Metadata } from "@/models/Metadata";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { userName, userEmail, fileName, fileType, aiRawText, aiStructured } = body;

    // ✅ capture IP and device info from request headers
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    // simple device detection
    let device = "desktop";
    if (/mobile/i.test(userAgent)) device = "mobile";
    else if (/tablet/i.test(userAgent)) device = "tablet";

    const record = await Metadata.create({
      userName,
      userEmail,
      fileName,
      fileType,
      aiRawText,
      aiStructured,
      ipAddress: ip,
      userAgent,
      device,
    });

    return NextResponse.json({
      success: true,
      message: "Metadata stored successfully",
      id: record._id,
    });
  } catch (err: any) {
    console.error("Error saving metadata:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
