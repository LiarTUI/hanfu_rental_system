import { PageContainer } from '@ant-design/pro-components';
import { APP_NAME } from 'shared';

function Dashboard() {
  return (
    <PageContainer>
      <div>{APP_NAME} 后台管理系统</div>
    </PageContainer>
  );
}

export default Dashboard;
