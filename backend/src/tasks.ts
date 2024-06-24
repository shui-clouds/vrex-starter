import { Request, Response, Router } from "express";
import { validateRequest, validateRequestParams } from 'zod-express-middleware';
import { z } from "zod";

const taskSchema = z.object({
    name: z.string({
        required_error: 'Task name is required',
    }).min(1),
    completed: z.boolean().default(false),
});

const taskIdUrlParamSchema = z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: "Task ID must be a positive number",
})

type Task = z.infer<typeof taskSchema> & { id: number };

const tasks: Task[] = [
    { id: 1, name: "Task 1", completed: false },
    { id: 2, name: "Task 2", completed: true },
    { id: 3, name: "Task 3", completed: false },
];


export const taskRouter = Router();

taskRouter.get('/', (_req: Request, res: Response) => {
    res.json(tasks);
});

taskRouter.post('/new', validateRequest({ body: taskSchema }), (req: Request, res: Response) => {
    const newTask = {
        id: tasks.length + 1,
        name: req.body.name,
        completed: req.body.completed,
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

taskRouter.get('/:id', validateRequestParams(z.object({ id: taskIdUrlParamSchema })), (req: Request, res: Response) => {
    const task = tasks.find((task) => task.id === parseInt(req.params.id));
    if (task) {
        res.json(task);
    } else {
        res.status(404).send('Task not found');
    }
});

taskRouter.put('/:id', validateRequestParams(z.object({ id: taskIdUrlParamSchema })), (req: Request, res: Response) => {
    const task = tasks.find((task) => task.id === parseInt(req.params.id));
    if (task) {
        task.name = req.body.name;
        task.completed = req.body.completed;
        res.json(task);
    } else {
        res.status(404).send('Task not found');
    }
});

taskRouter.delete('/:id', validateRequestParams(z.object({ id: taskIdUrlParamSchema })), (req: Request, res: Response) => {
    const index = tasks.findIndex((task) => task.id === parseInt(req.params.id));
    if (index !== -1) {
        tasks.splice(index, 1);
        res.json(`Task ID ${req.params.id} deleted`);
    } else {
        res.status(404).send('Task not found');
    }
});