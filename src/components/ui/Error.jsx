import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <ApperIcon name="AlertTriangle" size={32} className="text-red-500" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-red-800">
              Oops! Something went wrong
            </h3>
            <p className="text-red-600 text-sm">
              {message}
            </p>
          </div>
          
          {onRetry && (
            <button
              onClick={onRetry}
              className="btn-primary flex items-center gap-2 mt-4"
            >
              <ApperIcon name="RefreshCw" size={16} />
              Try Again
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default Error