import React, { useState } from 'react';
import { Image, Input, Button } from 'antd-mobile';
import Layout from '@/layout';
import { history } from 'umi';
import CustomModal from '@/components/CustomModal';
import styles from './index.less';
import job from '@/images/job.png';

const Index = () => {
  const [value, setValue] = useState('');
  const [visible, setVisible] = useState(false);
  const clickCard=()=>{
    setVisible(true)
  }
  const handleClickValue=(value)=>{
    setVisible(value)
  }
  const handleConfirm=(value)=>{
    history.push('/collectionTickets');
  }
  
  return (
    <div className={styles.jobBox}>
      <div className={styles.job}>
        <div className={styles.jobTop}>
          <Image src={job} width={24} height={24} fit="fill" />
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
        <div className={styles.jopButton} onClick={clickCard}>
          {' '}
          <Button shape="default" style={{ backgroundColor: '#004A86' }} className={styles.customButton}>
            点击领卡
          </Button>
        </div>
      </div>
      <Layout />
      <CustomModal visible={visible} handleClick={()=>handleClickValue(value)} handleConfirm={handleConfirm}/>
    </div>
  
  );
};

export default Index;
