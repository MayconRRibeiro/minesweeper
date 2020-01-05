package minesweeper.api;

import java.util.List;
import minesweeper.api.responses.GameCreateResponse;
import minesweeper.api.responses.MultipleCellStatusResponse;
import minesweeper.api.logic.Game;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class GameController {

  private final GameRepository gameRepository;

  public GameController(GameRepository gameRepository) {
    this.gameRepository = gameRepository;
  }

  @PostMapping("game")
  public ResponseEntity<GameCreateResponse> createGame(Game game) {
    try {
      gameRepository.save(game);
    } catch (DataAccessException e) {
      e.printStackTrace();
      return new ResponseEntity<GameCreateResponse>(HttpStatus.BAD_REQUEST);
    }
    return new ResponseEntity<GameCreateResponse>(
        new GameCreateResponse(game.getId()), HttpStatus.CREATED);
  }

  @GetMapping("game")
  public List<Game> getGames() {
    return (List<Game>) gameRepository.findAll();
  }

  // @GetMapping("game/{id}")

  @GetMapping("game/{id}/{x}/{y}")
  public ResponseEntity<MultipleCellStatusResponse> revealCells(
      @PathVariable String id, @PathVariable int x, @PathVariable int y) {
    List<Game> games = (List<Game>) gameRepository.findAll();
    for (Game it : games) {
      if (it.getId().equals(id)) {
        return new ResponseEntity<MultipleCellStatusResponse>(
            new MultipleCellStatusResponse(it.getCellsToReveal(x, y)), HttpStatus.OK);
      }
    }
    return new ResponseEntity<MultipleCellStatusResponse>(HttpStatus.NOT_FOUND);
  }
}
