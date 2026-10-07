import ll from '@/assets/ll.svg';
import { PageContainer } from '@ant-design/pro-components';
import { Image } from 'antd';
function Dashboard() {
  return (
    <PageContainer>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image src={ll}></Image>
        <h1 style={{ color: 'red' }}>看老子屏幕cnmd</h1>
        <h1 style={{ color: 'red' }}>听过没有</h1>
      </div>
    </PageContainer>
  );
}

export default Dashboard;
