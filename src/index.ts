import express from 'express';
import cors from 'cors';
import logRouter from './routes/log.route';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend API is running');
});

app.use('/api/log', logRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
