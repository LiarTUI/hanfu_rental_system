import { useMemo, useState } from 'react';

/**
 * 表格客户端关键词搜索：按指定字段过滤列表。
 * 数据已全量在内存时使用；后端上分页后需改为 query 参数走服务端过滤。
 *
 * @param list 原始列表
 * @param fields 参与匹配的字段，任一字段命中即保留
 */
export function useTableSearch<T>(list: T[], fields: (keyof T)[]) {
  const [keyword, setKeyword] = useState('');
  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return list;
    return list.filter((item) =>
      fields.some((f) =>
        String(item[f] ?? '')
          .toLowerCase()
          .includes(kw),
      ),
    );
  }, [list, keyword]);
  return { keyword, setKeyword, filtered };
}
