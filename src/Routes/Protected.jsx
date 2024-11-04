import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Product from '../Admin/Product/Product'
import Categories from '../Admin/Product/Categories/Categories'
import FAQs from '../Admin/Product/FAQs/FAQs'
import Order from '../Admin/Product/Order/Order'

function Protected() {
    return (
            <Routes>
                <Route path="/product"  element={<Product />}  />
                <Route path="/categories"  element={<Categories />} />
                <Route path="/faqs" element={<FAQs />}  />
                <Route path="/orders"  element={<Order />}  />
            </Routes>
    )
}

export default Protected