import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function uploadBlogImage(file: File): Promise<string> {
  try {
    console.log("Starting image upload:", file.name, file.size, file.type);
    
    // Create a unique filename: blog-{timestamp}-{originalName}
    const timestamp = Date.now();
    const filename = `blog-${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    console.log("Storage bucket:", storage.app.options.storageBucket);
    
    // Create reference to the file in Firebase Storage
    const storageRef = ref(storage, `blog-images/${filename}`);
    console.log("Storage ref created:", storageRef.fullPath);
    
    // Upload the file
    console.log("Uploading file...");
    const snapshot = await uploadBytes(storageRef, file);
    console.log("Upload successful:", snapshot.metadata);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("Download URL obtained:", downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    
    // More specific error messages
    if (error instanceof Error) {
      if (error.message.includes("CORS")) {
        throw new Error("CORS error: Please run 'gsutil cors set cors.json gs://doc-web-a913f.firebasestorage.app' to fix");
      }
      if (error.message.includes("unauthorized")) {
        throw new Error("Unauthorized: Please check your Firebase authentication");
      }
      if (error.message.includes("quota")) {
        throw new Error("Storage quota exceeded");
      }
      if (error.message.includes("network")) {
        throw new Error("Network error: Please check your internet connection");
      }
    }
    
    throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
