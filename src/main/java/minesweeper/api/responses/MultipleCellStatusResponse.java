package minesweeper.api.responses;

import java.util.List;

public class MultipleCellStatusResponse {
  List<CellStatusResponse> cells;

  public MultipleCellStatusResponse(List<CellStatusResponse> ll) {
    this.cells = ll;
  }

  public List<CellStatusResponse> getCells() {
    return cells;
  }
}
