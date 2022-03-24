import React, { useState } from "react";
import "./App.css";
import { Layout, Input, Image, Space, List, Divider } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
const {
  Header,
  Sider,
  Content
} = Layout;
const {
  Search
} = Input; // service framework

export default function App() {
  // sample state values
  const [inputVal, setInputVal] = useState("");
  const [weathers, setWeathers] = useState([]);
  const [parks, setParks] = useState([]);
  const [gyms, setGyms] = useState([]); // this function is triggered on pressing the search button inside "Searchbar"

  async function onSearch(val) {
    const resp = await fetch("/api/search", create_postREQ({
      target: val
    })); // wait for execution to complete

    const returnVal = await resp.json(); // get result in json format

    if (returnVal["success"] !== 0) {
      setInputVal(val);
      setWeathers(returnVal["weathers"]); // change the state value accordingly

      setParks(returnVal["parks"]);
      setGyms(returnVal["gyms"]);
    } else {
      setInputVal(val);
    }
  } // return the layout of the mainpage 
  // there are three self-defined components: Searchbar, DisplayMap and ResultColumn, which are implemented below.


  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Layout, null, /*#__PURE__*/React.createElement(Layout, null, /*#__PURE__*/React.createElement(Header, {
    className: "frame-header"
  }, /*#__PURE__*/React.createElement(Searchbar, {
    onSearch: onSearch
  })), /*#__PURE__*/React.createElement(Content, null, /*#__PURE__*/React.createElement(DisplayMap, null))), /*#__PURE__*/React.createElement(Sider, {
    width: "30%",
    className: "frame-sider"
  }, /*#__PURE__*/React.createElement(ResultColumn, {
    inputVal: inputVal,
    weathers: weathers,
    parks: parks,
    gyms: gyms
  }))));
} // 1. Component at the header: a sample search bar (only returns fixed contents for testing purpose)

function Searchbar(props) {
  return /*#__PURE__*/React.createElement(Search, {
    placeholder: "Enter your workout destination!",
    allowClear: true,
    enterButton: "Search",
    size: "large",
    prefix: /*#__PURE__*/React.createElement(SearchOutlined, {
      className: "search-form-icon"
    }),
    onSearch: val => props.onSearch(val)
  });
} // 2. Component that would display the map: only contains a static picture by now


function DisplayMap() {
  return /*#__PURE__*/React.createElement(Image, {
    src: "/sample-map.png",
    weight: 1000,
    height: 670
  });
} // 3. Component that lists the search results


function ResultColumn(props) {
  // In this sample implementation, we don't have enough data to conduct a search, so this is only 
  // a responsive component displaying fixed contents including a list of weather, parks and gyms
  // local values / variables can also be used as components
  // contains an empty column / results with 3 lists: weather forecast for nearby areas, parks and gyms
  // (multiple components should be enclosed with <></> (i.e., <div></div>))
  const resultContent = props.inputVal !== "" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", null, "Search result of \"", props.inputVal, "\":"), /*#__PURE__*/React.createElement(Divider, null, "Weather Forecast"), /*#__PURE__*/React.createElement(List, {
    bordered: true,
    dataSource: props.weathers,
    renderItem: item => /*#__PURE__*/React.createElement(List.Item, null, /*#__PURE__*/React.createElement(List.Item.Meta, {
      title: item["name"],
      description: item["weather"]
    }))
  }), /*#__PURE__*/React.createElement(Divider, null, "Nearby Parks"), /*#__PURE__*/React.createElement(List, {
    bordered: true,
    dataSource: props.parks,
    renderItem: item => /*#__PURE__*/React.createElement(List.Item, null, /*#__PURE__*/React.createElement(List.Item.Meta, {
      title: item["name"],
      description: /*#__PURE__*/React.createElement(Space, {
        direction: "vertical"
      }, /*#__PURE__*/React.createElement("p", null, "(", item["longitude"], ", ", item["latitude"], ")", /*#__PURE__*/React.createElement("br", null), item.description))
    }))
  }), /*#__PURE__*/React.createElement(Divider, null, "Nearby Gyms"), /*#__PURE__*/React.createElement(List, {
    bordered: true,
    dataSource: props.gyms,
    renderItem: item => /*#__PURE__*/React.createElement(List.Item, null, /*#__PURE__*/React.createElement(List.Item.Meta, {
      title: item["name"],
      description: /*#__PURE__*/React.createElement(Space, {
        direction: "vertical"
      }, /*#__PURE__*/React.createElement("p", null, "(", item["longitude"], ", ", item["latitude"], ")", /*#__PURE__*/React.createElement("br", null), item.description))
    }))
  })) : /*#__PURE__*/React.createElement("h2", null, "The Result Column is empty.");
  return /*#__PURE__*/React.createElement(React.Fragment, null, resultContent);
} // helper function: create a post request with this template


function create_postREQ(body = null) {
  let payload = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  };
  if (body != null) payload["body"] = JSON.stringify(body);
  return payload;
}

export { App, create_postREQ };