import express, { Application } from 'express';
import router from './routes';

const app: Application = express();
const port = process.env.PORT || 8000;

app.use('/', router);

export const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

export default app;
