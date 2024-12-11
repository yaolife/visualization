import area from '@/images/area.png';
import pointPng from '@/images/point.png';
import Layout from '@/layout';
import { connectMQTT, disconnectMQTT, publishMQTT, subscribeMQTT } from '@/services/services';
import { Image } from 'antd-mobile';
import { useEffect, useRef, useState } from 'react';
import './index.less';

const Index = () => {
  const [imagePosition, setImagePosition] = useState([
    { latitude: 21.719247, longitude: 112.248985 }, // 图片位置 左上
    { latitude: 21.719246, longitude: 112.272878 }, // 图片位置 右上
    { latitude: 21.698033, longitude: 112.248986 }, // 图片位置 左下
    { latitude: 21.698032, longitude: 112.272816 }, // 图片位置 右下
  ]);

  const [point, setPoint] = useState({
    longitude: '',
    latitude: '',
  });
  const [orient, setOrient] = useState(true); //没有找到定位点
  const [pointPosition, setPointPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState([]);
  const [pointPositions, setPointPositions] = useState([]);

  const areaRef = useRef(null);

  useEffect(() => {
    // 连接到 MQTT 代理
    connectMQTT('ws://broker.emqx.io:8083/mqtt')
      .then(() => {
        console.log('88777777');
        // 订阅主题
        subscribeMQTT('realTimeWorker', (message) => {
          console.log('订阅的信息:', message);
          try {
            const parsedMessage = JSON.parse(message);
            setMessages((prevMessages) => [...prevMessages, parsedMessage]);
          } catch (error) {
            console.error('Failed to parse message:', error);
          }
        });
        // 发布消息(这里可以发布，客户端也可以发布)
        //publishMQTT('realTimeWorker', '天使来了');

        // 清理函数，在组件卸载时断开连接
        return () => {
          disconnectMQTT();
        };
      })
      .catch((error) => {
        console.log(error, 'error');
        console.error('Failed to connect to MQTT broker:', error);
      });
  }, []);

  useEffect(() => {
    const position = calculatePointPosition(point, imagePosition);
    setPointPosition(position);
  }, [imagePosition]);

  useEffect(() => {
    const newPointPositions = messages.map((msg) => calculatePointPosition(msg, imagePosition));
    setPointPositions(newPointPositions);
  }, [messages, imagePosition]);

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

    const newPosition = calculatePointPosition(point, imagePosition);
    setPointPosition({
      x: newLeft + newPosition.x,
      y: newTop + newPosition.y,
    });
  };

  return (
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
      {pointPositions.map((position, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: 'translate(-50%, -50%)',
            width: '10px',
            height: '10px',
            backgroundColor: '#77FF00',
            borderRadius: '50%',
          }}
        />
      ))}
      {/* <div
        style={{
          position: 'fixed',
          right: '20px',
          bottom: '105px',
        }}
        onClick={handleClick}
      >
        {' '}
        <Image src={pointIcon} width={36} height={36} />
      </div> */}
      <Layout />
      {/* 先注释后面需要 */}
      {/* {orient && (
        <div className="orient">
          <Image src={currentLocation} width={18} height={18} />
          <span>未查找到当前区域定位点</span>
        </div>
      )} */}
    </div>
  );
};

export default Index;