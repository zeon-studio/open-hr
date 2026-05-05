"use client";

import Image from "next/image";
import { CSSProperties, useEffect, useState } from "react";

type GravatarProps = {
  email?: string | null;
  size?: number;
  default?: string;
  className?: string;
  style?: CSSProperties;
  alt?: string;
};

async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(input)
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function Gravatar({
  email,
  size = 80,
  default: fallback = "mp",
  className,
  style,
  alt,
}: GravatarProps) {
  const [hash, setHash] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!email) {
      setHash(null);
      return;
    }
    sha256(email.trim().toLowerCase())
      .then((h) => {
        if (!cancelled) setHash(h);
      })
      .catch(() => {
        if (!cancelled) setHash(null);
      });
    return () => {
      cancelled = true;
    };
  }, [email]);

  if (!email || !hash) return null;

  const src = `https://www.gravatar.com/avatar/${hash}?s=${size * 2}&d=${encodeURIComponent(fallback)}`;

  return (
    <Image
      src={src}
      alt={alt || email}
      width={size}
      height={size}
      className={className}
      style={style}
      unoptimized
      loading="eager"
    />
  );
}
