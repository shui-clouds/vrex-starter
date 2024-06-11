import express from 'express';

const app = express();
const port = 3000;

const a = 'hello';

app.get('/', (request, response) => {
	response.send('Hello World!');
	console.log('Hello World!');
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
