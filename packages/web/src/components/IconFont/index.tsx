import type { CSSProperties, MouseEventHandler } from 'react';
interface IconFontProps {
  type: string;
  size?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
  onClick?: MouseEventHandler<SVGSVGElement>;
  click?: boolean;
}

export default function IconFont({
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
