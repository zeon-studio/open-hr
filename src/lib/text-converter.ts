import { marked } from "marked";

export const humanize = (content: string) => {
  return content
    .replace(/^[\s_]+|[\s_]+$/g, "")
    .replace(/[_\s]+/g, " ")
    .replace(/^[a-z]/, function (m) {
      return m.toUpperCase();
    });
};

export const titleify = (content: string) => {
  const humanized = humanize(content);
  return humanized
    .replace("-", " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const markdownify = (content: string) => {
  const markdownContent = marked.parse(content);
  return { __html: markdownContent };
};
