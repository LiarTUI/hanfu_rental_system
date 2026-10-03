import IconFont from '@/components/IconFont';
import { Button } from 'antd';
import styles from './index.less';
function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.contentBox}>
        <div className={styles.content}>
          <span>不知今夕何夕，当着何衣？</span>
          <span>让懂行的知识库，为您推演合乎礼制的绝佳搭配。</span>
          <span>Let the knowledge graph deduce the perfect match for you.</span>
          <Button className={styles.button}>
            开始量体裁案
            <IconFont
              className={styles.icon}
              type="icon-ltr"
              size={20}
              style={{ fill: '#fff' }}
            ></IconFont>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Home;
