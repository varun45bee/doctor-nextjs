import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Blog } from "@/lib/types/blog";

const BLOGS_COLLECTION = "blogs";

export async function createBlog(blog: Omit<Blog, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const docRef = await addDoc(collection(db, BLOGS_COLLECTION), {
    ...blog,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateBlog(id: string, blog: Partial<Blog>): Promise<void> {
  const docRef = doc(db, BLOGS_COLLECTION, id);
  await updateDoc(docRef, {
    ...blog,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteBlog(id: string): Promise<void> {
  await deleteDoc(doc(db, BLOGS_COLLECTION, id));
}

export async function getBlogById(id: string): Promise<Blog | null> {
  const docRef = doc(db, BLOGS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) return null;
  
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : undefined,
    updatedAt: data.updatedAt ? (data.updatedAt as Timestamp).toDate() : undefined,
  } as Blog;
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const q = query(
    collection(db, BLOGS_COLLECTION),
    where("slug", "==", slug),
    where("published", "==", true)
  );
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) return null;
  
  const doc = querySnapshot.docs[0];
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : undefined,
    updatedAt: data.updatedAt ? (data.updatedAt as Timestamp).toDate() : undefined,
  } as Blog;
}

export async function getAllBlogs(publishedOnly: boolean = true): Promise<Blog[]> {
  console.log("=== getAllBlogs called ===");
  console.log("publishedOnly:", publishedOnly);
  
  const q = query(
    collection(db, BLOGS_COLLECTION),
    where("published", "==", publishedOnly),
    orderBy("createdAt", "desc")
  );
  
  console.log("Query created, fetching...");
  const querySnapshot = await getDocs(q);
  console.log("Query snapshot size:", querySnapshot.size);
  
  const blogs = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    console.log("Blog document:", doc.id, data);
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : undefined,
      updatedAt: data.updatedAt ? (data.updatedAt as Timestamp).toDate() : undefined,
    } as Blog;
  });
  
  console.log("Final blogs array:", blogs);
  return blogs;
}

export async function getAllBlogsForAdmin(): Promise<Blog[]> {
  const q = query(
    collection(db, BLOGS_COLLECTION),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : undefined,
      updatedAt: data.updatedAt ? (data.updatedAt as Timestamp).toDate() : undefined,
    } as Blog;
  });
}
