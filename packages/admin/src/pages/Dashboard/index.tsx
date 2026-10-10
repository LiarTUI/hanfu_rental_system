import { PageContainer } from '@ant-design/pro-components';
import { useMemo } from 'react';
import Admin from './components/Admin/index';
import Store from './components/Store/index';
import styles from './index.less';
function Dashboard() {
  const storeid = Number(localStorage.getItem('storeid'));
  const component = useMemo(() => {
    if (storeid === 0) {
      return <Admin></Admin>;
    } else {
      return <Store></Store>;
    }
  }, [storeid]);
  return (
    <PageContainer className={styles.pageContainer}>
      <div className={styles.pageHeader}>{component}</div>
    </PageContainer>
  );
}

export default Dashboard;
