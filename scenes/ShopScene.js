class ShopScene extends Phaser.Scene {
    constructor() {
      super({ key: 'ShopScene' });
    }
  
    create() {
      this.add.rectangle(187, 333, 375, 667, 0x000000, 0.9);
  
      this.add.text(187, 50, 'Магазин', {
        fontSize: '32px',
        fill: '#fff'
      }).setOrigin(0.5);
  
      const backBtn = this.add.text(187, 600, 'Назад', {
        fontSize: '20px',
        backgroundColor: '#f00',
        padding: { x: 15, y: 5 },
        fill: '#fff'
      }).setOrigin(0.5).setInteractive();
  
      backBtn.on('pointerdown', () => {
        this.scene.stop();
        this.scene.launch('MenuScene');
      });
  
      const score = parseInt(localStorage.getItem('catTowerRecord')) || 0;
  
      this.scoreText = this.add.text(187, 90, `Очки: ${score}`, {
        fontSize: '20px',
        fill: '#fff'
      }).setOrigin(0.5);
  
      this.items = [
        {
          name: 'Лёгкий Кот',
          description: 'Падает медленнее',
          cost: 100,
          key: 'unlockedCat2',
          bought: localStorage.getItem('unlockedCat2') === 'true'
        },
        {
          name: 'Гранатокот',
          description: 'Взорвёт всех рядом',
          cost: 200,
          key: 'unlockedCat3',
          bought: localStorage.getItem('unlockedCat3') === 'true'
        },
        {
          name: 'Бонусник',
          description: 'Даёт +50, если на вершине',
          cost: 300,
          key: 'unlockedCat4',
          bought: localStorage.getItem('unlockedCat4') === 'true'
        }
      ];
  
      this.items.forEach((item, i) => {
        const y = 150 + i * 120;
  
        const rect = this.add.rectangle(187, y, 320, 100, item.bought ? 0x444444 : 0x228B22);
        rect.setAlpha(0.7);
  
        this.add.text(187, y - 30, item.name, {
          fontSize: '20px',
          fill: '#fff'
        }).setOrigin(0.5);
  
        this.add.text(187, y, item.description, {
          fontSize: '14px',
          fill: '#ccc'
        }).setOrigin(0.5);
  
        const price = this.add.text(187, y + 30, `${item.cost} очков`, {
          fontSize: '16px',
          fill: '#ff0'
        }).setOrigin(0.5);
  
        if (!item.bought) {
          rect.setInteractive();
          rect.on('pointerdown', () => {
            if (score >= item.cost) {
              this.scoreText.setText(`Очки: ${score - item.cost}`);
              localStorage.setItem(item.key, 'true');
              localStorage.setItem('catTowerRecord', score - item.cost);
              this.scene.restart();
              this.showNotice('bonusNotice', `🔓 Вы открыли: ${item.name}`);
            } else {
              this.showNotice('bonusNotice', '❌ Недостаточно очков!');
            }
          });
        }
      });
    }
  
    showNotice(id, text) {
      const el = document.getElementById(id);
      el.innerText = text;
      setTimeout(() => el.innerText = '', 3000);
    }
  }