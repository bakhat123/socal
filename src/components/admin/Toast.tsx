"use client"

import { useEffect, useState } from "react"
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react"

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  type: ToastType
  message: string
  onClose: () => void
  duration?: number
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-gradient-to-r from-green-500 to-emerald-600',
    borderColor: 'border-green-400',
    textColor: 'text-white',
    iconColor: 'text-green-100'
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-gradient-to-r from-red-500 to-pink-600',
    borderColor: 'border-red-400',
    textColor: 'text-white',
    iconColor: 'text-red-100'
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-gradient-to-r from-yellow-500 to-orange-600',
    borderColor: 'border-yellow-400',
    textColor: 'text-white',
    iconColor: 'text-yellow-100'
  },
  info: {
    icon: Info,
    bgColor: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    borderColor: 'border-blue-400',
    textColor: 'text-white',
    iconColor: 'text-blue-100'
  }
}

export default function Toast({ type, message, onClose, duration = 4000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const config = toastConfig[type]
  const Icon = config.icon

  useEffect(() => {
    setIsVisible(true)
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for animation to complete
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div className={`fixed top-4 right-4 z-[9999] transform transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`${config.bgColor} ${config.borderColor} border-l-4 rounded-lg shadow-2xl p-4 min-w-80 max-w-md backdrop-blur-sm`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon className={`w-6 h-6 ${config.iconColor}`} />
            <div className="flex-1">
              <p className={`${config.textColor} font-medium text-sm`}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </p>
              <p className={`${config.textColor} text-sm mt-1`}>
                {message}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(onClose, 300)
            }}
            className={`${config.textColor} hover:bg-white/20 rounded-full p-1 transition-colors`}
          >
            <X size={16} />
          </button>
        </div>
        <div className={`absolute bottom-0 left-0 h-1 ${config.borderColor} bg-white/30 rounded-b-lg transition-all duration-300`} 
             style={{ width: isVisible ? '100%' : '0%' }} />
      </div>
    </div>
  )
}

// Toast Container to manage multiple toasts
interface ToastContainerProps {
  toasts: Array<{
    id: string
    type: ToastType
    message: string
  }>
  removeToast: (id: string) => void
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}
