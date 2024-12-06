import { useModel } from 'umi';
import { useEffect, useState } from 'react';
import { Button, Card } from 'antd-mobile';
import { history } from 'umi';
import Layout from '@/layout';
import CardItem from '@/components/CardItem';
import styles from './index.less';

const Index = () => {
  let [personnelList, setPersonnelList] = useState([
    { total: 12, key: 'staff', visitorNumber: 12, fixedPersonnelNumber: 96, title: '人员' ,subTitle:'固定人员'},
    { total: 35, key: 'vehicle', visitorNumber: 77888, fixedPersonnelNumber: 88, title: '车辆',subTitle:'固定车' },
    { total: 14, key: 'fence',  title: '电子围栏' },
    // { total: 25, key: 'alarm', visitorNumber: 8333, fixedPersonnelNumber: 9947, title: '区域报警' },
  ]);
  const { user } = useModel('user');

  const handleClick = (item) => {
     if(item?.key=='vehicle'){
      history.push('/vehicleList');
     }
     if(item?.key=='staff'){
      history.push('/personnelList');
     }
     if(item?.key=='fence'){
      history.push('/electronicFenceList');
     }
  };

  return (
    <div>
      <div className={styles.home}>
        {personnelList.map((item, index) => (
          <span key={item.key} onClick={() => handleClick(item)}>
            <CardItem key={item.key} item={item} />
          </span>
        ))}
      </div>
      <Layout />
    </div>
  );
};

export default Index;
