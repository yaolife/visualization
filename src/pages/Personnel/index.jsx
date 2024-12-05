import { useModel } from 'umi';
import { useEffect, useState } from 'react';
import { Button, Card } from 'antd-mobile';
import { history } from 'umi';
import CardItem from '@/components/CardItem';
import styles from './index.less';

const Index = () => {
  let [personnelList, setPersonnelList] = useState([
    { total: 12, key: 'staff', visitorNumber: 12, fixedPersonnelNumber: 96, title: '人员' },
    { total: 35, key: 'vehicle', visitorNumber: 77888, fixedPersonnelNumber: 88, title: '车辆' },
    { total: 14, key: 'fence', visitorNumber: 48, fixedPersonnelNumber: 34, title: '电子围栏' },
    { total: 25, key: 'alarm', visitorNumber: 8333, fixedPersonnelNumber: 9947, title: '区域报警' },
  ]);
  const { user } = useModel('user');

  const handleClick = (item) => {
    console.log(item, '5677');
    //  if(item?.key=='vehicle'){
    //   history.push('/personnel/components/VehicleList');
    //  }
  };

  return (
    <div className={styles.home}>
      {personnelList.map((item, index) => (
        <span key={item.key} onClick={() => handleClick(item)}>
          <CardItem key={item.key} item={item} />
        </span>
      ))}
    </div>
  );
};

export default Index;
