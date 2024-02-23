import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    /*
    img: (props) => (
      <figure>
        <img {...props} />
        <figcaption>{props.alt}</figcaption>
      </figure>
    ),
     */
    table: ({ children }) => (
      <div className="scroller">
        <table>{children}</table>
      </div>
    ),
    ...components,
  };
}
