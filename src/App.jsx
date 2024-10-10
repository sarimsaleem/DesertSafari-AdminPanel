import Categories from "./Admin/Product/Categories/Categories"
import Product from "./Admin/Product/Product"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./app.css"

function App() {

  return (
    <>    
    {/* <p>sarim</p> */}
      <Router>
        <Routes>
          <Route path="/" element={<Product />} />
          <Route path="/categories" element={<Categories />} />
        </Routes>
      </Router >
    </>
  )
}

export default App
