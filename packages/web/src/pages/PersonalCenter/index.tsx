import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from '@umijs/max';
import { Avatar, Layout, message, Modal, Upload } from 'antd';
import { useEffect, useState } from 'react';
import { IconFont } from 'shared';
import { getProfile, uploadAvatar } from '../../services/user';
import styles from './index.less';
const { Header, Sider, Content } = Layout;
// ========== 左侧菜单 ==========
const menus = [
  { key: 'contract', label: '履约契书', note: '订单' },
  { key: 'deposit', label: '押金库', note: '¥500 冻结中' },
  { key: 'profile', label: '量体档案', note: '尺寸' },
  { key: 'favorites', label: '我的雅集', note: '收藏' },
];

// ========== 契书状态 tab 与文案 ==========
const statusTabs = [
  { key: 'inProgress', label: '进行中' },
  { key: 'pending', label: '待履约' },
  { key: 'checking', label: '待查验' },
  { key: 'archived', label: '已归档' },
];

const statusMeta: Record<string, { label: string; red?: boolean }> = {
  inProgress: { label: '履约中', red: true },
  pending: { label: '待履约' },
  checking: { label: '待查验' },
  archived: { label: '已归档' },
};

// ========== 契书数据 ==========
// TODO: 以下为占位样例数据，对接接口后整体替换：
//       - imgs 填本地 import 或后端 URL，为空时显示灰色占位块
//       - tab 上的数量按 status 从列表自动统计，无需单独维护
interface ContractItem {
  id: string; // 契书编号
  status: 'inProgress' | 'pending' | 'checking' | 'archived';
  remainText: string; // 剩余时间，仅履约中展示
  dateRange: string; // 核定履约日期
  plan: string; // 方案
  count: number; // 包含单品件数
  merchant: string; // 所属商家
  deposit: number; // 押金
  imgs: string[];
}

const contractList: ContractItem[] = [
  {
    id: 'YS-20261015001',
    status: 'inProgress',
    remainText: '1 天 14 小时',
    dateRange: '10月15日 ~ 10月17日',
    plan: '大明风华 · 织金马面裙组合',
    count: 3,
    merchant: '织造司',
    deposit: 500,
    imgs: ['', ''],
  },
  {
    id: 'YS-20261018002',
    status: 'pending',
    remainText: '',
    dateRange: '10月18日 ~ 10月20日',
    plan: '大宋风华 · 对襟褙子套装',
    count: 2,
    merchant: '重回汉唐',
    deposit: 300,
    imgs: [''],
  },
  {
    id: 'YS-20261012003',
    status: 'checking',
    remainText: '',
    dateRange: '10月12日 ~ 10月14日',
    plan: '大唐气象 · 齐胸衫裙',
    count: 2,
    merchant: '明华堂',
    deposit: 400,
    imgs: ['', ''],
  },
  {
    id: 'YS-20260928004',
    status: 'archived',
    remainText: '',
    dateRange: '9月28日 ~ 9月30日',
    plan: '魏晋风度 · 大袖衫',
    count: 1,
    merchant: '寻裳雅陌',
    deposit: 200,
    imgs: [''],
  },
];

