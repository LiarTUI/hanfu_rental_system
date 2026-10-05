import IconFont from '@/components/IconFont';
import { CalendarOutlined } from '@ant-design/icons';
import { DatePicker, message } from 'antd';
import type { Dayjs } from 'dayjs';
import { useState } from 'react';
import styles from './index.less';

const { RangePicker } = DatePicker;

// ========== 步骤 1：场景选项 ==========
// TODO: 前两张卡需要配图，后续把 img 填上（本地 import 或接口 URL），为空时显示深色渐变占位
// TODO: 后两张卡的 icon 名替换成你 iconfont 项目里的真实图标名
const sceneList = [
  { id: 'gufeng', name: '古风写真', img: '', icon: '' },
  { id: 'hunyan', name: '传统婚宴', img: '', icon: '' },
  { id: 'youyuan', name: '节庆游园', img: '', icon: 'icon-jieri' },
  { id: 'yaji', name: '雅集日常', img: '', icon: 'icon-huacao' },
];

// ========== 步骤 2：气韵选项（watermark 是卡片右侧的大水印字）==========
const styleList = [
  {
    id: 'qingleng',
    name: '清冷婉约',
    watermark: '雅',
    desc: '以月白、天青为主，低饱和度，展现柔美出尘之姿。',
  },
  {
    id: 'yongrong',
    name: '雍容华贵',
    watermark: '华',
    desc: '重工织金、妆花工艺，大红明黄等正色，尽显华美端庄。',
  },
  {
    id: 'feiyu',
    name: '飞鱼飒爽',
    watermark: '侠',
    desc: '圆领袍、贴里等英气形制，适合追求侠英风之感。',
  },
  {
    id: 'buju',
    name: '不拘一格',
    watermark: '',
    desc: '听凭知识库推测，期待意外之喜。',
  },
];

// 步骤文案配置
const stepMeta = [
  { no: 'QUESTION 01', tag: '场景', lines: ['此番披衣，', '欲赴何等雅集？'] },
  { no: 'QUESTION 02', tag: '气韵', lines: ['期许呈现', '何种气韵神态？'] },
  { no: 'QUESTION 03', tag: '档期', lines: ['请定下', '履约之期。'] },
];

interface SmartMatchProps {
  // 切换顶部页签：'1' 寻衣 | '2' 量体裁案 | '3' 风物志 | '4' 市集
  setActiveKey: (key: string) => void;
}

