import React from 'react'
import { Route, Router, Routes } from 'react-router-dom'
import Login from '../Admin/Login/Login'
import Signup from '../Admin/Login/Signup/Signup'

function Auth() {
  return (
        <Routes>
          <Route path="/" element={<Login />} />
          {/* <Route path="/" element={<Signup />} /> */}
          <Route path="*" element={<Login />} />
        </Routes>
  )
}

export default Auth
