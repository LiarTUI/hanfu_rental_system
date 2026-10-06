import { PageContainer } from '@ant-design/pro-components';

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
        <h1 style={{ color: 'red' }}>听过没有</h1>
      </div>
    </PageContainer>
  );
}

export default Dashboard;
