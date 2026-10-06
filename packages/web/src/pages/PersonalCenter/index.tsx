import { useNavigate } from '@@/exports';
import { Button } from 'antd';

function PersonalCenter() {
  const navigate = useNavigate();
  const handleExit = () => {
    localStorage.removeItem('token');
    navigate('/', { replace: true });
  };
  return (
    <div>
      <Button onClick={handleExit}>退出登陆</Button>
    </div>
  );
}

export default PersonalCenter;
