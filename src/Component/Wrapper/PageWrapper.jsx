import React, { Fragment } from "react";
import Navbar from './../Navbar/Navbar';
import { Layout } from "antd";
import './pageWrapper.css';

const { Content } = Layout;

function PageWrapper({
    children,
    headerProps,
    collapsed = false,
    noNavar = false,
}) {
    return (
        <Layout style={{ height: '100%' }}>
            <Layout style={{ height: '100%', overflow: 'scroll' }}>
                {noNavar ? null : <Navbar  {...headerProps} />}

                <Content style={{ padding: '0px 16px 0', overflowY: 'scroll', height: '100%' }}>
                    {/* <div style={{ padding: 24, minHeight: 360, background: '#fff', overflowY: 'auto' }}> */}
                    {/* <div className="table-container"> */}
                    {children}
                    {/* </div> */}
                    {/* </div> */}
                </Content>
            </Layout>
        </Layout>
    );
}

export default PageWrapper;