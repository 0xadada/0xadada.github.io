import React from "react";
import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    p: ({ children, ...props }) => {
      const kids = React.Children.toArray(children);
      const child = kids[0] as React.ReactElement;
      if (kids.length === 1 && child.type && child.type === "img") {
        return (
          <figure {...props}>
            {child}
            <figcaption>{child.props.alt}</figcaption>
          </figure>
        );
      }
      return <p {...props}>{children}</p>;
    },
    table: ({ children }) => (
      <div className="scroller">
        <table>{children}</table>
      </div>
    ),
    ...components,
  };
}
