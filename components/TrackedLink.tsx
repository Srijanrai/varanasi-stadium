"use client";

import { track, type TrackEvent } from "@/lib/track";

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: TrackEvent;
  params?: Record<string, string | number | undefined>;
};

export function TrackedLink({ event, params, onClick, ...rest }: Props) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        track(event, params);
        onClick?.(e);
      }}
    />
  );
}
