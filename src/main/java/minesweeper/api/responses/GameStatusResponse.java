package minesweeper.api.responses;

import minesweeper.api.logic.Game;
import minesweeper.api.logic.Difficulty;

public class GameStatusResponse {
  private String id;
  Difficulty difficulty;
  private int x;
  private int y;
  private int minesCount;

  public GameStatusResponse(Game g) {
    this.id = g.getId();
    this.x = g.getX();
    this.y = g.getY();
    this.minesCount = g.getminesCount();
    this.difficulty = g.getDifficulty();
  }

  public String getId() {
    return id;
  }

  public int getX() {
    return x;
  }

  public int getY() {
    return y;
  }

  public int getMinesCount() {
    return minesCount;
  }

public Difficulty getDifficulty() {
  return difficulty;
}
}
