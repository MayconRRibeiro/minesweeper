import React from 'react';

class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }
  render() {
    return (
      <button
        className="cell"
        // todo
        onClick={() => {
          this.setState({value: 'X'});
        }}
      >
        {this.state.value}{'%'}
      </button>
    );
  }
}

export default Cell;
