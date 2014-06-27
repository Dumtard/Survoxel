window.onload = function() {
  var game = new Game(window.innerWidth, window.innerHeight);
  game.initialize();

  game.loop();
}
