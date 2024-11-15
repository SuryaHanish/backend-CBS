import cloudinary from "../config/cloudinary";
import { CloudinaryResponse } from '../models/cloudinary.model'; // Define the response model

// Upload image to Cloudinary
export const uploadImage = async (imageData: string): Promise<CloudinaryResponse> => {
    try {
      const result = await cloudinary.uploader.upload(imageData, {
        folder: "blogs/images" // Folder in Cloudinary where the images will be stored
      });
      return result;
    } catch (error: any) {
      console.error("Image upload failed:", error.message); // More detailed error logging
      throw new Error(`Image upload failed: ${error.message}`);
    }
  };

// Delete image from Cloudinary
// Utility function to extract publicId from Cloudinary URL
export const extractCloudinaryPublicId = (url: string): string | undefined => {
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

  
export const deleteImageFromCloudinary = async (publicId: string): Promise<void> => {
    try {
      // Remove the domain and image upload path to extract the correct publicId
      const regex = /https:\/\/res\.cloudinary\.com\/.*\/upload\/v\d+\//;
      const cleanedPublicId = publicId.replace(regex, '').replace(/\.[^/.]+$/, ""); // Remove the Cloudinary domain and the file extension
  
      //console.log("Attempting to delete image with publicId:", cleanedPublicId); // Log the cleaned publicId
  
      const result = await cloudinary.uploader.destroy(cleanedPublicId); // Pass the cleaned publicId to Cloudinary
  
      // Log the deletion result for debugging
      //console.log('Cloudinary deletion result:', result);
  
      if (result.result !== 'ok') {
        throw new Error("Failed to delete image from Cloudinary");
      }
  
      //console.log(`Successfully deleted image with publicId: ${cleanedPublicId}`);
    } catch (error: any) {
      console.error("Image deletion failed:", error.message);
      throw new Error(`Image deletion failed: ${error.message}`);
    }
  };
  