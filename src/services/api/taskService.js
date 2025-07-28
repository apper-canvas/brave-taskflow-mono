import mockTasks from "@/services/mockData/tasks.json"

let tasks = [...mockTasks]

const taskService = {
  // Get all tasks
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...tasks]
  },

  // Get task by id
  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const task = tasks.find(task => task.Id === parseInt(id))
    if (!task) {
      throw new Error("Task not found")
    }
    return { ...task }
  },

  // Create new task
  create: async (taskData) => {
    await new Promise(resolve => setTimeout(resolve, 400))
    
const newTask = {
      Id: Math.max(...tasks.map(t => t.Id), 0) + 1,
      ...taskData,
      assignee: taskData.assignee || "",
      createdAt: new Date().toISOString(),
      completedAt: null,
      archived: false
    }
    
    tasks.unshift(newTask)
    return { ...newTask }
  },

  // Update task
  update: async (id, updateData) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = tasks.findIndex(task => task.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Task not found")
    }
    
    tasks[index] = { ...tasks[index], ...updateData }
    return { ...tasks[index] }
  },

  // Delete task
  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 250))
    
    const index = tasks.findIndex(task => task.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Task not found")
    }
    
    tasks.splice(index, 1)
    return true
  },

  // Archive task
  archive: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const index = tasks.findIndex(task => task.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Task not found")
    }
    
    tasks[index].archived = true
    return { ...tasks[index] }
  },

  // Get archived tasks
  getArchived: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return tasks.filter(task => task.archived).map(task => ({ ...task }))
  }
}

export default taskService