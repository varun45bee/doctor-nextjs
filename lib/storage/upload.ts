import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function uploadBlogImage(file: File): Promise<string> {
  try {
    // Create a unique filename: blog-{timestamp}-{originalName}
    const timestamp = Date.now();
    const filename = `blog-${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    // Create reference to the file in Firebase Storage
    const storageRef = ref(storage, `blog-images/${filename}`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
}
