import React, { useEffect, useCallback } from 'react';
import { Button, Modal } from 'antd-mobile';
import './index.less';

const UsModal = (props) => {
  const { visible, content, handleClose, handleConfirm, showCloseButtonFlag = false } = props;

  const onClose = useCallback(() => {
    if (handleClose) {
      handleClose();
    }
  }, [handleClose]);
  const onConfirm = useCallback(() => {
    handleConfirm();
  }, [handleConfirm]);

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
          // 返回 false 阻止模态框自动关闭
          return false;
        },
        onClose: () => {
          onClose();
        },
      });
    }
  }, [visible, content, handleClose, handleConfirm, onConfirm, onClose, showCloseButtonFlag]);

  return <></>;
};

export default UsModal;
