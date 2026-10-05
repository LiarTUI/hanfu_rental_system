import { useState } from 'react';
import styles from './index.less';

// ========== 数据结构：朝代（父选项）→ 子选项组 → 词条 ==========
interface KnowledgeItem {
  key: string;
  label: string;
  desc: string; // 词条简介，未配正文时作为兜底段落
}

interface KnowledgeGroup {
  id: string; // 组 id（同一朝代内唯一即可）
  title: string; // 中文组名，如「唐制形制」
  en: string; // 英文组名，如 STYLE
  items: KnowledgeItem[];
}

interface Dynasty {
  key: string;
  label: string; // 朝代名，如「大唐气象」
  motto: string; // 风韵短语，如「庄重古朴」
  groups: KnowledgeGroup[];
}

const DYNASTIES: Dynasty[] = [
  {
    key: 'xianqin',
    label: '先秦两汉',
    motto: '庄重古朴',
    groups: [
      {
        id: 'style',
        title: '汉制形制',
        en: 'STYLE',
        items: [
          {
            key: 'quju-shenyi',
            label: '曲裾深衣',
            desc: '极具代表性的缠绕式长衣',
          },
          { key: 'zhiju-shenyi', label: '直裾深衣', desc: '垂直剪裁的常服' },
          { key: 'han-ruqun', label: '交领襦裙', desc: '汉代基础上下两截穿搭' },
        ],
      },
      {
        id: 'accessory',
        title: '首服与配饰',
        en: 'ACCESSORY',
        items: [
          { key: 'faguan-jinze', label: '发冠 / 巾帻', desc: '男士头饰' },
          {
            key: 'zu-yupei',
            label: '玉佩 / 组玉佩',
            desc: '体现君子之风的核心配饰',
          },
        ],
      },
      {
        id: 'color',
        title: '汉制色彩',
        en: 'COLOR SCHEME',
        items: [
          { key: 'xuan-duan', label: '玄端', desc: '黑红搭配，极具庄重威仪感' },
        ],
      },
    ],
  },
  {
    key: 'weijin',
    label: '魏晋南北朝',
    motto: '魏晋风度',
    groups: [
      {
        id: 'style',
        title: '晋制形制',
        en: 'STYLE',
        items: [
          {
            key: 'jiaoling-banbi',
            label: '交领半臂 / 襦',
            desc: '多为异色缘边，领口袖口有撞色包边',
          },
          {
            key: 'po-qun',
            label: '破裙',
            desc: '由多块布料拼接而成的下裙，如交窬裙',
          },
          {
            key: 'zaju-chaoshao',
            label: '杂裾垂髾服',
            desc: '带有飘带、极具灵动飞舞感的服饰',
          },
          {
            key: 'daxiu-shan',
            label: '大袖衫',
            desc: '宽袍大袖，展现名士名媛风流',
          },
        ],
      },
      {
        id: 'accessory',
        title: '首服与配饰',
        en: 'ACCESSORY',
        items: [
          {
            key: 'biju-buyao',
            label: '蔽髻 / 步摇',
            desc: '女性高髻与摇曳发饰',
          },
        ],
      },
    ],
  },
  {
    key: 'sui-tang',
    label: '隋唐五代',
    motto: '大唐气象',
    groups: [
      {
        id: 'style',
        title: '唐制形制',
        en: 'STYLE',
        items: [
          {
            key: 'qixiong-shanqun',
            label: '齐胸衫裙',
            desc: '盛唐标志性女装，裙腰提至胸上',
          },
          {
            key: 'tanling-banbi',
            label: '坦领 / U领半臂',
            desc: '初唐流行，领口开阔，受西域影响',
          },
          { key: 'qiyao-ruqun', label: '齐腰襦裙', desc: '中晚唐经典搭配' },
          {
            key: 'daxiu-pibo',
            label: '大袖衫 / 披帛',
            desc: '晚唐贵妇的华丽外搭与缠绕帛带',
          },
          {
            key: 'yuanling-pao',
            label: '圆领袍',
            desc: '男女皆宜，可翻领穿搭，常伴蹀躞带',
          },
        ],
      },
      {
        id: 'accessory',
        title: '首服与配饰',
        en: 'ACCESSORY',
        items: [
          {
            key: 'huadian-mianye',
            label: '花钿 / 面靥',
            desc: '唐代特色面部妆造体系',
          },
          { key: 'yingluo', label: '璎珞', desc: '颈部华丽配饰' },
          {
            key: 'diexie-dai',
            label: '蹀躞带',
            desc: '唐代武官或骑马出行必佩皮带',
          },
        ],
      },
    ],
  },
  {
    key: 'song',
    label: '两宋时期',
    motto: '大宋风华',
    groups: [
      {
        id: 'style',
        title: '宋制形制',
        en: 'STYLE',
        items: [
          {
            key: 'duijin-beizi',
            label: '对襟褙子',
            desc: '宋代最核心外搭，直领对襟两侧开衩',
          },
          { key: 'feijixiu', label: '飞机袖短衫', desc: '极具修身效果的上衣' },
          { key: 'moxiong-guodu', label: '抹胸 / 裹肚', desc: '内搭' },
          { key: 'baidie-qun', label: '百迭裙', desc: '打细褶的一片式下裙' },
          {
            key: 'xuan-qun',
            label: '三片裙 / 旋裙',
            desc: '便于劳作与行走的特殊裙式',
          },
          {
            key: 'song-ku',
            label: '宋裤',
            desc: '改良后非常受现代通勤欢迎的两件套裤装',
          },
        ],
      },
      {
        id: 'accessory',
        title: '首服与配饰',
        en: 'ACCESSORY',
        items: [
          {
            key: 'huaguan-zhenzhu',
            label: '花冠 / 珍珠妆',
            desc: '宋代极具特色的满头插花与面部贴珠',
          },
        ],
      },
      {
        id: 'color',
        title: '宋制色彩',
        en: 'COLOR SCHEME',
        items: [
          {
            key: 'qingya-secai',
            label: '清雅低饱和',
            desc: '月白、天青、藕荷、丁香',
          },
        ],
      },
    ],
  },
  {
    key: 'ming',
    label: '明朝时期',
    motto: '大明衣冠',
    groups: [
      {
        id: 'style',
        title: '明制形制',
        en: 'STYLE',
        items: [
          {
            key: 'ma-mian-qun',
            label: '马面裙',
            desc: '明清核心下裙，四裙门打褶',
          },
          {
            key: 'liling-shan-ao',
            label: '立领长衫 / 短袄',
            desc: '防风保暖，端庄内敛',
          },
          { key: 'jiaoling-ao', label: '交领袄', desc: '明代基础内搭或外穿' },
          {
            key: 'pifeng-bijia',
            label: '披风 / 比甲',
            desc: '无袖或大袖外搭，增加层次感',
          },
          {
            key: 'tieli-yisan',
            label: '贴里 / 曳撒',
            desc: '男装大宗，飞鱼服常见形制，飒爽英挺',
          },
        ],
      },
      {
        id: 'accessory',
        title: '首服与配饰',
        en: 'ACCESSORY',
        items: [
          {
            key: 'diji-toumian',
            label: '狄髻 / 头面',
            desc: '明代已婚女性的一整套金银发冠体系',
          },
          { key: 'gongtao', label: '宫绦', desc: '压在裙头或外衣上的垂挂饰品' },
          { key: 'yunjian', label: '云肩', desc: '极具华丽感的肩部装饰' },
        ],
      },
    ],
  },
];

