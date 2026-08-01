"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getAllBlogsForAdmin, deleteBlog } from "@/lib/firestore/blogs";
import type { Blog } from "@/lib/types/blog";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import dynamic from "next/dynamic";

const BlogForm = dynamic(() => import("./BlogForm"), {
  ssr: false,
  loading: () => <div className="text-sage-600">Loading form...</div>
});

export default function AdminBlogPage() {
  const { user, isDoctor, loading } = useAuth();
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  useEffect(() => {
    if (!loading && !isDoctor) {
      router.push("/");
    }
  }, [loading, isDoctor, router]);

  useEffect(() => {
    if (isDoctor) {
      loadBlogs();
    }
  }, [isDoctor]);

  const loadBlogs = async () => {
    setLoadingBlogs(true);
    try {
      const fetchedBlogs = await getAllBlogsForAdmin();
      setBlogs(fetchedBlogs);
    } catch (error) {
      console.error("Error loading blogs:", error);
    } finally {
      setLoadingBlogs(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    
    try {
      await deleteBlog(id);
      setBlogs(blogs.filter((blog) => blog.id !== id));
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
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

  if (!isDoctor) {
    return null;
  }

  if (showForm) {
    return <BlogForm blog={editingBlog} onClose={handleFormClose} />;
  }

  return (
    <div className="min-h-screen bg-sage-50 dark:bg-sage-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-sage-900 dark:text-sage-100">
              Blog Management
            </h1>
            <p className="text-sage-600 dark:text-sage-400 mt-2">
              Create and manage your blog posts
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-sage-600 text-white px-4 py-2 rounded-lg hover:bg-sage-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Blog Post
          </button>
        </div>

        <div className="bg-white dark:bg-sage-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-sage-200 dark:divide-sage-700">
              <thead className="bg-sage-50 dark:bg-sage-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sage-500 dark:text-sage-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sage-500 dark:text-sage-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sage-500 dark:text-sage-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sage-500 dark:text-sage-400 uppercase tracking-wider">
                    Tags
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-sage-500 dark:text-sage-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-sage-800 divide-y divide-sage-200 dark:divide-sage-700">
                {blogs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-sage-500 dark:text-sage-400"
                    >
                      No blog posts yet. Create your first one!
                    </td>
                  </tr>
                ) : (
                  blogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-sage-50 dark:hover:bg-sage-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-sage-900 dark:text-sage-100">
                          {blog.title}
                        </div>
                        <div className="text-sm text-sage-500 dark:text-sage-400">
                          /blog/{blog.slug}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                            blog.published
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          }`}
                        >
                          {blog.published ? (
                            <>
                              <Eye className="w-3 h-3" />
                              Published
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              Draft
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-sage-500 dark:text-sage-400">
                        {blog.createdAt?.toLocaleDateString() || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {blog.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex px-2 py-0.5 text-xs font-medium bg-sage-100 text-sage-800 dark:bg-sage-700 dark:text-sage-200 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                          {blog.tags.length > 3 && (
                            <span className="text-xs text-sage-500 dark:text-sage-400">
                              +{blog.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(blog)}
                            className="text-sage-600 hover:text-sage-900 dark:text-sage-400 dark:hover:text-sage-200"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(blog.id!)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
