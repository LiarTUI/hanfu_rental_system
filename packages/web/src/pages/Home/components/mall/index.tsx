import { getMarketProducts } from '@/services/product';
import { useNavigate } from '@@/exports';
import { CalendarOutlined } from '@ant-design/icons';
import { DatePicker, Select, Spin } from 'antd';
import type { Dayjs } from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { IconFont } from 'shared';
import styles from './index.less';

const { RangePicker } = DatePicker;

// ========== 商品数据（来自 GET /api/product/market） ==========
// heat 后端暂未提供时由前端按 rating/reviewCount 折算兜底；
// available=false → 卡片灰化并显示「当前档期已约满」，选定租赁档期后该卡被滤除
// featured → 左上角显示红色「镇店良裁」角标
interface GoodsItem {
  id: number;
  name: string;
  rentPrice: number; // 日租金
  rentUnit?: number; // 租金单位，1=天
  dynasty: string; // 宋制 / 晋制 / 唐制 / 明制
  category: string; // 外搭 / 下装 / 男装 / 步摇...
  storeId: number;
  storeName?: string; // 店铺名，接口暂未返回时显示「」占位
  coverUrl?: string;
  stock?: number;
  rating?: number | null;
  reviewCount?: number;
  heat: number; // 热度（排序用）
  available?: boolean; // 选定档期内是否可租（后端档期校验）
  featured?: boolean;
}

/** 接口未提供 heat 时，用评分/评价数折算一个兜底热度 */
const deriveHeat = (g: GoodsItem) =>
  Math.round((g.rating ?? 0) * 20 + (g.reviewCount ?? 0));

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
  const [goodsList, setGoodsList] = useState<GoodsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const hasRange = !!(range?.[0] && range?.[1]);
  const navigate = useNavigate();

  // 拉取市集商品：选定档期后带日期参数重拉，由后端校验各商品区间内可租状态
  useEffect(() => {
    setLoading(true);
    getMarketProducts(
      hasRange && range?.[0] && range?.[1]
        ? {
            startDate: range[0].format('YYYY-MM-DD'),
            endDate: range[1].format('YYYY-MM-DD'),
          }
        : undefined,
    )
      .then((res) => setGoodsList(res?.data ?? []))
      .finally(() => setLoading(false));
    // range 变化即重拉；hasRange 由 range 派生不必单列
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  // 形制筛选项从商品数据里动态提取，数据更新后选项自动跟着变
  const styleOptions = useMemo(
    () => [
      { value: 'all', label: '所有形制' },
      ...Array.from(new Set(goodsList.map((g) => g.category)))
        .filter(Boolean)
        .map((c) => ({ value: c, label: c })),
    ],
    [goodsList],
  );

  const visibleList = useMemo(() => {
    const match = dynastyTabs.find((t) => t.key === dynastyKey)?.match ?? '';
    let list = goodsList.filter((g) => {
      if (match && g.dynasty !== match) return false;
      if (styleFilter !== 'all' && g.category !== styleFilter) return false;
      if (hasRange && g.available === false) return false; // 选定档期后，滤除无库之衣
      return true;
    });
    if (sortType === 'heat')
      list = [...list].sort((a, b) => deriveHeat(b) - deriveHeat(a));
    if (sortType === 'priceAsc')
      list = [...list].sort((a, b) => a.rentPrice - b.rentPrice);
    if (sortType === 'priceDesc')
      list = [...list].sort((a, b) => b.rentPrice - a.rentPrice);
    return list;
  }, [goodsList, dynastyKey, styleFilter, sortType, hasRange]);

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
      {loading ? (
        <div className={styles.emptyBlock}>
          <Spin />
        </div>
      ) : visibleList.length > 0 ? (
        <div className={styles.goodsGrid}>
          {visibleList.map((item) => (
            <div
              onClick={() => navigate(`/buy/${item.id}`)}
              key={item.id}
              className={`${styles.goodsCard} ${
                item.available === false ? styles.cardSoldOut : ''
              }`}
            >
              <div className={styles.goodsImgBox}>
                {item.coverUrl ? (
                  <img
                    className={styles.goodsImg}
                    src={item.coverUrl}
                    alt={item.name}
                  />
                ) : (
                  <div className={styles.goodsImgPlaceholder} />
                )}
                {item.featured && (
                  <span className={styles.featuredBadge}>镇店良裁</span>
                )}
                {item.available === false && (
                  <span className={styles.soldOutTag}>当前档期已约满</span>
                )}
              </div>
              <div className={styles.goodsRow}>
                <h3 className={styles.goodsName}>{item.name}</h3>
                <div className={styles.priceBox}>
                  <p className={styles.price}>
                    <span>¥</span>
                    {item.rentPrice}
                  </p>
                  <span className={styles.per}>/ 日</span>
                </div>
              </div>
              <p className={styles.goodsMeta}>
                {item.dynasty} · {item.category}｜{item.storeName ?? '暂无店铺'}
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
