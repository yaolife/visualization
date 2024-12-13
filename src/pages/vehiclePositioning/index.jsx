import Back from '@/components/Back';
import { BgEnum, StatusEnum } from '@/constants';
import area from '@/images/area.png';
import locationPng from '@/images/location.png';
import vehicle from '@/images/vehicle.png';
import { formatDateTime } from '@/utils';
import { connectMQTT,disconnectMQTT, subscribeMQTT } from '@/services/services';
import { Button, DatePicker, Image, Toast } from 'antd-mobile';
import { useEffect, useRef, useState } from 'react';
import { history, useLocation } from 'umi';
import styles from './index.less';

const VehiclePositioning = () => {
  const location = useLocation();
  const item = location.query;
  console.log(item, 'VehiclePositioning的参数');
  const [imagePosition, setImagePosition] = useState([
    { latitude: 21.719247, longitude: 112.248985 }, // 图片位置 左上
    { latitude: 21.719246, longitude: 112.272878 }, // 图片位置 右上
    { latitude: 21.698033, longitude: 112.248986 }, // 图片位置 左下
    { latitude: 21.698032, longitude: 112.272816 }, // 图片位置 右下
  ]);
  const [pointLocation, setPointLocation] = useState({
    longitude: 0,
    latitude: 0,
  });
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [startDateVisible, setStartDateVisible] = useState(false);
  const [endDateVisible, setEndDateVisible] = useState(false);
  const [pointPosition, setPointPosition] = useState({ x: 0, y: 0 });
  const [vehicleMessages, setVehicleMessages] = useState([]); // 人员的消息
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const areaRef = useRef(null);

  useEffect(() => {
    // 连接到 MQTT 代理
    connectMQTT()
      .then(() => {
        // 订阅主题 当前车辆的实时定位
        subscribeMQTT('realTimeVehicle', (message) => {
          console.log('订阅的信息:', message);
          try {
            const parsedMessage = JSON.parse(message);
            console.log('解析后的消息:', parsedMessage);

            // 检查消息格式
            if (Array.isArray(parsedMessage) && parsedMessage.length > 0) {
              const firstMessage = parsedMessage[0];
              if (firstMessage.vehicleNumber && firstMessage.latitude && firstMessage.longitude) {
                setVehicleMessages((prevMessages) => {
                  // 检查是否存在相同的 vehicleNumber 并更新
                  const existingIndex = prevMessages.findIndex(
                    (msg) => msg.vehicleNumber === firstMessage.vehicleNumber,
                  );
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
                // 如果匹配到当前车辆的车牌号，则更新 pointLocation
                if (firstMessage.vehicleNumber === item.vehicleNumber) {
                  setPointLocation({
                    longitude: firstMessage.longitude,
                    latitude: firstMessage.latitude,
                  });
                }
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
      })
      .catch((error) => {
        console.log(error, 'error');
        console.error('Failed to connect to MQTT broker:', error);
      });

    // 清理函数，在组件卸载时断开连接
    return () => {
      disconnectMQTT();
    };
  }, [item.vehicleNumber]); // 添加 item.vehicleNumber 作为依赖

  useEffect(() => {
    const position = calculatePointPosition(pointLocation, imagePosition);
    setPointPosition(position);
  }, [pointLocation, imagePosition]);

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

    return { x: pixelX, y: pixelY }; //减去图片宽度和高度的一半
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

    const newPosition = calculatePointPosition(pointLocation, imagePosition);
    setPointPosition({
      x: newLeft + newPosition.x,
      y: newTop + newPosition.y,
    });
  };

  const goVehicleHistory = (item) => {
    if (!startTime || !endTime) {
      Toast.show('请选择开始时间和结束时间');
      return;
    }

    if (startTime >= endTime) {
      Toast.show('结束时间必须晚于开始时间');
      return;
    }
    const queryParams = {
      vehicleNumber:item?.vehicleNumber,
      startTime:formatDateTime(startTime),
      endTime:formatDateTime(endTime),
      cardId: vehicleMessages[0]?.cardId,
    };
    history.push({
      pathname: '/vehicleHistory',
      query: queryParams,
    });
  };

  console.log('vehicleMessages', vehicleMessages);
  console.log('pointPosition', pointPosition);
  return (
    <>
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
            left: `${pointPosition.x + 4}px`,
            top: `${pointPosition.y - 14}px`,
            transform: 'translate(-50%, -50%)',
          }}
          className="location-image"
        >
          <span className={styles.locationRealName}>{vehicleMessages[0]?.vehicleNumber || ''}</span>
          <Image src={locationPng} width={33} height={54} />
        </div>
      </div>
      <div className={styles.vehicleInformation}>
        <div className={styles.informationTop}>
          <div>
            <Image src={vehicle} width={36} height={36} />
          </div>
          <div className={styles.informationTopMiddle}>
            {vehicleMessages[0]?.vehicleNumber || ''}
          </div>
          {vehicleMessages[0]?.workStatus && (
            <div
              className={styles.status}
              style={{
                backgroundColor: BgEnum[vehicleMessages[0]?.workStatus],
              }}
            >
              {StatusEnum[vehicleMessages[0]?.workStatus] || ''}
            </div>
          )}
        </div>
        <div className={styles.informationMiddle}>
          <div className={styles.informationMiddleLeft}>
            {' '}
            <div>
              <label>车辆类型</label>
              <span>{vehicleMessages[0]?.vehicleType || ''}</span>
            </div>
            <div>
              <label>车辆颜色</label>
              <span>{vehicleMessages[0]?.vehicleColor || ''}</span>
            </div>
          </div>
          <div className={styles.informationMiddleRight}>
            <div>
              {' '}
              <Button
                onClick={() => {
                  setStartDateVisible(true);
                }}
              >
                开始时间
              </Button>
              <DatePicker
                title="开始时间"
                visible={startDateVisible}
                value={startTime}  // 绑定 value 属性到 startTime
                onClose={() => {
                  setStartDateVisible(false);
                }}
                mouseWheel
                precision="second"
                onConfirm={(val) => {
                  setStartTime(val);          
                }}
              />   
              {startTime && <span >{formatDateTime(startTime)}</span>}       
            </div>
            <div>
              {' '}
              <Button
                onClick={() => {
                  setEndDateVisible(true);
                }}
              >
                结束时间
              </Button>
              <DatePicker
                title="结束时间"
                visible={endDateVisible}
                value={endTime}  // 绑定 value 属性到 endTime
                onClose={() => {
                  setEndDateVisible(false);
                }}
                mouseWheel
                precision="second"
                onConfirm={(val) => {
                  setEndTime(val);           
                }}
              />            
              {endTime && <span >{formatDateTime(endTime)}</span>}       
            </div>
          </div>
        </div>
        <div className={styles.informationBottom}>
          <div className={styles.informationBottomLeft}>
            <div>
              <label>联系电话</label>
              <span>{vehicleMessages[0]?.driverTel || ''}</span>
            </div>
            <div>
              <label>工作时长</label>
              <span>{''}</span>
            </div>
          </div>
          <div className={styles.informationBottomRight} onClick={() => goVehicleHistory(item)}>
            <Button> 查看历史轨迹</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VehiclePositioning;
