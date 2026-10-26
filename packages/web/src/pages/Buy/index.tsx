import { createOrder } from '@/services/order';
import { getProductById } from '@/services/product';
import { LeftOutlined, ShopOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from '@umijs/max';
import { Button, DatePicker, message } from 'antd';
import type { Dayjs } from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from 'shared';
import styles from './index.less';

const { RangePicker } = DatePicker;

// 后端 /api/product/{id} 返回实体（游客白名单，详情免登录可浏览）
interface ProductSku {
  skuId: number;
  size: string; // S/M/L/XL...
  conditionStatus: number; // 物理成色：1 全新 / 2 良好 / 3 微瑕（4 报废不可租，后端已过滤）
}

interface ProductData {
  id: number;
  name: string;
  category: string; // 套装 / 外搭 / 下装...
  dynasty: string; // 宋制 / 唐制...
  coverUrl: string; // /api/upload/... 相对路径
  rentPrice: number; // 日租金（rentUnit=1 按天，当前全部商品按天计）
  deposit: number; // 押金
  cleaningFee?: number; // 洗涤费：按件收取，下单时计入订单总额（10-19 复审口径）
  minRentPeriod?: number; // 最小起租天数，下单强制校验
  status: number; // 1 上架 / 0 下架
  storeId?: number;
  storeName?: string; // 出品商家
  storeLogoUrl?: string | null; // 店铺 logo，后端暂未提供时前端显示默认图标
  skus?: ProductSku[]; // 在租的具体衣件（尺码+成色）
  createTime?: string;
}

// 成色 → 文案 + 色点（与后台 SKU 管理口径一致）
const CONDITION: Record<number, { text: string; dot: string }> = {
  1: { text: '全新', dot: '#52a35a' },
  2: { text: '良好', dot: '#3b7ea9' },
  3: { text: '微瑕', dot: '#c08a2d' },
};

export default function Buy() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLogin, openLogin } = useAuth();

  const [product, setProduct] = useState<ProductData | null>(null);
  const [loaded, setLoaded] = useState(false); // 详情请求是否完成
  const [imgOk, setImgOk] = useState(true); // 封面加载失败时降级为占位块
  const [range, setRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  // 选中的具体衣件（SKU）；默认自动选中成色最好的一件
  const [skuId, setSkuId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false); // 下单请求防重复点击

  useEffect(() => {
    if (!id) return;
    getProductById(id).then((res) => {
      if (res?.success && res.data) {
        setProduct(res.data);
        // 默认选中成色最好的 SKU（conditionStatus 数字越小成色越好）
        const rentable = (res.data.skus ?? []).filter(
          (s: ProductSku) => s.conditionStatus !== 4,
        );
        if (rentable.length) {
          setSkuId(
            rentable.reduce((a: ProductSku, b: ProductSku) =>
              b.conditionStatus < a.conditionStatus ? b : a,
            ).skuId,
          );
        }
      }
      setLoaded(true);
    });
  }, [id]);

  // 租期按自然日计：起租当日计入，归还当日不计
  const days = useMemo(() => {
    if (!range?.[0] || !range?.[1]) return 0;
    return range[1].diff(range[0], 'day');
  }, [range]);

  const rentTotal = days * (product?.rentPrice ?? 0);
  const cleaningFee = product?.cleaningFee ?? 0; // 洗涤费按件（单件订单 ×1）
  const orderTotal = rentTotal + cleaningFee; // 应付 = 租金 + 洗涤费（押金另计、可退）
  const minDays = product?.minRentPeriod ?? 1;
  const off = !!product && product.status !== 1;
  const skuList = (product?.skus ?? []).filter((s) => s.conditionStatus !== 4);

  // 下单：金额由后端计算，前端只传 SKU + 档期（productId 由 skuId 反查）
  const handleSubmit = async () => {
    if (days < 1) {
      message.warning('归还日期需晚于起租日期');
      return;
    }
    if (days < minDays) {
      message.warning(`该衣衫起租 ${minDays} 天起`);
      return;
    }
    if (!skuId) {
      message.warning('请先挑选尺码');
      return;
    }
    setSubmitting(true);
    try {
      const res = await createOrder({
        skuId,
        startDate: range![0]!.format('YYYY-MM-DD'),
        endDate: range![1]!.format('YYYY-MM-DD'),
      });
      if (res?.success) {
        message.success('下单成功，可在我的订单中支付');
        navigate('/orders');
      } else {
        message.error(res?.errorMsg || '下单失败，该衣件档期可能已被订走');
      }
    } catch {
      message.error('下单服务暂不可用，请稍后再试');
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmitClick = () => {
    if (!isLogin) {
      openLogin({ after: handleSubmit });
      return;
    }
    handleSubmit();
  };

  return (
    <div className={styles.buy}>
      <div className={styles.wrap}>
        <div className={styles.backLink} onClick={() => navigate('/home')}>
          <LeftOutlined /> 返回首页
        </div>

        {!loaded ? (
          <div className={styles.empty}>正在展开衣册……</div>
        ) : !product ? (
          <div className={styles.empty}>
            <p>衣衫不在此册，可能已下架或移除</p>
            <Button onClick={() => navigate('/home')}>回市集逛逛</Button>
          </div>
        ) : (
          <div className={styles.detail}>
            {/* 题跋列：竖排格言 + 印章 */}
            <div className={styles.inscription}>
              <p className={styles.motto}>衣冠载道</p>
              <span className={styles.seal}>华衿</span>
            </div>

            {/* 立轴：轴头 + 裱框大图 */}
            <div className={styles.scroll}>
              <i className={styles.rod} />
              <div className={styles.imgCard}>
                {product.coverUrl && imgOk ? (
                  <img
                    className={styles.img}
                    src={product.coverUrl}
                    alt={product.name}
                    onError={() => setImgOk(false)}
                  />
                ) : (
                  <div className={styles.imgPlaceholder}>衣样图暂缺</div>
                )}
                {off && <div className={styles.offMask}>已下架</div>}
              </div>
              <i className={styles.rod} />
            </div>

            {/* 信息流 */}
            <div className={styles.info}>
              <p className={styles.eyebrow}>
                {product.dynasty} · {product.category}
              </p>
              <h1 className={styles.name}>{product.name}</h1>
              <hr className={styles.divider} />

              <div className={styles.priceRow}>
                <div className={styles.priceMain}>
                  <p className={styles.priceValue}>
                    <span>¥</span>
                    {product.rentPrice}
                    <i>/日</i>
                  </p>
                  <span className={styles.priceTag}>日租金</span>
                </div>
                <div className={styles.priceSub}>
                  <p className={styles.priceValue}>
                    <span>¥</span>
                    {product.deposit}
                  </p>
                  <span className={styles.priceTag}>
                    押金 · 归还验衣后原路退回
                  </span>
                </div>
              </div>

              <div className={styles.section}>
                <p className={styles.sectionTitle}>
                  挑选尺码
                  <span className={styles.sectionTip}>
                    每件衣衫独立编号，成色以色点标注
                  </span>
                </p>
                <div className={styles.skuList}>
                  {skuList.map((s) => {
                    const cond = CONDITION[s.conditionStatus];
                    return (
                      <div
                        key={s.skuId}
                        className={`${styles.skuItem} ${
                          skuId === s.skuId ? styles.skuSelected : ''
                        }`}
                        onClick={() => setSkuId(s.skuId)}
                      >
                        <span className={styles.skuSize}>{s.size}</span>
                        <span className={styles.skuCond}>
                          <i
                            className={styles.condDot}
                            style={{ background: cond?.dot ?? '#999' }}
                          />
                          {cond?.text ?? '可租'}
                        </span>
                      </div>
                    );
                  })}
                  {skuList.length === 0 && (
                    <p className={styles.skuEmpty}>
                      各尺码均在租出中，暂无可选衣件
                    </p>
                  )}
                </div>
              </div>

              <div className={styles.section}>
                <p className={styles.sectionTitle}>租赁档期</p>
                <RangePicker
                  className={styles.rangePicker}
                  value={range}
                  onChange={setRange}
                />
              </div>

              {days > 0 && (
                <div className={styles.bill}>
                  <div className={styles.billRow}>
                    <span>
                      租金小计（{days} 日 × ¥{product.rentPrice}/日）
                    </span>
                    <span>¥{rentTotal}</span>
                  </div>
                  {!!cleaningFee && (
                    <div className={styles.billRow}>
                      <span>洗涤费（归还后由平台统一洗护）</span>
                      <span>¥{cleaningFee}</span>
                    </div>
                  )}
                  <div className={styles.billRow}>
                    <span>押金（无损全退，验衣后原路退回）</span>
                    <span>¥{product.deposit}</span>
                  </div>
                  <div className={`${styles.billRow} ${styles.billTotal}`}>
                    <span>预计应付（下单时）</span>
                    <span>¥{orderTotal + product.deposit}</span>
                  </div>
                </div>
              )}

              <Button
                className={styles.submitBtn}
                disabled={off}
                loading={submitting}
                onClick={onSubmitClick}
              >
                {isLogin ? '提交租赁订单' : '登录后提交订单'}
              </Button>

              <ul className={styles.notes}>
                <li>租金按自然日计，起租当日计入，归还当日不计。</li>
                <li>签收请当场验衣，租赁期内请妥善保管。</li>
                <li>
                  归还经洗护质检无损后，押金原路退回；如有超期或损坏，将从押金中据实扣减。
                </li>
              </ul>

              {/* 出品商家 */}
              {product.storeName && (
                <div className={styles.storeBox}>
                  <span className={styles.storeAvatar}>
                    {product.storeLogoUrl ? (
                      <img
                        className={styles.storeLogo}
                        src={product.storeLogoUrl}
                        alt={product.storeName}
                      />
                    ) : (
                      <ShopOutlined className={styles.storeLogoIcon} />
                    )}
                  </span>
                  <div>
                    <p className={styles.storeName}>{product.storeName}</p>
                    <p className={styles.storeMeta}>
                      出品商家 · 衣况与档期咨询请联系商家
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className={styles.footerMotto}>
          <span className={styles.line} />
          <p>承千年衣冠 · 见四时风雅</p>
          <span className={styles.line} />
        </div>
      </div>
    </div>
  );
}
