import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'

const PeopleList = ({ people, loading, onEdit, onDelete, onCreatePerson }) => {
  const [searchTerm, setSearchTerm] = useState('')

  // Filter people based on search term
  const filteredPeople = people.filter(person =>
    person.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.position?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (person) => {
    onEdit(person)
  }

  const handleDelete = (personId) => {
    onDelete(personId)
  }

  const emptyProps = searchTerm ? {
    title: "No people found",
    description: `No people match "${searchTerm}". Try adjusting your search terms.`,
    icon: "Search"
  } : {
    title: "No people yet",
    description: "Get started by adding your first person to the system.",
    icon: "Users"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">People</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your team members and contacts
          </p>
        </div>
        <Button onClick={onCreatePerson} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={16} />
          Add Person
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-md">
          <Input
            type="text"
            placeholder="Search people..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            icon={<ApperIcon name="Search" size={16} />}
          />
        </div>
        <div className="text-sm text-gray-500">
          {filteredPeople.length} {filteredPeople.length === 1 ? 'person' : 'people'}
        </div>
      </div>

      {/* People List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredPeople.length === 0 ? (
            <Empty {...emptyProps} />
          ) : (
            filteredPeople.map((person) => (
              <motion.div
                key={person.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {person.name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{person.name}</h3>
                      <p className="text-sm text-gray-600">{person.position}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <ApperIcon name="Mail" size={14} />
                          {person.email}
                        </span>
                        {person.phone && (
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <ApperIcon name="Phone" size={14} />
                            {person.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEdit(person)}
                      className="flex items-center gap-1"
                    >
                      <ApperIcon name="Edit" size={14} />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(person.Id)}
                      className="flex items-center gap-1"
                    >
                      <ApperIcon name="Trash2" size={14} />
                      Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default PeopleList