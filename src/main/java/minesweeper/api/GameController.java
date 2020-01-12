package minesweeper.api;

import java.util.List;
import minesweeper.api.logic.Difficulty;
import minesweeper.api.logic.Game;
import minesweeper.api.responses.GameCreateResponse;
import minesweeper.api.responses.GameStatusResponse;
import minesweeper.api.responses.MultipleCellStatusResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class GameController {

  private final GameRepository gameRepository;

  public GameController(GameRepository gameRepository) {
    this.gameRepository = gameRepository;
  }

  @PostMapping("game")
  public ResponseEntity<GameCreateResponse> createGame(@RequestParam Difficulty difficulty) {
    Game game = new Game(difficulty);
    gameRepository.save(game);
    return new ResponseEntity<GameCreateResponse>(
        new GameCreateResponse(game.getId()), HttpStatus.CREATED);
  }

  @GetMapping("game")
  public List<Game> getGames() {
    return (List<Game>) gameRepository.findAll();
  }

  @GetMapping("game/{id}")
  public ResponseEntity<GameStatusResponse> getGameStatus(@PathVariable String id) {
    List<Game> games = (List<Game>) gameRepository.findAll();
    for (Game it : games) {
      if (it.getId().equals(id)) {
        return new ResponseEntity<GameStatusResponse>(new GameStatusResponse(it), HttpStatus.OK);
      }
    }
    return new ResponseEntity<GameStatusResponse>(HttpStatus.NOT_FOUND);
  }

  @DeleteMapping("game/{id}")
  public ResponseEntity<String> deleteGame(@PathVariable String id) {
    this.gameRepository.deleteById(id);
    return new ResponseEntity<String>("deleted game with id " + id, HttpStatus.OK);
  }

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
