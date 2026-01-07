// Configuration du jeu
const CONFIG = {
  canvasWidth: 1200,
  canvasHeight: 600,
  backgroundColor: '#1a1a2e'
};

// Variables globales
let canvas, ctx;
let player;
let platforms = [];
let interactiveObjects = [];
let lastTime = 0;
let gameRunning = false;

// Images
let playerImage;
let npcImage;
let swordImage;
let imagesLoaded = 0;
let totalImages = 3;

// Initialisation
window.addEventListener('DOMContentLoaded', () => {
  initGame();
  setupPlayButton();
});

function setupPlayButton() {
  const playButton = document.getElementById('play-button');
  const titleScreen = document.getElementById('title-screen');
  
  playButton.addEventListener('click', () => {
    titleScreen.classList.add('hidden');
    startGame();
  });
}

function initGame() {
  // Setup canvas
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  
  // Définir la taille du canvas
  canvas.width = CONFIG.canvasWidth;
  canvas.height = CONFIG.canvasHeight;
  
  // Charger les images
  loadImages();
}

function loadImages() {
  playerImage = new Image();
  playerImage.onload = () => {
    imagesLoaded++;
    checkImagesLoaded();
  };
  playerImage.onerror = () => {
    console.error('Erreur de chargement de l\'image du joueur');
    imagesLoaded++;
    checkImagesLoaded();
  };
  playerImage.src = '/assets/images/character/player.png';
  
  // Charger l'image du PNJ
  npcImage = new Image();
  npcImage.onload = () => {
    imagesLoaded++;
    checkImagesLoaded();
  };
  npcImage.onerror = () => {
    console.error('Erreur de chargement de l\'image du PNJ');
    imagesLoaded++;
    checkImagesLoaded();
  };
  npcImage.src = '/assets/images/character/pnj-jeu.png';
  
  // Charger l'image de l'épée
  swordImage = new Image();
  swordImage.onload = () => {
    imagesLoaded++;
    checkImagesLoaded();
  };
  swordImage.onerror = () => {
    console.error('Erreur de chargement de l\'image de l\'épée');
    imagesLoaded++;
    checkImagesLoaded();
  };
  swordImage.src = '/assets/images/objects/sword.png';
}

function checkImagesLoaded() {
  if (imagesLoaded >= totalImages) {
    console.log('Toutes les images sont chargées !');
  }
}

function startGame() {
  // Créer le joueur
  player = new Player(100, 100);
  
  // Créer les plateformes
  createPlatforms();
  
  // Créer les objets interactifs (épées, PNJ, etc.)
  createInteractiveObjects();
  
  // Démarrer la boucle de jeu
  gameRunning = true;
  requestAnimationFrame(gameLoop);
}

function createPlatforms() {
  platforms = [
    // Sol principal
    { x: 0, y: 550, width: 1200, height: 50, color: '#2d4059' },
    
    // Plateformes pour monter
    { x: 200, y: 450, width: 150, height: 20, color: '#ea5455' },
    { x: 450, y: 350, width: 150, height: 20, color: '#ea5455' },
    { x: 700, y: 250, width: 150, height: 20, color: '#ea5455' },
    { x: 950, y: 350, width: 150, height: 20, color: '#ea5455' },
    
    // Plateforme haute
    { x: 500, y: 150, width: 200, height: 20, color: '#f07b3f' }
  ];
}

