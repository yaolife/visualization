import React, { useState, useEffect } from 'react';
import { Button, Modal, Space, Toast } from 'antd-mobile';
import './index.less';
const UsModal = (props) => {
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
        content: '领取成功!',
        visible: visible,
        bodyClassName: 'ticketContent',
        bodyStyle: {
          height: 240,
        },
        confirmText: '确定',
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
export default UsModal;
