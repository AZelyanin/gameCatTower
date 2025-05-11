class GameOverScene extends Phaser.Scene {
    constructor() {
      super({ key: 'GameOverScene' });
    }
  
    init(data) {
      this.finalScore = data.score;
      this.canContinue = data.canContinue;
    }
  
    create() {
      this.add.rectangle(187, 333, 350, 200, 0x000000, 0.8).setStrokeStyle(2, 0xffffff);
      this.add.text(187, 280, 'Игра окончена!', {
        fontSize: '28px',
        fill: '#fff'
      }).setOrigin(0.5);
  
      this.add.text(187, 320, `Ваш результат: ${this.finalScore}`, {
        fontSize: '20px',
        fill: '#fff'
      }).setOrigin(0.5);
  
      const restartBtn = this.add.text(187, 360, 'Заново', {
        fontSize: '20px',
        fill: '#fff',
        backgroundColor: '#f00',
        padding: { x: 15, y: 5 }
      }).setOrigin(0.5).setInteractive();
  
      restartBtn.on('pointerdown', () => {
        this.scene.stop();
        this.scene.restart('GameScene');
      });
  
      if (this.canContinue) {
        const continueBtn = this.add.text(187, 400, 'Продолжить игру', {
          fontSize: '16px',
          fill: '#0f0',
          backgroundColor: '#0008',
          padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive();
  
        continueBtn.on('pointerdown', () => {
          this.scene.get('GameScene').continueAfterFail();
          this.scene.stop();
        });
      }
    }
  }