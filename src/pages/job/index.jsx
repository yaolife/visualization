import React, { useState } from 'react';
import { Image, Input, Button } from 'antd-mobile';
import styles from './index.less';
import job from '@/images/job.png';

const Index = () => {
  const [value, setValue] = useState('');
  return (
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
          clearable
          onChange={(val) => {
            setValue(val);
          }}
        />
      </div>
      <div>
        {' '}
        <Button shape="default" color="#004A86" className={styles.customButton}>
         点击领卡
        </Button>
      </div>
    </div>
  );
};

export default Index;
