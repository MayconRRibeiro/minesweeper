package minesweeper.api.responses;

public class CellStatusResponse {
  private int x;
  private int y;
  private int status;

  public CellStatusResponse(int x, int y, int status) {
    this.x = x;
    this.y = y;
    this.status = status;
  }

  public int getX() {
    return x;
  }

  public int getY() {
    return y;
  }

  public int getStatus() {
    return status;
  }
}
