import React from 'react';
import { Button, Card } from 'antd-mobile';
import { withRouter } from 'react-router-dom';
import bgFence from '@/images/bg_fence.png';
import bgPersonal from '@/images/bg_personal.png';
import bgRegional from '@/images/bg_regional.png';
import bgVehicle from '@/images/bg_vehicle.png';
import styles from './index.less';

const CardItem = (props) => {
  const { total, key, visitorNumber, fixedPersonnelNumber, title } = props.item;
  const constant = (type) => {
    switch (type) {
      case 'staff':
        return bgPersonal;
      case 'vehicle':
        return bgVehicle;
      case 'fence':
        return bgFence;
      case 'alarm':
        return bgRegional;
    }
  };
  return (
    <div
      className={styles.card}
      style={{ backgroundImage: `url(${constant(key)})`, backgroundSize: 'cover' }}
    >
      <div className={styles.cardTop}>
        <label>{title}</label>{' '}
        <div>
          <span>总数</span>
          <span className={styles.total}>{total}</span>
        </div>{' '}
      </div>
      <div className={styles.cardBottom}>
        <div className={styles.fixedPersonnel}>
          <label>{key == 'vehicle' ? '固定车' : '固定人员'}</label>
          <span>{fixedPersonnelNumber}</span>
        </div>
        <div className={styles.visitor}>
          <label>访客</label>
          <span>{visitorNumber}</span>
        </div>
      </div>
    </div>
  );
};

export default CardItem;
