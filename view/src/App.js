import React, {Component} from 'react';
import {Route, NavLink, HashRouter} from 'react-router-dom';
import Home from './Home';
import Game from './Game';

class App extends Component {
  render() {
    return (
      <div className="main">
        <div>
          <HashRouter>
            <div>
              <div className="rout">
                <h1>
                  <NavLink exact to="/" href="">
                    welcome to minesweeper
                  </NavLink>
                </h1>
                <a href="https://github.com/hoob3rt/minesweeper">
                  click here to view source code
                </a>
              </div>
              <div className="content">
                <Route exact path="/" component={Home} />
                <Route
                  exact
                  path="/easy"
                  component={() => <Game difficulty="easy" />}
                />
                <Route
                  exact
                  path="/medium"
                  component={() => <Game difficulty="medium" />}
                />
                <Route
                  exact
                  path="/hard"
                  component={() => <Game difficulty="hard" />}
                />
              </div>
            </div>
          </HashRouter>
        </div>
      </div>
    );
  }
}

export default App;
