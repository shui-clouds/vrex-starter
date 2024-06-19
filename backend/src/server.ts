import express from 'express';
import cors from 'cors';
import { taskRouter } from './tasks';

import { Request, Response } from 'express';

const app = express();
const port = 3000;

app.use(cors({
	origin: 'http://localhost:3000',
}));

app.use(express.json());

app.get('/', (request: Request, response: Response) => {
	response.send('Hello World!');
	console.log('Hello World!');
});

app.use('/tasks', taskRouter);


app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
