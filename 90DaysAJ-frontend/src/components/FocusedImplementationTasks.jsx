import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, CheckCircle2, Circle, Clock, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";

// Database-like storage utility
const STORAGE_KEY = "focused_implementation_tasks";

// Initialize database structure
const initializeDatabase = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    const db = {
      tasks: [],
      metadata: {
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        version: "1.0.0"
      }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    return db;
  }
  return JSON.parse(existing);
};

// Database operations
const dbOperations = {
  // Get all tasks for a specific day
  getTasksByDay: (dayNumber, journeyId) => {
    const db = initializeDatabase();
    return db.tasks.filter(
      task => task.dayNumber === dayNumber && task.journeyId === journeyId
    );
  },

  // Add a new task
  addTask: (task) => {
    const db = initializeDatabase();
    const newTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...task,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completed: false
    };
    db.tasks.push(newTask);
    db.metadata.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    return newTask;
  },

  // Update a task
  updateTask: (taskId, updates) => {
    const db = initializeDatabase();
    const taskIndex = db.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      db.tasks[taskIndex] = {
        ...db.tasks[taskIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      db.metadata.lastUpdated = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
      return db.tasks[taskIndex];
    }
    return null;
  },

  // Delete a task
  deleteTask: (taskId) => {
    const db = initializeDatabase();
    db.tasks = db.tasks.filter(t => t.id !== taskId);
    db.metadata.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  },

  // Toggle task completion
  toggleTask: (taskId) => {
    const db = initializeDatabase();
    const task = db.tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      task.updatedAt = new Date().toISOString();
      if (task.completed) {
        task.completedAt = new Date().toISOString();
      } else {
        delete task.completedAt;
      }
      db.metadata.lastUpdated = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
      return task;
    }
    return null;
  },

  // Get all tasks (for backup/export)
  getAllTasks: () => {
    const db = initializeDatabase();
    return db;
  },

  // Export database (for backup)
  exportDatabase: () => {
    const db = initializeDatabase();
    const dataStr = JSON.stringify(db, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `focused-implementation-tasks-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // Import database (for restore)
  importDatabase: (jsonData) => {
    try {
      const imported = JSON.parse(jsonData);
      if (imported.tasks && Array.isArray(imported.tasks)) {
        localStorage.setItem(STORAGE_KEY, jsonData);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error importing database:", error);
      return false;
    }
  }
};

function FocusedImplementationTasks({ currentDay, journeyId, onClose }) {
  const [tasks, setTasks] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    timeBlock: "",
    discipline: "",
    priority: "normal",
    estimatedDuration: ""
  });

  useEffect(() => {
    if (currentDay && journeyId) {
      const dayTasks = dbOperations.getTasksByDay(currentDay.dayNumber, journeyId);
      setTasks(dayTasks);
    }
  }, [currentDay, journeyId]);

  const handleAddTask = () => {
    if (!formData.title.trim()) return;

    const newTask = dbOperations.addTask({
      dayNumber: currentDay.dayNumber,
      journeyId: journeyId,
      title: formData.title,
      description: formData.description,
      timeBlock: formData.timeBlock,
      discipline: formData.discipline,
      priority: formData.priority,
      estimatedDuration: formData.estimatedDuration
    });

    setTasks([...tasks, newTask]);
    setFormData({
      title: "",
      description: "",
      timeBlock: "",
      discipline: "",
      priority: "normal",
      estimatedDuration: ""
    });
    setIsAddModalOpen(false);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || "",
      timeBlock: task.timeBlock || "",
      discipline: task.discipline || "",
      priority: task.priority || "normal",
      estimatedDuration: task.estimatedDuration || ""
    });
    setIsAddModalOpen(true);
  };

  const handleUpdateTask = () => {
    if (!formData.title.trim() || !editingTask) return;

    const updated = dbOperations.updateTask(editingTask.id, {
      title: formData.title,
      description: formData.description,
      timeBlock: formData.timeBlock,
      discipline: formData.discipline,
      priority: formData.priority,
      estimatedDuration: formData.estimatedDuration
    });

    if (updated) {
      setTasks(tasks.map(t => t.id === updated.id ? updated : t));
      setEditingTask(null);
      setFormData({
        title: "",
        description: "",
        timeBlock: "",
        discipline: "",
        priority: "normal",
        estimatedDuration: ""
      });
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      dbOperations.deleteTask(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
    }
  };

  const handleToggleTask = (taskId) => {
    const updated = dbOperations.toggleTask(taskId);
    if (updated) {
      setTasks(tasks.map(t => t.id === updated.id ? updated : t));
    }
  };

  const getTimeBlocks = () => {
    if (!currentDay?.schedule?.timeBlocks?.focusedImplementation) return [];
    return currentDay.schedule.timeBlocks.focusedImplementation.map(block => ({
      value: block.time,
      label: `${block.time} (${block.duration}) - ${block.discipline}`
    }));
  };

  const getDisciplines = () => {
    return currentDay?.schedule?.disciplineRotation?.allDisciplines || [];
  };

  const priorityColors = {
    high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    medium: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    normal: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose && onClose()}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white dark:text-white">
            Focused Implementation Tasks - Day {currentDay?.dayNumber || 1}
          </DialogTitle>
          <DialogDescription className="text-white dark:text-white">
            Manage your freelancing and work tasks for today's Focused Implementation time blocks.
            All tasks are automatically saved to your local database for backup and reference.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Add Task Button */}
          <div className="flex items-center justify-between">
            <Button
              onClick={() => {
                setEditingTask(null);
                setFormData({
                  title: "",
                  description: "",
                  timeBlock: "",
                  discipline: "",
                  priority: "normal",
                  estimatedDuration: ""
                });
                setIsAddModalOpen(true);
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => dbOperations.exportDatabase()}
                size="sm"
              >
                Export Backup
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                size="sm"
              >
                Close
              </Button>
            </div>
          </div>

          {/* Tasks List */}
          {tasks.length === 0 ? (
            <Card className="border-2 border-dashed">
              <CardContent className="p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  No tasks added yet. Click "Add Task" to get started!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <Card
                  key={task.id}
                  className={`border-2 ${
                    task.completed
                      ? "opacity-60 border-gray-300 dark:border-gray-600"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className="mt-1 flex-shrink-0"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400 hover:text-green-500" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3
                            className={`font-bold text-lg ${
                              task.completed
                                ? "line-through text-gray-500"
                                : "text-black dark:text-black"
                            }`}
                          >
                            {task.title}
                          </h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge className={priorityColors[task.priority] || priorityColors.normal}>
                              {task.priority}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditTask(task)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTask(task.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        {task.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500 dark:text-gray-400">
                          {task.timeBlock && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {task.timeBlock}
                            </span>
                          )}
                          {task.discipline && (
                            <Badge variant="outline" className="text-xs">
                              {task.discipline}
                            </Badge>
                          )}
                          {task.estimatedDuration && (
                            <span>Duration: {task.estimatedDuration}</span>
                          )}
                          {task.completedAt && (
                            <span className="text-green-600">
                              Completed: {new Date(task.completedAt).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Add/Edit Task Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white dark:text-white">
                {editingTask ? "Edit Task" : "Add New Task"}
              </DialogTitle>
              <DialogDescription className="text-white dark:text-white">
                {editingTask
                  ? "Update your task details below."
                  : "Add a task for your Focused Implementation time block."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-white dark:text-white">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  placeholder="e.g., Complete client website redesign"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white dark:text-white">
                  Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full min-h-[100px] bg-gray-800 border-gray-600 text-white"
                  placeholder="Add details about what needs to be done..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-white dark:text-white">
                    Time Block
                  </label>
                  <select
                    value={formData.timeBlock}
                    onChange={(e) => setFormData({ ...formData, timeBlock: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  >
                    <option value="">Select time block</option>
                    {getTimeBlocks().map((block, idx) => (
                      <option key={idx} value={block.value} className="bg-gray-800">
                        {block.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-white dark:text-white">
                    Discipline
                  </label>
                  <select
                    value={formData.discipline}
                    onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  >
                    <option value="">Select discipline</option>
                    {getDisciplines().map((disc, idx) => (
                      <option key={idx} value={disc} className="bg-gray-800">
                        {disc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-white dark:text-white">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  >
                    <option value="normal" className="bg-gray-800">Normal</option>
                    <option value="medium" className="bg-gray-800">Medium</option>
                    <option value="high" className="bg-gray-800">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-white dark:text-white">
                    Estimated Duration
                  </label>
                  <input
                    type="text"
                    value={formData.estimatedDuration}
                    onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="e.g., 2 hours"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={editingTask ? handleUpdateTask : handleAddTask}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingTask ? "Update Task" : "Add Task"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}

// Export database operations for use in other components
export { dbOperations as focusedImplementationDB };
export default FocusedImplementationTasks;

