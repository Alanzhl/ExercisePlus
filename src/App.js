import React, { useState } from "react";
import "./App.css";
import { Layout, AutoComplete, Input, Space, List, Collapse } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from 'leaflet';
const {
  Header,
  Sider,
  Content
} = Layout;
const {
  Search
} = Input;
const INVOKE_URL = "https://j9fazolf64.execute-api.ap-southeast-1.amazonaws.com/dev/"; // service framework

export default function App() {
  // sample state values
  const [inputVal, setInputVal] = useState(""); // input value

  const [options, setOptions] = useState([]); // search options according to input value

  const [destination, setDestination] = useState({});
  const [weathers, setWeathers] = useState([]); // search results: weather, parks, gyms

  const [parks, setParks] = useState([]);
  const [gyms, setGyms] = useState([]); // this function is triggered on pressing the search button inside "Searchbar"

  async function onSearch(val) {
    if (val !== "") {
      const resp = await fetch(INVOKE_URL + "search", create_postREQ({
        target: val
      })); // wait for execution to complete

      const resp_json = await resp.json(); // get result in json format

      const returnVal = JSON.parse(resp_json.body);

      if (returnVal["success"] !== 0) {
        setInputVal(val);
        setDestination(returnVal["destination"]);
        setWeathers(returnVal["weathers"]); // change the state value accordingly

        setParks(returnVal["parks"]);
        setGyms(returnVal["gyms"]);
      } else {
        setInputVal(val);
      }
    }
  } // get search options according to current input "val"


  async function getSearchOptions(val) {
    if (val !== "") {
      const resp = await fetch(INVOKE_URL + "get-options", create_postREQ({
        target: val
      })); // wait for execution to complete

      const resp_json = await resp.json(); // get result in json format
      // console.log(resp_json);

      const returnVal = JSON.parse(resp_json.body);

      if (returnVal["success"] === 1 && returnVal["results"]["found"] > 0) {
        let renderedOptions = [];

        for (let result of returnVal["results"]["results"]) {
          let option = {
            label: /*#__PURE__*/React.createElement("div", {
              className: "search-option"
            }, /*#__PURE__*/React.createElement("h3", null, result["name"].toLowerCase()), /*#__PURE__*/React.createElement("p", null, "(", result["longitude"], ", ", result["latitude"], ")", /*#__PURE__*/React.createElement("br", null), result["address"])),
            value: result["name"].toLowerCase()
          };
          renderedOptions.push(option);
        }

        setOptions(renderedOptions);
      } else {
        setOptions([]);
      }
    }
  } // return the layout of the mainpage 
  // there are three self-defined components: Searchbar, DisplayMap and ResultColumn, which are implemented below.


  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Layout, null, /*#__PURE__*/React.createElement(Layout, null, /*#__PURE__*/React.createElement(Header, {
    className: "frame-header"
  }, /*#__PURE__*/React.createElement(Searchbar, {
    options: options,
    onSearch: onSearch,
    getSearchOptions: getSearchOptions
  })), /*#__PURE__*/React.createElement(Content, null, /*#__PURE__*/React.createElement(DisplayMap, {
    destination: destination,
    parks: parks,
    gyms: gyms
  }))), /*#__PURE__*/React.createElement(Sider, {
    width: "35%",
    className: "frame-sider"
  }, /*#__PURE__*/React.createElement(ResultColumn, {
    inputVal: inputVal,
    destination: destination,
    weathers: weathers,
    parks: parks,
    gyms: gyms
  }))));
} // 1. Component at the header: a sample search bar (only returns fixed contents for testing purpose)

