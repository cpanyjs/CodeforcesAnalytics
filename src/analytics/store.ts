import { User } from '../type';
import assert from 'assert';

const store = new Map<string, User>();

export function insert(name: string, handle: User) {
  if (store.has(name)) {
    const old: User = store.get(name) as User;
    if (old.maxRating > handle.maxRating) {
      handle.maxRating = old.maxRating;
      handle.maxRank = old.maxRank;
    }
    if (old.rating > handle.rating) {
      handle.rating = old.rating;
      handle.rank = old.rank;
    }
    handle.cfids = [...new Set([...old.cfids, ...handle.cfids])];
    handle.solve(old.solved);
    store.set(name, handle);
  } else {
    store.set(name, handle);
  }
}

export function query(): Array<User & { name: string }>;
export function query(name: string): User;

export function query(name?: string): any {
  if (typeof name === 'undefined') {
    const arr: Array<any> = [];
    store.forEach((value: User, key: string) => {
      value.parse();
      arr.push({ name: key, ...value });
    });
    return arr;
  } else if (typeof name === 'string') {
    assert(store.has(name));
    const tot = store.get(name) as User;
    tot.parse();
    return tot;
  }
}

export function clear(name?: string) {
  if (typeof name === 'undefined') {
    store.clear();
  } else {
    if (store.has(name)) {
      store.delete(name);
    }
  }
}
