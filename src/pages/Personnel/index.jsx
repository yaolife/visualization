import VehicleCardItem from '@/components/VehicleCardItem';
import WorkerCardItem from '@/components/WorkerCardItem';
import Layout from '@/layout';
import { connectMQTT, disconnectMQTT, subscribeMQTT } from '@/services/services';
import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import styles from './index.less';

const Index = () => {
  const { user } = useModel('user');
  const [personnelData, setPersonnelData] = useState({ staffNumber: 0, visitorNumber: 0 });
  const [vehicleData, setVehicleData] = useState({
    interiorVehicles: 0,
    visitingVehicles: 0,
    vehicleTypes: [],
  });
  useEffect(() => {
    // 连接到 MQTT 代理
    connectMQTT('ws://broker.emqx.io:8083/mqtt')
      .then(() => {
        // 订阅主题 区域人员统计的
        subscribeMQTT('workerStatistics', (message) => {
          console.log('订阅的信息:', message);
          try {
            const parsedMessage = JSON.parse(message);
            console.log('解析后的消息:', parsedMessage);
            setPersonnelData({
              staffNumber: parsedMessage?.staffNumber,
              visitorNumber: parsedMessage?.visitorNumber,
            });
          } catch (error) {
            console.error('Failed to parse message:', error);
          }
        });

        // 订阅主题 区域车辆统计的
        subscribeMQTT('vehicleStatistics', (message) => {
          console.log('订阅的信息:', message);
          try {
            const parsedMessage = JSON.parse(message);
            console.log('解析后的消息:', parsedMessage);
            setVehicleData({
              interiorVehicles: parsedMessage?.interiorVehicles,
              visitingVehicles: parsedMessage?.visitingVehicles,
            });
          } catch (error) {
            console.error('Failed to parse message:', error);
          }
        });
      })
      .catch((error) => {
        console.error('Failed to connect to MQTT broker:', error);
      });
    // 清理函数，在组件卸载时断开连接
    // return () => {
    //   disconnectMQTT();
    // };
  }, []);

  const handleWorkerClick = () => {
    history.push('/personnelList');
  };
  const handleVehicleClick = () => {
    history.push('/vehicleList');
  };
  return (
    <div>
      <div className={styles.home}>
        <span onClick={() => handleWorkerClick()}>
          <WorkerCardItem personnelData={personnelData} />
        </span>
        <span onClick={() => handleVehicleClick()}>
          <VehicleCardItem vehicleData={vehicleData} />
        </span>
      </div>
      <Layout />
    </div>
  );
};

export default Index;
