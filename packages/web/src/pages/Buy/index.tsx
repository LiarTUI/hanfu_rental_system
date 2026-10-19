import { getProductById } from '@/services/product';
import { LeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from '@umijs/max';
import { Button, DatePicker, message } from 'antd';
import type { Dayjs } from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from 'shared';
import styles from './index.less';

const { RangePicker } = DatePicker;

// 后端 /api/product/{id} 返回实体（游客白名单，详情免登录可浏览）
interface ProductData {
  id: number;
  name: string;
  category: string; // 套装 / 外搭 / 下装...
  dynasty: string; // 宋制 / 唐制...
  coverUrl: string; // /api/upload/... 相对路径
  rentPrice: number; // 日租金
  deposit: number; // 押金
  status: number; // 1 上架 / 0 下架
  createTime?: string;
}

export default function Buy() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLogin, openLogin } = useAuth();

  const [product, setProduct] = useState<ProductData | null>(null);
  const [loaded, setLoaded] = useState(false); // 详情请求是否完成
  const [imgOk, setImgOk] = useState(true); // 封面加载失败时降级为占位块
  const [range, setRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  useEffect(() => {
    if (!id) return;
    getProductById(id).then((res) => {
      if (res?.success && res.data) setProduct(res.data);
      setLoaded(true);
    });
  }, [id]);

  // 租期按自然日计：起租当日计入，归还当日不计
  const days = useMemo(() => {
    if (!range?.[0] || !range?.[1]) return 0;
    return range[1].diff(range[0], 'day');
  }, [range]);

  const rentTotal = days * (product?.rentPrice ?? 0);
  const off = !!product && product.status !== 1;

  // TODO: 后端下单接口就绪后替换为真实请求（payload 见 console）
  const handleSubmit = () => {
    if (days < 1) {
      message.warning('归还日期需晚于起租日期');
      return;
    }
    console.log('下单 payload', {
      productId: product?.id,
      startDate: range![0]!.format('YYYY-MM-DD'),
      endDate: range![1]!.format('YYYY-MM-DD'),
      days,
      rentTotal,
      deposit: product?.deposit,
    });
    message.success(
      `已提交租赁申请：${range![0]!.format('MM月DD日')} 起租，共 ${days} 日`,
    );
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
                  <div className={styles.billRow}>
                    <span>押金（可退）</span>
                    <span>¥{product.deposit}</span>
                  </div>
                  <div className={`${styles.billRow} ${styles.billTotal}`}>
                    <span>预计应付</span>
                    <span>¥{rentTotal + product.deposit}</span>
                  </div>
                </div>
              )}

              <Button
                className={styles.submitBtn}
                disabled={off}
                onClick={onSubmitClick}
              >
                {isLogin ? '提交租赁订单' : '登录后提交订单'}
              </Button>

              <ul className={styles.notes}>
                <li>租金按自然日计，起租当日计入，归还当日不计。</li>
                <li>签收请当场验衣，租赁期内请妥善保管。</li>
                <li>归还经洗护质检无损后，押金于 48 小时内原路退回。</li>
              </ul>
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
