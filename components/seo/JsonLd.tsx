import React from 'react';

interface JsonLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
  id?: string;
}

/**
 * Safely renders JSON-LD structured data into the DOM.
 * Replaces '<' with unicode escape '\u003c' to prevent premature tag closing
 * or script injection attacks per Google Search Central and HTML5 specs.
 */
export default function JsonLd({ data, id }: JsonLdProps) {
  const safeJson = JSON.stringify(data).replace(/</g, '\\u003c');

  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: safeJson,
      }}
    />
  );
}
