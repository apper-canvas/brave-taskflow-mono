import Select from "@/components/atoms/Select"

const FilterControls = ({ 
  statusFilter, 
  priorityFilter, 
  categoryFilter,
  onStatusChange,
  onPriorityChange,
  onCategoryChange,
  categories = []
}) => {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="min-w-[140px]">
        <Select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          label="Status"
        >
          <option value="">All Status</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </Select>
      </div>
      
      <div className="min-w-[140px]">
        <Select
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value)}
          label="Priority"
        >
          <option value="">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Select>
      </div>
      
      <div className="min-w-[140px]">
        <Select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          label="Category"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.Id} value={category.Id}>
              {category.name}
            </option>
          ))}
        </Select>
      </div>
    </div>
  )
}

export default FilterControls