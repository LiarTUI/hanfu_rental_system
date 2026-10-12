// shared 目录的 IDE/独立类型检查兜底声明。
// 各端自身的资源声明由 src/.umi/typings.d.ts 生成提供，覆盖不到 shared 源码，
// shared 的 tsconfig 会让 IDE 用这份文件。

declare module '*.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  const src: string;
  export default src;
}
