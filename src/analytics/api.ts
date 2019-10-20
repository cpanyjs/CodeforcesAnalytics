import axios from 'axios';

const api = axios.create({
  baseURL: 'https://codeforces.com/api/'
});

export default api;

const userInfoCache = new Map<string, object>();

export async function getUserInfo(cfid: string) {
  if (userInfoCache.has(cfid)) {
    return userInfoCache.get(cfid);
  }
  const {
    data: {
      result: [data]
    }
  } = await api.get(`user.info`, {
    params: {
      handles: cfid
    }
  });
  userInfoCache.set(cfid, data);
  return data;
}