function createInteractiveObjects() {
  interactiveObjects = [
    // Épées pour les projets (6 au total)
    { 
      type: 'sword', 
      x: 250, 
      y: 500, 
      width: 30, 
      height: 40, 
      projectId: 1,
      title: 'Projet 1'
    },
    { 
      type: 'sword', 
      x: 500, 
      y: 300, 
      width: 30, 
      height: 40, 
      projectId: 2,
      title: 'Projet 2'
    },
    { 
      type: 'sword', 
      x: 750, 
      y: 200, 
      width: 30, 
      height: 40, 
      projectId: 3,
      title: 'Projet 3'
    },
    { 
      type: 'sword', 
      x: 1000, 
      y: 300, 
      width: 30, 
      height: 40, 
      projectId: 4,
      title: 'Projet 4'
    },
    { 
      type: 'sword', 
      x: 550, 
      y: 100, 
      width: 30, 
      height: 40, 
      projectId: 5,
      title: 'Projet 5'
    },
    { 
      type: 'sword', 
      x: 100, 
      y: 500, 
      width: 30, 
      height: 40, 
      projectId: 6,
      title: 'Projet 6'
    },
    
    // PNJ pour "À propos"
    { 
      type: 'npc', 
      x: 900, 
      y: 490, 
      width: 40, 
      height: 60,
      label: 'À Propos'
    },
    
    // Coffres pour réseaux sociaux
    { 
      type: 'chest', 
      x: 50, 
      y: 520, 
      width: 35, 
      height: 30,
      link: 'github',
      label: 'GitHub'
    },
    { 
      type: 'chest', 
      x: 1100, 
      y: 520, 
      width: 35, 
      height: 30,
      link: 'linkedin',
      label: 'LinkedIn'
    }
  ];
}

function gameLoop(timestamp) {
  if (!gameRunning) return;
  
  // Calculer le delta time
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  
  // Clear canvas
  ctx.fillStyle = CONFIG.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Update
  player.update(deltaTime, platforms);
  
  // Draw
  drawPlatforms();
  drawInteractiveObjects();
  drawPlayer();
  
  // Check interactions
  checkInteractions();
  
  // Continue la boucle
  requestAnimationFrame(gameLoop);
}

function drawPlatforms() {
  platforms.forEach(platform => {
    // Bordure
    ctx.fillStyle = '#000';
    ctx.fillRect(platform.x - 2, platform.y - 2, platform.width + 4, platform.height + 4);
    
    // Plateforme
    ctx.fillStyle = platform.color;
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    
    // Effet pixel art
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
  });
}

function drawInteractiveObjects() {
  interactiveObjects.forEach(obj => {
    ctx.save();
    
    switch(obj.type) {
      case 'sword':
        drawSword(obj);
        break;
      case 'npc':
        drawNPC(obj);
        break;
      case 'chest':
        drawChest(obj);
        break;
    }
    
    ctx.restore();
  });
}

