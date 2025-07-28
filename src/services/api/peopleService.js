import { toast } from "react-toastify"
import mockPeople from "@/services/mockData/people.json"

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const peopleService = {
  // Get all people
  getAll: async () => {
    try {
      await delay(300)
      return [...mockPeople]
    } catch (error) {
      console.error("Error fetching people:", error.message)
      return []
    }
  },

  // Get person by id
  getById: async (id) => {
    try {
      await delay(200)
      const person = mockPeople.find(p => p.Id === parseInt(id))
      return person ? { ...person } : null
    } catch (error) {
      console.error(`Error fetching person with ID ${id}:`, error.message)
      return null
    }
  },

  // Create new person
  create: async (personData) => {
    try {
      await delay(400)
      const newPerson = {
        Id: Date.now(),
        name: personData.name,
        email: personData.email,
        phone: personData.phone || '',
        position: personData.position,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      // Add to mock data for session persistence
      mockPeople.unshift(newPerson)
      
      return { ...newPerson }
    } catch (error) {
      console.error("Error creating person:", error.message)
      return null
    }
  },

  // Update person
  update: async (id, updateData) => {
    try {
      await delay(400)
      const personIndex = mockPeople.findIndex(p => p.Id === parseInt(id))
      
      if (personIndex === -1) {
        throw new Error('Person not found')
      }
      
      const updatedPerson = {
        ...mockPeople[personIndex],
        name: updateData.name,
        email: updateData.email,
        phone: updateData.phone || '',
        position: updateData.position,
        updatedAt: new Date().toISOString()
      }
      
      // Update in mock data
      mockPeople[personIndex] = updatedPerson
      
      return { ...updatedPerson }
    } catch (error) {
      console.error("Error updating person:", error.message)
      return null
    }
  },

  // Delete person
  delete: async (id) => {
    try {
      await delay(300)
      const personIndex = mockPeople.findIndex(p => p.Id === parseInt(id))
      
      if (personIndex === -1) {
        throw new Error('Person not found')
      }
      
      // Remove from mock data
      mockPeople.splice(personIndex, 1)
      
      return true
    } catch (error) {
      console.error("Error deleting person:", error.message)
      return false
    }
  }
}

export default peopleService