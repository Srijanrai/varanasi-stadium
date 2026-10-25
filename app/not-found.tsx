import Link from "next/link";
import { Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="py-20">
      <h1 className="text-[clamp(2.2rem,6vw,3.4rem)]">This page isn&apos;t here</h1>
      <p className="mt-4 max-w-[52ch] text-lg text-muted">
        It may have moved, or it hasn&apos;t been written yet. Try the stadium guide or go back to the start.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/stadium/" className="btn btn-primary">
          Stadium guide
        </Link>
        <Link href="/" className="btn btn-secondary">
          Home
        </Link>
      </div>
    </Container>
  );
}
