import { request } from 'umi';

export const login = (data) => {
  return request(`/api/user`, {
    data,
    method: 'POST',
  });
};
