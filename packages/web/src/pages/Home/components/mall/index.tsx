import IconFont from '@/components/IconFont';
import { CalendarOutlined } from '@ant-design/icons';
import { DatePicker, Select } from 'antd';
import type { Dayjs } from 'dayjs';
import { useMemo, useState } from 'react';
import styles from './index.less';

const { RangePicker } = DatePicker;

// ========== 商品数据 ==========
// TODO: 以下为占位样例数据（名称/价格/分类/商家均照设计稿填的假数据），
//       对接接口后整体替换为后端返回：
//       - img 填本地 import 或接口 URL，为空时显示灰色占位块
//       - heat 用于「按热度」排序，接口返回后填入
//       - soldOut: true → 卡片灰化并显示「当前档期已约满」，选定租赁档期后该卡被滤除
//       - featured: true → 左上角显示红色「镇店良裁」角标
interface GoodsItem {
  id: number;
  name: string;
  price: number; // 日租金
  heat: number; // 热度（排序用）
  dynasty: string; // 宋制 / 晋制 / 唐制 / 明制
  category: string; // 外搭 / 下装 / 男装 / 步摇...
  shop: string; // 商家名
  img: string;
  soldOut?: boolean;
  featured?: boolean;
}

const goodsList: GoodsItem[] = [
  {
    id: 1,
    name: '月白海棠刺绣对襟褙子',
    price: 60,
    heat: 98,
    dynasty: '宋制',
    category: '外搭',
    shop: '织造司',
    img: '',
  },
  {
    id: 2,
    name: '浅灰蓝三褶百迭裙',
    price: 40,
    heat: 85,
    dynasty: '宋制',
    category: '下装',
    shop: '重回汉唐',
    img: '',
    soldOut: true,
  },
  {
    id: 3,
    name: '大红织金云龙纹圆领袍',
    price: 120,
    heat: 120,
    dynasty: '明制',
    category: '男装',
    shop: '明华堂',
    img: '',
    featured: true,
  },
  {
    id: 4,
    name: '南珠流苏银錾步摇',
    price: 25,
    heat: 76,
    dynasty: '配饰',
    category: '步摇',
    shop: '寻裳雅陌',
    img: '',
  },
];

// ========== 断代筛选：match 对应商品数据的 dynasty 字段 ==========
const dynastyTabs = [
  { key: 'all', label: '不限断代', match: '' },
  { key: 'weijin', label: '魏晋南北朝', match: '晋制' },
  { key: 'tang', label: '大唐气象', match: '唐制' },
  { key: 'song', label: '大宋风华', match: '宋制' },
  { key: 'ming', label: '大明衣冠', match: '明制' },
];

const sortOptions = [
  { value: 'heat', label: '默认排序（按热度）' },
  { value: 'priceAsc', label: '价格从低到高' },
  { value: 'priceDesc', label: '价格从高到低' },
];

interface MallProps {
  // 切换顶部页签：'1' 寻衣 | '2' 量体裁案 | '3' 风物志 | '4' 市集
  setActiveKey: (key: string) => void;
}

