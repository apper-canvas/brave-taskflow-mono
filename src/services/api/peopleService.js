import { toast } from "react-toastify";

const peopleService = {
  // Get all people
getAll: async () => {
    try {
      if (!window.ApperSDK) {
        throw new Error('ApperSDK not loaded');
      }
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "firstName_c" } },
          { field: { Name: "lastName_c" } },
          { field: { Name: "email_c" } }, 
          { field: { Name: "phone_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ]
      };

      const response = await apperClient.fetchRecords("people_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database records to match UI expectations
      const transformedData = response.data?.map(record => ({
        Id: record.Id,
        name: record.Name || `${record.firstName_c || ''} ${record.lastName_c || ''}`.trim(),
        firstName: record.firstName_c || '',
        lastName: record.lastName_c || '',
        email: record.email_c || '',
        phone: record.phone_c || '',
        position: record.Name || 'Team Member', // Using Name field as position for compatibility
        createdAt: record.CreatedOn,
        updatedAt: record.ModifiedOn
      })) || [];

return transformedData;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching people:", error?.response?.data?.message);
      } else {
        console.error("Error fetching people:", error.message);
      }
      return [];
    }
  },

  // Get person by id
getById: async (id) => {
    try {
      if (!window.ApperSDK) {
        throw new Error('ApperSDK not loaded');
      }
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "firstName_c" } },
          { field: { Name: "lastName_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ]
      };

const response = await apperClient.getRecordById("people_c", parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (!response.data) {
        return null;
      }

      // Transform database record to match UI expectations
      const record = response.data;
      return {
        Id: record.Id,
        name: record.Name || `${record.firstName_c || ''} ${record.lastName_c || ''}`.trim(),
        firstName: record.firstName_c || '',
        lastName: record.lastName_c || '',
        email: record.email_c || '',
        phone: record.phone_c || '',
        position: record.Name || 'Team Member',
        createdAt: record.CreatedOn,
        updatedAt: record.ModifiedOn
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching person with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching person with ID ${id}:`, error.message);
      }
      return null;
    }
  },

  // Create new person
create: async (personData) => {
    try {
      if (!window.ApperSDK) {
        throw new Error('ApperSDK not loaded');
      }
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Split name into first and last name
      const nameParts = personData.name ? personData.name.split(' ') : [''];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Only include Updateable fields
      const params = {
        records: [{
          Name: personData.name || '',
          firstName_c: firstName,
          lastName_c: lastName,
          email_c: personData.email || '',
          phone_c: personData.phone || ''
        }]
      };

      const response = await apperClient.createRecord("people_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create people ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const newRecord = successfulRecords[0].data;
          return {
            Id: newRecord.Id,
            name: newRecord.Name || `${newRecord.firstName_c || ''} ${newRecord.lastName_c || ''}`.trim(),
            firstName: newRecord.firstName_c || '',
            lastName: newRecord.lastName_c || '',
            email: newRecord.email_c || '',
            phone: newRecord.phone_c || '',
            position: newRecord.Name || 'Team Member',
            createdAt: newRecord.CreatedOn,
            updatedAt: newRecord.ModifiedOn
          };
        }
      }
      
return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating person in People service:", error?.response?.data?.message);
      } else {
        console.error("Error creating person:", error.message);
      }
      return null;
    }
  },

  // Update person
update: async (id, updateData) => {
    try {
      if (!window.ApperSDK) {
        throw new Error('ApperSDK not loaded');
      }
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Split name into first and last name
      const nameParts = updateData.name ? updateData.name.split(' ') : [''];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Only include Updateable fields plus Id
      const params = {
        records: [{
          Id: parseInt(id),
          Name: updateData.name || '',
          firstName_c: firstName,
          lastName_c: lastName,
          email_c: updateData.email || '',
          phone_c: updateData.phone || ''
        }]
      };

      const response = await apperClient.updateRecord("people_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update people ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedRecord = successfulUpdates[0].data;
          return {
            Id: updatedRecord.Id,
            name: updatedRecord.Name || `${updatedRecord.firstName_c || ''} ${updatedRecord.lastName_c || ''}`.trim(),
            firstName: updatedRecord.firstName_c || '',
            lastName: updatedRecord.lastName_c || '',
            email: updatedRecord.email_c || '',
            phone: updatedRecord.phone_c || '',
            position: updatedRecord.Name || 'Team Member',
            createdAt: updatedRecord.CreatedOn,
            updatedAt: updatedRecord.ModifiedOn
          };
        }
      }
      
return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating person in People service:", error?.response?.data?.message);
      } else {
        console.error("Error updating person:", error.message);
      }
      return null;
    }
  },

// Delete person
  delete: async (id) => {
    try {
      if (!window.ApperSDK) {
        throw new Error('ApperSDK not loaded');
      }
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord("people_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete People ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting person:", error?.response?.data?.message);
      } else {
        console.error("Error deleting person:", error.message);
      }
      return false;
    }
}
}

export default peopleService;