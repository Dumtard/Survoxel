var Survoxel = Survoxel || {};

Survoxel.windowWidth = window.innerWidth;
Survoxel.windowHeight = window.innerHeight;

Survoxel.game = new Game(Survoxel.windowWidth, Survoxel.windowHeight);
Survoxel.game.initialize();

Survoxel.game.loop();
