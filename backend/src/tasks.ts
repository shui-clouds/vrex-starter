import { Request, Response, Router, NextFunction } from "express";
import { z } from "zod";

const taskSchema = z.object({
    name: z.string({
        required_error: 'Task name is required',
    }).min(1),
    completed: z.boolean().default(false),
});

type Task = z.infer<typeof taskSchema> & { id: number };

const tasks: Task[] = [
    { id: 1, name: "Task 1", completed: false },
    { id: 2, name: "Task 2", completed: true },
    { id: 3, name: "Task 3", completed: false },
];

const newTaskSchema = z.object({
    body: taskSchema,
})

const validate = (schema: z.AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('validate')

        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        })
        next()
    } catch (error) {
        res.status(400).json(error)
    }
}

export const taskRouter = Router();

taskRouter.get('/', (_req: Request, res: Response) => {
    res.json(tasks);
});

taskRouter.post('/new', validate(newTaskSchema), (req: Request, res: Response) => {
    console.log('hit')
    const newTask = {
        id: tasks.length + 1,
        name: req.body.name,
        completed: req.body.completed,
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

taskRouter.get('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).send('Task ID must be a number');
        return;
    }
    const task = tasks.find((task) => task.id === id);
    if (task) {
        res.json(task);
    } else {
        res.status(404).send('Task not found');
    }
});

taskRouter.put('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).send('Task ID must be a number');
        return;
    }
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
    if (isNaN(id)) {
        res.status(400).send('Task ID must be a number');
        return;
    }
    const index = tasks.findIndex((task) => task.id === id);
    if (index !== -1) {
        tasks.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Task not found');
    }
});