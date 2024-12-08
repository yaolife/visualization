import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'antd-mobile';
import './index.less';
const UsModal = (props) => {
  const { visible, content,handleClick, handleConfirm,showCloseButtonFlag=false } = props;
  const onClose = () => {
    handleClick();
  };
  const onConfirm = () => {
    handleConfirm();
  };
  useEffect(() => {
    if (visible) {
      Modal.alert({
        content: content,
        visible: visible,
        bodyClassName: 'ticketContent',
        showCloseButton: showCloseButtonFlag,
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
