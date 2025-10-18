// pages/api/ocr/hindi/route.ts
import { NextResponse } from "next/server";
import { Buffer } from "buffer";
import { GoogleGenerativeAI } from "@google/generative-ai";


const PROMPT_TEXT = `
You are given the scanned image of a "Data Collection form for Devanagari OCR and Form Processing Research" filled out in Hindi.

Extract all data points below and return one valid JSON object only "{responseText}", exactly matching this schema.
If a checkbox is ticked, use true; if not ticked or absent, use false.
If a text entry is blank, return an empty string "".
No additional keys, no extra text, comments, Markdown, or code fences.
also make sure that all the Hindi text values are returned in english script.

{
  "studentDetails": {
    "rollNumber": "",                   // रोल नंबर (Roll Number)
    "candidateName": {
      "first": "",                      // उम्मीदवार का नाम लिखो: पहला (Candidate's Name: First)
      "middle": "",                     // मध्य (Middle)
      "last": ""                        // अंतिम (Last)
    },
    "fatherName": {
      "first": "",                      // पिता का नाम लिखो: पहला (Father's Name: First)
      "middle": "",                     // मध्य (Middle)
      "last": ""                        // अंतिम (Last)
    },
    "motherName": {
      "first": "",                      // माता का नाम लिखो: पहला (Mother's Name: First)
      "middle": "",                     // मध्य (Middle)
      "last": ""                        // अंतिम (Last)
    },
    "dateOfBirth": {
      "day": "",                        // जन्म तिथि (dd)
      "month": "",                      // जन्म तिथि (mm)
      "year": ""                        // जन्म तिथि (yyyy)
    },
    "contact": {
      "telephoneNumber": ""             // टेलीफोन न (Telephone No.)
    }
  },
  "addressDetails": {
    "houseNumber": "",                  // घर क न (House Number)
    "streetLocalitySociety": "",        // गली/चर्होलो/सोसाइटी (Street/Locality/Society)
    "city": "",                         // शहर (City)
    "state": "",                        // राज्य (स्टेट) (State)
    "pincode": ""                       // पिनकोड (Pincode)
  },
  "academicDetails": {
    "class": "",                        // कक्षा (Class)
    "department": "",                   // विभाग (Department)
    "subject": {
      "male": false,                    // विष: पुरुष (Subject: Male checkbox)
      "female": false                   // विष: स्त्री (Subject: Female checkbox)
    }
  },
  "signature": ""                       // हस्ताक्षर (Signature)
}
`;


function cleanLLMJson(txt: string) {
  return txt
    .trim()
    .replace(/^"""\n?/, "")
    .replace(/"""$/, "")
    .replace(/^```json\s*/i, "")
    .replace(/```$/, "")
    .trim();
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const pdf = formData.get("file");
    if (!pdf || typeof pdf === "string") {
      return NextResponse.json({ error: "No PDF provided" }, { status: 400 });
    }

    console.log("Received file:", (pdf as File).name, (pdf as File).type);
    const buffer = Buffer.from(await (pdf as File).arrayBuffer());
    const inline = {
      inlineData: {
        data: buffer.toString("base64"),
        mimeType: (pdf as File).type,
      },
    };

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent([PROMPT_TEXT, inline]);
    const responseText = result.response.text();

    // 👇 Parse here safely
    const cleaned = cleanLLMJson(responseText);
    let structured: any = {};
    try {
      structured = JSON.parse(cleaned);
    } catch (e) {
      console.warn("Failed to parse Gemini JSON:", e);
    }

    return NextResponse.json({
      rawText: responseText,
      structured,
    });
  } catch (err: any) {
    console.error("Error in /api/ocr:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
