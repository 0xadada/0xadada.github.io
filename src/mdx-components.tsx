import React, { DetailedHTMLProps, ImgHTMLAttributes } from "react";
import type { MDXComponents } from "mdx/types";

interface ImgProps
  extends DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    table: ({ children }) => (
      <div className="scroller">
        <table>{children}</table>
      </div>
    ),
    ...components,
  };
}
