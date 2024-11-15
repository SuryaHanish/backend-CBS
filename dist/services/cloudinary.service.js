"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImageFromCloudinary = exports.extractCloudinaryPublicId = exports.uploadImage = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
// Upload image to Cloudinary
const uploadImage = async (imageData) => {
    try {
        const result = await cloudinary_1.default.uploader.upload(imageData, {
            folder: "blogs/images" // Folder in Cloudinary where the images will be stored
        });
        return result;
    }
    catch (error) {
        console.error("Image upload failed:", error.message); // More detailed error logging
        throw new Error(`Image upload failed: ${error.message}`);
    }
};
exports.uploadImage = uploadImage;
// Delete image from Cloudinary
// Utility function to extract publicId from Cloudinary URL
const extractCloudinaryPublicId = (url) => {
    // Log the input URL to check if it's correct
    //console.log('Extracting publicId from URL:', url);
    // Updated regular expression to match the Cloudinary image URL and extract the publicId
    const regex = /upload\/v\d+\/(.*)$/; // Adjusted regex to match the pattern more generically
    const match = url.match(regex);
    if (match && match[1]) {
        //console.log('Extracted publicId:', match[1]); // Log the extracted publicId
        return match[1]; // This will return the part of the URL we want
    }
    //console.log('Failed to extract publicId from URL'); // Log failure message if extraction fails
    return undefined;
};
exports.extractCloudinaryPublicId = extractCloudinaryPublicId;
const deleteImageFromCloudinary = async (publicId) => {
    try {
        // Remove the domain and image upload path to extract the correct publicId
        const regex = /https:\/\/res\.cloudinary\.com\/.*\/upload\/v\d+\//;
        const cleanedPublicId = publicId.replace(regex, '').replace(/\.[^/.]+$/, ""); // Remove the Cloudinary domain and the file extension
        //console.log("Attempting to delete image with publicId:", cleanedPublicId); // Log the cleaned publicId
        const result = await cloudinary_1.default.uploader.destroy(cleanedPublicId); // Pass the cleaned publicId to Cloudinary
        // Log the deletion result for debugging
        //console.log('Cloudinary deletion result:', result);
        if (result.result !== 'ok') {
            throw new Error("Failed to delete image from Cloudinary");
        }
        //console.log(`Successfully deleted image with publicId: ${cleanedPublicId}`);
    }
    catch (error) {
        console.error("Image deletion failed:", error.message);
        throw new Error(`Image deletion failed: ${error.message}`);
    }
};
exports.deleteImageFromCloudinary = deleteImageFromCloudinary;
