import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const CategorySidebar = ({ 
  categories, 
  selectedCategory, 
  onCategorySelect,
  taskCounts = {},
  className 
}) => {
  const allTasksCount = Object.values(taskCounts).reduce((sum, count) => sum + count, 0)

  return (
    <div className={cn("bg-white border-r border-gray-200 h-full", className)}>
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <ApperIcon name="FolderOpen" size={20} className="text-primary-500" />
          Categories
        </h2>
        
        <div className="space-y-2">
          {/* All Tasks */}
          <motion.button
            whileHover={{ x: 4 }}
            onClick={() => onCategorySelect("")}
            className={cn(
              "w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-150",
              selectedCategory === "" 
                ? "bg-primary-50 text-primary-700 border border-primary-200" 
                : "hover:bg-gray-50 text-gray-700"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full" />
              <span className="font-medium">All Tasks</span>
            </div>
            <span className={cn(
              "text-xs px-2 py-1 rounded-full",
              selectedCategory === "" 
                ? "bg-primary-100 text-primary-700" 
                : "bg-gray-100 text-gray-600"
            )}>
              {allTasksCount}
            </span>
          </motion.button>
          
          {/* Individual Categories */}
          {categories.map((category) => (
            <motion.button
              key={category.Id}
              whileHover={{ x: 4 }}
              onClick={() => onCategorySelect(category.Id)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-150",
                selectedCategory === category.Id 
                  ? "bg-primary-50 text-primary-700 border border-primary-200" 
                  : "hover:bg-gray-50 text-gray-700"
              )}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: category.color }}
                />
                <span className="font-medium">{category.name}</span>
              </div>
              <span className={cn(
                "text-xs px-2 py-1 rounded-full",
                selectedCategory === category.Id 
                  ? "bg-primary-100 text-primary-700" 
                  : "bg-gray-100 text-gray-600"
              )}>
                {taskCounts[category.Id] || 0}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategorySidebar