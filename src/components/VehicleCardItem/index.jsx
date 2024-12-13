import React from 'react';
import bgVehicle from '@/images/bg_vehicle.png';
import styles from './index.less';

const VehicleCardItem = (props) => {
  console.log(props,'props')
  const { interiorVehicles, visitingVehicles } = props?.vehicleData;
  return (
    <div
      className={styles.card}
      style={{ backgroundImage: `url(${bgVehicle})`, backgroundSize: 'cover' }}
    >
      <div className={styles.cardTop}>
        <label>车辆</label>{' '}
        <div>
          <span>总数</span>
          <span className={styles.total}>{parseInt(interiorVehicles)+parseInt(visitingVehicles)}</span>
        </div>{' '}
      </div>    
        <div className={styles.cardBottom}>
          <div className={styles.fixedPersonnel}>
            <label>固定车</label>
            <span>{interiorVehicles || 0}</span>
          </div>
          <div className={styles.visitor}>
            <label>访客车</label>
            <span>{visitingVehicles || 0}</span>
          </div>
        </div>
    
    </div>
  );
};

export default VehicleCardItem;