function Mall({ setActiveKey }: MallProps) {
  const [dynastyKey, setDynastyKey] = useState('all');
  const [styleFilter, setStyleFilter] = useState('all');
  const [sortType, setSortType] = useState('heat');
  const [range, setRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const hasRange = !!(range?.[0] && range?.[1]);

  // 形制筛选项从商品数据里动态提取，数据更新后选项自动跟着变
  const styleOptions = useMemo(
    () => [
      { value: 'all', label: '所有形制' },
      ...Array.from(new Set(goodsList.map((g) => g.category))).map((c) => ({
        value: c,
        label: c,
      })),
    ],
    [],
  );

  const visibleList = useMemo(() => {
    const match = dynastyTabs.find((t) => t.key === dynastyKey)?.match ?? '';
    let list = goodsList.filter((g) => {
      if (match && g.dynasty !== match) return false;
      if (styleFilter !== 'all' && g.category !== styleFilter) return false;
      if (hasRange && g.soldOut) return false; // 选定档期后，滤除无库之衣
      return true;
    });
    if (sortType === 'priceAsc')
      list = [...list].sort((a, b) => a.price - b.price);
    if (sortType === 'priceDesc')
      list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [dynastyKey, styleFilter, sortType, hasRange]);

  return (
    <div className={styles.mall}>
      {/* ========== 页头：标题 + 档期筛选 ========== */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>市集</h1>
          <p className={styles.pageEyebrow}>RENTAL MARKETPLACE</p>
        </div>

        <div className={styles.dateCard} onClick={() => setPickerOpen(true)}>
          <p className={styles.dateTip}>
            <CalendarOutlined /> 拟定租赁之期（可选）
          </p>
          <p className={styles.dateMain}>
            {hasRange && range?.[0] && range[1]
              ? `${range[0].format('YYYY.MM.DD')} ~ ${range[1].format(
                  'YYYY.MM.DD',
                )}`
              : '在此选择日期，滤除无库之衣'}
            <IconFont
              type="icon-ltr"
              size={16}
              style={{ fill: 'rgb(42, 40, 37)' }}
            />
          </p>
          {/* 隐形的 RangePicker 覆盖在自绘卡片上，负责弹出日历 */}
          <RangePicker
            open={pickerOpen}
            onOpenChange={setPickerOpen}
            value={range}
            onChange={(v) => setRange(v)}
            format="YYYY.MM.DD"
            className={styles.pickerHidden}
          />
        </div>
      </div>

      {/* ========== 筛选栏：断代 / 形制 / 排序 ========== */}
      <div className={styles.filterBar}>
        <div className={styles.dynastyTabs}>
          {dynastyTabs.map((t) => (
            <span
              key={t.key}
              className={`${styles.dynastyTab} ${
                dynastyKey === t.key ? styles.tabActive : ''
              }`}
              onClick={() => setDynastyKey(t.key)}
            >
              {t.label}
            </span>
          ))}
        </div>
        <Select
          variant="borderless"
          value={styleFilter}
          onChange={setStyleFilter}
          options={styleOptions}
          className={styles.styleSelect}
        />
        <Select
          variant="borderless"
          value={sortType}
          onChange={setSortType}
          options={sortOptions}
          className={styles.sortSelect}
        />
      </div>

      {/* ========== 商品网格 ========== */}
      {visibleList.length > 0 ? (
        <div className={styles.goodsGrid}>
          {visibleList.map((item) => (
            <div
              key={item.id}
              className={`${styles.goodsCard} ${
                item.soldOut ? styles.cardSoldOut : ''
              }`}
            >
              <div className={styles.goodsImgBox}>
                {/* TODO: img 为空显示占位块，拿到数据后填 goodsList 里的 img 字段即可 */}
                {item.img ? (
                  <img
                    className={styles.goodsImg}
                    src={item.img}
                    alt={item.name}
                  />
                ) : (
                  <div className={styles.goodsImgPlaceholder} />
                )}
                {item.featured && (
                  <span className={styles.featuredBadge}>镇店良裁</span>
                )}
                {item.soldOut && (
                  <span className={styles.soldOutTag}>当前档期已约满</span>
                )}
              </div>
              <div className={styles.goodsRow}>
                <h3 className={styles.goodsName}>{item.name}</h3>
                <div className={styles.priceBox}>
                  <p className={styles.price}>
                    <span>¥</span>
                    {item.price}
                  </p>
                  <span className={styles.per}>/ 日</span>
                </div>
              </div>
              <p className={styles.goodsMeta}>
                {item.dynasty} · {item.category}｜{item.shop}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyBlock}>
          暂无符合条件之衣，请调整筛选或档期。
        </div>
      )}
    </div>
  );
}

export default Mall;
