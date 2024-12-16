import Back from '@/components/Back';
import area from '@/images/area.png';
import locationPng from '@/images/location.png';
import portrait from '@/images/portrait.png';
import { connectMQTT, disconnectMQTT,subscribeMQTT } from '@/services/services';
import { formatDateTime } from '@/utils';
import { Button, DatePicker, Image, Toast } from 'antd-mobile';
import { useEffect, useRef, useState } from 'react';
import { history, useLocation } from 'umi';
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
  const [pointLocation, setPointLocation] = useState({
    longitude: 0,
    latitude: 0,
  });
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [startDateVisible, setStartDateVisible] = useState(false);
  const [endDateVisible, setEndDateVisible] = useState(false);
  const [pointPosition, setPointPosition] = useState({ x: 0, y: 0 });
  const [personMessages, setPersonMessages] = useState([]); // 人员的消息
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const areaRef = useRef(null);

  useEffect(() => {
    // 连接到 MQTT 代理
    connectMQTT()
      .then(() => {
        // 订阅主题 人员的
        subscribeMQTT('realTimeWorker', (message) => {
          try {
            const parsedMessage = JSON.parse(message);
            // 检查消息格式
            if (Array.isArray(parsedMessage) && parsedMessage.length > 0) {
              const firstMessage = parsedMessage[0];
              if (firstMessage.personId && firstMessage.latitude && firstMessage.longitude) {
                setPersonMessages((prevMessages) => {
                  // 检查是否存在相同的 personId 并更新
                  const existingIndex = prevMessages.findIndex(
                    (msg) => msg.personId === firstMessage.personId,
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
                // 如果匹配到当前人员的 personId，则更新 pointLocation
                if (firstMessage.personId === item.personId) {
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
        console.error('Failed to connect to MQTT broker:', error);
      });

    // 清理函数，在组件卸载时断开连接
    return () => {
      disconnectMQTT();
    };
  }, [item.personId]); // 添加 item.personId 作为依赖
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

  const clickHistory = () => {
    const queryParams = {
      personId:item?.personId,
      startTime:formatDateTime(startTime),
      endTime:formatDateTime(endTime),
      cardId:personMessages[0]?.cardId
    };
    if (!startTime || !endTime) {
      Toast.show('请选择开始时间和结束时间');
      return;
    }

    if (startTime >= endTime) {
      Toast.show('结束时间必须晚于开始时间');
      return;
    }
    history.push({
      pathname: '/history',
      query: queryParams,
    });
  };

  console.log('personMessages', personMessages);
  console.log('pointPosition', pointPosition);
  return (
    <>
      <Back />
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <div
          className="personPage"
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
          <span className={styles.locationRealName}>{personMessages[0]?.realName || ''}</span>
          <Image src={locationPng} width={33} height={54} />
        </div>
      </div>
      <div className={styles.employeeInformation}>
        <div className={styles.informationTop}>
          <div>
            <Image src={portrait} width={40} height={40} />
          </div>
          <div className={styles.informationTopMiddle}>
            {' '}
            <span>{personMessages[0]?.realName || ''}</span>
            <label>{personMessages[0]?.ticketNo || ''}</label>
          </div>
          {personMessages[0]?.workStatus && (
            <div
              className={styles.status}
              style={{
                backgroundColor: BgEnum[personMessages[0]?.workStatus],
              }}
            >
              {StatusEnum[personMessages[0]?.workStatus] || ''}
            </div>
          )}
        </div>
        <div className={styles.informationMiddle}>
          <div className={styles.informationMiddleLeft}>
            <div>
              <label>作业票号</label>
              <span>{personMessages[0]?.ticketNo || ''}</span>
            </div>
            <div>
              <label>所属部门</label>
              <span>{personMessages[0]?.deptName || ''}</span>
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
              <span>{''}</span>
            </div>
            <div>
              <label>工作时长</label>
              <span>{''}</span>
            </div>
          </div>
          <div className={styles.informationBottomRight} onClick={clickHistory}>
            <Button>查看历史轨迹</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonnelTrajectory;