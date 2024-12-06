import { LeftOutline } from 'antd-mobile-icons';
import { history } from 'umi';
import styles from './index.less';



const Header = ({ title }) => {
  const goBack = () => {
    history.goBack();
  };

  return (
    <div className={styles.navBar}>
      <div className={styles.navBarLeft}>
        <LeftOutline onClick={goBack} />
      </div>
      <div className={styles.navBarTitle}>{title || document.title}</div>
    </div>
  );
};

export default Header;
