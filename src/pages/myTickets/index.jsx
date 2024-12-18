import React, { useState, useEffect } from 'react';
import { Image, Button } from 'antd-mobile';
import { history, useLocation } from 'umi';
import UsModal from '@/components/UsModal';
import TicketItem from '@/components/TicketItem';
import Layout from '@/layout';
import whiteJob from '@/images/whiteJob.png';
import styles from './index.less';

const MyTicket = () => {
  const [value, setValue] = useState('');
  const [visible, setVisible] = useState(false);

  const goNavigation = () => {
    history.push('/ticketNavigation');
  };

  const location = useLocation();
  const activeTab = location.state?.activeTab || 0;

  useEffect(() => {
    // 设置底部导航栏的激活状态
    if (activeTab !== undefined) {
      history.replace({ pathname: '/myTickets', state: { activeTab } });
    }
  }, [activeTab]); // 移除了 history 依赖

  const receiveCard = () => {
    setVisible(true);
  };
  const handleConfirm = (value) => {
    setVisible(false);
  };
  const clickReceiveCard = () => {
    setVisible(true);
  };
  return (
    <>
      <div className={styles.myTicket}>
        <div className={styles.ticketTitle}>
          <Image src={whiteJob} width={24} height={24} fit="fill" />
          <span>我的作业票</span>
        </div>
        <div>
          <TicketItem clickReceiveCard={clickReceiveCard} />
          <TicketItem />
          <TicketItem />
        </div>
        <Layout />
      </div>
      <UsModal
        visible={visible}
        content={'领取成功!'}
        showCloseButtonFlag={false}
        handleConfirm={handleConfirm}
      />
    </>
  );
};

export default MyTicket;
