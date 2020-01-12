import React, {Component} from 'react';
import {Route, NavLink, HashRouter} from 'react-router-dom';
import Home from './Home';
import Play from './Play';
import Game from './Game';

class App extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <h1>
            <NavLink exact to="/" href="">
              minesweeper
            </NavLink>
          </h1>
          <div className="content">
            <Route exact path="/" component={Home} />
            <Route exact path="/play" component={() => <Play />} />
            <Route
              exact
              path="/play/easy"
              component={() => <Game difficulty="easy" />}
            />
            <Route
              exact
              path="/play/medium"
              component={() => <Game difficulty="medium" />}
            />
            <Route
              exact
              path="/play/hard"
              component={() => <Game difficulty="hard" />}
            />
          </div>
        </div>
      </HashRouter>
    );
  }
}

export default App;
