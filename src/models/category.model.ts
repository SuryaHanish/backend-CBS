// models/category.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  subjectSlug: string;
  slug: string;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  subjectSlug: { type: String, required: true }, // Subject reference by slug
  slug: { type: String, required: true },
});

export default mongoose.model<ICategory>('Category', CategorySchema);
