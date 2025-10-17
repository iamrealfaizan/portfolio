// pages/api/ocr/route.ts
import { NextResponse } from "next/server";
import { Buffer } from "buffer";
import { GoogleGenerativeAI } from "@google/generative-ai";


const PROMPT_TEXT = `
You are given the scanned pages of the "School Admission Form".

Extract all data points below and return one valid JSON object only "{responseText}", exactly matching this schema.
If a checkbox is ticked, use true; if not ticked or absent, use false.
If a text entry is blank, return an empty string "".
No additional keys, no extra text, comments, Markdown, or code fences.

{
  "studentInformation": {
    "fullName": "",                   // Student's Name:
    "dateOfBirth": "",                // Date of Birth: (MM/DD/YYYY)
    "gender": "",                     // Gender: (e.g., "Male", "Female", "Prefer not to say")
    "residentialAddress": {
      "fullAddress": "",              // Residential Address:
      "city": "",                     // City:
      "state": "",                    // State:
      "zip": ""                       // Zip:
    }
  },
  "parentGuardianInformation": {
    "fullName": "",                   // Parent/Guardian Name:
    "relationshipToStudent": "",      // Relationship to Student:
    "contactNumber": "",              // Contact Number:
    "emailAddress": "",               // Email Address:
    "occupation": "",                 // Occupation:
    "residentialAddressIfDifferent": {
      "fullAddress": "",              // Residential Address (if different from student):
      "city": "",                     // City:
      "state": "",                    // State:
      "zip": ""                       // Zip:
    }
  },
  "previousSchoolDetails": {
    "schoolName": "",                 // Name of Previous School:
    "schoolAddress": {
      "fullAddress": "",              // School Address:
      "city": "",                     // City:
      "state": "",                    // State:
      "zip": ""                       // Zip:
    },
    "datesAttended": {
      "from": "",                     // Dates Attended: (start date)
      "to": ""                        // to (end date)
    },
    "reasonForLeaving": ""            // Reason for Leaving:
  },
  "emergencyContactInformation": {
    "fullName": "",                   // Emergency Contact Name:
    "relationshipToStudent": "",      // Relationship to Student:
    "contactNumber": "",              // Contact Number:
    "alternateContactNumber": ""      // Alternate Contact Number:
  },
  "healthInformation": {
    "hasAllergiesOrConditions": false,// Does the student have any allergies or medical conditions? [] Yes [] No
    "conditionsDetails": "",          // If yes, please specify:
    "physicianNameAndContact": ""     // Primary Care Physician Name and Contact:
  },
  "additionalInformation": {
    "specialEducationalNeeds": "",    // Special Educational Needs:
    "interestsHobbies": "",           // Interests/Hobbies:
    "languagesSpokenAtHome": ""       // Languages Spoken at Home:
  },
  "declaration": {
    "parentGuardianSignature": "",    // Parent/Guardian Signature:
    "date": ""                        // Date:
  },
  "officeUseOnly": {
    "receivedBy": "",                 // Received by:
    "date": "",                       // Date:
    "applicationNumber": ""           // Application Number:
  }
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
