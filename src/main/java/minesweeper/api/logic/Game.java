package minesweeper.api.logic;

import java.util.LinkedList;
import java.util.List;
import java.util.Random;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import minesweeper.api.responses.CellStatusResponse;
import org.hibernate.annotations.GenericGenerator;

@Entity
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
    placeMines();
    placeNumbers();
    printCells();
  }

  public Game() {}

  public void printCells() {

    for (int[] x : this.cells) {
      for (int y : x) {
        if (y != -1) {
          System.out.print("+" + y + "    ");
        } else {
          System.out.print(y + "    ");
        }
      }
      System.out.println();
    }
  }

  public void placeMines() {
    Random rng = new Random();
    int mines = this.minesCount;
    while (mines > 0) {
      int x1 = rng.nextInt(this.x);
      int y1 = rng.nextInt(this.y);
      if (this.cells[x1][y1] != -1) {
        this.cells[x1][y1] = -1;
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
        // for ( in
        // zamienic na for 44:54
        int counter = 0;
        if (isValidCell(i - 1, j - 1) && this.cells[i - 1][j - 1] == -1) {
          counter++;
        }
        if (isValidCell(i - 1, j) && this.cells[i - 1][j] == -1) {
          counter++;
        }
        if (isValidCell(i - 1, j + 1) && this.cells[i - 1][j + 1] == -1) {
          counter++;
        }
        if (isValidCell(i, j - 1) && this.cells[i][j - 1] == -1) {
          counter++;
        }
        if (isValidCell(i, j + 1) && this.cells[i][j + 1] == -1) {
          counter++;
        }
        if (isValidCell(i + 1, j - 1) && this.cells[i + 1][j - 1] == -1) {
          counter++;
        }
        if (isValidCell(i + 1, j) && this.cells[i + 1][j] == -1) {
          counter++;
        }
        if (isValidCell(i + 1, j + 1) && this.cells[i + 1][j + 1] == -1) {
          counter++;
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
          // TODO
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
        //System.out.println(this.cells[x][y]);
        this.revealed[x][y] = true;
        // floodFill(response, x, y);
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
}
