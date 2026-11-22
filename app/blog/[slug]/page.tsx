import { getPost } from "@/lib/data/content";
import { pageMeta } from "@/lib/seo/meta";
import { PostView, postParams } from "@/components/PostPages";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams() {
  return postParams("blog");
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const p = getPost("blog", (await params).slug);
  if (!p) return {};
  const cover = p.photos[0];
  return pageMeta({
    title: p.title,
    description: p.summary,
    path: `/blog/${p.slug}/`,
    noindex: p.status !== "published",
    image: cover ? { url: cover.src, width: cover.width, height: cover.height, alt: cover.alt } : undefined,
  });
}

export default async function Page({ params }: { params: Promise<Params> }) {
  return <PostView kind="blog" slug={(await params).slug} />;
}
