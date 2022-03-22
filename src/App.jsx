import React, {useState} from "react";
import "./App.css";
import { Layout, Input, Image } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Search } = Input;


// service framework
export default function App() {
    // sample state value
    const [visitor, setVisitor] = useState("");
    
    // this function is triggered on pressing the search button inside "Searchbar"
    async function onSearch(val) {
        const resp = await fetch("/api/search", create_postREQ({target: val}));    // wait for execution to complete
        const returnVal = await resp.json();    // get result in json format
        if (returnVal["success"] !== 0) {
            setVisitor(returnVal["message"]);         // change the state value accordingly
        }
    }

    // return the layout of the mainpage
    return (
        <>
        <Layout>
            <Layout>
                <Header className="frame-header">
                    <Searchbar onSearch={onSearch}/>
                </Header>
                <Content>
                    <DisplayMap/>
                </Content>
            </Layout>
            <Sider width="30%" className="frame-sider">
                <ResultColumn visitor={visitor}/>
            </Sider>
        </Layout>
        </>
    );
}


// Component at the header
function Searchbar(props) {
    return (
        <Search
            placeholder="Enter your visitor name to generate a welcome message"
            allowClear
            enterButton="Search"
            size="large"
            prefix={<SearchOutlined className="search-form-icon" />}
            onSearch={val => props.onSearch(val)}
        />
    );
}


// Component that would display the map
function DisplayMap() {
    return (
        <Image 
            src="/sample-map.png"
            weight={900}
            height={600}
        />
    );
}


// Component that lists the search results
function ResultColumn(props) {
    const welcomeText = props.visitor !== "" ? (
        <h2>Welcome, {props.visitor}!</h2>
    ) : (
        <h2>Please input your name to generate the welcome message!</h2>
    );

    return (
        <>{welcomeText}</>
    );
}


// helper function: create a post request with this template
function create_postREQ(body) {
    return {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    }
}

export {App, create_postREQ};