class MenuScene extends Phaser.Scene {
    constructor() {
      super({ key: 'MenuScene' });
    }
  
    preload() {
      this.load.image('background', 'assets/background.png');
      this.load.image('cloud', 'assets/cloud.png');
      this.load.image('cat', 'assets/cat1.png');
      this.load.audio('bgm', 'assets/bgm.mp3');
      this.load.audio('click', 'assets/click.mp3');
    }
  
    create() {
      // Фон
      this.add.image(187, 333, 'background').setScale(0.5);
  
      // Музыка
      this.bgm = this.sound.add('bgm', { loop: true, volume: 0.3 });
      if (!this.bgm.isPlaying) this.bgm.play();
  
      // Звук клика
      this.clickSound = this.sound.add('click');
  
      // Облако с анимацией
      this.cloud = this.add.image(-100, 150, 'cloud').setScale(0.3);
      this.tweens.add({
        targets: this.cloud,
        x: 400,
        duration: 4000,
        ease: 'Power2',
        repeat: -1,
        yoyo: true
      });
  
      // Кот на облаке
      this.catOnCloud = this.add.image(this.cloud.x - 30, this.cloud.y - 20, 'cat').setScale(0.3);
      this.catOnCloud.setAngle(-10);
      this.tweens.add({
        targets: this.catOnCloud,
        angle: 10,
        duration: 800,
        ease: 'Sine.InOut',
        repeat: -1,
        yoyo: true
      });
  
      // Заголовок
      this.titleText = this.add.text(187, 100, 'Кошачья\nБашня', {
        fontSize: '36px',
        fill: '#fff',
        align: 'center',
        stroke: '#000',
        strokeThickness: 4
      }).setOrigin(0.5).setAlpha(0);
  
      this.tweens.add({
        targets: this.titleText,
        alpha: 1,
        y: 120,
        duration: 1000,
        ease: 'Back.out'
      });
  
      // Подпись
      this.subtitleText = this.add.text(187, 190, 'Набери очки, открывай новых котов!', {
        fontSize: '16px',
        fill: '#ccc',
        align: 'center'
      }).setOrigin(0.5).setAlpha(0);
  
      this.tweens.add({
        targets: this.subtitleText,
        alpha: 1,
        duration: 1000,
        delay: 500,
        ease: 'Power1'
      });
  
      // Кнопка "Играть"
      this.playButton = this.add.text(187, 300, 'ИГРАТЬ', {
        fontSize: '24px',
        fill: '#fff',
        backgroundColor: '#f00',
        padding: { x: 20, y: 10 }
      }).setOrigin(0.5).setInteractive().setAlpha(0);
  
      this.tweens.add({
        targets: this.playButton,
        alpha: 1,
        y: 280,
        duration: 800,
        delay: 1000,
        ease: 'Back.out'
      });
  
      this.playButton.on('pointerover', () => {
        this.playButton.setStyle({ backgroundColor: '#c00' });
      });
  
      this.playButton.on('pointerout', () => {
        this.playButton.setStyle({ backgroundColor: '#f00' });
      });
  
      this.playButton.on('pointerdown', () => {
        this.clickSound.play();
        this.scene.start('GameScene');
      });
  
      // Кнопка "Магазин"
      this.shopButton = this.add.text(187, 360, 'МАГАЗИН', {
        fontSize: '20px',
        fill: '#0f0',
        backgroundColor: '#0008',
        padding: { x: 20, y: 10 }
      }).setOrigin(0.5).setInteractive().setAlpha(0);
  
      this.tweens.add({
        targets: this.shopButton,
        alpha: 1,
        y: 340,
        duration: 800,
        delay: 1200,
        ease: 'Back.out'
      });
  
      this.shopButton.on('pointerover', () => {
        this.shopButton.setStyle({ backgroundColor: '#000' });
      });
  
      this.shopButton.on('pointerout', () => {
        this.shopButton.setStyle({ backgroundColor: '#0008' });
      });
  
      this.shopButton.on('pointerdown', () => {
        this.clickSound.play();
        this.scene.start('ShopScene');
      });
  
      // Рекорд
      const record = localStorage.getItem('catTowerRecord') || 0;
      this.recordText = this.add.text(187, 420, `Рекорд: ${record}`, {
        fontSize: '18px',
        fill: '#ccc'
      }).setOrigin(0.5).setAlpha(0);
  
      this.tweens.add({
        targets: this.recordText,
        alpha: 1,
        duration: 800,
        delay: 1400,
        ease: 'Power1'
      });
    }
  
    shutdown() {
      if (this.bgm && this.bgm.isPlaying) {
        this.bgm.stop();
      }
    }
  }