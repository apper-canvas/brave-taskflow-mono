import { toast } from "react-toastify"

const categoryService = {
  // Get all categories
  getAll: async () => {
    try {
if (!window.ApperSDK) {
        throw new Error('ApperSDK not loaded')
      }
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "color_c" } },
          { field: { Name: "taskCount_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        orderBy: [
          { fieldName: "Name", sorttype: "ASC" }
        ]
      }

      const response = await apperClient.fetchRecords("category_c", params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching categories:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return []
    }
  },

  // Get category by id
  getById: async (id) => {
    try {
if (!window.ApperSDK) {
        throw new Error('ApperSDK not loaded')
      }
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "color_c" } },
          { field: { Name: "taskCount_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      }

      const response = await apperClient.getRecordById("category_c", parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching category with ID ${id}:`, error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  },

  // Create new category
  create: async (categoryData) => {
try {
      if (!window.ApperSDK) {
        throw new Error('ApperSDK not loaded')
      }
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      const params = {
        records: [{
          Name: categoryData.Name || categoryData.name,
          color_c: categoryData.color_c || categoryData.color,
          taskCount_c: categoryData.taskCount_c || 0
        }]
      }

      const response = await apperClient.createRecord("category_c", params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create category ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating category:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  },

  // Update category
  update: async (id, updateData) => {
    try {
if (!window.ApperSDK) {
        throw new Error('ApperSDK not loaded')
      }
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        records: [{
          Id: parseInt(id),
          Name: updateData.Name || updateData.name,
          color_c: updateData.color_c || updateData.color,
          taskCount_c: updateData.taskCount_c
        }]
      }

      const response = await apperClient.updateRecord("category_c", params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update category ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating category:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  },

  // Delete category
  delete: async (id) => {
    try {
if (!window.ApperSDK) {
        throw new Error('ApperSDK not loaded')
      }
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        RecordIds: [parseInt(id)]
      }

      const response = await apperClient.deleteRecord("category_c", params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete category ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulDeletions.length > 0
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting category:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return false
    }
  }
}

export default categoryService