import axios from 'axios';

import { DAEMON_URL } from '../config';
import { OutputUser } from '../type';

const api = axios.create({
  baseURL: DAEMON_URL
});

export default api;

export async function checkServer() {
  try {
    await api.get('');
    return true;
  } catch (err) {
    return false;
  }
}

export async function insert(name: string, cfid: string, print: boolean) {
  console.log(`开始查询 "${cfid}" ...`);
  try {
    const { data } = await api.post('', { name, cfid });
    console.log(`${name}的 Codeforces ID "${cfid}" 插入成功`);
    if (print) {
      console.log(JSON.stringify(data, null, 2));
    }
    return true;
  } catch (err) {
    console.error(`Codeforces ID "${cfid}" 插入失败`);
    return false;
  }
}

export async function query(): Promise<OutputUser[]>;
export async function query(name: string): Promise<OutputUser>;

export async function query(name?: string): Promise<OutputUser[] | OutputUser> {
  if (typeof name === 'undefined') {
    const { data } = await api.get('');
    return data;
  } else if (typeof name === 'string') {
    const { data } = await api.get('', {
      params: { name }
    });
    return data;
  } else {
    throw new Error(`typeof name: ${typeof name}`);
  }
}

export async function clear(name?: string) {
  try {
    await api.delete(
      '',
      typeof name === 'undefined'
        ? undefined
        : {
            params: {
              name
            }
          }
    );
  } catch (err) {
    console.log('删除失败');
  }
}
