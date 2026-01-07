class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 48; // Taille approximative sprite
    this.height = 48;
    this.velocityX = 0;
    this.velocityY = 0;
    this.speed = 5;
    this.jumpForce = 12;
    this.gravity = 0.5;
    this.isGrounded = false;
    this.direction = 1; // 1 = droite, -1 = gauche
    
    // Animation
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrames = 4; // À ajuster selon ton spritesheet
    this.frameTimer = 0;
    this.frameInterval = 100; // ms entre chaque frame
    
    // Contrôles
    this.keys = {
      left: false,
      right: false,
      up: false,
      space: false
    };
    
    this.setupControls();
  }
  
  setupControls() {
    window.addEventListener('keydown', (e) => {
      switch(e.code) {
        case 'ArrowLeft':
        case 'KeyA':
        case 'KeyQ': // AZERTY
          this.keys.left = true;
          break;
        case 'ArrowRight':
        case 'KeyD':
          this.keys.right = true;
          break;
        case 'ArrowUp':
        case 'KeyW':
        case 'KeyZ': // AZERTY
        case 'Space':
          this.keys.up = true;
          break;
      }
    });
    
    window.addEventListener('keyup', (e) => {
      switch(e.code) {
        case 'ArrowLeft':
        case 'KeyA':
        case 'KeyQ':
          this.keys.left = false;
          break;
        case 'ArrowRight':
        case 'KeyD':
          this.keys.right = false;
          break;
        case 'ArrowUp':
        case 'KeyW':
        case 'KeyZ':
        case 'Space':
          this.keys.up = false;
          break;
      }
    });
  }
  
  update(deltaTime, platforms) {
    // Déplacement horizontal
    if (this.keys.left) {
      this.velocityX = -this.speed;
      this.direction = -1;
    } else if (this.keys.right) {
      this.velocityX = this.speed;
      this.direction = 1;
    } else {
      this.velocityX = 0;
    }
    
    // Saut
    if (this.keys.up && this.isGrounded) {
      this.velocityY = -this.jumpForce;
      this.isGrounded = false;
    }
    
    // Gravité
    if (!this.isGrounded) {
      this.velocityY += this.gravity;
    }
    
    // Limiter la vitesse de chute
    if (this.velocityY > 15) {
      this.velocityY = 15;
    }
    
    // Appliquer les vélocités
    this.x += this.velocityX;
    this.y += this.velocityY;
    
    // Collision avec les plateformes
    this.checkPlatformCollision(platforms);
    
    // Animation
    if (this.velocityX !== 0) {
      this.animate(deltaTime);
    }
  }
  
  checkPlatformCollision(platforms) {
    this.isGrounded = false;
    
    platforms.forEach(platform => {
      // Collision par le bas (joueur tombe sur la plateforme)
      if (
        this.velocityY >= 0 &&
        this.y + this.height >= platform.y &&
        this.y + this.height <= platform.y + platform.height &&
        this.x + this.width > platform.x &&
        this.x < platform.x + platform.width
      ) {
        this.y = platform.y - this.height;
        this.velocityY = 0;
        this.isGrounded = true;
      }
      
      // Collision par le haut (joueur saute contre la plateforme)
      if (
        this.velocityY < 0 &&
        this.y <= platform.y + platform.height &&
        this.y >= platform.y &&
        this.x + this.width > platform.x &&
        this.x < platform.x + platform.width
      ) {
        this.y = platform.y + platform.height;
        this.velocityY = 0;
      }
      
      // Collision latérale (gauche)
      if (
        this.velocityX < 0 &&
        this.x <= platform.x + platform.width &&
        this.x + this.width > platform.x &&
        this.y + this.height > platform.y &&
        this.y < platform.y + platform.height
      ) {
        this.x = platform.x + platform.width;
      }
      
      // Collision latérale (droite)
      if (
        this.velocityX > 0 &&
        this.x + this.width >= platform.x &&
        this.x < platform.x + platform.width &&
        this.y + this.height > platform.y &&
        this.y < platform.y + platform.height
      ) {
        this.x = platform.x - this.width;
      }
    });
  }
  
  animate(deltaTime) {
    this.frameTimer += deltaTime;
    
    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      this.frameX++;
      
      if (this.frameX >= this.maxFrames) {
        this.frameX = 0;
      }
    }
  }
  
  draw(ctx, spriteImage) {
    ctx.save();
    
    // Flip horizontal si direction gauche
    if (this.direction === -1) {
      ctx.scale(-1, 1);
      ctx.drawImage(
        spriteImage,
        -this.x - this.width,
        this.y,
        this.width,
        this.height
      );
    } else {
      ctx.drawImage(
        spriteImage,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
    
    ctx.restore();
    
    // Debug hitbox (optionnel)
    // ctx.strokeStyle = 'red';
    // ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}