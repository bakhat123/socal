"use client"

import { X } from "lucide-react"

interface UserModalProps {
  showUserModal: boolean
  setShowUserModal: (show: boolean) => void
  editingUser: string | null
  setEditingUser: (id: string | null) => void
  userForm: any
  setUserForm: (form: any) => void
  createUser: (data: any) => void
  updateUser: (data: any) => void
}

export default function UserModal({
  showUserModal,
  setShowUserModal,
  editingUser,
  setEditingUser,
  userForm,
  setUserForm,
  createUser,
  updateUser
}: UserModalProps) {
  if (!showUserModal) return null

  return (
    <div className="modal show" onClick={() => setShowUserModal(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{editingUser ? 'Edit User' : 'Add User'}</h2>
          <button onClick={() => {
            setShowUserModal(false)
            setEditingUser(null)
            setUserForm({ _id: '', email: '', password: '', role: '', status: '' })
            console.log('🔒 Modal closed, form reset')
          }} className="close-btn">
            <X size={20} />
          </button>
        </div>
                 <div className="modal-body">
           <form className="form" id="userForm">
             <div className="form-grid">
               <div className="form-group">
                 <label className="form-label">
                   Email <span className="required">*</span>
                 </label>
                 <input 
                   type="email" 
                   className="form-input" 
                   placeholder="user@example.com"
                   value={userForm.email}
                   onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                   required
                 />
               </div>
               <div className="form-group">
                 <label className="form-label">
                   Password <span className="required">*</span>
                 </label>
                 <input 
                   type="password" 
                   className="form-input" 
                   placeholder="Password"
                   value={userForm.password}
                   onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                   required
                 />
               </div>
               <div className="form-group">
                 <label className="form-label">
                   Role <span className="required">*</span>
                 </label>
                 <select 
                   className="form-select"
                   value={userForm.role}
                   onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                   required
                 >
                   <option value="">Select Role</option>
                   <option value="Admin">Admin</option>
                   <option value="Editor">Editor</option>
                   <option value="User">User</option>
                 </select>
               </div>
               <div className="form-group">
                 <label className="form-label">Status</label>
                 <select 
                   className="form-select"
                   value={userForm.status}
                   onChange={(e) => setUserForm({...userForm, status: e.target.value})}
                 >
                   <option value="">Select Status</option>
                   <option value="Active">Active</option>
                   <option value="Inactive">Inactive</option>
                 </select>
               </div>
             </div>
           </form>
         </div>
         <div className="form-actions">
           <button type="button" onClick={() => {
             setShowUserModal(false)
             setEditingUser(null)
             setUserForm({ _id: '', email: '', password: '', role: '', status: '' })
             console.log('🔒 Cancel clicked, form reset')
           }} className="btn btn-secondary">Cancel</button>
           <button 
             type="button" 
             onClick={() => {
               const form = document.getElementById('userForm') as HTMLFormElement
               if (form && form.checkValidity()) {
                 if (editingUser) {
                   updateUser(userForm)
                 } else {
                   createUser(userForm)
                 }
               } else {
                 form?.reportValidity()
               }
             }} 
             className="btn btn-primary"
           >
             {editingUser ? 'Update User' : 'Save User'}
           </button>
         </div>
      </div>
    </div>
  )
}
