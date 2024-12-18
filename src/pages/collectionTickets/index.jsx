// src/pages/collectionTickets/index.jsx
import React, { useState } from 'react';
import { Image, Input, Button } from 'antd-mobile';
import Header from '@/components/Navbar';
import { history } from 'umi';
import UsModal from '@/components/UsModal';
import styles from './index.less';

const Ticket = () => {
  const [value, setValue] = useState('');
  const [visible, setVisible] = useState(false);

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
            <div><label>作业票号</label><span>FJ4315665</span></div>
            <div className={styles.ticketRequire}><label>作业内容</label><span>设备阀门检修长字段显示长字段显示长字段显示</span></div>
            <div><label>作业设备</label><span>SJ2132H</span><span>冷却阀门</span></div>
            <div><label>作业位置</label><span>5mx</span> <span>L3</span><span>R09</span></div>
            <div><label>开始时间</label><span>2024-06-09 23：59</span></div>
            <div><label>结束时间</label><span>2024-09-23 23：59</span></div>
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