import React, { useState,useEffect } from 'react';
import { Button, Modal, Space, Toast } from 'antd-mobile';
import styles from './index.less';
const CustomModal = (props) => {
  const { visible,handleClick,handleConfirm } = props;
  const onClose=()=>{
    handleClick(false);
  }
  const onConfirm=()=>{
    handleConfirm();
  }
useEffect(() => {
  if (visible) {
    Modal.alert({
      title: '3333',
      content: '右上角有个关闭的小图标，点击它也可以关闭弹窗',
      showCloseButton: true,
      visible:visible,
      bodyClassName:'cardContent',
      bodyStyle:{
        border:'1px solid #FF0000',
        height:280
      },
      confirmText:'查看并领取',
      onConfirm:()=>{
        onConfirm()
      },
      onClose:()=>{
        onClose()
      }
    });
  }
}, [visible]);
  return (
    <>  
         
    </>
  );
};
export default CustomModal;
