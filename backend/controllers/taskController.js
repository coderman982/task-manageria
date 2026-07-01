import Task from '../models/Task.js';

export const getTasks = async (req, res) => {
  try {
    const { search, status, priority, sort, page = 1, limit = 10 } = req.query;

    const query = { user: req.user._id };
    if (search) query.title = { $regex: search, $options: 'i' };
    if (status) query.status = status;
    if (priority) query.priority = priority;

    let sortOption = '-createdAt';
    if (sort === 'createdAt') sortOption = 'createdAt';
    else if (sort === 'dueDate') sortOption = 'dueDate';
    else if (sort === '-dueDate') sortOption = '-dueDate';
    else if (sort === 'priority') sortOption = 'priority';
    else if (sort === '-priority') sortOption = '-priority';
    else if (sort === 'title') sortOption = 'title';
    else if (sort === '-title') sortOption = '-title';

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Task.countDocuments(query);
    const tasks = await Task.find(query).sort(sortOption).skip(skip).limit(Number(limit));

    res.json({ tasks, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const task = await Task.create({ user: req.user._id, title, description, status, priority, dueDate });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.title = req.body.title ?? task.title;
    task.description = req.body.description ?? task.description;
    task.status = req.body.status ?? task.status;
    task.priority = req.body.priority ?? task.priority;
    task.dueDate = req.body.dueDate !== undefined ? req.body.dueDate : task.dueDate;

    const updated = await task.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
