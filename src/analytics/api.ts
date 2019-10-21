import axios from 'axios';
import { SolvedProblem } from '../type';
import { FROM_DATE } from '../config';

const api = axios.create({
  baseURL: 'https://codeforces.com/api/',
  timeout: 20 * 1000
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
  } = await api.get('user.info', {
    params: {
      handles: cfid
    }
  });
  userInfoCache.set(cfid, data);
  return data;
}

const BLOCK_SIZE = 100;
const userSolvedCache = new Set<string>();

export async function getUserSolved(cfid: string): Promise<SolvedProblem[]> {
  if (userSolvedCache.has(cfid)) return [];
  let from = 1,
    flag = true;
  const arr: SolvedProblem[] = [];
  while (flag) {
    try {
      const {
        data: { result }
      } = await api.get('user.status', {
        params: {
          handle: cfid,
          from: from,
          count: BLOCK_SIZE
        }
      });
      if (result.length === 0) break;
      for (const sub of result) {
        if (sub.verdict !== 'OK') continue;
        const tot = new SolvedProblem(
          sub.contestId,
          sub.problem.index,
          sub.creationTimeSeconds
        );
        if (tot.time < FROM_DATE) {
          flag = false;
          break;
        }
        arr.push(tot);
      }
      from += BLOCK_SIZE;
    } catch (err) {
      return arr;
    }
  }
  userSolvedCache.add(cfid);
  return arr;
}

export function clearCache(cfid: string) {
  if (userInfoCache.has(cfid)) userInfoCache.delete(cfid);
  if (userSolvedCache.has(cfid)) userSolvedCache.delete(cfid);
}
