import React, { useState } from 'react';
import { Image, Input, Button } from 'antd-mobile';
import Header from '@/components/Navbar';
import Layout from '@/layout';
import styles from './index.less';


const Ticket = () => {
  const [value, setValue] = useState('');
  const [visible, setVisible] = useState(false);

  const receiveCard=()=>{

  }
  return (
    <div className={styles.ticket}>
      <Header />
      <div className={styles.ticketContent}>
        <div className={styles.jobTop}>
          <span>我的作业票</span>
        </div>
        <div className={styles.emptyJop}> 暂无作业票</div>
        <div className={styles.jopNumber}>
          {' '}
          <Input
            className={styles.customInput}
            placeholder="输入作业票号查询"
            value={value}
            placeholderTextColor="grey" // 设置占位符的颜色，可以根据需要修改颜色值
            placeholderTextStyle={{ fontSize: 45 }}
            clearable
            onChange={(val) => {
              setValue(val);
            }}
          />
        </div>
        <div className={styles.jopButton} onClick={receiveCard}>
          {' '}
          <Button
            shape="default"
            style={{ backgroundColor: '#004A86' }}
            className={styles.customButton}
          >
            领取
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
