import React, { Component } from "react";
import Game from "./backup.js";
 
class Home extends Component {
  render() {
    return (
        <div className="game-board">
          <Game difficuty = "easy"/>
        </div>
    );
  }
}
 
export default Home;
