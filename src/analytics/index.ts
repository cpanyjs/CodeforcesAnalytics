import { Router } from 'express';

import { getUserInfo, clearCache, getUserSolved } from './api';
import { User } from '../type';
import { insert, query, clear } from './store';

const router = Router();

router.get('/', (req, res) => {
  if ('name' in req.query) {
    try {
      res.send(query(req.query.name));
    } catch (err) {
      res.status(404).send();
    }
  } else {
    res.send(query());
  }
});

router.post('/', async (req, res) => {
  const { name, cfid } = req.body;
  try {
    const info = await getUserInfo(cfid);
    const handle = new User(info);
    handle.solve(await getUserSolved(cfid));
    insert(name, handle);
    res.send(handle.parse(name));
  } catch (err) {
    res.status(500).send('');
  }
});

router.delete('/', (req, res) => {
  if ('name' in req.query) {
    query(req.query.name).cfids.forEach(id => clearCache(id));
    clear(req.query.name);
    res.send('');
  } else {
    res.status(400).send('');
  }
});

export default router;
