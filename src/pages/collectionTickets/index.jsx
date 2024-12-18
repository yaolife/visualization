// src/pages/collectionTickets/index.jsx
import React, { useState } from 'react';
import { Image, Input, Button } from 'antd-mobile';
import Header from '@/components/Navbar';
import { history } from 'umi';
import TicketItem from '@/components/TicketItem';
import UsModal from '@/components/UsModal';
import Layout from '@/layout';
import styles from './index.less';

const Ticket = () => {
  const [value, setValue] = useState('');
  const [visible, setVisible] = useState(false);
  const [ticketList, setTicketList] = useState([
    { content: 'FJ4315665', title: '作业票号', id: '67' },
    { content: '设备阀门检修长字段显示长字段显示长字段显示', title: '作业内容', id: '6' },
    { content: 'SJ2132H,冷却阀门', title: '作业设备', id: '64' },
    { content: '5mx  ， L3   ， R09', title: '作业位置', id: '56' },
    { content: '2024-06-09  23:59', title: '开始时间', id: '78' },
    { content: '2024-06-10  23:59', title: '结束时间', id: '32' },
  ]);

  const receiveCard = () => {
    setVisible(true);
  };

  const handleConfirm = (value) => {
    history.push({ pathname: '/myTickets', state: { activeTab: '/job' } }); // 确保传递 activeTab 参数
  };

  return (
    <div className={styles.ticket}>
      <Header />
      <div className={styles.ticketContent}>
        <div className={styles.ticketTop}>
          {ticketList.map((item, index) => (
            <div key={item.id}>
              <TicketItem item={item} key={item.id} />
            </div>
          ))}
        </div>
        <div className={styles.ticketNumber}>
          <Input
            className={styles.customInput}
            placeholder="输入作业票号查询"
            value={value}
            placeholderTextColor="grey"
            placeholderTextStyle={{ fontSize: 45 }}
            clearable
            onChange={(val) => {
              setValue(val);
            }}
          />
        </div>
        <div className={styles.jopButton} onClick={receiveCard}>
          <Button
            shape="default"
            style={{ backgroundColor: '#004A86' }}
            className={styles.customButton}
          >
            领取
          </Button>
        </div>
      </div>
      <UsModal
        visible={visible}
        content={'领取成功!'}
        showCloseButtonFlag={false}
        handleConfirm={handleConfirm}
      />
    </div>
  );
};

export default Ticket;