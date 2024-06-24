import express from 'express';
import cors from 'cors';
import { taskRouter } from './tasks';

import { Request, Response, NextFunction } from 'express';

const app = express();
const port = 3000;

const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		console.log('auth')
		next();
	} catch (error) {
		next(error);
	}
}

app.use(cors({
	origin: 'http://localhost:3000',
}));

app.use(express.json());

app.get('/', (_request: Request, response: Response) => {
	response.send('Hello World!');
	console.log('Hello World!');
});

app.use(AuthMiddleware);

app.use('/tasks', taskRouter);


app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
