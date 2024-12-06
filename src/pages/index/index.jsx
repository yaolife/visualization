import React, { useEffect, useState } from 'react';
import Layout from '@/layout';
import { Image } from 'antd-mobile';
import './index.less';
import area from '@/images/area.png';
import point from '@/images/point.png';

const Index = () => {
  const [imagePosition, setImagePosition] = useState([
    { latitude: 21.719247, longitude: 112.248985 },// 图片位置 左上 
    { latitude: 21.719246, longitude: 112.272878 },//图片位置  右上 
    { latitude:  21.698033, longitude: 112.248986 },//图片位置  左下
    { latitude: 21.698032, longitude: 112.272816 },//图片位置 右下 
  ]);
 

  useEffect(() => {
     // 人员坐标点
  const point={
    "longitude": 112.26540850000001,
		"latitude": 21.711175539999999,
  }
    calculatePointPosition(point, imagePosition);
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

    console.log(`人员坐标点相对于图片的位置: (${relativeLatitude.toFixed(4)}, ${relativeLongitude.toFixed(4)})`);

    // 将相对位置转换为像素位置（假设图片宽度和高度为100%）
    const imageWidth = 100; // 假设图片宽度为100%
    const imageHeight = 100; // 假设图片高度为100%

    const pixelX = relativeLongitude * imageWidth;
    const pixelY = (1 - relativeLatitude) * imageHeight; // 注意：Y轴是从上到下的

    console.log(`人员坐标点在图片上的像素位置: (${pixelX.toFixed(2)}px, ${pixelY.toFixed(2)}px)`);
  };
  return (
    <div>
      <div className="firstPage">
        <Image src={area} width={2418} height={2309} draggable />       
      </div>
      <Image src={point} width={10} height={10} draggable />
      <Layout />
    </div>
  );
};

export default Index;
