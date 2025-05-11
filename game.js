const config = {
    type: Phaser.AUTO,
    width: 375,
    height: 667,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 500 },
        debug: false
      }
    },
    scene: ['MenuScene', 'GameScene', 'GameOverScene', 'ShopScene']
  };
  
  let game = new Phaser.Game(config);