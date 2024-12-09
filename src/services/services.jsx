import { request } from 'umi';

// export const login = (data) => {
//   return request(`/api/user`, {
//     data,
//     method: 'POST',
//   });
// };

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