import { Router } from 'express';

import { getUserInfo } from './api';
import { User } from '../type';
import { insert, query } from './store';

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
    insert(name, handle);
    res.send(info);
  } catch (err) {
    res.status(500).send('');
  }
});

export default router;
