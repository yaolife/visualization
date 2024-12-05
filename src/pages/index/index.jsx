import { useModel } from 'umi';
import { Image } from 'antd-mobile';
import styles from './index.less';
import area from '@/images/area.png';

const Index = () => {
  const { user } = useModel('user');
  return (
    <div className={styles.home}>
      <div className={styles.image}>
        {' '}
        <Image src={area} width={2418} height={2309} fit="fill" />
      </div>
    </div>
  );
};

export default Index;
