import React, { useState, useEffect } from 'react';
import { Button, Input, Image } from 'antd-mobile';
import { ScanningOutline } from 'antd-mobile-icons';
import { TicketStatusEnum, TicketColorEnum } from '@/constants';
import navigation from '@/images/navigation.png';
import styles from './index.less';

const TicketItem = (props) => {
  const [getCardVisible, setGetCardVisible] = useState(true);
  return (
    <div className={styles.ticketItem}>
      <div className={styles.ticketItemTop}>
        <div className={styles.ticketItemTopLeft}>
          <span>FJ4315665</span>
          <label>作业票</label>
        </div>
        <div className={styles.ticketItemTopRight}>
          <Image src={navigation} width={20} height={20} fit="fill" />
          <span>导航</span>
        </div>
      </div>
      <div className={styles.ticketItemMiddle}>
        <div className={styles.ticketItemMiddleDeviceInfo}>
          <label>SJ2132H</label>
          <span>冷却阀门</span>
        </div>
        <div className={styles.ticketItemMiddleDeviceInfo}>5mx ， L3 ， R09</div>
        <div className={styles.ticketItemMiddleOperationInfo}>
          <label>开始时间</label>
          <span>2024-06-09 23：59</span>
        </div>
        <div className={styles.ticketItemMiddleOperationInfo}>
          <label>结束时间</label>
          <span>2024-08-09 23：59</span>
        </div>
        <div className={styles.locateCardNumber}>
          <div>
            {' '}
            <label>定位卡号</label>
            <span>SJ2132H418501</span>
          </div>
          <span
            style={{
              color: TicketColorEnum?.['1'] || '',
            }}
          >
            {' '}
            {TicketStatusEnum?.['1'] || ''}
          </span>
        </div>
        <div className={styles.ticketItemMiddleOperationInfo}>
          <label className={styles.operationInfo}>作业内容</label>
          <span className={styles.operationContent}>
            {' '}
            设备阀门检修长字段显示长字段显示长字段显示
          </span>
        </div>
      </div>
      <div className={styles.ticketItemBottom}>
        {getCardVisible ? (
          <div className={styles.ticketReceive}>
            <span className={styles.ticketIcon}>
              <ScanningOutline fontSize={26} />
            </span>
            <span className={styles.ticketLine} />
            <Input placeholder="输入定位卡号领取" clearable  className={styles.inputPlaceholder}  />
            <Button shape="default" block style={{ backgroundColor: '#004A86' }}>
              {' '}
              领卡
            </Button>
          </div>
        ) : (
          <div className={styles.ticketButtons}>
            {' '}
            <Button shape="default" block style={{ backgroundColor: '#004A86' }}>
              {' '}
              开始作业
            </Button>
            <Button shape="default" block style={{ backgroundColor: '#004A86' }}>
              {' '}
              结束作业
            </Button>
            <Button shape="default" block style={{ backgroundColor: '#004A86' }}>
              {' '}
              还卡
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketItem;
