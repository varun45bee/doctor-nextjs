"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { createBlog, updateBlog } from "@/lib/firestore/blogs";
import { uploadBlogImage } from "@/lib/storage/upload";
import type { Blog } from "@/lib/types/blog";
import { X, Save, Upload, Image as ImageIcon } from "lucide-react";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface BlogFormProps {
  blog?: Blog | null;
  onClose: () => void;
}

export default function BlogForm({ blog, onClose }: BlogFormProps) {
  const [title, setTitle] = useState(blog?.title || "");
  const [slug, setSlug] = useState(blog?.slug || "");
  const [content, setContent] = useState(blog?.content || "");
  const [excerpt, setExcerpt] = useState(blog?.excerpt || "");
  const [coverImage, setCoverImage] = useState(blog?.coverImage || "");
  const [tags, setTags] = useState(blog?.tags.join(", ") || "");
  const [published, setPublished] = useState(blog?.published || false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (title && !blog) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(generatedSlug);
    }
  }, [title, blog]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError("");

    try {
      const downloadURL = await uploadBlogImage(file);
      setCoverImage(downloadURL);
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const blogData: Omit<Blog, "id" | "createdAt" | "updatedAt"> = {
        title,
        slug,
        content,
        excerpt,
        coverImage,
        author: "Dr. Pratima Agale",
        published,
        tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      };

      if (blog?.id) {
        await updateBlog(blog.id, blogData);
      } else {
        await createBlog(blogData);
      }

      onClose();
    } catch (err) {
      console.error("Error saving blog:", err);
      setError("Failed to save blog. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "blockquote", "code-block"],
      ["clean"],
    ],
  };

  return (
    <div className="min-h-screen bg-sage-50 dark:bg-sage-900 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-sage-900 dark:text-sage-100">
              {blog ? "Edit Blog Post" : "Create New Blog Post"}
            </h1>
            <p className="text-sage-600 dark:text-sage-400 mt-2">
              {blog ? "Update your blog post" : "Write and publish a new article"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-sage-600 hover:text-sage-900 dark:text-sage-400 dark:hover:text-sage-200"
          >
            <X className="w-5 h-5" />
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="bg-white dark:bg-sage-800 rounded-lg shadow p-6 space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2"
              >
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border border-sage-300 dark:border-sage-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent dark:bg-sage-700 dark:text-white"
                placeholder="Enter blog title"
              />
            </div>

            <div>
              <label
                htmlFor="slug"
                className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2"
              >
                URL Slug *
              </label>
              <input
                type="text"
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="w-full px-4 py-2 border border-sage-300 dark:border-sage-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent dark:bg-sage-700 dark:text-white"
                placeholder="blog-post-url-slug"
              />
              <p className="mt-1 text-xs text-sage-500 dark:text-sage-400">
                This will be the URL: /blog/{slug}
              </p>
            </div>

            <div>
              <label
                htmlFor="excerpt"
                className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2"
              >
                Excerpt *
              </label>
              <textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                required
                rows={3}
                className="w-full px-4 py-2 border border-sage-300 dark:border-sage-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent dark:bg-sage-700 dark:text-white"
                placeholder="Short summary for preview cards (150-200 characters)"
              />
            </div>

            <div>
              <label
                htmlFor="coverImage"
                className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2"
              >
                Cover Image
              </label>
              
              <div className="space-y-3">
                {/* File Upload Button */}
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 bg-sage-100 dark:bg-sage-700 text-sage-700 dark:text-sage-300 rounded-lg cursor-pointer hover:bg-sage-200 dark:hover:bg-sage-600 transition-colors">
                    <ImageIcon className="w-4 h-4" />
                    <span>{uploading ? "Uploading..." : "Upload Image"}</span>
                    <input
                      type="file"
                      id="coverImage"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                  {uploading && (
                    <div className="text-sm text-sage-500 dark:text-sage-400">
                      <Upload className="w-4 h-4 inline animate-spin" />
                    </div>
                  )}
                </div>

                {/* Image Preview */}
                {coverImage && (
                  <div className="relative">
                    <img
                      src={coverImage}
                      alt="Cover preview"
                      className="w-full h-48 object-cover rounded-lg border border-sage-300 dark:border-sage-600"
                    />
                    <button
                      type="button"
                      onClick={() => setCoverImage("")}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* URL Input (fallback) */}
                <div className="relative">
                  <input
                    type="url"
                    id="coverImageUrl"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="w-full px-4 py-2 border border-sage-300 dark:border-sage-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent dark:bg-sage-700 dark:text-white"
                    placeholder="Or paste image URL here"
                  />
                </div>
              </div>
              <p className="mt-1 text-xs text-sage-500 dark:text-sage-400">
                Upload an image (max 5MB) or paste a URL
              </p>
            </div>

            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2"
              >
                Tags
              </label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-2 border border-sage-300 dark:border-sage-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent dark:bg-sage-700 dark:text-white"
                placeholder="PCOS, Women's Health, Homeopathy"
              />
              <p className="mt-1 text-xs text-sage-500 dark:text-sage-400">
                Separate tags with commas
              </p>
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2"
              >
                Content *
              </label>
              <div className="border border-sage-300 dark:border-sage-600 rounded-lg overflow-hidden">
                <ReactQuill
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  theme="snow"
                  className="dark:bg-sage-700 dark:text-white"
                  style={{ minHeight: "300px" }}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="published"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 text-sage-600 border-sage-300 rounded focus:ring-sage-500 dark:bg-sage-700 dark:border-sage-600"
              />
              <label
                htmlFor="published"
                className="ml-2 block text-sm text-sage-700 dark:text-sage-300"
              >
                Publish immediately (uncheck to save as draft)
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-sage-300 dark:border-sage-600 rounded-lg text-sage-700 dark:text-sage-300 hover:bg-sage-50 dark:hover:bg-sage-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : blog ? "Update" : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