function drawSword(sword) {
  if (swordImage.complete && swordImage.naturalHeight !== 0) {
    // Effet de brillance qui pulse
    const pulse = Math.sin(Date.now() / 300) * 3;
    
    // Ombre/aura brillante
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 15 + pulse;
    ctx.drawImage(
      swordImage,
      sword.x - 5,
      sword.y - 5,
      sword.width + 10,
      sword.height + 10
    );
    ctx.restore();
    
    // Dessiner l'épée
    ctx.drawImage(
      swordImage,
      sword.x,
      sword.y,
      sword.width,
      sword.height
    );
    
    // Particules scintillantes autour de l'épée
    const time = Date.now() / 500;
    for (let i = 0; i < 3; i++) {
      const angle = time + (i * Math.PI * 2 / 3);
      const sparkleX = sword.x + sword.width / 2 + Math.cos(angle) * 20;
      const sparkleY = sword.y + sword.height / 2 + Math.sin(angle) * 15;
      
      ctx.fillStyle = '#ffff00';
      ctx.globalAlpha = 0.6 + Math.sin(time * 3 + i) * 0.4;
      ctx.beginPath();
      ctx.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  } else {
    // Fallback si l'image n'est pas chargée
    const pulse = Math.sin(Date.now() / 300) * 5;
    
    // Ombre
    ctx.fillStyle = 'rgba(255, 107, 107, 0.3)';
    ctx.beginPath();
    ctx.arc(sword.x + 15, sword.y + 40, 15 + pulse, 0, Math.PI * 2);
    ctx.fill();
    
    // Lame
    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(sword.x + 12, sword.y, 6, 25);
    
    // Garde
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(sword.x + 5, sword.y + 25, 20, 5);
    
    // Poignée
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(sword.x + 10, sword.y + 30, 10, 10);
    
    // Pommeau
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(sword.x + 15, sword.y + 43, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawNPC(npc) {
  if (npcImage.complete && npcImage.naturalHeight !== 0) {
    // Dessiner l'image du PNJ
    ctx.drawImage(
      npcImage,
      npc.x,
      npc.y,
      npc.width,
      npc.height
    );
  } else {
    // Fallback si l'image n'est pas chargée
    // Corps
    ctx.fillStyle = '#4a5568';
    ctx.fillRect(npc.x + 10, npc.y + 30, 20, 30);
    
    // Tête
    ctx.fillStyle = '#fdbcb4';
    ctx.beginPath();
    ctx.arc(npc.x + 20, npc.y + 20, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // Yeux
    ctx.fillStyle = '#000';
    ctx.fillRect(npc.x + 15, npc.y + 18, 3, 3);
    ctx.fillRect(npc.x + 22, npc.y + 18, 3, 3);
    
    // Cape
    ctx.fillStyle = '#ed64a6';
    ctx.beginPath();
    ctx.moveTo(npc.x + 5, npc.y + 30);
    ctx.lineTo(npc.x + 35, npc.y + 30);
    ctx.lineTo(npc.x + 30, npc.y + 55);
    ctx.lineTo(npc.x + 10, npc.y + 55);
    ctx.closePath();
    ctx.fill();
  }
}

function drawChest(chest) {
  // Base du coffre
  ctx.fillStyle = '#8b4513';
  ctx.fillRect(chest.x, chest.y + 15, chest.width, chest.height - 15);
  
  // Couvercle
  ctx.fillStyle = '#a0522d';
  ctx.fillRect(chest.x, chest.y, chest.width, 15);
  
  // Serrure
  ctx.fillStyle = '#ffd700';
  ctx.fillRect(chest.x + chest.width / 2 - 3, chest.y + 10, 6, 8);
  
  // Bordures
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.strokeRect(chest.x, chest.y, chest.width, chest.height);
}

function drawPlayer() {
  if (playerImage.complete && playerImage.naturalHeight !== 0) {
    player.draw(ctx, playerImage);
  } else {
    // Fallback si l'image n'est pas chargée
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Yeux
    ctx.fillStyle = '#fff';
    ctx.fillRect(player.x + 10, player.y + 10, 8, 8);
    ctx.fillRect(player.x + 30, player.y + 10, 8, 8);
  }
}

function checkInteractions() {
  const uiOverlay = document.getElementById('ui-overlay');
  uiOverlay.innerHTML = ''; // Clear previous hints
  
  interactiveObjects.forEach(obj => {
    const distance = Math.hypot(
      (player.x + player.width / 2) - (obj.x + obj.width / 2),
      (player.y + player.height / 2) - (obj.y + obj.height / 2)
    );
    
    // Si le joueur est proche
    if (distance < 80) {
      showInteractionHint(obj);
    }
  });
}

function showInteractionHint(obj) {
  const uiOverlay = document.getElementById('ui-overlay');
  
  const hint = document.createElement('div');
  hint.className = 'interaction-hint';
  hint.textContent = `Clic pour ${obj.title || obj.label || 'interagir'}`;
  hint.style.left = `${obj.x}px`;
  hint.style.top = `${obj.y - 40}px`;
  
  hint.addEventListener('click', () => {
    handleInteraction(obj);
  });
  
  uiOverlay.appendChild(hint);
}

function handleInteraction(obj) {
  switch(obj.type) {
    case 'sword':
      showProject(obj.projectId, obj.title);
      break;
    case 'npc':
      window.location.href = '/about.html';
      break;
    case 'chest':
      openSocialLink(obj.link);
      break;
  }
}

function showProject(projectId, title) {
  alert(`Affichage du projet ${projectId}: ${title}\n\nOn créera un modal stylé dans la prochaine étape !`);
}

function openSocialLink(platform) {
  alert(`Redirection vers ${platform}\n\nOn ajoutera les vrais liens dans la prochaine étape !`);
}