import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getPosts, type PostKind } from "@/lib/data/content";
import { articleJsonLd } from "@/lib/seo/jsonld";
import { formatDate } from "@/lib/format";
import { JsonLd } from "./JsonLd";
import { AlertCta } from "./AlertCta";
import { ShareWhatsApp } from "./ShareWhatsApp";
import { Breadcrumbs, Container, DraftNotice, PageIntro, Sources } from "./ui";

const LABEL: Record<PostKind, string> = { blog: "News", guides: "Guides" };

export function hasPublishedPosts(kind: PostKind) {
  return getPosts(kind).some((p) => p.status === "published");
}

export function PostIndex({ kind, title, lead }: { kind: PostKind; title: string; lead: string }) {
  const posts = getPosts(kind);
  return (
    <Container>
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: LABEL[kind], path: `/${kind}/` }]} />
      <PageIntro title={title} lead={lead} />
      {posts.length === 0 ? (
        <p className="bg-soft p-5">Nothing here yet. Our first pieces are on the way.</p>
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {posts.map((p) => (
            <li key={p.slug} className="relative py-5">
              <time dateTime={p.publishedAt} className="text-sm text-muted">
                {formatDate(p.publishedAt)}
              </time>
              <h2 className="mt-1 text-[1.6rem]">
                <Link href={`/${kind}/${p.slug}/`} className="after:absolute after:inset-0 hover:underline underline-offset-4">
                  {p.title}
                </Link>
              </h2>
              <p className="mt-1 max-w-[62ch] text-muted">{p.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}

export function PostView({ kind, slug }: { kind: PostKind; slug: string }) {
  const p = getPost(kind, slug);
  if (!p) notFound();
  const path = `/${kind}/${p.slug}/`;
  return (
    <Container>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: LABEL[kind], path: `/${kind}/` },
          { name: p.title, path },
        ]}
      />
      <article>
        <PageIntro title={p.title} lead={p.summary}>
          <p className="mt-4 text-sm text-muted">
            By {p.author} | Published {formatDate(p.publishedAt)}
            {p.updatedAt !== p.publishedAt && <> | Updated {formatDate(p.updatedAt)}</>} | {p.readingMinutes} min read
          </p>
          {p.status === "draft" && <DraftNotice />}
        </PageIntro>
        {/* Markdown from our own repo files — trusted content. */}
        <div className="prose-local" dangerouslySetInnerHTML={{ __html: p.html }} />
        <div className="mt-8 space-y-4">
          <Sources sources={p.sources} />
          <ShareWhatsApp text={p.title} />
        </div>
      </article>
      <div className="mt-14">
        <AlertCta from={`${kind}-post`} />
      </div>
      <JsonLd data={articleJsonLd(p, path)} />
    </Container>
  );
}

export function postParams(kind: PostKind) {
  return getPosts(kind).map((p) => ({ slug: p.slug }));
}
