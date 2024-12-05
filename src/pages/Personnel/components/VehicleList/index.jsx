import { NavBar, Space, Toast } from 'antd-mobile';
import { CloseOutline, MoreOutline, SearchOutline } from 'antd-mobile-icons';
import { DemoBlock } from 'demos';
import React from 'react';

const VehicleList = () => {
  const back = () => {
    // 返回逻辑
    console.log('返回');
  };
  return (
    <div>
    <DemoBlock title="基础用法" padding="0">
      <NavBar onBack={back}>返回</NavBar>
    </DemoBlock>
    77777
    </div>
  );
};

export default VehicleList;
