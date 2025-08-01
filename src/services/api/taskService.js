import { toast } from "react-toastify";

const taskService = {
  // Get all tasks
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
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "assignee_c" } },
          { field: { Name: "people1_c" } },
          { field: { Name: "dueDate_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "completedAt_c" } },
          { field: { Name: "archived_c" } }
        ],
        orderBy: [
          { fieldName: "createdAt_c", sorttype: "DESC" }
        ]
      }

      const response = await apperClient.fetchRecords("task_c", params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return []
    }
  },

  // Get task by id
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
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "assignee_c" } },
          { field: { Name: "people1_c" } },
          { field: { Name: "dueDate_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "completedAt_c" } },
          { field: { Name: "archived_c" } }
        ]
      }

      const response = await apperClient.getRecordById("task_c", parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching task with ID ${id}:`, error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  },

  // Create new task
  create: async (taskData) => {
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
          Name: taskData.title,
          title_c: taskData.title,
          description_c: taskData.description || "",
          priority_c: taskData.priority || "medium",
          status_c: taskData.status || "todo",
          assignee_c: taskData.assignee || "",
          people1_c: taskData.people1 || "",
          dueDate_c: taskData.dueDate,
          createdAt_c: new Date().toISOString(),
          completedAt_c: null,
          archived_c: false
        }]
      }

      const response = await apperClient.createRecord("task_c", params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} task records: ${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null
      }

      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating task:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  },

  // Update task
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
          ...(updateData.title !== undefined && { title_c: updateData.title }),
          ...(updateData.description !== undefined && { description_c: updateData.description }),
          ...(updateData.priority !== undefined && { priority_c: updateData.priority }),
          ...(updateData.status !== undefined && { status_c: updateData.status }),
          ...(updateData.assignee !== undefined && { assignee_c: updateData.assignee }),
          ...(updateData.people1 !== undefined && { people1_c: updateData.people1 }),
          ...(updateData.dueDate !== undefined && { dueDate_c: updateData.dueDate }),
          ...(updateData.completedAt !== undefined && { completedAt_c: updateData.completedAt }),
          ...(updateData.archived !== undefined && { archived_c: updateData.archived })
        }]
      }

      const response = await apperClient.updateRecord("task_c", params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} task records: ${JSON.stringify(failedUpdates)}`)
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null
      }

      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating task:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  },

  // Delete task
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

      const response = await apperClient.deleteRecord("task_c", params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} task records: ${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulDeletions.length > 0
      }

      return false
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting task:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return false
    }
  },

  // Archive task
  archive: async (id) => {
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
          archived_c: true
        }]
      }

      const response = await apperClient.updateRecord("task_c", params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to archive ${failedUpdates.length} task records: ${JSON.stringify(failedUpdates)}`)
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null
      }

      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error archiving task:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  },

  // Get archived tasks
  getArchived: async () => {
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
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "assignee_c" } },
          { field: { Name: "people1_c" } },
          { field: { Name: "dueDate_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "completedAt_c" } },
          { field: { Name: "archived_c" } }
        ],
        where: [
          {
            FieldName: "archived_c",
            Operator: "EqualTo",
            Values: [true]
          }
        ],
        orderBy: [
          { fieldName: "createdAt_c", sorttype: "DESC" }
        ]
      }

      const response = await apperClient.fetchRecords("task_c", params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching archived tasks:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return []
    }
  }
}

export default taskService