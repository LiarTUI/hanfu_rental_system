import type { CSSProperties, MouseEventHandler } from 'react';

export interface IconFontProps {
  type: string;
  size?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
  onClick?: MouseEventHandler<SVGSVGElement>;
  click?: boolean;
}

// 阿里 iconfont Symbol 渲染组件：图标资源由各 app 在 .umirc.ts 的 headScripts 自行引入
export function IconFont({
  type,
  size = 16,
  color,
  className,
  style,
  onClick,
  click,
}: IconFontProps) {
  return (
    <svg
      className={className ? `icon ${className}` : 'icon'}
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        color,
        verticalAlign: 'middle',
        cursor: click ? 'pointer' : '',
        ...style,
      }}
      onClick={onClick}
    >
      <use xlinkHref={`#${type}`} />
    </svg>
  );
}
