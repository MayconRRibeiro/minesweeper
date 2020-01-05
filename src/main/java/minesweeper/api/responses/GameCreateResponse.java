package minesweeper.api.responses;

public class GameCreateResponse {
  private String id;

  public GameCreateResponse(String id) {
    this.id = id;
  }

  public String getId() {
    return id;
  }

}
