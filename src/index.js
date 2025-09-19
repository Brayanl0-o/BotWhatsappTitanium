import express from 'express';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { connectDB } from './db.js';
import webhookRouter from './routes/webhook.js';

dotenv.config();

await connectDB(); // Conectamos a MongoDB antes de iniciar servidor

const app = express();
app.set('trust proxy', 1);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const limiter = rateLimit({ windowMs: 60*1000, max: 200 });
app.use(limiter);

app.use('/webhook', webhookRouter);
app.get('/', (req, res) => res.send('WhatsApp Bot con MongoDB - OK'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
