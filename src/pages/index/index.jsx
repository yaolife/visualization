import area from '@/images/area.png';
import Layout from '@/layout';
import { connectMQTT, disconnectMQTT, subscribeMQTT } from '@/services/services';
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
  const imageWidth = 2418;
  const imageHeight = 2309;
  const [pointLocation, setPoint] = useState({
    longitude: 0,
    latitude: 0,
  });
  const [vehicleLocation, setVehicleLocation] = useState({
    longitude: 0,
    latitude: 0,
  });
  const [orient, setOrient] = useState(true); // 没有找到定位点
  const [pointPosition, setPointPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState([]);
  const [pointPositions, setPointPositions] = useState([]);

  const areaRef = useRef(null);

  useEffect(() => {
    // 连接到 MQTT 代理
    connectMQTT('ws://broker.emqx.io:8083/mqtt')
      .then(() => {
        // 订阅主题
        subscribeMQTT('realTimeWorker', (message) => {
          console.log('订阅的信息:', message);
          try {
            const parsedMessage = JSON.parse(message);
            console.log('解析后的消息:', parsedMessage);

            // 检查消息格式
            if (Array.isArray(parsedMessage) && parsedMessage.length > 0) {
              const firstMessage = parsedMessage[0];
              if (firstMessage.personId && firstMessage.latitude && firstMessage.longitude) {
                setMessages((prevMessages) => {
                  // 检查是否存在相同的 personId 并更新
                  const existingIndex = prevMessages.findIndex(msg => msg.personId === firstMessage.personId);
                  if (existingIndex !== -1) {
                    const updatedMessages = [...prevMessages];
                    updatedMessages[existingIndex] = firstMessage;
                    console.log(updatedMessages, 'updatedMessages');
                    return updatedMessages;
                  } else {
                    console.log(prevMessages, firstMessage, 'prevMessages___parsedMessage');
                    return [...prevMessages, firstMessage];
                  }
                });
              } else {
                console.error('消息格式不正确:', firstMessage);
              }
            } else {
              console.error('消息格式不正确:', parsedMessage);
            }
          } catch (error) {
            console.error('Failed to parse message:', error);
          }
        });

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
    const position = calculatePointPosition(pointLocation, imagePosition);
    setPointPosition(position);
  }, [pointLocation, imagePosition]);

  useEffect(() => {
    const newPointPositions = messages.map((msg) => calculatePointPosition(msg, imagePosition));
    setPointPositions(newPointPositions);
  }, [messages, imagePosition]);

  const calculatePointPosition = (point, positions) => {
    if (!point.latitude || !point.longitude) {
      console.error('点的坐标无效:', point);
      return { x: NaN, y: NaN };
    }

    // 找到最小和最大纬度和经度
    const minLatitude = Math.min(...positions.map((pos) => pos.latitude));
    const maxLatitude = Math.max(...positions.map((pos) => pos.latitude));
    const minLongitude = Math.min(...positions.map((pos) => pos.longitude));
    const maxLongitude = Math.max(...positions.map((pos) => pos.longitude));

    if (minLatitude === maxLatitude || minLongitude === maxLongitude) {
      console.error('位置范围无效:', positions);
      return { x: NaN, y: NaN };
    }

    // 计算相对位置
    const relativeLatitude = (point.latitude - minLatitude) / (maxLatitude - minLatitude);
    const relativeLongitude = (point.longitude - minLongitude) / (maxLongitude - minLongitude);

    // 将相对位置转换为像素位置
    const pixelX = relativeLongitude * imageWidth;
    const pixelY = (1 - relativeLatitude) * imageHeight; // 注意：Y轴是从上到下的

    console.log(`计算结果: relativeLatitude=${relativeLatitude}, relativeLongitude=${relativeLongitude}`);
    console.log(`计算结果: pixelX=${pixelX}, pixelY=${pixelY}`);

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

  console.log(pointPositions, 'pointPositions 的数据');

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
        <Image src={area} width={imageWidth} height={imageHeight} />
      </div>
      {pointPositions.map((position, index) => (
        <div
          key={index}
          className={`worker${index}`}
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
      <Layout />
    </div>
  );
};

export default Index;