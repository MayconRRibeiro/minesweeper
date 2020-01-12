import React from 'react';

class Cell extends React.Component {
  getValue() {
    const {value} = this.props;
    if (value.isFlagged) {
      return '';
    }
    if (value.isMine) {
      return '';
    }
    if (value.neighbour === 0) {
      return null;
    }
    return value.neighbour;
  }

  render() {
    const {value, onClick, cMenu} = this.props;
    let className =
      'cell' +
      (value.isRevealed ? '' : ' hidden') +
      (value.isMine ? ' is-mine' : '') +
      (value.isFlagged ? ' is-flag' : '');

    return (
      <div onClick={onClick} className={className} onContextMenu={cMenu}>
        {this.getValue()}
      </div>
    );
  }
}

export default Cell;
