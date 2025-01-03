import React, { Fragment } from "react";
import Navbar from './../Navbar/Navbar';
import { Layout } from "antd";
import NavLink from "./../Sidebar/NavLink";
import './pageWrapper.css';
import Protected from "../../Routes/Protected";

const { Content } = Layout;

function PageWrapper({
    children,
    headerProps,
    collapsed = false,
    noNavar = false,
}) {
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Layout>
                {noNavar ? null : <Navbar  {...headerProps} />}

                <Content style={{ margin: '24px 16px 0', overflowY: 'scroll', height: 'calc(100vh - 64px)' }}>
                    <div style={{ padding: 24, minHeight: 360, background: '#fff', overflowY: 'auto' }}>
                        <div className="table-container">
                            {children}
                        </div>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}

export default PageWrapper;