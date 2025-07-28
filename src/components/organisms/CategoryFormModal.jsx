import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'

const CategoryFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  category = null,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    Name: '',
    color_c: '#5B21B6'
  })
  const [errors, setErrors] = useState({})

  // Predefined colors matching existing categories
  const colorOptions = [
    { name: 'Purple', value: '#5B21B6' },
    { name: 'Green', value: '#059669' },
    { name: 'Red', value: '#DC2626' },
    { name: 'Orange', value: '#F59E0B' },
    { name: 'Violet', value: '#8B5CF6' },
    { name: 'Blue', value: '#0EA5E9' },
    { name: 'Indigo', value: '#4F46E5' },
    { name: 'Pink', value: '#EC4899' }
  ]

  // Initialize form data when category changes
  useEffect(() => {
    if (category) {
      setFormData({
        Name: category.Name || '',
        color_c: category.color_c || '#5B21B6'
      })
    } else {
      setFormData({
        Name: '',
        color_c: '#5B21B6'
      })
    }
    setErrors({})
  }, [category, isOpen])

  // Handle form input changes
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.Name.trim()) {
      newErrors.Name = 'Category name is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    const submitData = {
      Name: formData.Name.trim(),
      color_c: formData.color_c,
      taskCount_c: 0
    }
    
    onSubmit(submitData)
  }

  // Handle modal close
  const handleClose = () => {
    if (loading) return
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <ApperIcon name="Folder" size={20} className="text-primary-500" />
                {category ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button
                onClick={handleClose}
                disabled={loading}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150 disabled:opacity-50"
              >
                <ApperIcon name="X" size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Category Name */}
              <Input
                label="Category Name"
                type="text"
                value={formData.Name}
                onChange={(e) => handleChange("Name", e.target.value)}
                error={errors.Name}
                placeholder="Enter category name..."
                required
              />

              {/* Color Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Color
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => handleChange("color_c", color.value)}
                      className={`
                        relative w-full h-12 rounded-lg border-2 transition-all duration-150
                        ${formData.color_c === color.value 
                          ? 'border-gray-800 ring-2 ring-gray-300' 
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                      style={{ backgroundColor: color.value }}
                    >
                      {formData.color_c === color.value && (
                        <ApperIcon 
                          name="Check" 
                          size={16} 
                          className="absolute inset-0 m-auto text-white" 
                        />
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Selected: {colorOptions.find(c => c.value === formData.color_c)?.name}
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {category ? 'Updating...' : 'Creating...'}
                    </div>
                  ) : (
                    category ? 'Update Category' : 'Create Category'
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default CategoryFormModal