import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from './model/user';
import { requireObjectKeysType } from './validation';

const router = Router();

router.post('/auth/admin', async (req: Request, res: Response) => {
  try {
    if (!requireObjectKeysType(req.body, ['name', 'pass'], 'string'))
      return res
        .status(400)
        .send({ error: 'both name and pass are required in body' });

    const { name, pass } = req.body;

    const foundedUser = await User.findOne({ name });

    const hash = bcrypt.compareSync(pass, foundedUser.pass);

    if (foundedUser === null) {
      return res.status(400).send({
        e: 'userNotFound'
      });
    }

    if (hash) {
      return res.status(401).send({
        e: 'password Incorrect'
      });
    }

    const token = jwt.sign(
      { user: foundedUser.name, perms: foundedUser.perms },
      'privateKey'
    );

    res.send({ token });
  } catch {
    res.sendStatus(500);
  }
});

export default router;
