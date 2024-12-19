// services.jsx
import mqtt from 'mqtt';
import { request } from 'umi';

 const API_ROOT = 'http://10.44.100.133:8080';
// const API_ROOT = 'http://10.40.198.95:8011/threeHttp'

// 通用请求函数
const requestWithMethod = (url, method, data = {}, headers = {}) => {
  let requestData = data;
  if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    requestData = Object.keys(data).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&');
  }
  return request(url, {
    method,
    headers,
    timeout: 10000, // 增加超时时间，例如 10 秒
    ...(method === 'POST' ? { data: requestData } : {}),
  });
};

// POST 请求封装
export const post = (url, data, headers = {}) => {
  return requestWithMethod(url, 'POST', data, headers);
};

// GET 请求封装
export const get = (url, headers = {}) => {
  return requestWithMethod(url, 'GET', {}, headers);
};

// 设置公共请求头
let accessToken = '';

export const getHeaders = (includeAuth = true) => {
  const baseHeaders = {
    'Content-Type': 'application/json',
    'Authorization': ''
  };
  return baseHeaders;
};

// 示例：使用公共请求头发送请求
export const authenticatedPost = (url, data) => {
  const headers = getHeaders();
  return post(url, data, headers);
};

export const authenticatedGet = (url) => {
  const headers = getHeaders();
  return get(url, headers);
};

// 封装获取当前用户轨迹列表请求
export const getUserTrackList = async (params) => {
  const url = `${API_ROOT}/server-api/personTracks/getUserTrackList`;
  const headers = getHeaders(); // 使用公共请求头，包括 Authorization 头

  try {
    const response = await post(url, params, headers);
    return response;
  } catch (error) {
    console.error('Failed to get user track list:', error);
    throw error;
  }
};

// 封装获取当前车辆轨迹列表请求
export const getVehicleTrackList = async (params) => {
  const url = `${API_ROOT}/server-api/vehicleTracks/getVehicleTrackList`;
  const headers = getHeaders(); // 使用公共请求头，包括 Authorization 头

  try {
    const response = await post(url, params, headers);
    return response;
  } catch (error) {
    console.error('Failed to get vehicle track list:', error);
    throw error;
  }
};
// 获取作业票列表请求
export const getTicketList = async (params) => {
  const url = `${API_ROOT}/server-api/dingTalk/workOrder/person/list`;
  const headers = getHeaders(); // 使用公共请求头，包括 Authorization 头

  try {
    const response = await post(url, params, headers);
    return response;
  } catch (error) {
    console.error('Failed to get vehicle track list:', error);
    throw error;
  }
};
// 获取作业票发卡(领卡)
export const receiveTicket= async (params) => {
  const url = `${API_ROOT}/server-api/dingTalk/person/card/add`;
  const headers = getHeaders(); // 使用公共请求头，包括 Authorization 头

  try {
    const response = await post(url, params, headers);
    return response;
  } catch (error) {
    console.error('Failed to get vehicle track list:', error);
    throw error;
  }
};
// 获取作业票还卡
export const returnTicket= async (params) => {
  const url = `${API_ROOT}/server-api/dingTalk/person/card/return`;
  const headers = getHeaders(); // 使用公共请求头，包括 Authorization 头

  try {
    const response = await post(url, params, headers);
    return response;
  } catch (error) {
    console.error('Failed to get vehicle track list:', error);
    throw error;
  }
};
// 作业票状态修改
export const updateTicketStatus= async (params) => {
  const url = `${API_ROOT}/server-api/dingTalk/workOrder/update`;
  const headers = getHeaders(); // 使用公共请求头，包括 Authorization 头

  try {
    const response = await post(url, params, headers);
    return response;
  } catch (error) {
    console.error('Failed to get vehicle track list:', error);
    throw error;
  }
};
function generateRandomClientId(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

// MQTT 客户端实例
let client = null;
let isConnected = false;

// 连接到 MQTT 代理
export const connectMQTT = (options = {}) => {
  const brokerUrl='ws://broker.emqx.io:8083/mqtt'//本地调试
  // const brokerUrl = 'tcp://10.44.100.132:1883'; // 写死的 brokerUrl生产环境的
  // const brokerUrl = 'http://10.40.198.95:8011/ws'

  return new Promise((resolve, reject) => {
    if (isConnected) {
      console.log('Already connected to MQTT broker');
      resolve(client);
      return;
    }

    client = mqtt.connect(brokerUrl, {
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 0, // 禁用自动重连机制
      clientId: generateRandomClientId(16),
      username: 'admin',
      password: 'Getech@1234',
    });

    // 当客户端收到一个发布过来的消息时触发回调
    client.on('message', function (topic, message) {
      console.log('返回的数据：', message);
    });

    // 连接断开后触发的回调
    client.on('close', function () {
      console.log('已断开连接');
      isConnected = false;
    });

    client.on('connect', () => {
      console.log('已连接成功');
      isConnected = true;
      resolve(client);
    });

    client.on('error', (error) => {
      console.error('MQTT connection error:', error);
      isConnected = false;
      reject(error);
    });
  }).catch((e) => {
    console.log(e);
  });
};

// 订阅主题
export const subscribeMQTT = (topic, callback) => {
  if (!client) {
    throw new Error('MQTT client is not connected');
  }
  client.subscribe(topic, (err) => {
    if (!err) {
      console.log(`Subscribed to topic: ${topic}`);
      client.on('message', (receivedTopic, message) => {
        if (receivedTopic === topic) {
          callback(message.toString());
        }
      });
    } else {
      console.error(`Failed to subscribe to topic: ${topic}`, err);
    }
  });
};

// 发布消息
export const publishMQTT = (topic, message) => {
  if (!client) {
    throw new Error('MQTT client is not connected');
  }
  client.publish(topic, message, (err) => {
    if (!err) {
      console.log(`Message published to topic: ${topic}`);
    } else {
      console.error(`Failed to publish message to topic: ${topic}`, err);
    }
  });
};

// 断开 MQTT 连接
export const disconnectMQTT = () => {
  if (client) {
    client.end(() => {
      console.log('Disconnected from MQTT broker');
      client = null;
    });
  }
};