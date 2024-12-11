import { useModel } from 'umi';
import { useEffect, useState } from 'react';
import { Button, Card } from 'antd-mobile';
import { history } from 'umi';
import Layout from '@/layout';
import WorkerCardItem from '@/components/WorkerCardItem';
import VehicleCardItem from '@/components/VehicleCardItem';
import styles from './index.less';

const Index = () => {
  const { user } = useModel('user');
  const [personnelData, setPersonnelData] = useState({ staffNumber: '4', visitorNumber: '0' });
  const [vehicleData, setVehicleData] = useState({ interiorVehicles: '3', visitingVehicles: '0',vehicleTypes:[] });
 
  const handleWorkerClick=()=>{
    history.push('/personnelList');
  }
  const handleVehicleClick = () => {
    history.push('/vehicleList');  
};
  return (
    <div>
      <div className={styles.home}>
          <span onClick={() => handleWorkerClick()}>
            <WorkerCardItem personnelData={personnelData}/>
          </span>
          <span onClick={() => handleVehicleClick()}>
            <VehicleCardItem vehicleData={vehicleData}/>
          </span>
      </div>
      <Layout />
    </div>
  );
};

export default Index;
