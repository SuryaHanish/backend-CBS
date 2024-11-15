// blog.model.ts
import mongoose, { Schema, Document } from "mongoose";

// Base content type
export type BaseContent = {
  type: string;
  id?: string;
};

// Text-based content types
export type TextContent = BaseContent & {
  type: "text" | "bold" | "italic" | "underline" | "strikethrough" | "highlight";
  content: string;
};

export type TextPartContent = BaseContent & {
  type: "text";
  content: TextContent[];
};

// Code-related content types
export type CodeContent = BaseContent & {
  type: "code";
  content: string;
  language?: string;
  fileName?: string;
  lineNumbers?: boolean;
  highlightedLines?: number[];
};

export type CodeOutputContent = BaseContent & {
  type: "codeOutput";
  content: string;
  status?: "success" | "error" | "warning";
};

// Visual content types
export interface ImageContent {
    type: "image";
    content: string; // URL of the image
    lineNumbers?: boolean;
    highlightedLines?: number[];
    alt?: string;
    caption?: string;
    width?: number;
    height?: number;
    headers?: string[];
    alignment?: string[];
    tags?: string[];
    cloudinary_id: string;  // Add the cloudinary_id field to store the public_id of the image
  }
  

export type DiagramContent = BaseContent & {
  type: "diagram";
  content: string;
  caption?: string;
};

// List content types
export type BulletPointsContent = BaseContent & {
  type: "bulletpoints";
  content: (string | TextContent[])[]; // Mixed strings and text objects
  style?: "disc" | "circle" | "square";
};

export type NumberedListContent = BaseContent & {
  type: "numberedList";
  content: (string | TextContent[])[]; // Mixed strings and text objects
  startFrom?: number;
  style?: "decimal" | "alpha" | "roman";
};

// Interactive content types
export type LinkContent = BaseContent & {
  type: "link";
  content: string;
  url: string;
  isExternal?: boolean;
  icon?: string;
};

export type CalloutContent = BaseContent & {
  type: "callout";
  content: TextContent[];
  variant: "info" | "warning" | "error" | "success" | "note";
  title?: string;
};

// Table content types
export type TableCell = string | TextContent[];

export type TableContent = BaseContent & {
  type: "table";
  headers?: string[];
  content: TableCell[][]; // Array of rows, each row is array of cells
  caption?: string;
  alignment?: ("left" | "center" | "right")[];
};

// Technical content types
export type MathContent = BaseContent & {
  type: "math";
  content: string;
  isInline?: boolean;
};

// Git diff content types
export type GitDiffContent = BaseContent & {
  type: "gitDiff";
  content: {
    fileName: string;
    changes: Array<{
      type: "add" | "remove" | "context";
      content: string;
    }>;
  };
};

// Container types
export type TabsContent = BaseContent & {
  type: "tabs";
  content: {
    label: string;
    content: ContentSection[];
  }[];
};

export type ExpandableContent = BaseContent & {
  type: "expandable";
  title: string;
  content: ContentSection[];
  defaultExpanded?: boolean;
};

// Reference types
export type FootnoteContent = BaseContent & {
  type: "footnote";
  reference: string;
  content: TextContent[];
};

// Content section definition
export type ContentSection =
  | TextPartContent
  | CodeContent
  | CodeOutputContent
  | ImageContent
  | DiagramContent
  | BulletPointsContent
  | NumberedListContent
  | LinkContent
  | CalloutContent
  | TableContent
  | MathContent
  | GitDiffContent
  | TabsContent
  | ExpandableContent
  | FootnoteContent;

// Blog model interface
export interface Blog {
  slug: string;
  title: string;
  content: ContentSection[];
  metadata?: {
    author: string;
    publishDate: string;
    lastUpdated?: string;
    tags: string[];
    readingTime?: number;
    difficulty?: "beginner" | "intermediate" | "advanced";
  };
}

// Content schema definition
const contentSchema = new Schema({
  type: { type: String, required: true },
  content: { type: Schema.Types.Mixed }, // Mixed type for different content types
  language: { type: String },
  fileName: { type: String },
  lineNumbers: { type: Boolean, default: false },
  status:{type:String},
  highlightedLines: { type: [Number] },
  alt: { type: String },
  caption: { type: String },
  width: { type: Number },
  height: { type: Number },
  variant: { type: String, enum: ["info", "warning", "error", "success", "note"] },
  title: { type: String },
  reference: { type: String },
  headers: { type: [String] },
  alignment: { type: [String], enum: ["left", "center", "right"] },
  isInline: { type: Boolean },
  tags: { type: [String] },
  url: { type: String },
  isExternal: { type: Boolean },
  icon: { type: String },
  startFrom: { type: Number },
  style: { type: String, enum: ["decimal", "alpha", "roman"] },
});

// Blog schema definition
const blogSchema = new Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: [contentSchema], required: true },
  metadata: {
    author: { type: String },
    publishDate: { type: String },
    lastUpdated: { type: String },
    tags: { type: [String] },
    readingTime: { type: Number },
    difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"] },
  },
});

// Blog model
const BlogModel = mongoose.model<Blog & Document>("Blog", blogSchema);

export { BlogModel };
