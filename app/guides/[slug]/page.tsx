import { getPost } from "@/lib/data/content";
import { pageMeta } from "@/lib/seo/meta";
import { PostView, postParams } from "@/components/PostPages";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams() {
  return postParams("guides");
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const p = getPost("guides", (await params).slug);
  if (!p) return {};
  return pageMeta({ title: p.title, description: p.summary, path: `/guides/${p.slug}/`, noindex: p.status !== "published" });
}

export default async function Page({ params }: { params: Promise<Params> }) {
  return <PostView kind="guides" slug={(await params).slug} />;
}
