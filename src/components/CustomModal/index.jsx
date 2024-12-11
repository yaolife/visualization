import React, { useState, useEffect } from 'react';
import { Button, Modal, Space, Toast } from 'antd-mobile';
import './index.less';
const CustomModal = (props) => {
  const { visible, handleClick, handleConfirm } = props;
  const onClose = () => {
    handleClick(false);
  };
  const onConfirm = () => {
    handleConfirm();
  };
  useEffect(() => {
    if (visible) {
      Modal.alert({
        content: (
          <div className='cardTips'>
            <span>查询到作业票</span>
            <span>【1454664】</span>
          </div>
        ),
        showCloseButton: true,
        visible: visible,
        bodyClassName: 'cardContent',
        bodyStyle: {
          height: 280,
        },
        confirmText: '查看并领取',
        onConfirm: () => {
          onConfirm();
        },
        onClose: () => {
          onClose();
        },
      });
    }
  }, [visible]);
  return <></>;
};
export default CustomModal;
