import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

const ALLOWED = new Set(["risiko", "privasi", "tos"]);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const titles: Record<string, string> = {
    risiko: "Disclaimer Risiko",
    privasi: "Kebijakan Privasi",
    tos: "Syarat Layanan",
  };
  return { title: titles[slug] ?? "Legal" };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!ALLOWED.has(slug)) notFound();
  const path = join(process.cwd(), "content", "legal", `${slug}.md`);
  const md = await readFile(path, "utf8");
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24 prose prose-zinc">
      <ReactMarkdown>{md}</ReactMarkdown>
    </article>
  );
}