function Searchbar(props) {
  return /*#__PURE__*/React.createElement(AutoComplete, {
    className: "search-bar",
    options: props.options,
    onSelect: val => props.onSearch(val),
    onSearch: val => props.getSearchOptions(val)
  }, /*#__PURE__*/React.createElement(Search, {
    size: "large",
    allowClear: true,
    placeholder: "Enter your workout destination!",
    prefix: /*#__PURE__*/React.createElement(SearchOutlined, {
      className: "search-form-icon"
    }),
    enterButton: "Search",
    onSearch: val => props.onSearch(val)
  }));
} // 2. Component that would display the map: only contains a static picture by now


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
  }); // nested component that shows the place of our search result

  function DestPosition() {
    const map = useMap();
    map.flyTo([props.destination.latitude, props.destination.longitude], 13);
    return /*#__PURE__*/React.createElement(Marker, {
      position: [props.destination.latitude, props.destination.longitude],
      icon: redIcon
    }, /*#__PURE__*/React.createElement(Popup, {
      autoPan: true
    }, /*#__PURE__*/React.createElement("h3", null, props.destination.name)));
  }

  return /*#__PURE__*/React.createElement(MapContainer, {
    style: {
      height: "600px"
    },
    center: [1.3, 103.8],
    zoom: 13,
    scrollWheelZoom: true
  }, /*#__PURE__*/React.createElement(TileLayer, {
    attribution: "\xA9 <a href=\"https://osm.org/copyright\">OpenStreetMap</a> contributors",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  }), /*#__PURE__*/React.createElement(React.Fragment, null, Object.keys(props.destination).length !== 0 ? /*#__PURE__*/React.createElement(DestPosition, null) : null, props.parks.map(item => /*#__PURE__*/React.createElement(Marker, {
    position: [item.latitude, item.longitude],
    icon: greenIcon,
    key: item.id
  }, /*#__PURE__*/React.createElement(Popup, null, /*#__PURE__*/React.createElement("h3", null, item.name), /*#__PURE__*/React.createElement("p", null, item.description)))), props.gyms.map(item => /*#__PURE__*/React.createElement(Marker, {
    position: [item.latitude, item.longitude],
    key: item.id
  }, /*#__PURE__*/React.createElement(Popup, null, /*#__PURE__*/React.createElement("h3", null, item.name), /*#__PURE__*/React.createElement("p", null, item.description)))))); //markers.map(marker => <Marker position={marker} ></Marker>)
} // 3. Component that lists the search results


function ResultColumn(props) {
  // local values / variables can also be used as components
  // contains an empty column / results with 3 lists: weather forecast for nearby areas, parks and gyms
  // (multiple components should be enclosed with <></> (i.e., <div></div>))
  const {
    Panel
  } = Collapse;
  const resultContent = props.inputVal !== "" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", null, "Search result of \"", props.inputVal, "\":"), /*#__PURE__*/React.createElement(Collapse, {
    defaultActiveKey: ['weather_forcast']
  }, /*#__PURE__*/React.createElement(Panel, {
    header: "Weather Forecast",
    key: "weather_forcast"
  }, /*#__PURE__*/React.createElement(List, {
    bordered: true,
    dataSource: props.weathers,
    renderItem: item => /*#__PURE__*/React.createElement(List.Item, null, /*#__PURE__*/React.createElement(List.Item.Meta, {
      title: item["area"],
      description: item["forecast"]
    }))
  })), /*#__PURE__*/React.createElement(Panel, {
    header: "Nearby Parks",
    key: "nearby_parks"
  }, /*#__PURE__*/React.createElement(List, {
    bordered: true,
    dataSource: props.parks,
    renderItem: item => /*#__PURE__*/React.createElement(List.Item, null, /*#__PURE__*/React.createElement(List.Item.Meta, {
      title: item["name"],
      description: /*#__PURE__*/React.createElement(Space, {
        direction: "vertical"
      }, /*#__PURE__*/React.createElement("p", null, "(", item["longitude"], ", ", item["latitude"], ")", /*#__PURE__*/React.createElement("br", null), item.description))
    }))
  })), /*#__PURE__*/React.createElement(Panel, {
    header: "Nearby Gyms",
    key: "nearby_gyms"
  }, /*#__PURE__*/React.createElement(List, {
    bordered: true,
    dataSource: props.gyms,
    renderItem: item => /*#__PURE__*/React.createElement(List.Item, null, /*#__PURE__*/React.createElement(List.Item.Meta, {
      title: item["name"],
      description: /*#__PURE__*/React.createElement(Space, {
        direction: "vertical"
      }, /*#__PURE__*/React.createElement("p", null, "(", item["longitude"], ", ", item["latitude"], ")", /*#__PURE__*/React.createElement("br", null), item.description))
    }))
  })))) : /*#__PURE__*/React.createElement("h2", null, "The Result Column is empty.");
  return /*#__PURE__*/React.createElement(React.Fragment, null, resultContent);
} // helper function: create a post request with this template


function create_postREQ(body = null) {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  let payload = {
    method: "POST",
    headers: myHeaders,
    credentials: "omit",
    redirect: "follow"
  };
  if (body != null) payload["body"] = JSON.stringify(body);
  return payload;
}

export { App, create_postREQ };