import React from 'react';

class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  async reveal() {
    const url = 'http://127.0.0.1:8080/game/' + this.props.gameid + '/0/0/';
    console.log(url);
    let response = await fetch(url, {method: 'get'});
    const json = await response.json();
    console.log(json.cells[0].status);
    return json.cells[0].status;
  }

  async handleClick() {
    console.log('Kliknięto w link.');
    let x = await this.reveal();
    this.setState({value: x})
  }

  render() {
    return (
      <div className="cell" onClick={this.handleClick}>
        {this.state.value}
        {''}
      </div>
    );
  }
}

export default Cell;
