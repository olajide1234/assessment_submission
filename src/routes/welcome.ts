import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Fillout tech screen!');
  });

  export default router;
  