import Task from "../models/taskModel.js";

//CREATE TASK
export const createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, completed, color, recurrence } = req.body;
        const newTask = new Task({
            title,
            description,
            priority,
            dueDate,
            completed: completed === 'Yes' || completed === true,
            color,
            recurrence,
            owner: req.user._id
        });
        const savedTask = await newTask.save();
        res.status(201).json({ success: true, task: savedTask });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//GET ALL TASKS FOR LOGGED IN USER
export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ owner: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, tasks });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//GET SINGLE TASK BY ID
export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }
        res.json({ success: true, task });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

};

//UPDATE TASK BY ID
export const updateTask = async (req, res) => {
    try {
        const data = { ...req.body };
        if (data.completed !== undefined) {
            data.completed = data.completed === 'Yes' || data.completed === true;
        }

        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, owner: req.user._id },
            data,
            { new: true, runValidators: true }
        );
        if (!updatedTask) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }
        res.json({ success: true, task: updatedTask });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
//DELETE TASK BY ID
export const deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!deletedTask) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }
        res.json({ success: true, message: "Task deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

};
