import React, { useEffect, useState, useRef } from 'react';
import { LeftOutline } from 'antd-mobile-icons';
import { history } from 'umi';
import { Image } from 'antd-mobile';
import UsModal from '@/components/UsModal';
import { mockRequest } from './mock-request';
import styles from './index.less';
import location from '@/images/location.png';
import area from '@/images/area.png';

const History = () => {
  const [visible, setVisible] = useState(false);
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
    const fetchData = async () => {
      const data = await mockRequest();
      const points = data.map(point => calculatePointPosition(point, imagePosition));
      const pathData = points.reduce((acc, point, index) => {
        if (index === 0) {
          return `M ${point.x} ${point.y}`;
        } else {
          return `${acc} L ${point.x} ${point.y}`;
        }
      }, '');
      setPathData(pathData);
    };

    fetchData();
  }, [imagePosition]);

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

    setPathData(prevPathData => prevPathData.replace(/M (\d+) (\d+)/, `M ${newLeft} ${newTop}`));
  };

  const goBack = () => {
    setVisible(true);
  };

  const handleConfirm = () => {
    history.goBack();
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
          }}
        >
          <Image src={location} width={33} height={44} />
        </div>
      </div>
      <div className={styles.historyBottom}>
        <div className={styles.historyBottomNav}>
          <div className={styles.historyBottomNavLeft} onClick={goBack}>
            <LeftOutline fontSize={24} />
            <span>退出</span>
          </div>
          <div className={styles.historyBottomNavRight}>
            <label>历史轨迹</label>
          </div>
        </div>
      </div>
      <UsModal
        visible={visible}
        content={'确定退出?'}
        handleClick={() => handleClick()}
        showCloseButtonFlag
        handleConfirm={handleConfirm}
      />
    </>
  );
};

export default History;