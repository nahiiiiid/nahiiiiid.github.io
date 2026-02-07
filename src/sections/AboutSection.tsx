import React from "react";
import {
  Binary,
  Code,
  Database,
  Facebook,
  Github,
  Linkedin,
  Mail,
  MessageCircle,
  Smartphone,
  Terminal,
  Youtube,
  X,
} from "lucide-react";

import { profile } from "../data/profile";
import { Card, SectionShell } from "./shared";
import { FileText } from "lucide-react";

import about1 from "../assets/profile.jpeg";
import about2 from "../assets/profile.jpeg";
import about3 from "../assets/profile.jpeg";

export default function AboutSection() {
  return (
    <SectionShell id="about" title="About" icon={<FileText className="h-4 w-4" />}>
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {[about1, about2, about3].map((src, i) => (
            <Card key={i} className="p-0 overflow-hidden">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={src}
                  alt={`${profile.name} photo ${i + 1}`}
                  className="h-full w-full object-cover"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0.06), rgba(0,0,0,0.55))",
                  }}
                />
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-2xl font-semibold tracking-tight" style={{ color: "var(--text)" }}>
                {profile.name}
              </div>
              <div className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                {profile.designation}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-2 sm:grid-cols-5 lg:grid-cols-6">
            {[
              { label: "Gmail", href: profile.contact.email, icon: <Mail className="h-4 w-4" />, ext: false },
              { label: "WhatsApp", href: profile.contact.whatsapp, icon: <Smartphone className="h-4 w-4" />, ext: true },
              { label: "LinkedIn", href: profile.social.linkedin, icon: <Linkedin className="h-4 w-4" />, ext: true },
              { label: "X", href: profile.social.x, icon: <X className="h-4 w-4" />, ext: true },
              { label: "LeetCode", href: profile.social.leetcode, icon: <Code className="h-4 w-4" />, ext: true },
              { label: "Codeforces", href: profile.social.codeforces, icon: <Binary className="h-4 w-4" />, ext: true },
              { label: "Kaggle", href: profile.social.kaggle, icon: <Database className="h-4 w-4" />, ext: true },
              { label: "HackerRank", href: profile.social.hackerrank, icon: <Terminal className="h-4 w-4" />, ext: true },
              { label: "GitHub", href: profile.social.github, icon: <Github className="h-4 w-4" />, ext: true },
              { label: "Facebook", href: profile.social.facebook, icon: <Facebook className="h-4 w-4" />, ext: true },
              { label: "YouTube", href: profile.social.youtube, icon: <Youtube className="h-4 w-4" />, ext: true },
            ]
              .filter(Boolean)
              .map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.ext ? "_blank" : undefined}
                  rel={c.ext ? "noreferrer" : undefined}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm transition hover:opacity-90"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--panel2)",
                    color: "var(--text)",
                  }}
                >
                  <span style={{ color: "var(--accent)" }}>{c.icon}</span> {c.label}
                </a>
              ))}
          </div>
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="p-5 sm:p-6" style={{ background: "var(--panel)", boxShadow: "var(--shadow)" }}>
            <div className="mt-5 space-y-5">
              {profile.aboutPosts.map((post, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className="grid h-10 w-10 place-items-center rounded-xl border"
                      style={{
                        borderColor:
                          "color-mix(in oklab, var(--accent) 30%, transparent)" as any,
                        background:
                          "color-mix(in oklab, var(--accent) 12%, transparent)" as any,
                        color: "var(--accent)",
                      }}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </div>

                    {idx < profile.aboutPosts.length - 1 ? (
                      <div
                        className="mt-3 w-px flex-1"
                        style={{ background: "linear-gradient(to bottom, var(--border), transparent)" }}
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-semibold" style={{ color: "var(--text)" }}>
                        {post.title}
                      </span>
                    </div>

                    <div
                      className="mt-3 whitespace-pre-line text-sm leading-relaxed sm:text-base"
                      style={{ color: "var(--muted)" }}
                    >
                      {post.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </SectionShell>
  );
}
