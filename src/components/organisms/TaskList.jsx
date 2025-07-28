import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import TaskCard from "@/components/molecules/TaskCard"
import FilterControls from "@/components/molecules/FilterControls"
import SearchBar from "@/components/molecules/SearchBar"
import Button from "@/components/atoms/Button"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"

const TaskList = ({ 
  tasks, 
  categories,
  loading,
  onEdit, 
  onDelete, 
  onStatusChange,
  onCreateTask,
  selectedCategory,
  onCategoryChange
}) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("")
  const [sortBy, setSortBy] = useState("dueDate") // dueDate, priority, created

  // Filter and search tasks
  const filteredTasks = tasks.filter(task => {
const matchesSearch = !searchTerm || 
      (task.title_c || task.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description_c || task.description || "").toLowerCase().includes(searchTerm.toLowerCase())
    
const matchesStatus = !statusFilter || (task.status_c || task.status) === statusFilter
    const matchesPriority = !priorityFilter || (task.priority_c || task.priority) === priorityFilter
    const matchesCategory = !selectedCategory || (task.categoryId_c || task.categoryId) === selectedCategory
    
return matchesSearch && matchesStatus && matchesPriority && matchesCategory && !(task.archived_c || task.archived)
  })

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case "priority": {
const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority_c || b.priority] - priorityOrder[a.priority_c || a.priority]
      }
      case "dueDate": {
const aDate = a.dueDate_c || a.dueDate
        const bDate = b.dueDate_c || b.dueDate
        if (!aDate && !bDate) return 0
        if (!aDate) return 1
        if (!bDate) return -1
        return new Date(aDate) - new Date(bDate)
      }
      case "created":
return new Date(b.createdAt_c || b.createdAt) - new Date(a.createdAt_c || a.createdAt)
      default:
        return 0
    }
  })

  const getCategoryById = (categoryId) => {
    return categories.find(cat => cat.Id === categoryId)
  }

  if (filteredTasks.length === 0 && !loading) {
    const emptyProps = searchTerm || statusFilter || priorityFilter || selectedCategory
      ? {
          title: "No tasks match your filters",
          description: "Try adjusting your search or filter criteria",
          actionLabel: "Clear Filters",
          onAction: () => {
            setSearchTerm("")
            setStatusFilter("")
            setPriorityFilter("")
            onCategoryChange("")
          }
        }
      : {
          title: "No tasks yet",
          description: "Create your first task to get started with TaskFlow",
          actionLabel: "Create Task",
          onAction: onCreateTask
        }

    return <Empty {...emptyProps} />
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Actions */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div className="flex-1 max-w-md">
          <SearchBar 
            onSearch={setSearchTerm}
            placeholder="Search tasks..."
          />
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm("")
              setStatusFilter("")
              setPriorityFilter("")
              onCategoryChange("")
            }}
            icon="RotateCcw"
          >
            Clear Filters
          </Button>
          
          <Button
            onClick={onCreateTask}
            icon="Plus"
            className="whitespace-nowrap"
          >
            New Task
          </Button>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-end">
        <FilterControls
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          categoryFilter={selectedCategory}
          onStatusChange={setStatusFilter}
          onPriorityChange={setPriorityFilter}
          onCategoryChange={onCategoryChange}
          categories={categories}
        />
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="created">Created</option>
          </select>
        </div>
      </div>

      {/* Results Summary */}
      {(searchTerm || statusFilter || priorityFilter) && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="Filter" size={16} />
          <span>
Showing {sortedTasks.length} of {tasks.filter(t => !(t.archived_c || t.archived)).length} tasks
          </span>
        </div>
      )}

      {/* Task List */}
      <AnimatePresence mode="popLayout">
        <div className="space-y-3">
          {sortedTasks.map(task => (
            <TaskCard
              key={task.Id}
              task={task}
              category={getCategoryById(task.categoryId)}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      </AnimatePresence>
    </div>
  )
}

export default TaskList