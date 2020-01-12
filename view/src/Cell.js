import React from 'react';
import jQuery from 'jquery';


class Cell extends React.Component {
  getValue() {
    const {value} = this.props;
    if (value.isFlagged) {
      return '🚩';
    }
    if (value.isMine) {
      return '';
    }
    if (value.neighbour === 0) {
      return;
    }
    return value.neighbour;
  }

  render() {
    const {value, onClick, cMenu} = this.props;
    let className =
      'cell' +
      (value.isRevealed ? ' open' : ' hidden') +
      (value.isMine ? ' is-mine' : '') +
      (value.isFlagged ? ' is-flag' : '');

    //console.log(className);

    return (
      <div onClick={onClick} className={className} onContextMenu={cMenu}>
        <a>{this.getValue()}</a>
      </div>
    );
  }
}

export default Cell;
