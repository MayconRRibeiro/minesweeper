package minesweeper.api.logic;

import javax.persistence.Column;
import javax.persistence.Entity;
import java.util.List;
import java.util.LinkedList;
import minesweeper.api.responses.CellStatusResponse;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import org.hibernate.annotations.GenericGenerator;

@Entity
public class Game {

  @Id
  @GeneratedValue(generator = "uuid")
  @GenericGenerator(name = "uuid", strategy = "uuid")
  @Column(columnDefinition = "CHAR(32)")
  private String id;

  private int size;
  private int minesCount;

  public Game() {
    this.size = 1;
    this.minesCount = 1;
  }
  public List<CellStatusResponse> getCellsToReveal(int x, int y){
    List <CellStatusResponse> test = new LinkedList <CellStatusResponse>();
    test.add(new CellStatusResponse(x,y,1));
    return test;

  }

  public Game(int size, int minesCount) {
    this.size = size;
    this.minesCount = minesCount;
  }

  public String getId() {
    return id;
  }

  public int getsize() {
    return size;
  }

  public int getminesCount() {
    return minesCount;
  }

  @Override
  public String toString() {
    return "Game{" + "id=" + id + ", size=" + size + ", minesCount=" + minesCount + '}';
  }
}
