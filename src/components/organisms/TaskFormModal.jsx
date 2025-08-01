import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import peopleService from "@/services/api/peopleService";
import ApperIcon from "@/components/ApperIcon";
import Textarea from "@/components/atoms/Textarea";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";

const TaskFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  task = null,
  loading = false
}) => {
const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "todo",
    assignee: "",
    people1: "",
    dueDate: ""
})
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [people, setPeople] = useState([])
  const [peopleLoading, setPeopleLoading] = useState(false)
  const [peopleError, setPeopleError] = useState(null)
// Handle initial data population
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title_c || task.title || "",
        description: task.description_c || task.description || "",
        priority: task.priority_c || task.priority || "medium",
        status: task.status_c || task.status || "todo",
        assignee: task.assignee_c || task.assignee || "",
        people1: task.people1_c || task.people1 || "",
        dueDate: task.dueDate_c || task.dueDate ? format(new Date(task.dueDate_c || task.dueDate), "yyyy-MM-dd") : ""
      })
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        status: "todo",
        assignee: "",
        people1: "",
        dueDate: ""
      })
    }
  }, [task, isOpen])
  // Fetch people data for dropdown
  useEffect(() => {
    const fetchPeople = async () => {
      setPeopleLoading(true)
      setPeopleError(null)
      try {
        const peopleData = await peopleService.getAll()
        setPeople(peopleData || [])
      } catch (error) {
        setPeopleError('Failed to load people')
        console.error('Error loading people:', error)
      } finally {
        setPeopleLoading(false)
      }
    }

    if (isOpen) {
      fetchPeople()
    }
  }, [isOpen])

  // Form validation
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }
    
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
const submitData = {
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      status: formData.status,
      assignee: formData.assignee,
      people1: formData.people1 ? parseInt(formData.people1) : null,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
    }
    
    onSubmit(submitData)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {task ? "Edit Task" : "Create New Task"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2 -mr-2"
              >
                <ApperIcon name="X" size={16} />
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <Input
              label="Task Title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              error={errors.title}
              placeholder="Enter task title..."
              autoFocus
            />

            <Textarea
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Add task description..."
              rows={3}
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Priority"
                value={formData.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>

              <Select
                label="Status"
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </Select>
            </div>

<Select
              label="Assignee"
              value={formData.assignee}
              onChange={(e) => handleChange("assignee", e.target.value)}
            >
              <option value="">Select assignee...</option>
              <option value="John Smith">John Smith</option>
              <option value="Sarah Johnson">Sarah Johnson</option>
              <option value="Mike Davis">Mike Davis</option>
              <option value="Emily Chen">Emily Chen</option>
              <option value="Alex Rodriguez">Alex Rodriguez</option>
            </Select>
<Select
              label="People1"
              value={formData.people1}
              onChange={(e) => handleChange("people1", e.target.value)}
              disabled={peopleLoading}
              error={peopleError}
            >
              <option value="">
                {peopleLoading ? 'Loading people...' : 'Select a person...'}
              </option>
              {people.map((person) => (
                <option key={person.Id} value={person.Id}>
                  {person.name}
                </option>
              ))}
            </Select>
            <Input
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange("dueDate", e.target.value)}
            />
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                loading={loading}
              >
                {task ? "Update Task" : "Create Task"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default TaskFormModal