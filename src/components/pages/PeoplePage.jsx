import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import PeopleList from "@/components/organisms/PeopleList"
import PeopleFormModal from "@/components/organisms/PeopleFormModal"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import peopleService from "@/services/api/peopleService"

const PeoplePage = () => {
  const [people, setPeople] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPerson, setEditingPerson] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)

  // Load initial data
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const peopleData = await peopleService.getAll()
      
      // Handle empty or non-existent data
      if (!peopleData || peopleData.length === 0) {
        setPeople([])
      } else {
        setPeople(peopleData)
      }
    } catch (err) {
      setError("Failed to load people")
      console.error("Load data error:", err)
      setPeople([])
    } finally {
      setLoading(false)
    }
  }

  // Handle person creation
  const handleCreatePerson = async (personData) => {
    try {
      setModalLoading(true)
      const newPerson = await peopleService.create(personData)
      setPeople(prev => [newPerson, ...prev])
      setIsModalOpen(false)
      setEditingPerson(null)
      toast.success("Person added successfully!")
    } catch (err) {
      toast.error("Failed to add person")
      console.error("Create person error:", err)
    } finally {
      setModalLoading(false)
    }
  }

  // Handle person editing
  const handleEditPerson = async (personData) => {
    try {
      setModalLoading(true)
      const updatedPerson = await peopleService.update(editingPerson.Id, personData)
      setPeople(prev => prev.map(person => 
        person.Id === editingPerson.Id ? updatedPerson : person
      ))
      setIsModalOpen(false)
      setEditingPerson(null)
      toast.success("Person updated successfully!")
    } catch (err) {
      toast.error("Failed to update person")
      console.error("Update person error:", err)
    } finally {
      setModalLoading(false)
    }
  }

  // Handle person deletion
  const handleDeletePerson = async (personId) => {
    if (!window.confirm("Are you sure you want to delete this person?")) return
    
    try {
      await peopleService.delete(personId)
      setPeople(prev => prev.filter(person => person.Id !== personId))
      toast.success("Person deleted successfully!")
    } catch (err) {
      toast.error("Failed to delete person")
      console.error("Delete person error:", err)
    }
  }

  // Handle form submission
  const handleFormSubmit = (personData) => {
    if (editingPerson) {
      handleEditPerson(personData)
    } else {
      handleCreatePerson(personData)
    }
  }

  // Open create modal
  const openCreateModal = () => {
    setEditingPerson(null)
    setIsModalOpen(true)
  }

  // Open edit modal
  const openEditModal = (person) => {
    setEditingPerson(person)
    setIsModalOpen(true)
  }

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false)
    setEditingPerson(null)
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm p-6 overflow-y-auto"
    >
      <PeopleList
        people={people}
        loading={loading}
        onEdit={openEditModal}
        onDelete={handleDeletePerson}
        onCreatePerson={openCreateModal}
      />

      {/* People Form Modal */}
      <PeopleFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        person={editingPerson}
        loading={modalLoading}
      />
    </motion.div>
  )
}

export default PeoplePage