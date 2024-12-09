import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Product from '../Admin/Product/Product'
import Categories from '../Admin/Product/Categories/Categories'
import FAQs from '../Admin/Product/FAQs/FAQs'
import Order from '../Admin/Product/Order/Order'
import Queries from '../Admin/Product/Queries/Queries'
// import PageWrapper from '../Component/Wrapper/PageWrapper'
import Blog from '../Admin/Product/Blog/Blog'

function Protected() {
    return (
        // <PageWrapper>
            <Routes>
                <Route path="/"  element={<Product />}  />
                <Route path="*"  element={<Product />}  />
                <Route path="/categories"  element={<Categories />} />
                <Route path="/faqs" element={<FAQs />}  />
                <Route path="/orders"  element={<Order />}  />
                <Route path="/queries"  element={<Queries />}  />
                <Route path="/blogs"  element={<Blog />}  />
            </Routes>
        // </PageWrapper> 
    )
}

export default Protected
