import { Link, Outlet } from "react-router-dom";
import React, { useContext, useState } from "react";
import { AuthContext } from "@/App";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const authContext = useContext(AuthContext)
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      <div className={cn(
        "fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300",
        sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <div className={cn(
          "fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name="CheckSquare" size={18} className="text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="p-2"
              >
                <ApperIcon name="X" size={16} />
              </Button>
            </div>
          </div>
<nav className="p-6">
            <div className="space-y-2">
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <ApperIcon name="Home" size={18} />
                <span>Dashboard</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 bg-primary-50 text-primary-700 rounded-lg">
                <ApperIcon name="CheckSquare" size={18} />
                <span>Tasks</span>
              </a>
<Link to="/people" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <ApperIcon name="Users" size={18} />
                <span>People</span>
              </Link>
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <ApperIcon name="Archive" size={18} />
                <span>Archive</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <ApperIcon name="Settings" size={18} />
                <span>Settings</span>
              </a>
            </div>
          </nav>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-white border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
          </div>
        </div>
<nav className="p-6">
          <div className="space-y-2">
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <ApperIcon name="Home" size={18} />
              <span>Dashboard</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 bg-primary-50 text-primary-700 rounded-lg">
              <ApperIcon name="CheckSquare" size={18} />
              <span>Tasks</span>
            </a>
<Link to="/people" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <ApperIcon name="Users" size={18} />
              <span>People</span>
            </Link>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <ApperIcon name="Archive" size={18} />
              <span>Archive</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <ApperIcon name="Settings" size={18} />
              <span>Settings</span>
            </a>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2"
              >
                <ApperIcon name="Menu" size={20} />
              </Button>
<div>
                <h2 className="text-2xl font-bold text-gray-900">TaskFlow</h2>
                <p className="text-sm text-gray-600">Manage your work efficiently</p>
              </div>
            </div>
            
<div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="p-2">
                <ApperIcon name="Bell" size={18} />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <ApperIcon name="Search" size={18} />
              </Button>
<Button 
                variant="ghost" 
                size="sm" 
                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  if (authContext?.logout) {
                    authContext.logout();
                  }
                }}
              >
                <ApperIcon name="LogOut" size={18} />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout