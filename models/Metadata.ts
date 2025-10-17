import mongoose, { Schema, Document } from "mongoose";

export interface IMetadata extends Document {
  userName?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  device?: string;
  fileName?: string;
  fileType?: string;
  aiRawText?: string;
  aiStructured?: any;
  createdAt: Date;
}

const MetadataSchema = new Schema<IMetadata>(
  {
    userName: { type: String },
    userEmail: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
    device: { type: String },
    fileName: { type: String },
    fileType: { type: String },
    aiRawText: { type: String },
    aiStructured: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const Metadata =
  mongoose.models.Metadata || mongoose.model<IMetadata>("Metadata", MetadataSchema);
