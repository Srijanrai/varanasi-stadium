import { pageMeta } from "@/lib/seo/meta";
import { PostIndex, hasPublishedPosts } from "@/components/PostPages";

export const generateMetadata = () =>
  pageMeta({
  title: "Varanasi match-day & Kashi travel guides",
  description: "Longer, practical guides for planning a match day and a Kashi trip around it.",
  path: "/guides/",
  noindex: !hasPublishedPosts("guides"),
  });

export default function Page() {
  return <PostIndex kind="guides" title="Guides" lead="Longer, practical guides for planning a match day and a Kashi trip around it." />;
}
