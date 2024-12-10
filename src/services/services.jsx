import { request } from 'umi';
import mqtt from 'mqtt';

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
    client = mqtt.connect(brokerUrl, options);

    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      resolve(client);
    });

    client.on('error', (error) => {
      console.error('MQTT connection error:', error);
      reject(error);
    });
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