import React, { useState, useEffect } from 'react';
import { Image, Button } from 'antd-mobile';
import { history, useLocation } from 'umi';
import UsModal from '@/components/UsModal';
import TicketItem from '@/components/TicketItem';
import { getTicketList } from '@/services/services';
import { AutoSizer, List as VirtualizedList, WindowScroller } from 'react-virtualized';
import Layout from '@/layout';
import whiteJob from '@/images/whiteJob.png';
import styles from './index.less';

const MyTicket = () => {
  const [value, setValue] = useState('');
  const [visible, setVisible] = useState(false);
  const [ticketList, setTicketList] = useState([]);

  useEffect(() => {
    // 获取票务列表
    const fetchTicketList = async () => {
      try {
        const response = await getTicketList({ personId: 'P970203' });
        if (response.code === '0') {
          setTicketList(response.data);
        } else {
          console.error('Failed to fetch ticket list:', response.msg);
        }
      } catch (error) {
        console.error('Error fetching ticket list:', error);
      }
    };

    fetchTicketList();
  }, []);

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
      <div className={styles.ticketTitle}>
        <Image src={whiteJob} width={24} height={24} fit="fill" />
        <span>我的作业票</span>
      </div>
      <div className={styles.myTicket}>
        <div className={styles.ticketList}>
          <TicketItem clickReceiveCard={clickReceiveCard} />
          <TicketItem clickReceiveCard={clickReceiveCard} />
          <TicketItem clickReceiveCard={clickReceiveCard} />
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
