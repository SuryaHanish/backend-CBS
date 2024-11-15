"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogModel = void 0;
// blog.model.ts
const mongoose_1 = __importStar(require("mongoose"));
// Content schema definition
const contentSchema = new mongoose_1.Schema({
    type: { type: String, required: true },
    content: { type: mongoose_1.Schema.Types.Mixed }, // Mixed type for different content types
    language: { type: String },
    fileName: { type: String },
    lineNumbers: { type: Boolean, default: false },
    status: { type: String },
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
const blogSchema = new mongoose_1.Schema({
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
const BlogModel = mongoose_1.default.model("Blog", blogSchema);
exports.BlogModel = BlogModel;
