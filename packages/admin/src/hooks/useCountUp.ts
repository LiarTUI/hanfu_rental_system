import { useEffect, useState } from 'react';

/** 数字从 0 平滑滚动到 target，easeOutCubic 先快后慢；target 变化时自动重跑 */
export function useCountUp(target: number, duration = 1000) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!target) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // 卸载或 target 再变化时停掉旧动画
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}
