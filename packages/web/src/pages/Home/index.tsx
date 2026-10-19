import { useNavigate } from '@@/exports';
import { UserOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';
import { Avatar, ConfigProvider, Layout, Tabs } from 'antd';
import { useState } from 'react';
import { IconFont, useAuth } from 'shared';
import Home from './components/home';
import KnowLedge from './components/knowLedge';
import Mall from './components/mall';
import SmartMatch from './components/smartMatch';
import styles from './index.less';
const tabs = [
  { key: '1', label: '寻衣' },
  { key: '2', label: '量体裁案' },
  { key: '3', label: '风物志' },
  { key: '4', label: '市集' },
];
function Index() {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState('1');
  // 登录态与头像来自全局 AuthProvider，页面不再自拉 profile
  const { isLogin, user, openLogin } = useAuth();
  const avatarAddress = user?.avatar;
  const renderTabBar: TabsProps['renderTabBar'] = (props, DefaultTabBar) => {
    return (
      <div className={styles.tab}>
        <DefaultTabBar className={styles.tabItem} {...props} />
      </div>
    );
  };
  const handleClick = (
    e?: React.MouseEvent<HTMLElement | SVGSVGElement>,
    key?: string,
  ) => {
    e?.stopPropagation();
    navigate(`/${key}`, { replace: true });
  };
  // 头像/个人中心入口：游客先弹登录 Modal，登录成功后继续跳个人中心
  const handleUserClick = (
    e?: React.MouseEvent<HTMLElement | SVGSVGElement>,
  ) => {
    e?.stopPropagation();
    if (!isLogin) {
      openLogin({ after: () => navigate('/personalCenter') });
      return;
    }
    navigate('/personalCenter', { replace: true });
  };
  return (
    <ConfigProvider
      theme={{
        components: {
          Tabs: {
            itemHoverColor: 'rgb(148, 143, 131)',
            itemColor: 'rgb(42, 40, 37)',
            itemSelectedColor: 'rgb(178, 165, 144)',
            inkBarColor: 'rgb(128, 125, 123)',
          },
        },
      }}
    >
      <Layout className={styles.layout}>
        <Layout.Header className={styles.header}>
          <div className={styles.logoTitle}>
            <span
              className={styles.spantitle}
              style={{ color: 'rgb(142, 53, 46)' }}
            >
              /
            </span>
            <span className={styles.spantitle}>华衿</span>
            <span style={{ fontSize: '12px' }}>HUA JIN</span>
          </div>
          <Tabs
            activeKey={activeKey}
            onChange={setActiveKey}
            renderTabBar={renderTabBar}
            items={tabs}
            centered
            tabBarGutter={60}
          />
          <IconFont
            onClick={(e) => handleClick(e, 'cart')}
            className={styles.icon}
            type="icon-gouwuche"
            size={26}
          ></IconFont>
          <Avatar
            onClick={handleUserClick}
            className={styles.avatar}
            src={avatarAddress}
            icon={avatarAddress ? '' : <UserOutlined />}
          ></Avatar>
        </Layout.Header>
        <Layout.Content className={styles.content}>
          {activeKey === '1' && <Home setActiveKey={setActiveKey} />}
          {activeKey === '2' && <SmartMatch setActiveKey={setActiveKey} />}
          {activeKey === '3' && <KnowLedge setActiveKey={setActiveKey} />}
          {activeKey === '4' && <Mall setActiveKey={setActiveKey} />}
        </Layout.Content>
      </Layout>
    </ConfigProvider>
  );
}

export default Index;
