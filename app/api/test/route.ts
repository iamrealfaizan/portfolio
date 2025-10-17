import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

const TestSchema = new mongoose.Schema({
  name: String,
  createdAt: { type: Date, default: Date.now },
});

const Test = mongoose.models.Test || mongoose.model("Test", TestSchema);

export async function GET() {
  await connectDB();
  const docs = await Test.find();
  return NextResponse.json({ message: "Connected successfully!", docs });
}
