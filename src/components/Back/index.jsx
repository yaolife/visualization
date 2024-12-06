import { LeftOutline } from 'antd-mobile-icons';
import { history } from 'umi';
import styles from './index.less';



const Back = () => {
  const goBack = () => {
    history.goBack();
  };

  return (
    <div className={styles.back}>
        <LeftOutline onClick={goBack} fontSize={30} color='#FFFFFF' />
    </div>
  );
};

export default Back;
