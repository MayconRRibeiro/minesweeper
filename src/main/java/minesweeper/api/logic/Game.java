package minesweeper.api.logic;

import java.awt.Point;
import java.util.LinkedList;
import java.util.List;
import java.util.Random;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import minesweeper.api.responses.CellStatusResponse;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Entity
@Table(name = "Model_Rest")
@EnableTransactionManagement
public class Game {

  @Id
  @GeneratedValue(generator = "uuid")
  @GenericGenerator(name = "uuid", strategy = "uuid")
  @Column(name = "id")
  private String id;

  @Column(name = "cells", columnDefinition = "LONGVARBINARY")
  private int[][] cells;

  @Column(name = "revealed", columnDefinition = "LONGVARBINARY")
  private boolean[][] revealed;

  @Column(name = "x")
  private int x;

  @Column(name = "y")
  private int y;

  @Column(name = "difficulty")
  private Difficulty difficulty;

  @Column(name = "minesCount")
  private int minesCount;

  @Column(name = "minesLocations")
  @ElementCollection
  private List<Point> minesLocations;

  public Game(Difficulty difficulty) {
    this.difficulty = difficulty;
    if (difficulty == Difficulty.easy) {
      this.x = 8;
      this.y = 8;
      this.minesCount = 10;
    } else if (difficulty == Difficulty.medium) {
      this.x = 14;
      this.y = 14;
      this.minesCount = 40;
    } else if (difficulty == Difficulty.hard) {
      this.x = 22;
      this.y = 22;
      this.minesCount = 99;
    }
    this.cells = new int[this.x][this.y];
    this.revealed = new boolean[this.x][this.y];
    this.minesLocations = new LinkedList<Point>();
    placeMines();
    placeNumbers();
  }

  public Game() {}

  public void placeMines() {
    Random rng = new Random();
    int mines = this.minesCount;
    while (mines > 0) {
      int x1 = rng.nextInt(this.x);
      int y1 = rng.nextInt(this.y);
      if (this.cells[x1][y1] != -1) {
        this.cells[x1][y1] = -1;
        this.minesLocations.add(new Point(x1, y1));
        mines--;
      }
    }
  }

  public void placeNumbers() {
    for (int i = 0; i < this.x; i++) {
      for (int j = 0; j < this.y; j++) {
        if (this.cells[i][j] == -1) {
          continue;
        }
        int counter = 0;
        for (int xOffset = -1; xOffset < 2; xOffset++) {
          for (int yOffset = -1; yOffset < 2; yOffset++) {
            int tmpX = i + xOffset;
            int tmpY = j + yOffset;
            if (isValidCell(tmpX, tmpY) && this.cells[tmpX][tmpY] == -1) {
              counter++;
            }
          }
        }
        this.cells[i][j] = counter;
      }
    }
  }

  boolean isValidCell(int x, int y) {
    if (x >= 0 && y >= 0 && x < this.x && y < this.y) {
      return true;
    }
    return false;
  }

  private void floodFill(List<CellStatusResponse> response, int x, int y) {
    for (int xOffset = -1; xOffset < 2; xOffset++) {
      for (int yOffset = -1; yOffset < 2; yOffset++) {
        int i = x + xOffset;
        int j = y + yOffset;
        if (i > -1 && i < this.x && j > -1 && j < this.y) {
          if (this.cells[i][j] != -1 && this.revealed[i][j] == false) {
            this.revealed[i][j] = true;
            response.add(new CellStatusResponse(i, j, this.cells[i][j]));
            if (this.cells[i][j] == 0) {
              floodFill(response, i, j);
            }
          }
        }
      }
    }
  }

  public List<CellStatusResponse> revealMines() {
    List<CellStatusResponse> response = new LinkedList<CellStatusResponse>();
    for (Point it : minesLocations) {
      response.add(new CellStatusResponse(it.x, it.y, this.cells[it.x][it.y]));
    }
    return response;
  }

  public List<CellStatusResponse> getCellsToReveal(int x, int y) {
    List<CellStatusResponse> response = new LinkedList<CellStatusResponse>();
    if (this.revealed[x][y] == false) {
      if (this.cells[x][y] == 0) {
        floodFill(response, x, y);
      } else if (this.cells[x][y] == -1) {
        response.add(new CellStatusResponse(x, y, this.cells[x][y]));
        this.revealed[x][y] = true;
      } else {
        response.add(new CellStatusResponse(x, y, this.cells[x][y]));
        this.revealed[x][y] = true;
      }
    }
    return response;
  }

  public List<CellStatusResponse> revealBoard() {
    List<CellStatusResponse> response = new LinkedList<CellStatusResponse>();
    for (int x = 0; x < this.x; x++) {
      for (int y = 0; y < this.y; y++) {
        response.add(new CellStatusResponse(x, y, this.cells[x][y]));
      }
    }
    return response;
  }

  public String getId() {
    return id;
  }

  public int getminesCount() {
    return minesCount;
  }

  public int getX() {
    return x;
  }

  public int getY() {
    return y;
  }

  public Difficulty getDifficulty() {
    return difficulty;
  }

  public int[][] getCells() {
    return cells;
  }

  public boolean[][] getRevealed() {
    return revealed;
  }

  public int getMinesCount() {
    return minesCount;
  }

  public List<Point> getMinesLocations() {
    return minesLocations;
  }
}
