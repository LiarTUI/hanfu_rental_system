import { useCountUp } from '@/hooks/useCountUp';

/** 数字滚动组件：接口数据到达后 count 从 0 滚到目标值 */
export default function CountUp({ value }: { value: number }) {
  const n = useCountUp(value);
  return <span>{n}</span>;
}
