import mongoose, { Schema, Document } from 'mongoose';

export interface ITopic extends Document {
  name: string;
  categorySlug: string;  // Use category slug instead of ObjectId
  blogSlug?: string;     // Optionally reference a Blog by slug
  slug?:string;
}

const TopicSchema: Schema = new Schema({
  name: { type: String, required: true },
  categorySlug: { type: String, required: true },  // Category reference by slug
  blogSlug: { type: String, ref: 'Blog' }, // Reference to Blog by slug (optional)
  slug:{type:String},
});

export default mongoose.model<ITopic>('Topic', TopicSchema);
