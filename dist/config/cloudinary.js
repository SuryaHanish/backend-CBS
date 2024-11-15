"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
// Debugging: Check if the environment variables are being loaded correctly
//console.log("Cloudinary Config:");
//console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
//console.log("API Key:", process.env.CLOUDINARY_API_KEY);
//console.log("API Secret:", process.env.CLOUDINARY_API_SECRET);
console.log("Cloudinary connected");
// Cloudinary configuration
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
exports.default = cloudinary_1.v2;
