import React, {useState} from "react";
import "./App.css";
import { Layout, AutoComplete, Input, Space, List, Collapse, Button, Divider } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { MapContainer, TileLayer, Marker, Popup, useMap} from "react-leaflet";
import L from 'leaflet';

const { Header, Sider, Content } = Layout;
const { Search } = Input;

const INVOKE_URL = "https://j9fazolf64.execute-api.ap-southeast-1.amazonaws.com/dev/"


// service framework
export default function App() {
    // sample state values
    const [inputVal, setInputVal] = useState("");    // input value
    const [options, setOptions] = useState([]);      // search options according to input value
    const [destination, setDestination] = useState({});
    const [weathers, setWeathers] = useState([]);    // search results: weather, parks, gyms
    const [parks, setParks] = useState([]);
    const [gyms, setGyms] = useState([]);
    
    // this function is triggered on pressing the search button inside "Searchbar"
    async function onSearch(val) {
        if (val !== "") {
            const resp = await fetch(INVOKE_URL + "search", create_postREQ({target: val}));    // wait for execution to complete
            const resp_json = await resp.json();            // get result in json format
            const returnVal = JSON.parse(resp_json.body);

            if (returnVal["success"] !== 0) {
                setInputVal(val);
                setDestination(returnVal["destination"]);
                setWeathers(returnVal["weathers"]);         // change the state value accordingly
                setParks(returnVal["parks"]);
                setGyms(returnVal["gyms"]);
            } else {
                setInputVal(val);
            }
        }
    }

    // get search options according to current input "val"
    async function getSearchOptions(val) {
        if (val !== "") {
            const resp = await fetch(INVOKE_URL + "get-options", create_postREQ({target: val}));    // wait for execution to complete
            const resp_json = await resp.json();            // get result in json format
            // console.log(resp_json);
            const returnVal = JSON.parse(resp_json.body);

            if (returnVal["success"] === 1 && returnVal["results"]["found"] > 0) {
                let renderedOptions = [];
                for (let result of returnVal["results"]["results"]) {
                    let option = {
                        label: (
                            <div className="search-option">
                                <h3>{result["name"].toLowerCase()}</h3>
                                <p>({result["longitude"]}, {result["latitude"]})<br/>{result["address"]}</p>
                            </div>
                        ),
                        value: result["name"].toLowerCase()
                    };
                    renderedOptions.push(option);
                }
                setOptions(renderedOptions);
            } else {
                setOptions([]);
            }
        }
    }

    // return the layout of the mainpage 
    // there are three self-defined components: Searchbar, DisplayMap and ResultColumn, which are implemented below.
    return (
        <>
        <Layout>
            <Layout>
                <Header className="frame-header">
                    <Searchbar 
                        options={options}
                        onSearch={onSearch}
                        getSearchOptions={getSearchOptions}/>
                </Header>
                <Content>
                    <DisplayMap
                        destination={destination}
                        parks={parks}
                        gyms={gyms}/>
                </Content>
            </Layout>
            <Sider width="35%" className="frame-sider">
                <ResultColumn 
                    inputVal={inputVal}
                    destination={destination}
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
        <AutoComplete
            className="search-bar"
            options={props.options}
            onSelect={val => props.onSearch(val)}
            onSearch={val => props.getSearchOptions(val)}
        >
            <Search 
                size="large" 
                allowClear
                placeholder="Enter your workout destination!" 
                prefix={<SearchOutlined className="search-form-icon" />}
                enterButton="Search"
                onSearch={val => props.onSearch(val)} />
        </AutoComplete>
    );
}


// 2. Component that would display the map: only contains a static picture by now
function DisplayMap(props) {
    const greenIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const redIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    // nested component that shows the place of our search result
    function DestPosition() {
        const map = useMap();
        map.flyTo([props.destination.latitude, props.destination.longitude], 13);
        return (
            <Marker 
                position={[props.destination.latitude, props.destination.longitude]} 
                icon={redIcon}>
                    <Popup autoPan={true}><h3>{props.destination.name}</h3></Popup>
            </Marker>
        );
    }
  
    return (
        <MapContainer
            style={{ height: "600px" }}
            center={[1.3, 103.8]}
            zoom={13}
            scrollWheelZoom={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <>
                {(Object.keys(props.destination).length !== 0) ? <DestPosition/> : (null)}
                {props.parks.map(item => 
                    <Marker 
                        position={[item.latitude, item.longitude]} 
                        icon={greenIcon} key={item.id}>
                            <Popup>
                                <h3>{item.name}</h3>
                                <p>{item.description}</p>
                            </Popup>
                    </Marker>
                )}
                {props.gyms.map(item => 
                    <Marker 
                        position={[item.latitude, item.longitude]} 
                        key={item.id}>
                            <Popup>
                                <h3>{item.name}</h3>
                                <p>{item.description}</p>
                            </Popup>
                </Marker>
                )}
            </>      
        </MapContainer>
    );
    //markers.map(marker => <Marker position={marker} ></Marker>)
}


// 3. Component that lists the search results
function ResultColumn(props) {
    // local values / variables can also be used as components
    // contains an empty column / results with 3 lists: weather forecast for nearby areas, parks and gyms
    // (multiple components should be enclosed with <></> (i.e., <div></div>))
    const { Panel } = Collapse;

    const resultContent = props.inputVal !== "" ? (
        <>
            <Button style={{float:"right"}} type="primary" href="https://localhost34.auth.us-east-1.amazoncognito.com/signup?client_id=6hnovsu5fc95omp92ficdvgum9&response_type=code&scope=email+openid&redirect_uri=https://dev.d286e2j1zvdll3.amplifyapp.com/">Register / Login</Button>
            <Divider/>
            <h2 style={{padding:'10px'}}>Search result of "{props.inputVal}":</h2>
            <Collapse defaultActiveKey={['weather_forcast']}>
                <Panel header="Weather Forecast" key="weather_forcast">
                    <List
                        bordered
                        dataSource={props.weathers}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    title={item["area"]}
                                    description={item["forecast"]}
                                />
                            </List.Item>
                        )}
                    />
                </Panel>
                <Panel header="Nearby Parks" key="nearby_parks">
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
                </Panel>
                <Panel header="Nearby Gyms" key="nearby_gyms">
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
                </Panel>
            </Collapse>
        </>
    ) : (
        <>
        <Button style={{float:"right"}} type="primary" href="https://localhost34.auth.us-east-1.amazoncognito.com/signup?client_id=6hnovsu5fc95omp92ficdvgum9&response_type=code&scope=email+openid&redirect_uri=https://dev.d286e2j1zvdll3.amplifyapp.com/">Register / Login</Button>
        <Divider/>
        <h2 style={{padding:'10px'}}>The Result Column is empty.</h2>
        </>
    );

    return (<>
        {resultContent}
    </>);
}


// helper function: create a post request with this template
function create_postREQ(body=null) {
    let myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")

    let payload = {
        method: "POST",
        headers: myHeaders,
        credentials: "omit",
        redirect: "follow"
    }
    if (body != null) payload["body"] = JSON.stringify(body)

    return payload
}

export {App, create_postREQ};
