import React from 'react';

class Cell extends React.Component {
  getValue() {
    const {value} = this.props;
    if (value.isFlagged) {
      return '🚩';
    }
    if (value.isMine) {
      return '💣';
    }
    if (value.neighbour === 0) {
      return;
    }
    return value.neighbour;
  }

  render() {
    const {value, onClick, onLeftClick} = this.props;
    let className =
      'cell' +
      (value.isRevealed ? ' open' : ' hidden') +
      (value.isMine ? ' is-mine' : '') +
      (value.isFlagged ? ' is-flag' : '');
    return (
      <div onClick={onClick} className={className} onContextMenu={onLeftClick}>
        <span>{this.getValue()}</span>
      </div>
    );
  }
}

export default Cell;
