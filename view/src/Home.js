import React, {Component} from 'react';
import {NavLink, HashRouter} from 'react-router-dom';

class Home extends Component {
  componentDidMount() {
    let x = document.getElementById('choose-difficulty');
    x.style.display = 'none';
  }

  onClickHanler() {
    let x = document.getElementById('choose-difficulty');
    if (x.style.display === 'none') {
      x.style.display = 'block';
    } else {
      x.style.display = 'none';
    }
  }

  render() {
    return (
      <HashRouter>
        <div>
          <button onClick={this.onClickHanler}>Play</button>
          <ul id="choose-difficulty">
            <h1>choose difficulty </h1>
            <li>
              <NavLink exact to="/easy" href="/easy">
                easy
              </NavLink>
            </li>
            <li>
              <NavLink exact to="/medium" href="/medium">
                medium
              </NavLink>
            </li>
            <li>
              <NavLink exact to="/hard" href="/hard">
                hard
              </NavLink>
            </li>
          </ul>
          <h1>home</h1>
          <a> press minesweeper to return home</a>
        </div>
      </HashRouter>
    );
  }
}

export default Home;