function PersonalCenter() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('contract');
  const [activeStatus, setActiveStatus] = useState('inProgress');
  const [userInfo, setUserInfo] = useState<{
    username: string;
    avatar: string;
  }>({
    username: '',
    avatar: '',
  });
  // 更换头像弹层
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const res = await getProfile();
      if (res.success) {
        setUserInfo({ username: res.username ?? '', avatar: res.avatar ?? '' });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleExit = () => {
    localStorage.removeItem('token');
    navigate('/', { replace: true });
  };

  // 选文件后只做本地预览，return false 阻止 antd 自动上传，确认时才手动提交
  const beforeUpload = (file: File) => {
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      message.error('仅支持 JPG/PNG 格式');
      return false;
    }
    if (file.size / 1024 / 1024 >= 2) {
      message.error('图片不能超过 2MB');
      return false;
    }
    setAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    return false;
  };

  const confirmAvatar = async () => {
    if (!avatarFile) {
      message.warning('请先选择图片');
      return;
    }
    try {
      const res = await uploadAvatar(avatarFile);
      if (res.success) {
        message.success('头像更新成功');
        setAvatarOpen(false);
        setAvatarFile(null);
        setPreviewUrl('');
        getUserData(); // 重新拉取，左栏与顶部导航头像一起刷新
      } else {
        message.error(res.errorMsg ?? '上传失败');
      }
    } catch (e) {
      console.log(e);
    }
  };

  // 各状态数量自动统计
  const counts = contractList.reduce<Record<string, number>>((acc, c) => {
    acc[c.status] = (acc[c.status] ?? 0) + 1;
    return acc;
  }, {});

  const visibleList = contractList.filter((c) => c.status === activeStatus);
  const currentMenu = menus.find((m) => m.key === activeMenu)!;
  const handleBack = () => {
    navigate('/home');
  };
  return (
    <Layout className={styles.personalCenter}>
      {/* ========== 返回箭头 ======== */}
      <Header className={styles.header}>
        <IconFont
          type="icon-xiangzuojiantou"
          size={28}
          onClick={handleBack}
          click={true}
        />
      </Header>
      <Layout>
        {/* ========== 左侧栏 ========== */}
        <Sider className={styles.sidebar}>
          <div className={styles.userBox}>
            <div
              className={styles.avatarBox}
              onClick={() => {
                setAvatarFile(null);
                setPreviewUrl('');
                setAvatarOpen(true);
              }}
            >
              <Avatar
                className={styles.avatar}
                src={userInfo.avatar}
                icon={userInfo.avatar ? '' : <UserOutlined />}
              />
              <span className={styles.avatarMask}>更换</span>
            </div>
            <div>
              <p className={styles.userName}>
                {userInfo.username || '暂未登录'}
              </p>
              {/* TODO: 会员身份标签，后续接接口 */}
              <p className={styles.userTag}>云裳雅客</p>
            </div>
          </div>

          <nav className={styles.menuList}>
            {menus.map((m) => (
              <p
                key={m.key}
                className={`${styles.menuItem} ${
                  activeMenu === m.key ? styles.menuActive : ''
                }`}
                onClick={() => setActiveMenu(m.key)}
              >
                <span className={styles.menuLabel}>
                  {m.label} <span className={styles.menuNote}>({m.note})</span>
                </span>
              </p>
            ))}
          </nav>

          <a className={styles.exit} onClick={handleExit}>
            退出登录
          </a>
        </Sider>

        {/* ========== 右侧内容 ========== */}
        <Content className={styles.content}>
          <h1 className={styles.contentTitle}>{currentMenu.label}</h1>

          {activeMenu === 'contract' ? (
            <>
              {/* 状态 tabs */}
              <div className={styles.tabs}>
                {statusTabs.map((t) => (
                  <span
                    key={t.key}
                    className={`${styles.tab} ${
                      activeStatus === t.key ? styles.tabActive : ''
                    }`}
                    onClick={() => setActiveStatus(t.key)}
                  >
                    {t.label}（{counts[t.key] ?? 0}）
                  </span>
                ))}
              </div>

              {/* 契书卡片列表 */}
              {visibleList.length > 0 ? (
                <div className={styles.cardList}>
                  {visibleList.map((c) => {
                    const meta = statusMeta[c.status];
                    return (
                      <div
                        key={c.id}
                        className={`${styles.card} ${
                          meta.red ? styles.cardRed : ''
                        }`}
                      >
                        <div className={styles.cardHead}>
                          <span className={styles.cardStatus}>
                            {meta.red && <i className={styles.redDot} />}
                            {meta.label}
                            {c.remainText ? `（剩余 ${c.remainText}）` : ''}
                          </span>
                          <span className={styles.cardNo}>
                            契书编号：{c.id}
                          </span>
                        </div>

                        <div className={styles.cardBody}>
                          <div className={styles.cardInfo}>
                            <p className={styles.dateLabel}>核定履约日期</p>
                            <p className={styles.dateValue}>{c.dateRange}</p>
                            <p className={styles.infoLine}>方案：{c.plan}</p>
                            <p className={styles.infoLine}>
                              包含单品：{c.count} 件
                            </p>
                            <p className={styles.infoLine}>
                              所属商家：{c.merchant}
                            </p>
                          </div>

                          <div className={styles.cardImgs}>
                            {/* TODO: imgs 为空显示占位块，拿到数据后填 contractList 里的 imgs 字段即可 */}
                            {c.imgs.map((img, i) =>
                              img ? (
                                <img
                                  key={i}
                                  className={styles.cardImg}
                                  src={img}
                                  alt={c.plan}
                                />
                              ) : (
                                <div
                                  key={i}
                                  className={styles.imgPlaceholder}
                                />
                              ),
                            )}
                          </div>

                          <div className={styles.cardActions}>
                            <p className={styles.depositTip}>押金冻结中</p>
                            <p className={styles.deposit}>¥{c.deposit}</p>
                            {/* TODO: 归还/续租接口就绪后替换 message 提示 */}
                            <button
                              className={styles.mainBtn}
                              onClick={() =>
                                message.info('已提交归还预约（示例）')
                              }
                            >
                              预约快递归还
                            </button>
                            <button
                              className={styles.ghostBtn}
                              onClick={() =>
                                message.info('已提交续租申请（示例）')
                              }
                            >
                              续租延期
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={styles.emptyBlock}>该状态下暂无契书。</div>
              )}
            </>
          ) : (
            // 其余板块占位
            <div className={styles.emptyBlock}>
              「{currentMenu.label}」板块整理中，敬请期待。
            </div>
          )}
        </Content>
      </Layout>

      {/* 更换头像弹层 */}
      <Modal
        title="更换头像"
        open={avatarOpen}
        onOk={confirmAvatar}
        onCancel={() => setAvatarOpen(false)}
        okText="确认上传"
        cancelText="取消"
        width={420}
      >
        <Upload
          accept="image/jpeg, image/png"
          showUploadList={false}
          maxCount={1}
          beforeUpload={beforeUpload}
        >
          <button className={styles.pickBtn}>
            选择图片（JPG/PNG，不超过 2MB）
          </button>
        </Upload>
        {previewUrl && (
          <img className={styles.preview} src={previewUrl} alt="预览" />
        )}
      </Modal>
    </Layout>
  );
}

export default PersonalCenter;
