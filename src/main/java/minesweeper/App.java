package minesweeper;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.util.stream.Stream;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class App {
  public static void main(String[] args) {
    SpringApplication.run(App.class, args);
  }
    //@Bean
    //CommandLineRunner init(UserRepository userRepository) {
        //return args -> {
            //Stream.of("John", "Julie", "Jennifer", "Helen", "Rachel").forEach(name -> {
                //User user = new User(name, name.toLowerCase() + "@domain.com");
                //userRepository.save(user);
            //});
            ////userRepository.findAll().forEach(System.out::println);
        //};
    //}
}
