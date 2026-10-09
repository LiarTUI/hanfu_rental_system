import { PageContainer } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import styles from './index.less';
function Dashboard() {
  return (
    <PageContainer className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <Row align={'middle'} gutter={20}>
          <Col span={6}>
            <div className={styles.headerCard}>aa</div>
          </Col>
          <Col span={6}>
            <div className={styles.headerCard}>aa</div>
          </Col>
          <Col span={6}>
            <div className={styles.headerCard}>aa</div>
          </Col>
          <Col span={6}>
            <div className={styles.headerCard}>aa</div>
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
}

export default Dashboard;
