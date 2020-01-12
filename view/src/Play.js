import React, {Component} from 'react';
import {NavLink, HashRouter} from 'react-router-dom';

class Play extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <ul>
            <h>choose difficulty </h>
            <li>
              <NavLink exact to="/play/easy" href="/play/easy">
                easy
              </NavLink>
            </li>
            <li>
              <NavLink exact to="/play/medium" href="/play/medium">
                medium
              </NavLink>
            </li>
            <li>
              <NavLink exact to="/play/hard" href="/play/hard">
                hard
              </NavLink>
            </li>
          </ul>
        </div>
      </HashRouter>
    );
  }
}

export default Play;
