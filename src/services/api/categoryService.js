import mockCategories from "@/services/mockData/categories.json"

let categories = [...mockCategories]

const categoryService = {
  // Get all categories
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return [...categories]
  },

  // Get category by id
  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 150))
    const category = categories.find(category => category.Id === parseInt(id))
    if (!category) {
      throw new Error("Category not found")
    }
    return { ...category }
  },

  // Create new category
  create: async (categoryData) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const newCategory = {
      Id: Math.max(...categories.map(c => c.Id), 0) + 1,
      ...categoryData,
      taskCount: 0
    }
    
    categories.push(newCategory)
    return { ...newCategory }
  },

  // Update category
  update: async (id, updateData) => {
    await new Promise(resolve => setTimeout(resolve, 250))
    
    const index = categories.findIndex(category => category.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Category not found")
    }
    
    categories[index] = { ...categories[index], ...updateData }
    return { ...categories[index] }
  },

  // Delete category
  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const index = categories.findIndex(category => category.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Category not found")
    }
    
    categories.splice(index, 1)
    return true
  }
}

export default categoryService