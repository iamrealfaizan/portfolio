"use client";

import React, { useEffect, useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { WavyBackground } from "@/components/ui/wavy-background";
import { Sparkles } from "@/components/ui/sparkles";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type NameParts = { first: string; middle: string; last: string };

export type DevanagariICRForm = {
  rollNumber: string;
  nameOfContributor: NameParts;
  fathersName: NameParts;
  mothersName: NameParts;
  houseNo: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  telephoneNo: string;
  dateOfBirth: string; // formatted as dd/mm/yyyy
  class: string;
  subject: string;
  gender: "Male" | "Female" | "";
  signature: string;
};

const emptyName: NameParts = { first: "", middle: "", last: "" };
const defaultForm: DevanagariICRForm = {
  rollNumber: "",
  nameOfContributor: { ...emptyName },
  fathersName: { ...emptyName },
  mothersName: { ...emptyName },
  houseNo: "",
  address: "",
  city: "",
  state: "",
  pinCode: "",
  telephoneNo: "",
  dateOfBirth: "",
  class: "",
  subject: "",
  gender: "",
  signature: "",
};

const cleanLLMJson = (txt: string) =>
  txt
    .trim()
    .replace(/^"""\n?/, "")
    .replace(/"""$/, "")
    .replace(/^```json\s*/i, "")
    .replace(/```$/, "")
    .trim();

function SectionCard({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) {
  return (
    <Card className="border-border bg-card/80">
      <CardContent className="p-3.5">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="mt-4 space-y-4">{children}</div>
      </CardContent>
    </Card>
  );
}

/** 🧠 Utility: Safely map API response → frontend form */
function mapOcrToForm(apiData: any): DevanagariICRForm {
  if (!apiData || typeof apiData !== "object") return defaultForm;

  const s = apiData.studentDetails || {};
  const a = apiData.addressDetails || {};
  const ac = apiData.academicDetails || {};

  const dob =
    s.dateOfBirth && typeof s.dateOfBirth === "object"
      ? `${s.dateOfBirth.day || ""}/${s.dateOfBirth.month || ""}/${s.dateOfBirth.year || ""}`
      : "";

  const gender =
    ac.subject?.male === true
      ? "Male"
      : ac.subject?.female === true
      ? "Female"
      : "";

  return {
    rollNumber: s.rollNumber || "",
    nameOfContributor: {
      first: s.candidateName?.first || "",
      middle: s.candidateName?.middle || "",
      last: s.candidateName?.last || "",
    },
    fathersName: {
      first: s.fatherName?.first || "",
      middle: s.fatherName?.middle || "",
      last: s.fatherName?.last || "",
    },
    mothersName: {
      first: s.motherName?.first || "",
      middle: s.motherName?.middle || "",
      last: s.motherName?.last || "",
    },
    houseNo: a.houseNumber || "",
    address: a.streetLocalitySociety || "",
    city: a.city || "",
    state: a.state || "",
    pinCode: a.pincode || "",
    telephoneNo: s.contact?.telephoneNumber || "",
    dateOfBirth: dob,
    class: ac.class || "",
    subject: ac.department || "",
    gender,
    signature: apiData.signature || "",
  };
}

export default function DevanagariOcrPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [data, setData] = useState<DevanagariICRForm>(defaultForm);
  const [raw, setRaw] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreviewUrl(f ? URL.createObjectURL(f) : "");
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        try {
          URL.revokeObjectURL(previewUrl);
        } catch {}
      }
    };
  }, [previewUrl]);

  const extract = async () => {
    if (!file) {
      setErr("Please choose a PDF or image first.");
      return;
    }
    setLoading(true);
    setErr(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/ocr/hindi", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || "Extraction failed");

      const responseRaw = json.rawText ?? "";
      setRaw(responseRaw);

      let parsed: any = {};
      try {
        parsed =
          typeof json.structured === "string"
            ? JSON.parse(cleanLLMJson(json.structured))
            : json.structured || {};
      } catch {
        console.warn("Failed to parse structured response; using fallback schema.");
      }

      // ✅ Safely map and merge with defaults
      const mapped = mapOcrToForm(parsed);
      setData(mapped);

      // Store metadata
      await fetch("/api/metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: `userName`,
          userEmail: `email@example.com`,
          fileName: file.name,
          fileType: file.type,
          aiRawText: responseRaw,
          aiStructured: mapped,
          formType: "Devanagari-ICR",
        }),
      });
    } catch (e: any) {
      setErr(e?.message || "Extraction failed");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => setData(defaultForm);

  return (
    <section id="devanagari-icr" className="relative bg-background">
      <div className="absolute inset-0">
        <Sparkles density={150} />
      </div>

      <WavyBackground className="bg-grid py-16">
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <h1 className="text-3xl font-bold md:text-4xl">Document Digitizer - HINDI</h1>
          <p className="mt-2 text-foreground/70">
            Upload the scanned form (Hindi only). AI extracts fields. Photo is intentionally excluded.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 md:gap-6">
            <Input
              type="file"
              accept="application/pdf,image/*"
              onChange={onFile}
              className="w-full max-w-sm"
            />

            <div className="flex flex-wrap justify-end items-center gap-3">
                        {/* ✅ Download blank form */}
                        <Button
                          variant="outline"
                          onClick={() => {
                            const link = document.createElement("a");
                            link.href = "/forms/hindiFormTestBlank.pdf"; // static path
                            link.download = "hindiFormTestBlank.pdf";
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
                            link.href = "/forms/hindiFormTest.pdf"; // static path
                            link.download = "hindiFormTest.pdf";
                            link.click();
                          }}
                        >
                          Filled Sample
                        </Button>

            <Button variant="outline" onClick={extract} disabled={loading}>
              {loading ? "Extracting…" : "Extract"}
            </Button>
            </div> 
          </div>


          {err && (
            <div className="mt-4 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
              {err}
            </div>
          )}

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* LEFT: preview */}
            <Card className="border-border bg-card/80 flex h-[80vh] flex-col">
              <CardContent className="flex flex-1 flex-col p-0">
                <div className="flex items-center justify-between p-1 pl-4">
                  <h2 className="text-lg font-semibold">Original</h2>
                </div>
                <Separator />
                <div className="no-scrollbar flex-1 overflow-hidden p-4">
                  {previewUrl ? (
                    <embed
                      src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                      type={file?.type?.startsWith("image/") ? "image/*" : "application/pdf"}
                      className="h-full w-full overflow-hidden border border-border no-scrollbar"
                    />
                  ) : (
                    <label className="flex h-full w-full cursor-pointer items-center justify-center rounded-xl border border-dashed border-border text-foreground/70">
                      Drop a PDF/image or use the picker
                    </label>
                  )}
                </div>
                <Separator />
                <div className="border-t border-border p-4 text-sm text-foreground/70">
                  Right side mirrors the printed fields exactly.
                </div>
              </CardContent>
            </Card>

            {/* RIGHT: Form */}
            <ScrollArea className="h-[80vh] pr-2">
              <div className="flex flex-col gap-3">
                <SectionCard title="Identification">
                  <Input
                    placeholder="Roll Number"
                    value={data.rollNumber}
                    onChange={(e) => setData({ ...data, rollNumber: e.target.value })}
                  />
                </SectionCard>

                <SectionCard title="Name of Contributor">
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="First"
                      value={data.nameOfContributor.first}
                      onChange={(e) =>
                        setData({
                          ...data,
                          nameOfContributor: {
                            ...data.nameOfContributor,
                            first: e.target.value,
                          },
                        })
                      }
                    />
                    <Input
                      placeholder="Middle"
                      value={data.nameOfContributor.middle}
                      onChange={(e) =>
                        setData({
                          ...data,
                          nameOfContributor: {
                            ...data.nameOfContributor,
                            middle: e.target.value,
                          },
                        })
                      }
                    />
                    <Input
                      placeholder="Last"
                      value={data.nameOfContributor.last}
                      onChange={(e) =>
                        setData({
                          ...data,
                          nameOfContributor: {
                            ...data.nameOfContributor,
                            last: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </SectionCard>

                <SectionCard title="Father’s Name">
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="First"
                      value={data.fathersName.first}
                      onChange={(e) =>
                        setData({
                          ...data,
                          fathersName: {
                            ...data.fathersName,
                            first: e.target.value,
                          },
                        })
                      }
                    />
                    <Input
                      placeholder="Middle"
                      value={data.fathersName.middle}
                      onChange={(e) =>
                        setData({
                          ...data,
                          fathersName: {
                            ...data.fathersName,
                            middle: e.target.value,
                          },
                        })
                      }
                    />
                    <Input
                      placeholder="Last"
                      value={data.fathersName.last}
                      onChange={(e) =>
                        setData({
                          ...data,
                          fathersName: {
                            ...data.fathersName,
                            last: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </SectionCard>

                <SectionCard title="Mother’s Name">
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="First"
                      value={data.mothersName.first}
                      onChange={(e) =>
                        setData({
                          ...data,
                          mothersName: {
                            ...data.mothersName,
                            first: e.target.value,
                          },
                        })
                      }
                    />
                    <Input
                      placeholder="Middle"
                      value={data.mothersName.middle}
                      onChange={(e) =>
                        setData({
                          ...data,
                          mothersName: {
                            ...data.mothersName,
                            middle: e.target.value,
                          },
                        })
                      }
                    />
                    <Input
                      placeholder="Last"
                      value={data.mothersName.last}
                      onChange={(e) =>
                        setData({
                          ...data,
                          mothersName: {
                            ...data.mothersName,
                            last: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </SectionCard>

                <SectionCard title="Address">
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="House No."
                      value={data.houseNo}
                      onChange={(e) => setData({ ...data, houseNo: e.target.value })}
                    />
                    <div className="col-span-2">
                      <Input
                        placeholder="Address"
                        value={data.address}
                        onChange={(e) => setData({ ...data, address: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <Input
                      placeholder="City"
                      value={data.city}
                      onChange={(e) => setData({ ...data, city: e.target.value })}
                    />
                    <Input
                      placeholder="State"
                      value={data.state}
                      onChange={(e) => setData({ ...data, state: e.target.value })}
                    />
                    <Input
                      placeholder="Pin Code"
                      value={data.pinCode}
                      onChange={(e) => setData({ ...data, pinCode: e.target.value })}
                    />
                    <Input
                      placeholder="Telephone No."
                      value={data.telephoneNo}
                      onChange={(e) =>
                        setData({ ...data, telephoneNo: e.target.value })
                      }
                    />
                  </div>
                </SectionCard>

                <SectionCard title="Academic / Demographic">
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="Date of Birth (dd/mm/yyyy)"
                      value={data.dateOfBirth}
                      onChange={(e) => setData({ ...data, dateOfBirth: e.target.value })}
                    />
                    <Input
                      placeholder="Class"
                      value={data.class}
                      onChange={(e) => setData({ ...data, class: e.target.value })}
                    />
                    <Input
                      placeholder="Subject"
                      value={data.subject}
                      onChange={(e) => setData({ ...data, subject: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <RadioGroup
                      className="flex gap-6"
                      value={data.gender}
                      onValueChange={(v: string) =>
                        setData({
                          ...data,
                          gender: v as DevanagariICRForm["gender"],
                        })
                      }
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem id="g-m" value="Male" />
                        <Label htmlFor="g-m">Male</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem id="g-f" value="Female" />
                        <Label htmlFor="g-f">Female</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </SectionCard>

                <SectionCard title="Signature">
                  <Textarea
                    placeholder="Signature (type the name as written)"
                    value={data.signature}
                    onChange={(e) =>
                      setData({ ...data, signature: e.target.value })
                    }
                  />
                </SectionCard>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => console.log("ICR JSON", data)}
                  >
                    Save / Submit
                  </Button>
                  <Button onClick={reset}>Reset</Button>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </WavyBackground>
    </section>
  );
}
