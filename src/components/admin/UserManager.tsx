"use client"

import { Plus, Edit2, Trash2, User, Calendar } from "lucide-react"
import { User as UserType } from "@/types"

interface UserManagerProps {
  users: UserType[]
  setShowUserModal: (show: boolean) => void
  setEditingUser: (id: string | null) => void
  setUserForm: (form: any) => void
  deleteUser: (id: string) => void
  handleAddUser: () => void
}

export default function UserManager({ 
  users, 
  setShowUserModal, 
  setEditingUser, 
  setUserForm, 
  deleteUser,
  handleAddUser
}: UserManagerProps) {
  return (
    <div className="content-section">
      <div className="section-header">
        <div className="section-info">
          <div className="count-badge blue">
            <span>Total Users: </span>
            <span>{users.length}</span>
          </div>
        </div>
        <button onClick={handleAddUser} className="add-btn blue">
          <Plus size={20} />
          <span>Add User</span>
        </button>
      </div>

             <div className="content-grid">
         {users.map((user) => (
           <div key={user._id || user.id || Math.random()} className="card">
            <div className="user-card-content">
              <div className="user-info">
                <div className="user-avatar">
                  <User size={24} />
                </div>
                <div className="user-details">
                  <h3>{user.email}</h3>
                  <div className="user-meta">
                    <span>
                      <Calendar size={16} />
                      Created: {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                    <span>Role: {user.role || 'User'}</span>
                    <span className="status-badge status-active">{user.status || 'active'}</span>
                  </div>
                </div>
              </div>
              <div className="card-actions">
                                 <button 
                   className="action-btn edit"
                   onClick={() => {
                     const userId = user._id || user.id || ''
                     setEditingUser(userId)
                     setUserForm({
                       _id: userId,
                       email: user.email,
                       password: '',
                       role: user.role || 'User',
                       status: user.status || 'Active'
                     })
                     setShowUserModal(true)
                   }}
                 >
                  <Edit2 size={16} />
                </button>
                                 <button className="action-btn delete" onClick={() => {
                   const userId = user._id || user.id || ''
                   if (userId) {
                     deleteUser(userId)
                   }
                 }}>
                   <Trash2 size={16} />
                 </button>
              </div>
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <div className="card">
            <div className="user-card-content">
              <div className="user-info">
                <div className="user-details">
                  <h3>No users found</h3>
                  <p>Create your first user to get started</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
