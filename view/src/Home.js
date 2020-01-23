import React, {Component} from 'react';
import {NavLink, HashRouter} from 'react-router-dom';

class Home extends Component {
  componentDidMount() {
    let x = document.getElementById('choose-difficulty');
    x.style.display = 'none';
  }

  onClickHanler() {
    let x = document.getElementById('choose-difficulty');
    x.style.display = 'block';
    if (x.style.opacity !== '1') {
      window.setTimeout(function() {
        x.style.opacity = 1;
        x.style.transform = 'scale(1)';
      }, 10);
    } else {
      window.setTimeout(function() {
        x.style.opacity = 0;
        x.style.transform = 'scale(1)';
      }, 10);
    }
  }

  render() {
    return (
      <HashRouter>
        <div className="home">
          <button className="play" onClick={this.onClickHanler}>
            Play
          </button>
          <ul id="choose-difficulty">
            <li>
              <button>
              <NavLink exact to="/easy" href="/easy">
                easy
              </NavLink>
                </button>
            </li>
            <li>
              <button>
              <NavLink exact to="/medium" href="/medium">
                medium
              </NavLink>
                </button>
            </li>
            <li>
              <button>
              <NavLink exact to="/hard" href="/hard">
                hard
              </NavLink>
                </button>
            </li>
          </ul>
        </div>
      </HashRouter>
    );
  }
}

export default Home;
