import React, { useEffect, useState, useRef } from 'react';
import { Image, Button } from 'antd-mobile';
import { history,useLocation } from 'umi';
import Back from '@/components/Back';
import area from '@/images/area.png';
import locationPng from '@/images/location.png';
import portrait from '@/images/portrait.png';
import styles from './index.less';

const PersonnelTrajectory = () => {
  const location = useLocation();
  const item = location.query;
  const [imagePosition, setImagePosition] = useState([
    { latitude: 21.719247, longitude: 112.248985 }, // 图片位置 左上
    { latitude: 21.719246, longitude: 112.272878 }, // 图片位置 右上
    { latitude: 21.698033, longitude: 112.248986 }, // 图片位置 左下
    { latitude: 21.698032, longitude: 112.272816 }, // 图片位置 右下
  ]);

  const [pointPosition, setPointPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const areaRef = useRef(null);

  useEffect(() => {
    if (item) {
      // 使用 item 对象进行其他操作
      const point = {
        longitude: item.longitude || 112.264291,
        latitude: item.latitude || 21.712255,
      };

      const position = calculatePointPosition(point, imagePosition);
      setPointPosition(position);
    }
  }, [item, imagePosition]);

  const calculatePointPosition = (point, positions) => {
    // 找到最小和最大纬度和经度
    const minLatitude = Math.min(...positions.map((pos) => pos.latitude));
    const maxLatitude = Math.max(...positions.map((pos) => pos.latitude));
    const minLongitude = Math.min(...positions.map((pos) => pos.longitude));
    const maxLongitude = Math.max(...positions.map((pos) => pos.longitude));

    // 计算相对位置
    const relativeLatitude = (point.latitude - minLatitude) / (maxLatitude - minLatitude);
    const relativeLongitude = (point.longitude - minLongitude) / (maxLongitude - minLongitude);

    // 图片的实际尺寸
    const imageWidth = 2418;
    const imageHeight = 2309;

    // 将相对位置转换为像素位置
    const pixelX = relativeLongitude * imageWidth;
    const pixelY = (1 - relativeLatitude) * imageHeight; // 注意：Y轴是从上到下的

    return { x: pixelX, y: pixelY };
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setDragImage(new Image(), 0, 0); // 阻止默认拖动效果
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

    // 重新计算 point 的位置
    const point = {
      longitude: item.longitude || 112.264291,
      latitude: item.latitude || 21.712255,
    };
    const newPosition = calculatePointPosition(point, imagePosition);
    setPointPosition({
      x: newLeft + newPosition.x,
      y: newTop + newPosition.y,
    });
  };
  const clickHistory = (item) => {
    history.push('/history');
  };

  const handleClick = () => {};
  return (
    <>
      {' '}
      <Back />
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
        </div>
        <div
          style={{
            position: 'absolute',
            left: `${pointPosition.x}px`,
            top: `${pointPosition.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Image src={locationPng} width={33} height={54} />
        </div>
      </div>
      <div className={styles.employeeInformation}>
        <div className={styles.informationTop}>
          <div>
            <Image src={portrait} width={40} height={40} />
          </div>
          <span>{item?.personName || ''}</span>
          <label>{item?.orgName || ''}</label>
          <div className={styles.status}>{item?.status || '正常'}</div>
        </div>
        <div className={styles.informationMiddle}>
          <div>
            <label>作业票号</label>
            <span>{item?.orgName || ''}</span>
          </div>
          <div>
            <label>所属部门</label>
            <span>{item?.department || ''}</span>
          </div>
        </div>
        <div className={styles.informationBottom}>
          <div className={styles.informationBottomLeft}>
            <div>
              <label>联系电话</label>
              <span>{item?.contactNumber || ''}</span>
            </div>
            <div>
              <label>工作时长</label>
              <span>{item?.workDuration || ''}</span>
            </div>
          </div>
          <div className={styles.informationBottomRight} onClick={clickHistory}>
            <Button> 查看历史轨迹</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonnelTrajectory;
