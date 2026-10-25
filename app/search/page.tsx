import { pageMeta } from "@/lib/seo/meta";
import { getSearchIndex } from "@/lib/data/search";
import { SearchBox } from "@/components/SearchBox";
import { Container } from "@/components/ui";

export const metadata = pageMeta({ title: "Search", description: "Search temples, ghats, stations and stadium guides.", path: "/search/", noindex: true });

export default function SearchPage() {
  return (
    <Container className="min-h-[60vh] pt-6">
      <h1 className="mb-4 text-2xl">Search</h1>
      <SearchBox index={getSearchIndex()} autoFocus />
    </Container>
  );
}
