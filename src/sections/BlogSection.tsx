import React from "react";
import { ArrowRight, FileText } from "lucide-react";
import { blogPosts as BLOG } from "../data/blog";
import { Card, SectionShell } from "./shared";

export default function BlogSection() {
  return (
    <SectionShell id="blog" title="Blog" icon={<FileText className="h-4 w-4" />}>
      <div className="grid gap-4">
        {BLOG.map((post) => (
          <Card key={post.slug} className="p-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-lg font-semibold" style={{ color: "var(--text)" }}>
                {post.title}
              </div>
              <div className="font-mono text-xs" style={{ color: "var(--muted2)" }}>
                {post.date}
              </div>
            </div>

            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              {post.excerpt}
            </p>

            <div className="mt-4">
              <button
                className="inline-flex items-center gap-2 text-sm font-medium transition hover:opacity-90"
                style={{ color: "var(--accent)" }}
                onClick={() =>
                  alert("Hook this to a blog route (e.g., /blog/" + post.slug + ")")
                }
              >
                Read <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}
