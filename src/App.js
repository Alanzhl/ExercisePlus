import React, { useState } from "react";
import "./App.css";
import { Layout, Input, Image } from 'antd';
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
  const [visitor, setVisitor] = useState(""); // this function is triggered on pressing the search button inside "Searchbar"

  async function onSearch(val) {
    const resp = await fetch("/api/search", create_postREQ({
      target: val
    })); // wait for execution to complete

    const returnVal = await resp.json(); // get result in json format

    if (returnVal["success"] !== 0) {
      setVisitor(returnVal["message"]); // change the state value accordingly
    }
  } // return the layout of the mainpage


  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Layout, null, /*#__PURE__*/React.createElement(Layout, null, /*#__PURE__*/React.createElement(Header, {
    className: "frame-header"
  }, /*#__PURE__*/React.createElement(Searchbar, {
    onSearch: onSearch
  })), /*#__PURE__*/React.createElement(Content, null, /*#__PURE__*/React.createElement(DisplayMap, null))), /*#__PURE__*/React.createElement(Sider, {
    width: "30%",
    className: "frame-sider"
  }, /*#__PURE__*/React.createElement(ResultColumn, {
    visitor: visitor
  }))));
} // Component at the header

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
} // Component that would display the map


function DisplayMap() {
  return /*#__PURE__*/React.createElement(Image, {
    src: "/sample-map.png",
    weight: 900,
    height: 600
  });
} // Component that lists the search results


function ResultColumn(props) {
  const welcomeText = props.visitor !== "" ? /*#__PURE__*/React.createElement("h2", null, "Welcome, ", props.visitor, "!") : /*#__PURE__*/React.createElement("h2", null, "Please input your name to generate the welcome message!");
  return /*#__PURE__*/React.createElement(React.Fragment, null, welcomeText);
} // helper function: create a post request with this template


function create_postREQ(body) {
  return {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };
}

export { App, create_postREQ };