import React from 'react'
import { Route, Router, Routes } from 'react-router-dom'
import Login from '../Admin/Login/Login'

function Auth() {
  return (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Login />} />
        </Routes>
  )
}

export default Auth
