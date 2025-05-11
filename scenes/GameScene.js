class GameScene extends Phaser.Scene {
    constructor() {
      super({ key: 'GameScene' });
      this.score = 0;
      this.record = parseInt(localStorage.getItem('catTowerRecord')) || 0;
      this.catTypes = [];
      this.cloudSpeed = 150;
      this.dropCooldown = false;
      this.direction = 1;
      this.combo = 0;
      this.comboTimer = 0;
      this.achievementsShown = {};
      this.shieldActive = localStorage.getItem('shieldEnabled') === 'true';
      this.dayKey = new Date().toISOString().slice(0, 10);
      this.dailyClaimed = localStorage.getItem(`daily_${this.dayKey}`) === 'true';
    }
  
    preload() {
      this.load.image('background', 'assets/background.png');
      this.load.image('cat1', 'assets/cat1.png');
      this.load.image('cat2', 'assets/cat2.png');
      this.load.image('cat3', 'assets/cat3.png');
      this.load.image('cat4', 'assets/cat4.png');
      this.load.image('cloud', 'assets/cloud.png');
      this.load.image('bonus', 'assets/bonus.png');
  
      this.load.audio('drop', 'assets/drop.mp3');
      this.load.audio('bonus', 'assets/bonus.mp3');
      this.load.audio('bgm', 'assets/bgm.mp3');
    }
  
    create() {
      // Фон
      this.add.image(187, 333, 'background').setScale(0.5);
  
      // Музыка
      this.bgm = this.sound.add('bgm', { loop: true, volume: 0.3 });
      if (!this.bgm.isPlaying) this.bgm.play();
  
      // Земля
      this.ground = this.add.rectangle(187, 640, 375, 40, 0x228B22);
      this.physics.add.existing(this.ground, true);
  
      // Облако
      this.cloud = this.physics.add.image(187, 100, 'cloud').setScale(0.3);
      this.cloud.setImmovable(true);
      this.cloud.body.allowGravity = false;
  
      // Группа кошек
      this.catsGroup = this.physics.add.group();
      this.physics.add.collider(this.catsGroup, this.ground, this.handleCatLanding, null, this);
      this.physics.add.collider(this.catsGroup, this.catsGroup);
  
      // Управление
      this.input.on('pointerdown', () => this.dropCat());
      this.input.keyboard.on('keydown-SPACE', () => this.dropCat());
  
      // UI
      this.scoreText = document.getElementById('scoreBoard');
      this.recordText = document.getElementById('recordBoard');
      this.updateScore(0);
  
      // Бонусы
      this.time.addEvent({
        delay: 10000,
        callback: () => this.addBonus(),
        loop: true
      });
  
      // Комбо
      this.time.addEvent({
        delay: 1000,
        callback: () => this.checkCombo(),
        loop: true
      });
  
      // Ежедневный бонус
      this.showDailyLogin();
  
      // Проверяем доступные кошки из localStorage
      this.catTypes = [
        { key: 'cat1', name: 'Обычный', points: 10, ability: null }
      ];
  
      if (localStorage.getItem('unlockedCat2') === 'true') {
        this.catTypes.push({ key: 'cat2', name: 'Лёгкий', points: 15, ability: 'slowFall' });
      }
  
      if (localStorage.getItem('unlockedCat3') === 'true') {
        this.catTypes.push({ key: 'cat3', name: 'Гранатокот', points: 20, ability: 'explodeOnLand' });
      }
  
      if (localStorage.getItem('unlockedCat4') === 'true') {
        this.catTypes.push({ key: 'cat4', name: 'Бонусник', points: 10, ability: 'bonusOnTop' });
      }
    }
  
    update(time, delta) {
      this.cloud.x += this.direction * (this.cloudSpeed * delta / 1000);
      if (this.cloud.x >= 350) this.direction = -1;
      if (this.cloud.x <= 25) this.direction = 1;
    }
  
    dropCat() {
      if (this.dropCooldown) return;
      this.dropCooldown = true;
      this.time.delayedCall(300, () => this.dropCooldown = false);
  
      let catData = Phaser.Utils.Array.GetRandom(this.catTypes);
      let cat = this.physics.add.image(this.cloud.x, this.cloud.y + 20, catData.key).setScale(0.3);
      cat.setData('catData', catData);
      cat.setBounce(0.2);
      cat.setCollideWorldBounds(true);
  
      if (catData.ability === 'slowFall') {
        cat.setGravityY(200);
      } else {
        cat.setGravityY(500);
      }
  
      this.catsGroup.add(cat);
  
      this.combo++;
      this.comboTimer = 1.5;
  
      let multiplier = Math.min(1 + this.combo * 0.1, 3);
      let points = Math.floor(catData.points * multiplier);
  
      this.updateScore(this.score + points);
      this.sound.add('drop').play();
    }
  
    handleCatLanding(cat) {
      let catData = cat.getData('catData');
  
      if (catData.ability === 'explodeOnLand') {
        this.explodeCat(cat);
      }
  
      if (catData.ability === 'bonusOnTop') {
        let topCat = this.getTopCat();
        if (topCat && topCat === cat) {
          this.updateScore(this.score + 50);
          this.showNotice('bonusNotice', '💎 Бонускот на вершине!');
        }
      }
  
      if (cat.y > this.ground.y + 20) {
        cat.destroy();
        this.gameOver();
      }
    }
  
    explodeCat(cat) {
      this.showNotice('bonusNotice', '💥 Гранатокот взорвался!');
      this.sound.play('bonus');
  
      let nearbyCats = this.catsGroup.getChildren().filter(c =>
        Math.abs(c.x - cat.x) < 50 && Math.abs(c.y - cat.y) < 50
      );
  
      nearbyCats.forEach(c => c.destroy());
      cat.destroy();
    }
  
    getTopCat() {
      let cats = this.catsGroup.getChildren();
      if (!cats.length) return null;
      return cats.reduce((a, b) => a.y < b.y ? a : b);
    }
  
    checkCombo() {
      if (this.comboTimer <= 0) {
        this.combo = 0;
      } else {
        this.comboTimer -= 1;
      }
    }
  
    addBonus() {
      let bonus = this.physics.add.image(Phaser.Math.Between(50, 325), 0, 'bonus').setScale(0.1);
      bonus.setBounce(1);
      bonus.setVelocity(Phaser.Math.Between(-100, 100), 200);
      bonus.setCollideWorldBounds(true);
  
      this.physics.add.overlap(this.cloud, bonus, () => {
        bonus.destroy();
        this.updateScore(this.score + 100);
        this.showNotice('bonusNotice', '💫 +100 очков!');
        this.sound.add('bonus').play();
      });
    }
  
    updateScore(newScore) {
      this.score = newScore;
      this.scoreText.innerText = 'Очки: ' + this.score;
  
      if (this.score > this.record) {
        this.record = this.score;
        localStorage.setItem('catTowerRecord', this.record);
        this.recordText.innerText = 'Рекорд: ' + this.record;
      }
  
      this.checkAchievement();
    }
  
    checkAchievement() {
      const el = document.getElementById('achievementsNotice');
      if (this.score >= 200 && !this.achievementsShown['ach_200']) {
        el.innerText = '🏅 Достижение: 200 очков!';
        this.achievementsShown['ach_200'] = true;
        setTimeout(() => el.innerText = '', 3000);
      }
      if (this.score >= 500 && !this.achievementsShown['ach_500']) {
        el.innerText = '🏆 Достижение: 500 очков!';
        this.achievementsShown['ach_500'] = true;
        setTimeout(() => el.innerText = '', 3000);
      }
    }
  
    showNotice(id, text) {
      const el = document.getElementById(id);
      el.innerText = text;
      setTimeout(() => el.innerText = '', 3000);
    }
  
    showDailyLogin() {
      if (!this.dailyClaimed) {
        this.updateScore(this.score + 100);
        this.showNotice('bonusNotice', '🎁 Ежедневный бонус: +100 очков!');
        localStorage.setItem(`daily_${this.dayKey}`, 'true');
      }
    }
  
    continueAfterFail() {
      this.isGameOver = false;
      this.bgm.resume();
    }
  
    gameOver() {
      if (this.shieldActive) {
        this.shieldActive = false;
        localStorage.setItem('shieldEnabled', 'false');
        this.showNotice('bonusNotice', '🛡️ Щит спасает вас!');
        return;
      }
  
      this.bgm.stop();
      this.scene.launch('GameOverScene', { score: this.score, canContinue: true });
    }
  }