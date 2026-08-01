import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { getAllBlogs } from "@/lib/firestore/blogs";
import type { Blog } from "@/lib/types/blog";

export default async function BlogPage() {
  console.log("=== Fetching blogs for public view ===");
  const blogs = await getAllBlogs(true); // Only published blogs
  console.log("Blogs fetched:", blogs.length);
  console.log("Blog data:", blogs);

  return (
    <div className="pt-24 overflow-hidden">
      <section className="py-20 px-6 text-center" style={{ background: "linear-gradient(135deg, var(--bg-surface-alt), var(--bg-base))" }}>
        <div className="max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-6"
            style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--text-secondary)" }}
          >
            Knowledge Is Healing
          </div>
          <h1 className="font-serif mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 3.8rem)", color: "var(--text-primary)" }}>
            Health Articles & Insights
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Evidence-based homeopathy articles written by Dr. Pratima Agale to help you understand natural healing
          </p>
        </div>
      </section>

      <section className="py-16 px-6" style={{ backgroundColor: "var(--bg-surface)" }}>
        <div className="max-w-7xl mx-auto">
          {blogs.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-sage-100 rounded-2xl">
              <div className="text-4xl mb-3">✍️</div>
              <h3 className="font-semibold text-sage-700 mb-2">No articles published yet</h3>
              <p className="text-sage-500 text-sm">Check back soon for new health articles from Dr. Pratima Agale</p>
            </div>
          ) : (
            <>
              {/* Featured */}
              {blogs.length > 0 && (
                <Link
                  href={`/blog/${blogs[0].slug}`}
                  className="block rounded-2xl p-8 md:p-12 mb-10 hover:shadow-md transition-all"
                  style={{ backgroundColor: "var(--bg-surface-alt)" }}
                >
                  <span className="inline-block bg-sage-500 text-white text-xs px-3 py-1 rounded-full mb-4">Featured</span>
                  {blogs[0].coverImage && (
                    <img
                      src={blogs[0].coverImage}
                      alt={blogs[0].title}
                      className="w-full h-64 object-cover rounded-xl mb-6"
                    />
                  )}
                  <h2 className="font-serif text-3xl md:text-4xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}>
                    {blogs[0].title}
                  </h2>
                  <p className="leading-relaxed mb-6 max-w-2xl" style={{ color: "var(--text-secondary)" }}>{blogs[0].excerpt}</p>
                  <div className="flex items-center gap-6 text-sm mb-6" style={{ color: "var(--text-muted)" }}>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {blogs[0].createdAt?.toLocaleDateString() || "Recently"}
                    </span>
                    {blogs[0].tags.slice(0, 1).map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-0.5 rounded-full text-xs"
                        style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-2 bg-sage-500 text-white px-6 py-3 rounded-full font-medium hover:bg-sage-600 transition-all">
                    Read Article <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              )}

              {/* Grid */}
              {blogs.length > 1 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogs.slice(1).map((blog) => (
                    <Link
                      key={blog.id}
                      href={`/blog/${blog.slug}`}
                      className="group rounded-2xl overflow-hidden border hover:shadow-md transition-all hover:-translate-y-1"
                      style={{ borderColor: "var(--border-color)" }}
                    >
                      {blog.coverImage && (
                        <div className="p-6" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
                          <img
                            src={blog.coverImage}
                            alt={blog.title}
                            className="w-full h-40 object-cover rounded-xl"
                          />
                        </div>
                      )}
                      <div className="p-6" style={{ backgroundColor: "var(--bg-surface)" }}>
                        <div className="flex items-center gap-2 mb-3">
                          {blog.tags.slice(0, 1).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--text-muted)" }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h3
                          className="font-serif text-xl mb-3 group-hover:text-sage-600 transition-colors"
                          style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}
                        >
                          {blog.title}
                        </h3>
                        <p className="text-sm leading-relaxed line-clamp-3 mb-4" style={{ color: "var(--text-secondary)" }}>
                          {blog.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                            {blog.createdAt?.toLocaleDateString() || "Recently"}
                          </span>
                          <span className="text-sage-500 text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                            Read more <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
