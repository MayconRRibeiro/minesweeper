import React, {Component} from 'react';
import {NavLink, HashRouter} from 'react-router-dom';

class Home extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <a>
            <NavLink exact to="/play" href="/play">
              Play
            </NavLink>
          </a>
          <h1>home</h1>
          <a> press minesweeper to return home</a>
        </div>
      </HashRouter>
    );
  }
}

export default Home;
