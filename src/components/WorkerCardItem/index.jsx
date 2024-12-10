import React from 'react';
import bgFence from '@/images/bg_fence.png';
import bgPersonal from '@/images/bg_personal.png';
import bgRegional from '@/images/bg_regional.png';
import bgVehicle from '@/images/bg_vehicle.png';
import styles from './index.less';

const WorkerCardItem = (props) => {
  const { staffNumber, visitorNumber } = props.personnelData;
  return (
    <div
      className={styles.card}
      style={{ backgroundImage: `url(${bgPersonal})`, backgroundSize: 'cover' }}
    >
      <div className={styles.cardTop}>
        <label>人员</label>{' '}
        <div>
          <span>总数</span>
          <span className={styles.total}>{parseInt(staffNumber)+parseInt(visitorNumber)}</span>
        </div>{' '}
      </div>
        <div className={styles.cardBottom}>
          <div className={styles.fixedPersonnel}>
            <label> 固定人员</label>
            <span>{staffNumber || ''}</span>
          </div>
          <div className={styles.visitor}>
            <label>访客</label>
            <span>{visitorNumber || ''}</span>
          </div>
        </div> 
    </div>
  );
};

export default WorkerCardItem;
