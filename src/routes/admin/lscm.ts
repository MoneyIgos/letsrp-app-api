import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import LscmForm from '../../model/lscmForm';

const router = Router();

router.post('/lscm', (req: Request, res: Response) => {
  const { token } = req.body;
  let decoded: any;

  try {
    decoded = jwt.verify(token, 'privateKey');
  } catch (e) {
    return res.status(401).send({
      error: 'Invalid token'
    });
  }

  if (decoded.perms === 'admin' || decoded.perms === 'lscm') {
    LscmForm.find({ formType: 'lscm' }, (e, form) => {
      if (e) {
        res.status(500).send({
          error: 'Cannot get this from database'
        });
      } else {
        res.status(200).send({
          form
        });
      }
    });
  } else {
    return res.status(401).send({
      error: 'Unauthorized'
    });
  }
});

router.post('/lscm/check', (req: Request, res: Response) => {
  const { token, id, status } = req.body;
  let decoded: any;

  try {
    decoded = jwt.verify(token, 'privateKey');
  } catch (e) {
    return res.status(401).send({
      error: 'Invalid token'
    });
  }

  if (decoded.perms === 'admin' || decoded.perms === 'lscm') {
    LscmForm.findByIdAndUpdate(
      { _id: id },
      {
        status,
        reason: req.body?.reason
      }
    )
      .then(() => {
        res.status(201).send({
          message: 'Created'
        });
      })
      .catch(() => {
        res.status(500).send({
          error: 'Cannot save to database'
        });
      });
  } else {
    return res.status(401).send({
      error: 'Unauthorized'
    });
  }
});

export default router;
