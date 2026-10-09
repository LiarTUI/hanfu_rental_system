import { PageContainer } from '@ant-design/pro-components';
import Admin from './components/Admin/index';
import styles from './index.less';
function Dashboard() {
  return (
    <PageContainer className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <Admin></Admin>
      </div>
    </PageContainer>
  );
}

export default Dashboard;
