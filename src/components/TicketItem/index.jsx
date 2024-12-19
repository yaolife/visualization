import React, { useState, useEffect } from 'react';
import { Button, Input, Image } from 'antd-mobile';
import { ScanningOutline } from 'antd-mobile-icons';
import { TicketColorEnum } from '@/constants';
import styles from './index.less';

const TicketItem = (props) => {
  const { item, clickReceiveCard } = props;
  const [inputValue, setInputValue] = useState('');
  const handleInputChange = (value) => {
    setInputValue(value);
  };

  const handleGetCard = () => {
    clickReceiveCard({ ...item, trackingCardId: inputValue });
  };
  return (
    <div className={styles.ticketItem}>
      <div className={styles.ticketItemTop}>
        <div className={styles.ticketItemTopLeft}>
          <span>{item?.qmnum}</span>
        </div>
        <div
          className={styles.ticketItemTopRight}
          style={{
            backgroundColor: TicketColorEnum?.[item?.workStatus] || '',
          }}
        >
          {' '}
          {item?.workStatusShow || ''}
        </div>
      </div>
      <div className={styles.ticketItemMiddle}>
        <div className={styles.locateCardNumber}>
          <div>
            {' '}
            <label>定位卡号</label>
            <span>{item?.lstPerson?.[0]?.trackingCardId}</span>
          </div>
        </div>
        <div className={styles.ticketItemMiddleOperationInfo}>
          <label>开始时间</label>
          <span>{item?.startDate}</span>
        </div>
        <div className={styles.ticketItemMiddleOperationInfo}>
          <label>结束时间</label>
          <span>{item?.endDate}</span>
        </div>
        <div className={styles.ticketItemMiddleOperationInfo}>
          <label className={styles.operationInfo}>作业内容</label>
          <span className={styles.operationContent}> {item?.qmtxt}</span>
        </div>
        <div className={styles.ticketItemMiddleDeviceInfo}>
          <div>
            {' '}
            <label>作业设备</label>
            {item?.equipments?.length > 0 && (
              <span>
                {item?.equipments?.[0].equipmentName}... 等{item?.equipments?.length}个设备
              </span>
            )}
          </div>
          <div className={styles.checkDevice}>查看设备</div>
        </div>
      </div>
      <div className={styles.ticketItemBottom}>
        {item?.lstPerson?.[0]?.trackingCardId ? (
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
        ) : (
          <div className={styles.ticketReceive}>
            <span className={styles.ticketIcon}>
              <ScanningOutline fontSize={26} />
            </span>
            <span className={styles.ticketLine} />
            <Input
              placeholder="输入定位卡号领取"
              clearable
              className={styles.inputPlaceholder}
              value={inputValue}
              onChange={handleInputChange}
            />
            <Button
              shape="default"
              block
              style={{ backgroundColor: '#004A86' }}
              onClick={handleGetCard}
            >
              {' '}
              领卡
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketItem;
