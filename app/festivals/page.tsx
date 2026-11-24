import { pageMeta } from "@/lib/seo/meta";
import { PostIndex, hasPublishedPosts } from "@/components/PostPages";

export const generateMetadata = () =>
  pageMeta({
  title: "Varanasi festivals – dates and visitor guide",
  description: "Upcoming festivals in Varanasi with dates, where to go, crowd tips and where to stay.",
  path: "/festivals/",
  noindex: !hasPublishedPosts("festivals"),
  });

export default function Page() {
  return <PostIndex kind="festivals" title="Festivals in Varanasi" lead="Upcoming festivals in Varanasi with dates, where to go, crowd tips and where to stay." />;
}
