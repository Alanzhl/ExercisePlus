import React, {useState} from "react";
import "./App.css";
import { Layout, Input, Image, Button, Space, List } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Search } = Input;


// service framework
export default function App() {
    // sample state value
    const [visitor, setVisitor] = useState("");
    const [samples, setSamples] = useState([]);
    
    // this function is triggered on pressing the search button inside "Searchbar"
    async function onSearch(val) {
        const resp = await fetch("/api/search", create_postREQ({target: val}));    // wait for execution to complete
        const returnVal = await resp.json();    // get result in json format
        if (returnVal["success"] !== 0) {
            setVisitor(returnVal["message"]);         // change the state value accordingly
        }
    }

    // return the layout of the mainpage 
    // there are three self-defined components: Searchbar, DisplayMap and ResultColumn, which are implemented below.
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
                <ResultColumn visitor={visitor} samples={samples} setSamples={setSamples}/>
            </Sider>
        </Layout>
        </>
    );
}


// 1. Component at the header: a sample search bar (only supports generation of a welcome message)
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


// 2. Component that would display the map: only contains a static picture by now
function DisplayMap() {
    return (
        <Image 
            src="/sample-map.png"
            weight={1000}
            height={670}
        />
    );
}


// 3. Component that lists the search results
function ResultColumn(props) {
    // In this sample implementation, we don't have enough data to conduct a search, so this is only 
    // a responsive component that generates a welcome message with the visitor's name collected from 
    // the search bar.
    // This component also contains three buttons and a list to test interactions with the database.

    const welcomeText = props.visitor !== "" ? (
        <h2>Welcome, {props.visitor}!</h2>
    ) : (
        <h2>Please input your name to generate the welcome message!</h2>
    );

    // helper methods used in this component (triggered when clicking the corresponding buttons)
    async function insertSamples() {
        await fetch("/api/insertSamples", create_postREQ());
    }

    async function deleteSamples() {
        await fetch("/api/clearSamples", create_postREQ());
    }

    async function listSamples() {
        const resp = await fetch("/api/listSamples", create_postREQ());
        const result = await resp.json();
        console.log(result["values"]);
        props.setSamples(result["values"]);
    }

    // return value: a combination of sub-components enclosed by <></> (i.e., <div></div>)
    return (
        <>
            {welcomeText}
            <Space direction="vertical">
                <Button type="primary" onClick={insertSamples}>Insert Samples</Button>
                <Button danger onClick={deleteSamples}>Clear Samples</Button>
                <Button onClick={listSamples}>List Samples</Button>
            </Space>
            <List
                bordered
                dataSource={props.samples}
                renderItem={item => (
                    <List.Item>{item["name"] + ": " + item["description"]}</List.Item>
                )}
            />
        </>
    );
}


// helper function: create a post request with this template
function create_postREQ(body=null) {
    var payload = {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        }
    }
    if (body != null) payload["body"] = JSON.stringify(body)

    return payload
}

export {App, create_postREQ};