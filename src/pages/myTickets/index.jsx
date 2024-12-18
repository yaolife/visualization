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
  const [ticketList, setTicketList] = useState([
    { content: 'FJ4315665', title: '作业票号', id: '67' },
    { content: '设备阀门检修长字段显示长字段显示长字段显示', title: '作业内容', id: '36' },
    { content: 'SJ2132H,冷却阀门', title: '作业设备', id: '64' },
    { content: '5mx  ， L3   ， R09', title: '作业位置', id: '56' },
    {
      content: '【胡广华】,【张是三】,【胡广华】,【曾茉莉】,【张是三】',
      title: '作业人员',
      id: '29',
    },
    { content: 'SJ2132H418501', title: '定位卡号', id: '99' },
    { content: '2024-06-09  23:59', title: '开始时间', id: '78' },
    { content: '2024-06-10  23:59', title: '结束时间', id: '32' },
  ]);

  const goNavigation = () => {
    history.push('/ticketNavigation');
  };

  const location = useLocation();
  const activeTab = location.state?.activeTab || 0;

  useEffect(() => {
    // 设置底部导航栏的激活状态
    if (activeTab !== undefined) {
      console.log(activeTab, 'activeTab');
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
