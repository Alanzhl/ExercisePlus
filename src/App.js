import React, { useState } from "react";
import "./App.css";
import { Layout, Input, Image, Button, Space, List } from 'antd';
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
  // sample state value
  const [visitor, setVisitor] = useState("");
  const [samples, setSamples] = useState([]); // this function is triggered on pressing the search button inside "Searchbar"

  async function onSearch(val) {
    const resp = await fetch("/api/search", create_postREQ({
      target: val
    })); // wait for execution to complete

    const returnVal = await resp.json(); // get result in json format

    if (returnVal["success"] !== 0) {
      setVisitor(returnVal["message"]); // change the state value accordingly
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
    visitor: visitor,
    samples: samples,
    setSamples: setSamples
  }))));
} // 1. Component at the header: a sample search bar (only supports generation of a welcome message)

function Searchbar(props) {
  return /*#__PURE__*/React.createElement(Search, {
    placeholder: "Enter your visitor name to generate a welcome message",
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
  // a responsive component that generates a welcome message with the visitor's name collected from 
  // the search bar.
  // This component also contains three buttons and a list to test interactions with the database.
  const welcomeText = props.visitor !== "" ? /*#__PURE__*/React.createElement("h2", null, "Welcome, ", props.visitor, "!") : /*#__PURE__*/React.createElement("h2", null, "Please input your name to generate the welcome message!"); // helper methods used in this component (triggered when clicking the corresponding buttons)

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
  } // return value: a combination of sub-components enclosed by <></> (i.e., <div></div>)


  return /*#__PURE__*/React.createElement(React.Fragment, null, welcomeText, /*#__PURE__*/React.createElement(Space, {
    direction: "vertical"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "primary",
    onClick: insertSamples
  }, "Insert Samples"), /*#__PURE__*/React.createElement(Button, {
    danger: true,
    onClick: deleteSamples
  }, "Clear Samples"), /*#__PURE__*/React.createElement(Button, {
    onClick: listSamples
  }, "List Samples")), /*#__PURE__*/React.createElement(List, {
    bordered: true,
    dataSource: props.samples,
    renderItem: item => /*#__PURE__*/React.createElement(List.Item, null, item["name"] + ": " + item["description"])
  }));
} // helper function: create a post request with this template


function create_postREQ(body = null) {
  var payload = {
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