import { pageMeta } from "@/lib/seo/meta";
import { PostIndex, hasPublishedPosts } from "@/components/PostPages";

export const generateMetadata = () =>
  pageMeta({
  title: "Varanasi stadium news & updates",
  description: "Official announcements, construction progress and anything that changes how you plan your trip. Dated, with sources.",
  path: "/blog/",
  noindex: !hasPublishedPosts("blog"),
  });

export default function Page() {
  return <PostIndex kind="blog" title="News from the stadium and around Kashi" lead="Official announcements, construction progress and anything that changes how you plan your trip. Dated, with sources." />;
}
