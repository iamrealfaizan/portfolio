"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { WavyBackground } from "@/components/ui/wavy-background";
import { Sparkles } from "@/components/ui/sparkles";

/* =========================================
   1) SCHEMA (exact keys required)
   ========================================= */

type Address = {
  fullAddress: string;
  city: string;
  state: string;
  zip: string;
};

export type SchoolAdmission = {
  studentInformation: {
    fullName: string;
    dateOfBirth: string; // MM/DD/YYYY
    gender: string; // "Male" | "Female" | "Prefer not to say" | ""
    residentialAddress: Address;
  };
  parentGuardianInformation: {
    fullName: string;
    relationshipToStudent: string;
    contactNumber: string;
    emailAddress: string;
    occupation: string;
    residentialAddressIfDifferent: Address;
  };
  previousSchoolDetails: {
    schoolName: string;
    schoolAddress: Address;
    datesAttended: { from: string; to: string };
    reasonForLeaving: string;
  };
  emergencyContactInformation: {
    fullName: string;
    relationshipToStudent: string;
    contactNumber: string;
    alternateContactNumber: string;
  };
  healthInformation: {
    hasAllergiesOrConditions: boolean;
    conditionsDetails: string;
    physicianNameAndContact: string;
  };
  additionalInformation: {
    specialEducationalNeeds: string;
    interestsHobbies: string;
    languagesSpokenAtHome: string;
  };
  declaration: {
    parentGuardianSignature: string;
    date: string;
  };
  officeUseOnly: {
    receivedBy: string;
    date: string;
    applicationNumber: string;
  };
};

/* =========================================
   2) DEFAULT OBJECT
   ========================================= */

const emptyAddress: Address = { fullAddress: "", city: "", state: "", zip: "" };

const defaultAdmission: SchoolAdmission = {
  studentInformation: {
    fullName: "",
    dateOfBirth: "",
    gender: "",
    residentialAddress: { ...emptyAddress },
  },
  parentGuardianInformation: {
    fullName: "",
    relationshipToStudent: "",
    contactNumber: "",
    emailAddress: "",
    occupation: "",
    residentialAddressIfDifferent: { ...emptyAddress },
  },
  previousSchoolDetails: {
    schoolName: "",
    schoolAddress: { ...emptyAddress },
    datesAttended: { from: "", to: "" },
    reasonForLeaving: "",
  },
  emergencyContactInformation: {
    fullName: "",
    relationshipToStudent: "",
    contactNumber: "",
    alternateContactNumber: "",
  },
  healthInformation: {
    hasAllergiesOrConditions: false,
    conditionsDetails: "",
    physicianNameAndContact: "",
  },
  additionalInformation: {
    specialEducationalNeeds: "",
    interestsHobbies: "",
    languagesSpokenAtHome: "",
  },
  declaration: { parentGuardianSignature: "", date: "" },
  officeUseOnly: { receivedBy: "", date: "", applicationNumber: "" },
};

/* =========================================
   3) Utils
   ========================================= */

const cleanLLMJson = (txt: string) =>
  txt
    .trim()
    .replace(/^"""\n?/, "")
    .replace(/"""$/, "")
    .replace(/^```json\s*/i, "")
    .replace(/```$/, "")
    .trim();

/* =========================================
   4) Section Components (portfolio styling)
   ========================================= */

