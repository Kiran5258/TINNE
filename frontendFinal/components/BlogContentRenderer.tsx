import React from "react";

interface ContentBlock {
  type: string;
  text?: string;
  level?: number;
  src?: string;
  caption?: string;
  items?: string[];
  value?: string;
}

interface Props {
  content: ContentBlock[];
}

export const BlogContentRenderer: React.FC<Props> = ({ content }) => {
  return (
    <div className="prose max-w-none">
      {content.map((block, index) => {
        switch (block.type) {
          case "heading": {
            if (block.level === 1) return <h1 key={index}>{block.text}</h1>;
            if (block.level === 2) return <h2 key={index}>{block.text}</h2>;
            if (block.level === 3) return <h3 key={index}>{block.text}</h3>;
            if (block.level === 4) return <h4 key={index}>{block.text}</h4>;

            return <h2 key={index}>{block.text}</h2>;
          }

          case "paragraph":
            return <p key={index}>{block.text}</p>;

          case "image":
            return (
              <figure key={index}>
                <img src={block.src} alt={block.caption || ""} />
                {block.caption && <figcaption>{block.caption}</figcaption>}
              </figure>
            );

          case "quote":
            return <blockquote key={index}>{block.text}</blockquote>;

          case "list":
            return (
              <ul key={index}>
                {block.items?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            );

          case "html":
            return (
              <div
                key={index}
                dangerouslySetInnerHTML={{ __html: block.value || "" }}
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
};
