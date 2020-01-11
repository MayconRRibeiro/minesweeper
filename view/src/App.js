import React, { Component } from "react";
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
import Home from "./Home";
 
class App extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <h1></h1>
          <ul className="header">
            <li><NavLink exact to ="/" href="/">Home</NavLink></li>
          </ul>
          <div className="content">
            <Route exact path="/" component={Home}/>
          </div>
        </div>
      </HashRouter>
    );
  }
}
 
export default App;
