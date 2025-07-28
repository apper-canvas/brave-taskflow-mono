import { motion } from "framer-motion"
import { format } from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { cn } from "@/utils/cn"

const TaskCard = ({ 
  task, 
  category,
  onEdit, 
  onDelete, 
  onStatusChange, 
  onToggleComplete,
  className 
}) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-500"
      case "medium": return "bg-amber-500"
      case "low": return "bg-green-500"
      default: return "bg-gray-400"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed": return "CheckCircle2"
      case "in-progress": return "Clock"
      default: return "Circle"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "text-green-600"
      case "in-progress": return "text-amber-600"
      default: return "text-gray-400"
    }
  }

  const formatDueDate = (date) => {
    if (!date) return null
    const dueDate = new Date(date)
    const now = new Date()
    const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return { text: "Overdue", color: "text-red-600" }
    if (diffDays === 0) return { text: "Due today", color: "text-amber-600" }
    if (diffDays === 1) return { text: "Due tomorrow", color: "text-amber-500" }
    return { text: `Due ${format(dueDate, "MMM d")}`, color: "text-gray-600" }
  }

  const dueDateInfo = formatDueDate(task.dueDate)

  const handleStatusCycle = () => {
    const statusOrder = ["todo", "in-progress", "completed"]
    const currentIndex = statusOrder.indexOf(task.status)
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length]
    onStatusChange(task.Id, nextStatus)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "task-card",
        task.status === "completed" && "task-completed",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-2">
            <div className={cn("priority-dot", `priority-${task.priority}`)} />
            
            <div className="flex-1">
              <h3 className={cn(
                "font-semibold text-gray-900 task-title",
                task.status === "completed" && "line-through text-gray-500"
              )}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
<button
              onClick={handleStatusCycle}
              className={cn(
                "flex items-center gap-1 hover:opacity-75 transition-opacity",
                getStatusColor(task.status_c)
              )}
            >
              <ApperIcon name={getStatusIcon(task.status_c)} size={14} />
              <span className="capitalize">{task.status_c?.replace("-", " ") || "Unknown"}</span>
            </button>
            
            {category && (
              <span 
                className="category-badge"
                style={{ backgroundColor: category.color }}
              >
                {category.name}
              </span>
            )}
            
            {dueDateInfo && (
              <span className={cn("flex items-center gap-1", dueDateInfo.color)}>
                <ApperIcon name="Calendar" size={14} />
                {dueDateInfo.text}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            className="p-2"
          >
            <ApperIcon name="Edit2" size={16} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.Id)}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default TaskCard