// ========== 知识词条正文 ==========
// TODO: 后续接入接口/补全词条后在 ARTICLES 里按 item.key 填充；
//       img 填本地 import 或接口 URL，为空时显示占位块；未配置的词条自动走兜底模板
interface Article {
  title: string;
  paragraphs: string[];
  img: string;
}

const ARTICLES: Record<string, Article> = {
  'ma-mian-qun': {
    title: '马面裙的纵横之美',
    paragraphs: [
      '马面裙，又名"马面褶裙"。其四裙门的设计，不仅是为了视觉上的端庄平正，更是为了古人骑马出行时的便利。',
      '两片两裙的结构，光面为"马面"，两侧打褶，动静之间，尽显东方哲学的辩证统一。',
    ],
    img: '',
  },
};

// 未配置正文的词条走兜底模板：用词条自带 desc 拼一段简介，保证任意导航项点击都有内容
const buildArticle = (item: KnowledgeItem): Article => ({
  title: item.label,
  paragraphs: [`${item.label}，${item.desc}。`],
  img: '',
});

interface KnowLedgeProps {
  // 切换顶部页签：'1' 寻衣 | '2' 量体裁案 | '3' 风物志 | '4' 市集
  setActiveKey: (key: string) => void;
}

function KnowLedge({ setActiveKey }: KnowLedgeProps) {
  // 当前停留的朝代（父选项）
  const [dynastyKey, setDynastyKey] = useState(DYNASTIES[0].key);
  // 记忆每个「朝代:组」下最近选中的词条，缺省取该组第一项
  const [picked, setPicked] = useState<Record<string, string>>({});
  // 内容区展示最近点击的词条
  const [currentKey, setCurrentKey] = useState(
    DYNASTIES[0].groups[0].items[0].key,
  );

  const dynasty = DYNASTIES.find((d) => d.key === dynastyKey)!;

  // 某个组当前应高亮的词条 key
  const pickedIn = (group: KnowledgeGroup) =>
    picked[`${dynastyKey}:${group.id}`] ?? group.items[0].key;

  // 切换朝代：子选项组整体联动刷新，内容默认落到新朝代第一组第一项
  const switchDynasty = (key: string) => {
    const next = DYNASTIES.find((d) => d.key === key)!;
    setDynastyKey(key);
    setCurrentKey(next.groups[0].items[0].key);
  };

  // 点选子选项：记录该组选中项，并切换正文
  const pickItem = (groupId: string, key: string) => {
    setPicked((prev) => ({ ...prev, [`${dynastyKey}:${groupId}`]: key }));
    setCurrentKey(key);
  };

  const currentGroup =
    dynasty.groups.find((g) => g.items.some((i) => i.key === currentKey)) ??
    dynasty.groups[0];
  const currentItem =
    currentGroup.items.find((i) => i.key === currentKey) ??
    currentGroup.items[0];
  const article = ARTICLES[currentItem.key] ?? buildArticle(currentItem);

  return (
    <div className={styles.knowLedge}>
      {/* ========== 左侧导航 ========== */}
      <aside className={styles.sidebar}>
        <p className={styles.eyebrow}>KNOWLEDGE INDEX</p>

        {/* 父选项：断代流变 */}
        <h3 className={styles.groupTitle}>
          断代流变 <span className={styles.groupEn}>/ DYNASTY</span>
        </h3>
        {DYNASTIES.map((d) => (
          <p
            key={d.key}
            className={`${styles.dynastyItem} ${
              dynastyKey === d.key ? styles.dynastyItemActive : ''
            }`}
            onClick={() => switchDynasty(d.key)}
          >
            <span className={styles.dynastyLabel}>{d.label}</span>
            <span className={styles.dynastyMotto}>{d.motto}</span>
          </p>
        ))}

        {/* 子选项组：随父选项联动 */}
        {dynasty.groups.map((group) => (
          <div key={group.id}>
            <h3 className={styles.groupTitle}>
              {group.title} <span className={styles.groupEn}>/ {group.en}</span>
            </h3>
            {group.items.map((item) => (
              <p
                key={item.key}
                className={`${styles.navItem} ${
                  pickedIn(group) === item.key ? styles.itemActiveDot : ''
                }`}
                onClick={() => pickItem(group.id, item.key)}
              >
                {item.label}
              </p>
            ))}
          </div>
        ))}
      </aside>

      {/* ========== 右侧内容区 ========== */}
      <main className={styles.content} key={currentKey}>
        <p className={styles.contentEyebrow}>
          {dynasty.label} · {currentGroup.title} / {currentGroup.en}
        </p>
        <h2 className={styles.contentTitle}>{article.title}</h2>

        {/* TODO: 词条配图，img 为空时显示占位块 */}
        {article.img ? (
          <img
            className={styles.contentImg}
            src={article.img}
            alt={article.title}
          />
        ) : (
          <div className={styles.contentImgPlaceholder} />
        )}

        {article.paragraphs.map((para, idx) => (
          <p className={styles.contentPara} key={idx}>
            {para}
          </p>
        ))}
      </main>
    </div>
  );
}

export default KnowLedge;
