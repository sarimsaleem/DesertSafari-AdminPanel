import Categories from "./Admin/Product/Categories/Categories"
import Product from "./Admin/Product/Product"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./app.css"
import Login from "./Admin/Login/Login"
import Signup from "./Admin/Login/Signup/Signup"

function App() {

  return (
    <>    
    {/* <p>sarim</p> */}
      <Router>
        <Routes>
          <Route path="/product" element={<Product />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/" element={<Login/>} />
          {/* <Route path="/" element={<Signup/>} /> */}
        </Routes>
      </Router >
    </>
  )
}

export default App