function SectionCard({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) {
  return (
    <Card className="border-border bg-card/80">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="mt-4 space-y-4">{children}</div>
      </CardContent>
    </Card>
  );
}

export default function AdmissionOcrPage() {
  const [pdf, setPdf] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [data, setData] = useState<SchoolAdmission>(defaultAdmission);
  const [raw, setRaw] = useState("");
  const [showRaw, setShowRaw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setPdf(f);
    setPreviewUrl(f ? URL.createObjectURL(f) : "");
  };

  // Revoke object URL when preview changes or component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        try {
          URL.revokeObjectURL(previewUrl);
        } catch (e) {
          // ignore
        }
      }
    };
  }, [previewUrl]);

  const extract = async () => {
    if (!pdf) {
      setErr("Please choose a PDF first.");
      return;
    }
    setLoading(true);
    setErr(null);
    try {
      const fd = new FormData();
      fd.append("file", pdf);
      const res = await fetch("/api/ocr", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || "Extraction failed");
      // json.structured is expected to match the schema exactly
      setRaw(json.rawText ?? "");
      const parsed =
        typeof json.structured === "string"
          ? JSON.parse(cleanLLMJson(json.structured))
          : json.structured;

      // Immediately update state with parsed result
      setData(parsed as SchoolAdmission);
      // Also capture raw text from response (avoid relying on possibly stale `raw` state)
      const responseRaw = json.rawText ?? "";
      setRaw(responseRaw);

      // POST metadata using local values (not stale React state)
      await fetch("/api/metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: `userName`,
          userEmail: `email@example.com`,
          fileName: pdf.name,
          fileType: pdf.type,
          aiRawText: responseRaw,
          aiStructured: parsed,
        }),
      });

    } catch (e: any) {
      setErr(e?.message || "Extraction failed");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => setData(defaultAdmission);

  return (
    <section id="admission-ocr" className="relative bg-background">
      {/* ambient particles like your Hero/Contact sections */}
      <div className="absolute inset-0">
        <Sparkles density={150} />
      </div>

      <WavyBackground className="bg-grid py-16">
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <h1 className="text-3xl font-bold md:text-4xl">Document Digitizer</h1>
          <p className="mt-2 text-foreground/70">
            Just Upload the scanned form PDF, Let AI do the rest!
          </p>

          <div className="mt-6 flex flex-wrap justify-between items-center gap-4 md:gap-6">
            <div className="flex-shrink-0">
            {/* Upload */}
            <Input
              type="file"
              accept="application/pdf"
              onChange={onFile}
              className="w-full max-w-sm"
            />
            </div>

            <div className="flex flex-wrap justify-end items-center gap-3">
            {/* ✅ Download blank form */}
            <Button
              variant="outline"
              onClick={() => {
                const link = document.createElement("a");
                link.href = "/forms/SampleSchoolForm.pdf"; // static path
                link.download = "SampleSchoolFormFilled.pdf";
                link.click();
              }}
            >
              Blank Form
            </Button>

            {/* ✅ Download Filled form */}
            <Button
              variant="outline"
              onClick={() => {
                const link = document.createElement("a");
                link.href = "/forms/SampleSchoolFormFilled.pdf"; // static path
                link.download = "SampleSchoolFormFilled.pdf";
                link.click();
              }}
            >
              Filled Sample
            </Button>

            {/* Existing Show Raw button */}
            {/* <Button
              variant="secondary"
              disabled={!raw}
              onClick={() => setShowRaw((s) => !s)}
            >
              {showRaw ? "Hide" : "Show"} Raw
            </Button> */}

            {/* Extract button */}
            <Button className="ml-10 mr-2" variant="outline" onClick={extract} disabled={loading}>
              {loading ? "Extracting…" : "Extract"}
            </Button>
            </div>
          </div>



          {err && (
            <div className="mt-4 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
              {err}
            </div>
          )}

          {showRaw && (
            <Card className="mt-4 border-border bg-card/80">
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-4">
                  <h2 className="text-lg font-semibold">Raw API Response</h2>
                </div>
                <Separator />
                <ScrollArea className="h-40 p-4 text-sm">
                  <pre className="whitespace-pre-wrap">{raw}</pre>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* LEFT: PDF preview */}
            <Card className="border-border bg-card/80 flex flex-col h-[80vh]">
              <CardContent className="flex flex-col flex-1 p-0">
                <div className="flex items-center justify-between p-1 pl-4">
                  <h2 className="text-lg font-semibold">Original</h2>
                </div>
                <Separator />
                <div className="flex-1 overflow-hidden p-4 no-scrollbar">
                  {previewUrl ? (
                    <embed
                      src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                      type="application/pdf"
                      className="w-full h-full border border-border overflow-hidden no-scrollbar"
                    />
                  ) : (
                    <label className="flex h-full w-full cursor-pointer items-center justify-center rounded-xl border border-dashed border-border text-foreground/70">
                      Drop a PDF or use the picker
                    </label>
                  )}
                </div>
                <Separator />
                <div className="p-4 text-sm text-foreground/70 border-t border-border">
                  Fields on the right map 1:1 with the Uploaded Form.
                </div>
              </CardContent>
            </Card>


            {/* RIGHT: Form sections */}
            <ScrollArea className="h-[80vh]">
              <div className="flex flex-col gap-6 pr-2">
                <SectionCard title="Student Information">
                  <Input
                    placeholder="Student's Name"
                    value={data.studentInformation.fullName}
                    onChange={(e) =>
                      setData({
                        ...data,
                        studentInformation: { ...data.studentInformation, fullName: e.target.value },
                      })
                    }
                  />
                  <Input
                    placeholder="Date of Birth (MM/DD/YYYY)"
                    value={data.studentInformation.dateOfBirth}
                    onChange={(e) =>
                      setData({
                        ...data,
                        studentInformation: { ...data.studentInformation, dateOfBirth: e.target.value },
                      })
                    }
                  />
                  <Input
                    placeholder="Gender"
                    value={data.studentInformation.gender}
                    onChange={(e) =>
                      setData({
                        ...data,
                        studentInformation: { ...data.studentInformation, gender: e.target.value },
                      })
                    }
                  />
                  <Separator />
                  <Input
                    placeholder="Residential Address"
                    value={data.studentInformation.residentialAddress.fullAddress}
                    onChange={(e) =>
                      setData({
                        ...data,
                        studentInformation: {
                          ...data.studentInformation,
                          residentialAddress: {
                            ...data.studentInformation.residentialAddress,
                            fullAddress: e.target.value,
                          },
                        },
                      })
                    }
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="City"
                      value={data.studentInformation.residentialAddress.city}
                      onChange={(e) =>
                        setData({
                          ...data,
                          studentInformation: {
                            ...data.studentInformation,
                            residentialAddress: {
                              ...data.studentInformation.residentialAddress,
                              city: e.target.value,
                            },
                          },
                        })
                      }
                    />
                    <Input
                      placeholder="State"
                      value={data.studentInformation.residentialAddress.state}
                      onChange={(e) =>
                        setData({
                          ...data,
                          studentInformation: {
                            ...data.studentInformation,
                            residentialAddress: {
                              ...data.studentInformation.residentialAddress,
                              state: e.target.value,
                            },
                          },
                        })
                      }
                    />
                    <Input
                      placeholder="Zip"
                      value={data.studentInformation.residentialAddress.zip}
                      onChange={(e) =>
                        setData({
                          ...data,
                          studentInformation: {
                            ...data.studentInformation,
                            residentialAddress: {
                              ...data.studentInformation.residentialAddress,
                              zip: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>
                </SectionCard>

                <SectionCard title="Parent / Guardian Information">
                  <Input
                    placeholder="Full Name"
                    value={data.parentGuardianInformation.fullName}
                    onChange={(e) =>
                      setData({
                        ...data,
                        parentGuardianInformation: {
                          ...data.parentGuardianInformation,
                          fullName: e.target.value,
                        },
                      })
                    }
                  />
                  <Input
                    placeholder="Relationship to Student"
                    value={data.parentGuardianInformation.relationshipToStudent}
                    onChange={(e) =>
                      setData({
                        ...data,
                        parentGuardianInformation: {
                          ...data.parentGuardianInformation,
                          relationshipToStudent: e.target.value,
                        },
                      })
                    }
                  />
                  <Input
                    placeholder="Contact Number"
                    value={data.parentGuardianInformation.contactNumber}
                    onChange={(e) =>
                      setData({
                        ...data,
                        parentGuardianInformation: {
                          ...data.parentGuardianInformation,
                          contactNumber: e.target.value,
                        },
                      })
                    }
                  />
                  <Input
                    placeholder="Email Address"
                    value={data.parentGuardianInformation.emailAddress}
                    onChange={(e) =>
                      setData({
                        ...data,
                        parentGuardianInformation: {
                          ...data.parentGuardianInformation,
                          emailAddress: e.target.value,
                        },
                      })
                    }
                  />
                  <Input
                    placeholder="Occupation"
                    value={data.parentGuardianInformation.occupation}
                    onChange={(e) =>
                      setData({
                        ...data,
                        parentGuardianInformation: {
                          ...data.parentGuardianInformation,
                          occupation: e.target.value,
                        },
                      })
                    }
                  />
                  <Separator />
                  <Input
                    placeholder="Residential Address (if different)"
                    value={data.parentGuardianInformation.residentialAddressIfDifferent.fullAddress}
                    onChange={(e) =>
                      setData({
                        ...data,
                        parentGuardianInformation: {
                          ...data.parentGuardianInformation,
                          residentialAddressIfDifferent: {
                            ...data.parentGuardianInformation.residentialAddressIfDifferent,
                            fullAddress: e.target.value,
                          },
                        },
                      })
                    }
                  />
                  {/* <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="City"
                      value={data.parentGuardianInformation.residentialAddressIfDifferent.city}
                      onChange={(e) =>
                        setData({
                          ...data,
                          parentGuardianInformation: {
                            ...data.parentGuardianInformation,
                            residentialAddressIfDifferent: {
                              ...data.parentGuardianInformation.residentialAddressIfDifferent,
                              city: e.target.value,
                            },
                          },
                        })
                      }
                    />
                    <Input
                      placeholder="State"
                      value={data.parentGuardianInformation.residentialAddressIfDifferent.state}
                      onChange={(e) =>
                        setData({
                          ...data,
                          parentGuardianInformation: {
                            ...data.parentGuardianInformation,
                            residentialAddressIfDifferent: {
                              ...data.parentGuardianInformation.residentialAddressIfDifferent,
                              state: e.target.value,
                            },
                          },
                        })
                      }
                    />
                    <Input
                      placeholder="Zip"
                      value={data.parentGuardianInformation.residentialAddressIfDifferent.zip}
                      onChange={(e) =>
                        setData({
                          ...data,
                          parentGuardianInformation: {
                            ...data.parentGuardianInformation,
                            residentialAddressIfDifferent: {
                              ...data.parentGuardianInformation.residentialAddressIfDifferent,
                              zip: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div> */}
                </SectionCard>

                <SectionCard title="Previous School Details">
                  <Input
                    placeholder="Name of Previous School"
                    value={data.previousSchoolDetails.schoolName}
                    onChange={(e) =>
                      setData({
                        ...data,
                        previousSchoolDetails: {
                          ...data.previousSchoolDetails,
                          schoolName: e.target.value,
                        },
                      })
                    }
                  />
                  <Input
                    placeholder="School Address"
                    value={data.previousSchoolDetails.schoolAddress.fullAddress}
                    onChange={(e) =>
                      setData({
                        ...data,
                        previousSchoolDetails: {
                          ...data.previousSchoolDetails,
                          schoolAddress: {
                            ...data.previousSchoolDetails.schoolAddress,
                            fullAddress: e.target.value,
                          },
                        },
                      })
                    }
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="City"
                      value={data.previousSchoolDetails.schoolAddress.city}
                      onChange={(e) =>
                        setData({
                          ...data,
                          previousSchoolDetails: {
                            ...data.previousSchoolDetails,
                            schoolAddress: {
                              ...data.previousSchoolDetails.schoolAddress,
                              city: e.target.value,
                            },
                          },
                        })
                      }
                    />
                    <Input
                      placeholder="State"
                      value={data.previousSchoolDetails.schoolAddress.state}
                      onChange={(e) =>
                        setData({
                          ...data,
                          previousSchoolDetails: {
                            ...data.previousSchoolDetails,
                            schoolAddress: {
                              ...data.previousSchoolDetails.schoolAddress,
                              state: e.target.value,
                            },
                          },
                        })
                      }
                    />
                    <Input
                      placeholder="Zip"
                      value={data.previousSchoolDetails.schoolAddress.zip}
                      onChange={(e) =>
                        setData({
                          ...data,
                          previousSchoolDetails: {
                            ...data.previousSchoolDetails,
                            schoolAddress: {
                              ...data.previousSchoolDetails.schoolAddress,
                              zip: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Dates Attended: From"
                      value={data.previousSchoolDetails.datesAttended.from}
                      onChange={(e) =>
                        setData({
                          ...data,
                          previousSchoolDetails: {
                            ...data.previousSchoolDetails,
                            datesAttended: {
                              ...data.previousSchoolDetails.datesAttended,
                              from: e.target.value,
                            },
                          },
                        })
                      }
                    />
                    <Input
                      placeholder="Dates Attended: To"
                      value={data.previousSchoolDetails.datesAttended.to}
                      onChange={(e) =>
                        setData({
                          ...data,
                          previousSchoolDetails: {
                            ...data.previousSchoolDetails,
                            datesAttended: {
                              ...data.previousSchoolDetails.datesAttended,
                              to: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>
                  <Textarea
                    placeholder="Reason for Leaving"
                    value={data.previousSchoolDetails.reasonForLeaving}
                    onChange={(e) =>
                      setData({
                        ...data,
                        previousSchoolDetails: {
                          ...data.previousSchoolDetails,
                          reasonForLeaving: e.target.value,
                        },
                      })
                    }
                  />
                </SectionCard>

                <SectionCard title="Emergency Contact Information">
                  <Input
                    placeholder="Emergency Contact Name"
                    value={data.emergencyContactInformation.fullName}
                    onChange={(e) =>
                      setData({
                        ...data,
                        emergencyContactInformation: {
                          ...data.emergencyContactInformation,
                          fullName: e.target.value,
                        },
                      })
                    }
                  />
                  <Input
                    placeholder="Relationship to Student"
                    value={data.emergencyContactInformation.relationshipToStudent}
                    onChange={(e) =>
                      setData({
                        ...data,
                        emergencyContactInformation: {
                          ...data.emergencyContactInformation,
                          relationshipToStudent: e.target.value,
                        },
                      })
                    }
                  />
                  <Input
                    placeholder="Contact Number"
                    value={data.emergencyContactInformation.contactNumber}
                    onChange={(e) =>
                      setData({
                        ...data,
                        emergencyContactInformation: {
                          ...data.emergencyContactInformation,
                          contactNumber: e.target.value,
                        },
                      })
                    }
                  />
                  <Input
                    placeholder="Alternate Contact Number"
                    value={data.emergencyContactInformation.alternateContactNumber}
                    onChange={(e) =>
                      setData({
                        ...data,
                        emergencyContactInformation: {
                          ...data.emergencyContactInformation,
                          alternateContactNumber: e.target.value,
                        },
                      })
                    }
                  />
                </SectionCard>

                <SectionCard title="Health Information">
                  <label className="flex items-center gap-2">
                    <Checkbox
                      checked={data.healthInformation.hasAllergiesOrConditions}
                      onCheckedChange={(v) =>
                        setData({
                          ...data,
                          healthInformation: {
                            ...data.healthInformation,
                            hasAllergiesOrConditions: Boolean(v),
                          },
                        })
                      }
                    />
                    <span>Student has allergies or medical conditions</span>
                  </label>
                  <Textarea
                    placeholder="If yes, please specify"
                    value={data.healthInformation.conditionsDetails}
                    onChange={(e) =>
                      setData({
                        ...data,
                        healthInformation: {
                          ...data.healthInformation,
                          conditionsDetails: e.target.value,
                        },
                      })
                    }
                  />
                  <Input
                    placeholder="Primary Care Physician Name and Contact"
                    value={data.healthInformation.physicianNameAndContact}
                    onChange={(e) =>
                      setData({
                        ...data,
                        healthInformation: {
                          ...data.healthInformation,
                          physicianNameAndContact: e.target.value,
                        },
                      })
                    }
                  />
                </SectionCard>

                <SectionCard title="Additional Information">
                  <Textarea
                    placeholder="Special Educational Needs"
                    value={data.additionalInformation.specialEducationalNeeds}
                    onChange={(e) =>
                      setData({
                        ...data,
                        additionalInformation: {
                          ...data.additionalInformation,
                          specialEducationalNeeds: e.target.value,
                        },
                      })
                    }
                  />
                  <Textarea
                    placeholder="Interests/Hobbies"
                    value={data.additionalInformation.interestsHobbies}
                    onChange={(e) =>
                      setData({
                        ...data,
                        additionalInformation: {
                          ...data.additionalInformation,
                          interestsHobbies: e.target.value,
                        },
                      })
                    }
                  />
                  <Input
                    placeholder="Languages Spoken at Home"
                    value={data.additionalInformation.languagesSpokenAtHome}
                    onChange={(e) =>
                      setData({
                        ...data,
                        additionalInformation: {
                          ...data.additionalInformation,
                          languagesSpokenAtHome: e.target.value,
                        },
                      })
                    }
                  />
                </SectionCard>

                <SectionCard title="Declaration">
                  <Input
                    placeholder="Parent/Guardian Signature"
                    value={data.declaration.parentGuardianSignature}
                    onChange={(e) =>
                      setData({
                        ...data,
                        declaration: {
                          ...data.declaration,
                          parentGuardianSignature: e.target.value,
                        },
                      })
                    }
                  />
                  <Input
                    placeholder="Date"
                    value={data.declaration.date}
                    onChange={(e) =>
                      setData({
                        ...data,
                        declaration: { ...data.declaration, date: e.target.value },
                      })
                    }
                  />
                </SectionCard>

                <SectionCard title="Office Use Only">
                  <Input
                    placeholder="Received by"
                    value={data.officeUseOnly.receivedBy}
                    onChange={(e) =>
                      setData({
                        ...data,
                        officeUseOnly: { ...data.officeUseOnly, receivedBy: e.target.value },
                      })
                    }
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Date"
                      value={data.officeUseOnly.date}
                      onChange={(e) =>
                        setData({
                          ...data,
                          officeUseOnly: { ...data.officeUseOnly, date: e.target.value },
                        })
                      }
                    />
                    <Input
                      placeholder="Application Number"
                      value={data.officeUseOnly.applicationNumber}
                      onChange={(e) =>
                        setData({
                          ...data,
                          officeUseOnly: { ...data.officeUseOnly, applicationNumber: e.target.value },
                        })
                      }
                    />
                  </div>
                </SectionCard>

                <div className="flex items-center gap-3">
                  <Button variant="outline"
                    onClick={() => {
                      // You can post `data` to your backend here
                      console.log("Admission JSON", data);
                    }}
                  >
                    Save / Submit
                  </Button>
                  <Button onClick={reset}>
                    Reset
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </WavyBackground>
    </section>
  );
}
