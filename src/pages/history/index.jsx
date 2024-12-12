import React, { useEffect, useState, useRef } from 'react';
import { LeftOutline } from 'antd-mobile-icons';
import { history } from 'umi';
import { Image } from 'antd-mobile';
import { connectMQTT, disconnectMQTT, subscribeMQTT } from '@/services/services';
import UsModal from '@/components/UsModal';
import styles from './index.less';
import locationPng from '@/images/location.png';
import area from '@/images/area.png';

const History = () => {
  const [visible, setVisible] = useState(false);
  const [realName, setRealName] = useState('');
  const [imagePosition, setImagePosition] = useState([
    { latitude: 21.719247, longitude: 112.248985 }, // 图片位置 左上
    { latitude: 21.719246, longitude: 112.272878 }, // 图片位置 右上
    { latitude: 21.698033, longitude: 112.248986 }, // 图片位置 左下
    { latitude: 21.698032, longitude: 112.272816 }, // 图片位置 右下
  ]);

  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [pathData, setPathData] = useState('');
  const areaRef = useRef(null);

  const calculatePointPosition = (point, imageCorners) => {
    const [topLeft, topRight, bottomLeft, bottomRight] = imageCorners;

    const width = topRight.longitude - topLeft.longitude;
    const height = bottomLeft.latitude - topLeft.latitude;

    const relativeX = (point.longitude - topLeft.longitude) / width;
    const relativeY = (point.latitude - topLeft.latitude) / height;

    const pixelX = relativeX * 2418;
    const pixelY = relativeY * 2309;

    return { x: pixelX, y: pixelY };
  };

  useEffect(() => {
    // 连接到 MQTT 代理
    connectMQTT('ws://broker.emqx.io:8083/mqtt')
      .then(() => {
        // 订阅主题 人员历史轨迹
        subscribeMQTT('workerHistory', (message) => {
          console.log('历史轨迹:', message);
          try {
            const data = JSON.parse(message);
            if (data?.length > 0) {
              setRealName(data[0]?.realName);
            }
            const points = data?.map((point) => calculatePointPosition(point, imagePosition));
            const pathData = generatePathData(points);
            setPathData(pathData);

            // 更新location图片的位置
            if (points.length > 0) {
              const lastPoint = points[points.length - 1];
              updateLocationImagePosition(lastPoint);
            }
          } catch (error) {
            console.error('Failed to parse message:', error);
          }
        });
      })
      .catch((error) => {
        console.log(error, 'error');
        console.error('Failed to connect to MQTT broker:', error);
      });

    // 清理函数，在组件卸载时断开连接
    return () => {
      disconnectMQTT();
    };
  }, [imagePosition]);

  const generatePathData = (points) => {
    return points.reduce((acc, point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      } else {
        return `${acc} L ${point.x} ${point.y}`;
      }
    }, '');
  };

  const updateLocationImagePosition = (point) => {
    const locationElement = document.querySelector('.location-image');
    if (locationElement) {
      locationElement.style.left = `${point.x + areaRef.current.offsetLeft - 16}px`;
      locationElement.style.top = `${point.y + areaRef.current.offsetTop - 27}px`;
    }
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setDragImage(new Image(), 0, 0);
    const rect = areaRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleDragEnd = (e) => {
    const rect = areaRef.current.getBoundingClientRect();
    const newLeft = e.clientX - dragOffset.x;
    const newTop = e.clientY - dragOffset.y;
    areaRef.current.style.left = `${newLeft}px`;
    areaRef.current.style.top = `${newTop}px`;

    // 计算新的imagePosition
    const deltaX = newLeft - parseFloat(areaRef.current.style.left.replace('px', ''));
    const deltaY = newTop - parseFloat(areaRef.current.style.top.replace('px', ''));

    const newImagePosition = imagePosition.map((point) => ({
      latitude: point.latitude,
      longitude: point.longitude,
      x: point.x + deltaX,
      y: point.y + deltaY,
    }));

    setImagePosition(newImagePosition);
  };

  const goBack = () => {
    setVisible(true); // 显示确认对话框
  };

  const handleClose = () => {
    setVisible(false); // 关闭确认对话框
  };

  const handleClick = () => {
    history.goBack();
  };

  return (
    <>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <div
          className="firstPage"
          ref={areaRef}
          draggable
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          style={{
            position: 'absolute',
            left: '0px',
            top: '0px',
          }}
        >
          <Image src={area} width={2418} height={2309} />
          <svg width="2418" height="2309" style={{ position: 'absolute', left: '0px', top: '0px' }}>
            <path d={pathData} stroke="#FFAE00" fill="none" strokeWidth="3" />
          </svg>
        </div>
        <div
          style={{
            position: 'absolute',
            zIndex: 33,
          }}
          className="location-image"
        >
          <span className={styles.locationRealName}>{realName}</span>
          <Image src={locationPng} width={33} height={54} />
        </div>
      </div>
      <div className={styles.historyBottom}>
        <div className={styles.historyBottomNav}>
          <div className={styles.historyBottomNavLeft} onClick={goBack}>
            <LeftOutline fontSize={24} />
            <span>退出</span>
          </div>
          <div className={styles.historyBottomNavRight}>
            <span>历史轨迹</span>
          </div>
        </div>
      </div>
      <UsModal
        visible={visible}
        content={'确定退出?'}
        handleClose={handleClose}
        showCloseButtonFlag
        handleConfirm={handleClick}
      />
    </>
  );
};

export default History;