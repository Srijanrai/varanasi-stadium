import { Breadcrumbs, Container, PageIntro } from "./ui";

/** Simple long-form page for About, Disclaimer, Privacy, etc. */
export function TextPage({
  title,
  path,
  lead,
  updated,
  children,
}: {
  title: string;
  path: string;
  lead?: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <Container>
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: title, path }]} />
      <PageIntro title={title} lead={lead}>
        {updated && <p className="mt-3 text-sm text-muted">Last updated {updated}</p>}
      </PageIntro>
      <div className="prose-local">{children}</div>
    </Container>
  );
}
