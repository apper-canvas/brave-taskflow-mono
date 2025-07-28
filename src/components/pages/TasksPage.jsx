import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import CategorySidebar from "@/components/organisms/CategorySidebar"
import TaskList from "@/components/organisms/TaskList"
import TaskFormModal from "@/components/organisms/TaskFormModal"
import CategoryFormModal from "@/components/organisms/CategoryFormModal"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import taskService from "@/services/api/taskService"
import categoryService from "@/services/api/categoryService"

const TasksPage = () => {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [categoryModalLoading, setCategoryModalLoading] = useState(false)
  // Load initial data
  useEffect(() => {
    loadData()
  }, [])

const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ])
      
      // Handle empty or non-existent data
      if (!tasksData || tasksData.length === 0) {
        setTasks([])
      } else {
        setTasks(tasksData)
      }
      
      if (!categoriesData || categoriesData.length === 0) {
        setCategories([])
      } else {
        setCategories(categoriesData)
      }
    } catch (err) {
      setError("Failed to load tasks and categories")
      console.error("Load data error:", err)
      setTasks([])
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  // Calculate task counts per category
  const getTaskCounts = () => {
    const counts = {}
categories.forEach(category => {
      counts[category.Id] = tasks.filter(task => 
        task.categoryId_c === category.Id && !task.archived_c
      ).length
    })
    return counts
  }

  // Handle task creation
  const handleCreateTask = async (taskData) => {
    try {
      setModalLoading(true)
      const newTask = await taskService.create(taskData)
      setTasks(prev => [newTask, ...prev])
      setIsModalOpen(false)
      setEditingTask(null)
      toast.success("Task created successfully!")
    } catch (err) {
      toast.error("Failed to create task")
      console.error("Create task error:", err)
    } finally {
      setModalLoading(false)
    }
  }

  // Handle task editing
  const handleEditTask = async (taskData) => {
    try {
      setModalLoading(true)
      const updatedTask = await taskService.update(editingTask.Id, taskData)
      setTasks(prev => prev.map(task => 
        task.Id === editingTask.Id ? updatedTask : task
      ))
      setIsModalOpen(false)
      setEditingTask(null)
      toast.success("Task updated successfully!")
    } catch (err) {
      toast.error("Failed to update task")
      console.error("Update task error:", err)
    } finally {
      setModalLoading(false)
    }
}

  // Handle category creation
  const handleCreateCategory = async (categoryData) => {
    try {
      setCategoryModalLoading(true)
      const newCategory = await categoryService.create(categoryData)
      if (newCategory) {
        setCategories(prev => [...prev, newCategory])
        setIsCategoryModalOpen(false)
        setEditingCategory(null)
        toast.success("Category created successfully!")
      }
    } catch (err) {
      toast.error("Failed to create category")
      console.error("Create category error:", err)
    } finally {
      setCategoryModalLoading(false)
    }
  }

  // Handle task deletion
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return
    
    try {
      await taskService.delete(taskId)
      setTasks(prev => prev.filter(task => task.Id !== taskId))
      toast.success("Task deleted successfully!")
    } catch (err) {
      toast.error("Failed to delete task")
      console.error("Delete task error:", err)
    }
  }

  // Handle status change
  const handleStatusChange = async (taskId, newStatus) => {
try {
      const task = tasks.find(t => t.Id === taskId)
      const updateData = { 
        status_c: newStatus,
        completedAt_c: newStatus === "completed" ? new Date().toISOString() : null
      }
      
      const updatedTask = await taskService.update(taskId, updateData)
      setTasks(prev => prev.map(t => t.Id === taskId ? updatedTask : t))
      
      if (newStatus === "completed") {
        toast.success("Task completed! 🎉")
      } else {
        toast.info(`Task status updated to ${newStatus.replace("-", " ")}`)
      }
    } catch (err) {
      toast.error("Failed to update task status")
      console.error("Status update error:", err)
    }
  }

  // Handle form submission
  const handleFormSubmit = (taskData) => {
    if (editingTask) {
      handleEditTask(taskData)
    } else {
      handleCreateTask(taskData)
    }
  }

  // Open create modal
  const openCreateModal = () => {
    setEditingTask(null)
    setIsModalOpen(true)
  }

  // Open edit modal
  const openEditModal = (task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false)
    setEditingTask(null)
}

  // Handle category form submission
  const handleCategoryFormSubmit = (categoryData) => {
    if (editingCategory) {
      // Handle edit in future if needed
    } else {
      handleCreateCategory(categoryData)
    }
  }

  // Open create category modal
  const openCreateCategoryModal = () => {
    setEditingCategory(null)
    setIsCategoryModalOpen(true)
  }

  // Close category modal
  const closeCategoryModal = () => {
    setIsCategoryModalOpen(false)
    setEditingCategory(null)
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />
  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Category Sidebar */}
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 flex-shrink-0"
      >
<CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          taskCounts={getTaskCounts()}
          className="h-full rounded-lg shadow-sm"
          onAddCategory={openCreateCategoryModal}
        />
      </motion.div>

      {/* Main Task Area */}
      <motion.div 
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex-1 bg-white rounded-lg shadow-sm p-6 overflow-y-auto"
      >
        <TaskList
          tasks={tasks}
          categories={categories}
          loading={loading}
          onEdit={openEditModal}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
          onCreateTask={openCreateModal}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </motion.div>

{/* Task Form Modal */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        task={editingTask}
        categories={categories}
        loading={modalLoading}
      />

      {/* Category Form Modal */}
      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        onClose={closeCategoryModal}
        onSubmit={handleCategoryFormSubmit}
        category={editingCategory}
        loading={categoryModalLoading}
      />
    </div>
  )
}

export default TasksPage