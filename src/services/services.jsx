import mqtt from 'mqtt';
import { request } from 'umi';

// 通用请求函数
const requestWithMethod = (url, method, data = {}) => {
  return request(url, {
    method,
    ...(method === 'POST' ? { data } : {}),
  });
};

// POST 请求封装
export const post = (url, data) => {
  return requestWithMethod(url, 'POST', data);
};

// GET 请求封装
export const get = (url) => {
  return requestWithMethod(url, 'GET');
};

// 示例：登录请求
export const login = (data) => {
  return post('/api/user', data);
};

// MQTT 客户端实例
let client = null;

// 连接到 MQTT 代理
export const connectMQTT = (brokerUrl, options = {}) => {
  return new Promise((resolve, reject) => {
    client = mqtt.connect(brokerUrl, {
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
      clientId: 'emqx_test',
      username: 'emqx_test',
      password: 'emqx_test',
    });

    // 当客户端收到一个发布过来的消息时触发回调
    client.on('message', function (message) {
      // 这里有可能拿到的数据格式是Uint8Array格式，所以可以直接用toString转成字符串
      // let data = JSON.parse(message.toString());
      console.log('返回的数据：', message);
    });

    // 连接断开后触发的回调
    client.on('close', function () {
      console.log('已断开连接');
    });

    client.on('connect', () => {
      console.log('已经连接成功');
      resolve(client);
    });

    client.on('error', (error) => {
      console.error('MQTT connection error:', error);
      reject(error);
    });
  }).catch((e) => {
    console.log(e, '7777');
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
