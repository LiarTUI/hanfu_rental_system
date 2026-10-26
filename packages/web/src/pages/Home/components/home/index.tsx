import { getMarketProducts, type MarketProduct } from '@/services/product';
import { getScenes, type SceneItem } from '@/services/tag';
import { useNavigate } from '@@/exports';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { IconFont } from 'shared';
import styles from './index.less';

// 场景提案数据来自 GET /api/tag/scenes（id / name / imageUrl）
// 接口暂无 desc / dynasty 推荐角标字段，卡片仅展示图与名称，后端补字段后可扩展

// ========== 本周风物（知识板块）==========
const knowledge = {
  tag: 'KNOWLEDGE BASE / 本周风物',
  title: ['大明风华', '马面裙的纵横之美'],
  desc: '马面裙，又名"马面褶裙"。其四裙门的设计，不仅是为了视觉上的端庄平正，更是为了古人骑马出行时的便利。两片两裙的结构，光面为"马面"，两侧打褶，动静之间，尽显东方哲学的辩证统一。',
  action: '阅览完整形制拆解',
  // TODO: 后续对接接口后，把每个单品的 img 填上：
  //       - 本地图片：import 后放变量，如 img: scene1
  //       - 接口图片：直接填后端返回的 URL 字符串
  //       img 为空字符串时会显示灰色占位块
  items: [
    { id: 1, name: '孔府旧藏复原图·织金马面', price: 80, img: '' },
    { id: 2, name: '仿素绸·灰蓝压褶马面', price: 50, img: '' },
  ],
};

const footerText = '© 2026 HUAJIN HANFU PLATFORM. 知识赋能的汉服租赁生态体系。';

interface HomeProps {
  // 切换顶部页签：'1' 寻衣 | '2' 量体裁案 | '3' 风物志 | '4' 市集
  setActiveKey: (key: string) => void;
}

function Home({ setActiveKey }: HomeProps) {
  const navigate = useNavigate();
  const [sceneList, setSceneList] = useState<SceneItem[]>([]);
  // 档期良选：复用市集商品接口，取前 4 件
  const [marketList, setMarketList] = useState<MarketProduct[]>([]);

  useEffect(() => {
    getScenes().then((res) => setSceneList(res?.data ?? []));
    getMarketProducts().then((res) =>
      setMarketList((res?.data ?? []).slice(0, 4)),
    );
  }, []);

  return (
    <div className={styles.container}>
      {/* hero 层：独占一屏并保持原有居中效果 */}
      <div className={styles.hero}>
        <div className={styles.contentBox}>
          <div className={styles.content}>
            <span>不知今夕何夕，当着何衣？</span>
            <span>让懂行的知识库，为您推演合乎礼制的绝佳搭配。</span>
            <span>
              Let the knowledge graph deduce the perfect match for you.
            </span>
            <Button className={styles.button} onClick={() => setActiveKey('2')}>
              开始量体裁案
              <IconFont
                className={styles.icon}
                type="icon-ltr"
                size={20}
                style={{ fill: '#fff' }}
              ></IconFont>
            </Button>
          </div>
          <div className={styles.content}></div>
        </div>
      </div>

      {/* 场景提案板块 */}
      <div className={styles.sceneSection}>
        <div className={styles.sceneHeader}>
          <div>
            <h2 className={styles.sceneTitle}>场景提案</h2>
            <p className={styles.sceneSubTitle}>SCENE PROPOSALS</p>
          </div>
          <a className={styles.sceneMore}>查看所有场景 →</a>
        </div>

        <div className={styles.sceneList}>
          {sceneList.map((scene) => (
            <div className={styles.sceneCard} key={scene.id}>
              <div className={styles.sceneImgBox}>
                {scene.imageUrl ? (
                  <img
                    className={styles.sceneImg}
                    src={scene.imageUrl}
                    alt={scene.name}
                  />
                ) : (
                  <div className={styles.sceneImgPlaceholder} />
                )}
              </div>
              <h3 className={styles.sceneName}>{scene.name}</h3>
              <a className={styles.sceneLink}>以此场景生成搭配</a>
            </div>
          ))}
        </div>
      </div>

      {/* 本周风物 / 关联良选单品板块 */}
      <div className={styles.knowledgeSection}>
        <div className={styles.knowledgeLeft}>
          <p className={styles.knowledgeTag}>{knowledge.tag}</p>
          <h2 className={styles.knowledgeTitle}>
            {knowledge.title[0]}
            <br />
            {knowledge.title[1]}
          </h2>
          <p className={styles.knowledgeDesc}>{knowledge.desc}</p>
          <a className={styles.knowledgeBtn}>{knowledge.action}</a>
        </div>

        <div className={styles.knowledgeRight}>
          <p className={styles.relatedTitle}>
            关联良选单品 <span>Related Items</span>
          </p>
          <div className={styles.relatedList}>
            {knowledge.items.map((item) => (
              <div className={styles.relatedCard} key={item.id}>
                <div className={styles.relatedImgBox}>
                  {/* TODO: img 为空显示占位块，拿到数据后填 knowledge.items 里的 img 字段即可 */}
                  {item.img ? (
                    <img
                      className={styles.relatedImg}
                      src={item.img}
                      alt={item.name}
                    />
                  ) : (
                    <div className={styles.relatedImgPlaceholder} />
                  )}
                </div>
                <p className={styles.relatedName}>{item.name}</p>
                <p className={styles.relatedPrice}>¥ {item.price} / 日</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 档期良选板块 */}
      <div className={styles.marketSection}>
        <div className={styles.marketHeader}>
          <div>
            <h2 className={styles.marketTitle}>档期良选</h2>
            <p className={styles.marketSubTitle}>AVAILABLE THIS WEEKEND</p>
          </div>
          <a className={styles.marketMore} onClick={() => setActiveKey('4')}>
            进入市集 →
          </a>
        </div>

        <div className={styles.marketList}>
          {marketList.map((item) => (
            <div
              className={styles.marketCard}
              key={item.id}
              onClick={() => navigate(`/buy/${item.id}`)}
            >
              <div className={styles.marketImgBox}>
                {item.coverUrl ? (
                  <img
                    className={styles.marketImg}
                    src={item.coverUrl}
                    alt={item.name}
                  />
                ) : (
                  <div className={styles.marketImgPlaceholder} />
                )}
              </div>
              <div className={styles.marketRow}>
                <p className={styles.marketName}>{item.name}</p>
                <p className={styles.marketPrice}>¥{item.rentPrice}</p>
              </div>
              <p className={styles.marketCategory}>
                {item.dynasty} · {item.category}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 页脚 */}
      <footer className={styles.footer}>{footerText}</footer>
    </div>
  );
}

export default Home;