function SmartMatch({ setActiveKey }: SmartMatchProps) {
  // step: 1 场景 → 2 气韵 → 3 档期 → 4 推演中 → 5 推演完成
  const [step, setStep] = useState(1);
  const [scene, setScene] = useState('');
  const [style, setStyle] = useState('');
  const [range, setRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const pickScene = (id: string) => {
    setScene(id);
    setStep(2);
  };

  const pickStyle = (id: string) => {
    setStyle(id);
    setStep(3);
  };

  const startInfer = () => {
    if (!range || !range[0] || !range[1]) {
      message.warning('请先选取租赁起止日');
      return;
    }
    setStep(4);
    // TODO: 替换为真实推演接口：把 scene/style/起止日 提交给后端，拿到方案后再进入结果页
    setTimeout(() => setStep(5), 2500);
  };

  const restart = () => {
    setScene('');
    setStyle('');
    setRange(null);
    setStep(1);
  };

  const meta = stepMeta[step - 1];
  const sceneName = sceneList.find((s) => s.id === scene)?.name ?? '';
  const styleName = styleList.find((s) => s.id === style)?.name ?? '';

  return (
    <div className={styles.smartMatch}>
      {/* 左侧步骤指示轨（仅在答题阶段显示） */}
      {step <= 3 && (
        <div className={styles.stepRail}>
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              className={`${styles.railDot} ${
                step >= n ? styles.railDotActive : ''
              }`}
            />
          ))}
        </div>
      )}

      {/* ========== 步骤 1 / 2 / 3：问卷 ========== */}
      {step <= 3 && (
        <div className={styles.stepBlock} key={step}>
          <p className={styles.stepEyebrow}>
            {meta.no} <span className={styles.eyebrowTag}>/ {meta.tag}</span>
          </p>
          <h2 className={styles.stepTitle}>
            {meta.lines[0]}
            <br />
            {meta.lines[1]}
          </h2>

          {/* 步骤 1：场景四选一 */}
          {step === 1 && (
            <div className={styles.sceneList}>
              {sceneList.map((item) => (
                <div
                  key={item.id}
                  className={`${styles.sceneCard} ${
                    scene === item.id ? styles.cardSelected : ''
                  }`}
                  onClick={() => pickScene(item.id)}
                >
                  {/* 有配图的卡：背景图 + 压暗渐变 + 左下角白字 */}
                  {item.img ? (
                    <>
                      <img
                        className={styles.sceneImg}
                        src={item.img}
                        alt={item.name}
                      />
                      <div className={styles.sceneMask} />
                      <span className={styles.sceneNameLight}>{item.name}</span>
                    </>
                  ) : (
                    // 无配图的卡：居中圆形图标 + 文字
                    <div className={styles.sceneCenter}>
                      <div className={styles.sceneIconCircle}>
                        <IconFont
                          type={item.icon}
                          size={22}
                          color="rgb(42, 40, 37)"
                        />
                      </div>
                      <span className={styles.sceneNameDark}>{item.name}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 步骤 2：气韵 2x2 四选一 */}
          {step === 2 && (
            <div className={styles.styleGrid}>
              {styleList.map((item) => (
                <div
                  key={item.id}
                  className={`${styles.styleCard} ${
                    style === item.id ? styles.cardSelected : ''
                  }`}
                  onClick={() => pickStyle(item.id)}
                >
                  {item.watermark && (
                    <span className={styles.watermark}>{item.watermark}</span>
                  )}
                  <h3 className={styles.styleName}>{item.name}</h3>
                  <p className={styles.styleDesc}>{item.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* 步骤 3：档期 + 提交 */}
          {step === 3 && (
            <div className={styles.dateCard}>
              <p className={styles.dateTip}>
                选取租赁起止日（系统将为您预留物流时间）
              </p>
              <div
                className={styles.dateBox}
                onClick={() => setPickerOpen(true)}
              >
                <div className={styles.dateItem}>
                  <span className={styles.dateLabel}>起 / START</span>
                  <span className={styles.dateValue}>
                    {range?.[0] ? range[0].format('YYYY.MM.DD') : '请选择'}
                  </span>
                </div>
                <div className={styles.dateDivider} />
                <div className={styles.dateItem}>
                  <span className={styles.dateLabel}>止 / END</span>
                  <span className={styles.dateValue}>
                    {range?.[1] ? range[1].format('YYYY.MM.DD') : '请选择'}
                  </span>
                </div>
                <CalendarOutlined className={styles.dateIcon} />
                {/* 隐形的 RangePicker 覆盖在自绘盒子上，负责弹出日历 */}
                <RangePicker
                  open={pickerOpen}
                  onOpenChange={setPickerOpen}
                  value={range}
                  onChange={(v) => setRange(v)}
                  format="YYYY.MM.DD"
                  className={styles.datePickerHidden}
                />
              </div>
              <button className={styles.inferBtn} onClick={startInfer}>
                开始推演方案
                <IconFont
                  type="icon-ltr"
                  size={18}
                  style={{ fill: 'rgb(248, 247, 242)' }}
                />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========== 步骤 4：推演中 loading ========== */}
      {step === 4 && (
        <div className={styles.loadingBlock}>
          <div className={styles.loadingCircle}>
            <div className={styles.loadingDiamond} />
          </div>
          <p className={styles.loadingText}>解析场景需求...</p>
        </div>
      )}

      {/* ========== 步骤 5：推演完成（占位结果） ========== */}
      {step === 5 && (
        <div className={styles.stepBlock}>
          <p className={styles.stepEyebrow}>
            PROPOSAL <span className={styles.eyebrowTag}>/ 推演完成</span>
          </p>
          <h2 className={styles.stepTitle}>
            为你推得，
            <br />
            如下华服之选。
          </h2>
          <div className={styles.resultCard}>
            <p>
              场景：<b>{sceneName}</b>
            </p>
            <p>
              气韵：<b>{styleName}</b>
            </p>
            <p>
              档期：
              <b>
                {range?.[0]?.format('YYYY.MM.DD')} ~{' '}
                {range?.[1]?.format('YYYY.MM.DD')}
              </b>
            </p>
            <div className={styles.resultBtns}>
              <button className={styles.restartBtn} onClick={restart}>
                重新搭配
              </button>
              {/* '4' 对应顶部页签「市集」，即租赁页面 */}
              <button
                className={styles.goRentBtn}
                onClick={() => setActiveKey('4')}
              >
                前往租赁
              </button>
            </div>
            {/* TODO: 接入推演接口后，这里渲染后端返回的推荐方案列表 */}
          </div>
        </div>
      )}
    </div>
  );
}

export default SmartMatch;
