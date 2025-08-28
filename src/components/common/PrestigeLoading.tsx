'use client'
import React from 'react'
import '@/styles/animations.css'
import '@/styles/Loading.css'

interface LoadingProps {
  title?: string;
}

const Loading = ({ 
  title = 'SOCAL PRIME HOMES'
}: LoadingProps) => {
  return (
    <div className="loading-screen">
      <div className="loading-logo">{title}</div>
      <div className="loading-bar">
        <div className="loading-progress"></div>
      </div>
    </div>
  )
}

export default Loading
