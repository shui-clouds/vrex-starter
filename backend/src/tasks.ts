import { Request, Response, Router } from "express";

type Task = {
    id: number;
    name: string;
    completed: boolean;
};

const tasks: Task[] = [
    { id: 1, name: "Task 1", completed: false },
    { id: 2, name: "Task 2", completed: true },
    { id: 3, name: "Task 3", completed: false },
];

export const taskRouter = Router();


taskRouter.get('/', (req: Request, res: Response) => {
    res.json(tasks);
});

taskRouter.post('/new', (req: Request, res: Response) => {

    const task: Task = {
        id: tasks.length + 1,
        name: req.body.name,
        completed: false,
    };
    tasks.push(task);
    res.status(201).json(task);
});

taskRouter.get('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const task = tasks.find((task) => task.id === id);
    if (task) {
        res.json(task);
    } else {
        res.status(404).send('Task not found');
    }
});

taskRouter.put('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const task = tasks.find((task) => task.id === id);
    if (task) {
        task.name = req.body.name;
        task.completed = req.body.completed;
        res.json(task);
    } else {
        res.status(404).send('Task not found');
    }
});

taskRouter.delete('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = tasks.findIndex((task) => task.id === id);
    if (index !== -1) {
        tasks.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Task not found');
    }
});