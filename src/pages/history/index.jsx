// index.jsx
import UsModal from '@/components/UsModal';
import area from '@/images/area.png';
import locationPng from '@/images/location.png';
import LazyLoad from 'react-lazyload';
import { getUserTrackList } from '@/services/services';
import { Image } from 'antd-mobile';
import { LeftOutline } from 'antd-mobile-icons';
import { useEffect, useRef, useState } from 'react';
import { history, useLocation } from 'umi';
import styles from './index.less';

const History = () => {
  const location = useLocation();
  const { personId, cardId, startTime, endTime } = location.query;

  const [visible, setVisible] = useState(false);
  const [realName, setRealName] = useState('');
  const [imagePosition, setImagePosition] = useState([
    { latitude: 21.719247, longitude: 112.248985 }, // 图片位置 左上
    { latitude: 21.719246, longitude: 112.272878 }, // 图片位置 右上
    { latitude: 21.698033, longitude: 112.248986 }, // 图片位置 左下
    { latitude: 21.698032, longitude: 112.272816 }, // 图片位置 右下
  ]);
  const imageWidth = 2418;
  const imageHeight = 2309;
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [pathData, setPathData] = useState('');
  const [isLocationImageVisible, setIsLocationImageVisible] = useState(false); // 新增状态变量
  const areaRef = useRef(null);

  const calculatePointPosition = (point, imageCorners) => {
    const [topLeft, topRight, bottomLeft, bottomRight] = imageCorners;

    const width = topRight.longitude - topLeft.longitude;
    const height = bottomLeft.latitude - topLeft.latitude;

    const relativeX = (point.longitude - topLeft.longitude) / width;
    const relativeY = (point.latitude - topLeft.latitude) / height;

    const pixelX = relativeX * imageWidth;
    const pixelY = relativeY * imageHeight;

    return { x: pixelX, y: pixelY };
  };

  useEffect(() => {
    // 获取当前用户轨迹列表
    const fetchUserTrackList = async () => {
      try {
        const params = {
          cardId: cardId,
          personId: personId,
          startTime: startTime,
          endTime: endTime,
        };
        const response = await getUserTrackList(params);
        console.log('User Track List:', response);

        if (response.code === '0') {
          if (response.data?.length > 0) {
            setRealName(response?.data[0]?.realName);
          }
          // 处理响应数据
          const points = response?.data?.map((point) =>
            calculatePointPosition(point, imagePosition),
          );
          const pathData = generatePathData(points);
          setPathData(pathData);

          // 更新location图片的位置
          if (points.length > 0) {
            const lastPoint = points[points.length - 1];
            updateLocationImagePosition(lastPoint);
            setIsLocationImageVisible(true); // 设置为可见
          } else {
            setIsLocationImageVisible(false); // 设置为不可见
          }
        } else {
          console.error('获取用户轨迹列表失败:', response.msg);
        }
      } catch (error) {
        console.error('Failed to fetch user track list:', error);
      }
    };

    fetchUserTrackList();
    // 清理函数，在组件卸载时清除数据
    return () => {
      setPathData('');
      setIsLocationImageVisible(false);
    };
  }, [imagePosition, startTime, endTime, personId, cardId]);

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
          <LazyLoad>
            <Image src={area} width={imageWidth} height={imageHeight} />
          </LazyLoad>
          <svg
            width={imageWidth}
            height={imageHeight}
            style={{ position: 'absolute', left: '0px', top: '0px' }}
          >
            <path d={pathData} stroke="#FFAE00" fill="none" strokeWidth="3" />
          </svg>
        </div>
        <div
          style={{
            position: 'absolute',
            zIndex: 33,
            display: isLocationImageVisible ? 'block' : 'none', // 根据状态控制显示和隐藏
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
