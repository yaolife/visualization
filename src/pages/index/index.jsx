import React, { useEffect, useState } from 'react';
import Layout from '@/layout';
import { Image } from 'antd-mobile';
import './index.less';
import area from '@/images/area.png';
import point from '@/images/point.png';

const Index = () => {
  const [imagePosition, setImagePosition] = useState([
    { latitude: 21.719247, longitude: 112.248985 }, // 图片位置 左上 
    { latitude: 21.719246, longitude: 112.272878 }, // 图片位置 右上 
    { latitude: 21.698033, longitude: 112.248986 }, // 图片位置 左下
    { latitude: 21.698032, longitude: 112.272816 }, // 图片位置 右下 
  ]);

  const [pointPosition, setPointPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // 人员坐标点
    const point = {
      "longitude": 112.264291,
      "latitude": 21.712255,
    };

    const position = calculatePointPosition(point, imagePosition);
    setPointPosition(position);
  }, [imagePosition]);

  const calculatePointPosition = (point, positions) => {
    // 找到最小和最大纬度和经度
    const minLatitude = Math.min(...positions.map(pos => pos.latitude));
    const maxLatitude = Math.max(...positions.map(pos => pos.latitude));
    const minLongitude = Math.min(...positions.map(pos => pos.longitude));
    const maxLongitude = Math.max(...positions.map(pos => pos.longitude));

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

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div className="firstPage">
        <Image src={area} width={2418} height={2309} draggable />
      </div>
      <div
        style={{
          position: 'absolute',
          left: `${pointPosition.x}px`,
          top: `${pointPosition.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Image src={point} width={10} height={10} draggable />
      </div>
      <Layout />
    </div>
  );
};

export default Index;