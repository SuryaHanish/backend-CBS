import mongoose, { Schema, Document } from 'mongoose';

export interface ISubject extends Document {
  name: string;
  slug: string;  // Slug for unique identification
  description: string;
  categories: string[];  // Array of Category slugs
}

const SubjectSchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  categories: [{ type: String }],  // Array of Category slugs
});

export default mongoose.model<ISubject>('Subject', SubjectSchema);
