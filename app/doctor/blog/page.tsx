"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getAllBlogsForAdmin, deleteBlog } from "@/lib/firestore/blogs";
import type { Blog } from "@/lib/types/blog";
import { Plus, Edit, Trash2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";

const BlogForm = dynamic(() => import("../../admin/blog/BlogForm"), {
  ssr: false,
  loading: () => <div className="text-sage-600">Loading form...</div>
});

export default function DoctorBlogPage() {
  const { user, isDoctor, loading } = useAuth();
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  useEffect(() => {
    if (!loading && (!user || !isDoctor)) {
      router.push("/doctor");
      return;
    }

    loadBlogs();
  }, [user, isDoctor, loading, router]);

  const loadBlogs = async () => {
    try {
      const data = await getAllBlogsForAdmin();
      setBlogs(data);
    } catch (err) {
      console.error("Failed to load blogs:", err);
    } finally {
      setLoadingBlogs(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    
    try {
      await deleteBlog(id);
      setBlogs(blogs.filter((b) => b.id && b.id !== id));
    } catch (err) {
      console.error("Failed to delete blog:", err);
      alert("Failed to delete blog post");
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingBlog(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingBlog(null);
    loadBlogs();
  };

  if (loading || loadingBlogs) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sage-600">Loading...</div>
      </div>
    );
  }

  if (!user || !isDoctor) {
    return null;
  }

  if (showForm) {
    return <BlogForm blog={editingBlog} onClose={handleFormClose} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/doctor")}
            className="p-2 rounded-lg hover:bg-sage-50 transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-serif text-2xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}>
              Blog Management
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Create and manage your blog posts
            </p>
          </div>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sage-500 text-white hover:bg-sage-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Blog Post
        </button>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-sage-100 rounded-2xl">
          <div className="text-4xl mb-3">📝</div>
          <h3 className="font-semibold text-sage-700 mb-2">No blog posts yet</h3>
          <p className="text-sage-500 text-sm mb-4">Create your first blog post to get started</p>
          <button
            onClick={handleNew}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sage-500 text-white hover:bg-sage-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Blog Post
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="p-4 rounded-xl border flex items-center justify-between gap-4"
              style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-surface)" }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                    {blog.title}
                  </h3>
                  {blog.published ? (
                    <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                      <Eye className="w-3 h-3" /> Published
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                      <EyeOff className="w-3 h-3" /> Draft
                    </span>
                  )}
                </div>
                <p className="text-sm truncate" style={{ color: "var(--text-secondary)" }}>
                  {blog.excerpt}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
                  <span>/{blog.slug}</span>
                  {blog.tags.length > 0 && (
                    <span>• {blog.tags.join(", ")}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleEdit(blog)}
                  className="p-2 rounded-lg hover:bg-sage-50 transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => blog.id && handleDelete(blog.id)}
                  className="p-2 rounded-lg hover:bg-red-50 transition-colors text-red-500"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
