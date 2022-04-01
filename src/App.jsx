import React, {useState} from "react";
import "./App.css";
import { Layout, Input, Image, Space, List, Divider } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Search } = Input;

const INVOKE_URL = "https://e5mm4kas75.execute-api.ap-southeast-1.amazonaws.com/dev/"


// service framework
export default function App() {
    // sample state values
    const [inputVal, setInputVal] = useState("");
    const [weathers, setWeathers] = useState([]);
    const [parks, setParks] = useState([]);
    const [gyms, setGyms] = useState([]);
    
    // this function is triggered on pressing the search button inside "Searchbar"
    async function onSearch(val) {
        const resp = await fetch(INVOKE_URL, create_postREQ({target: val}));    // wait for execution to complete
        const returnVal = await resp.json();            // get result in json format
        // if (returnVal["success"] !== 0) {
        //     setInputVal(val);
        //     setWeathers(returnVal["weathers"]);         // change the state value accordingly
        //     setParks(returnVal["parks"]);
        //     setGyms(returnVal["gyms"]);
        // } else {
        //     setInputVal(val);
        // }
        setInputVal(val);
        setWeathers(returnVal.body);
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
                <ResultColumn 
                    inputVal={inputVal}
                    weathers={weathers}
                    parks={parks}
                    gyms={gyms}
                />
            </Sider>
        </Layout>
        </>
    );
}


// 1. Component at the header: a sample search bar (only returns fixed contents for testing purpose)
function Searchbar(props) {
    return (
        <Search
            placeholder="Enter your workout destination!"
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
    // a responsive component displaying fixed contents including a list of weather, parks and gyms

    // local values / variables can also be used as components
    // contains an empty column / results with 3 lists: weather forecast for nearby areas, parks and gyms
    // (multiple components should be enclosed with <></> (i.e., <div></div>))
    const resultContent = props.inputVal !== "" ? (
        <>
            <h2>Search result of "{props.inputVal}":</h2>
            <Divider>Weather Forecast</Divider>
            <List
                bordered
                dataSource={props.weathers}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            title={item["name"]}
                            description={item["weather"]}
                        />
                    </List.Item>
                )}
            />
            <Divider>Nearby Parks</Divider>
            <List
                bordered
                dataSource={props.parks}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            title={item["name"]}
                            description={<Space direction="vertical">
                                <p>({item["longitude"]}, {item["latitude"]})<br/>
                                    {item.description}</p>
                            </Space>}
                        />
                    </List.Item>
                )}
            />
            <Divider>Nearby Gyms</Divider>
            <List
                bordered
                dataSource={props.gyms}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            title={item["name"]}
                            description={<Space direction="vertical">
                                <p>({item["longitude"]}, {item["latitude"]})<br/>
                                    {item.description}</p>
                            </Space>}
                        />
                    </List.Item>
                )}
            />
        </>
    ) : (
        <h2>The Result Column is empty.</h2>
    );

    return (<>
        {resultContent}
    </>);
}


// helper function: create a post request with this template
function create_postREQ(body=null) {
    let payload = {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow"
    }
    if (body != null) payload["body"] = JSON.stringify(body)

    return payload
}

export {App, create_postREQ};