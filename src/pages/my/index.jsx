import { useModel } from 'umi';
import Layout from '@/layout';
import styles from './index.less';

const Index = () => {
  return (
    <div>
    <div className={styles.home}>
      <h1 className={styles.title}>欢迎我</h1>
    </div>
    <Layout />
    </div>
  );
};

export default Index;
