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
let currentInteractable = null;
let modalOpen = false;
let projectsFound = 0;
let totalProjects = 6;
let lastInteractable = null;

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

    titleScreen.addEventListener('animationend', () => {
      titleScreen.classList.add('removed');
    }, {once: true});

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
  const basePath = window.siteBaseUrl || '';

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
  playerImage.src = basePath + '/assets/images/character/player.png';
  
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
  npcImage.src = basePath + '/assets/images/character/pnj-jeu.png';
  
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
  swordImage.src = basePath + '/assets/images/objects/sword.png';
}

function checkImagesLoaded() {
  if (imagesLoaded >= totalImages) {
    console.log('Toutes les images sont chargées !');
  }
}

function startGame() {
  gameRunning = true;
  lastTime = performance.now();

  const gameHud = document.getElementById('game-hud');
  gameHud.classList.remove('hidden');
  requestAnimationFrame(() => {
    gameHud.classList.add("visible")
  });

  const canvas = document.getElementById("gameCanvas");
  requestAnimationFrame(() => {
    canvas.classList.add("zoomded");
  });

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
      y: 480, 
      width: 50, 
      height: 70, 
      projectId: 1,
      title: 'Projet 1',
      discovered: false 
    },
    { 
      type: 'sword', 
      x: 500, 
      y: 270, 
      width: 50, 
      height: 70, 
      projectId: 2,
      title: 'Projet 2',
      discovered: false 
    },
    { 
      type: 'sword', 
      x: 750, 
      y: 170, 
      width: 50, 
      height: 70, 
      projectId: 3,
      title: 'Projet 3',
      discovered: false 
    },
    { 
      type: 'sword', 
      x: 1000, 
      y: 270, 
      width: 50, 
      height: 70, 
      projectId: 4,
      title: 'Projet 4',
      discovered: false 
    },
    { 
      type: 'sword', 
      x: 550, 
      y: 80, 
      width: 50, 
      height: 70, 
      projectId: 5,
      title: 'Projet 5',
      discovered: false 
    },
    { 
      type: 'sword', 
      x: 100, 
      y: 480, 
      width: 50, 
      height: 70, 
      projectId: 6,
      title: 'Projet 6',
      discovered: false 
    },
    
    // PNJ pour "À propos"
    { 
      type: 'npc', 
      x: 900, 
      y: 470, 
      width: 70, 
      height: 90,
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

  let nearestNPC = null;
  let nearestOther = null;

  for (const obj of interactiveObjects) {
    const distance = Math.hypot(
      (player.x + player.width / 2) - (obj.x + obj.width / 2),
      (player.y + player.height / 2) - (obj.y + obj.height / 2)
    );

    if (distance < 90) {
      if (obj.type === 'npc') {
        nearestNPC = obj;
        break;
      } else if (!nearestOther) {
        nearestOther = obj;
      }
    }
  }

  const target = nearestNPC || nearestOther;

  // SI RIEN À INTERAGIR
  if (!target) {
    uiOverlay.innerHTML = '';
    currentInteractable = null;
    lastInteractable = null;
    return;
  }

  // SI C’EST LE MÊME OBJET → ON NE REDESSINE PAS
  if (target === lastInteractable) {
    currentInteractable = target;
    return;
  }

  // NOUVEL OBJET → ON REDESSINE
  uiOverlay.innerHTML = '';
  currentInteractable = target;
  lastInteractable = target;

  // BULLE PNJ
  if (target.type === 'npc') {
    const bubble = document.createElement('div');
    bubble.className = 'npc-dialogue';
    bubble.innerHTML = `
      <strong>Hugo :</strong><br>
      Bienvenue dans mon univers.<br>
      Je m'appelle Hugo, et si tu veux en découvrir plus,<br>
      appuie sur <strong>E</strong>.
    `;

    bubble.style.left = `${target.x - 80}px`;
    bubble.style.top = `${target.y - 90}px`;

    uiOverlay.appendChild(bubble);
  } else {
    const hint = document.createElement('div');
    hint.className = 'interaction-hint';

    if (target.type === 'chest') {
      hint.textContent = `🔗 ${target.label}`;
      hint.classList.add(`hint-${target.link}`); 
    }else {
      hint.textContent = `Appuie sur E pour ${target.title || target.label || 'interagir'}`;
    }
    
    hint.style.left = `${target.x}px`;
    hint.style.top = `${target.y - 40}px`;

    uiOverlay.appendChild(hint);
  }
}

window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'e') {

    if (modalOpen) {
        closeProjectModal();
        return;
    }
    if (currentInteractable && gameRunning) {
        handleInteraction(currentInteractable);
    }
  }
});

document.getElementById('close-modal')?.addEventListener('click', closeProjectModal);



// function showInteractionHint(obj) {
//   const uiOverlay = document.getElementById('ui-overlay');
  
//   const hint = document.createElement('div');
//   hint.className = 'interaction-hint';
//   hint.textContent = `Clic pour ${obj.title || obj.label || 'interagir'}`;
//   hint.style.left = `${obj.x}px`;
//   hint.style.top = `${obj.y - 40}px`;
  
//   hint.addEventListener('click', () => {
//     handleInteraction(obj);
//   });
  
//   uiOverlay.appendChild(hint);
// }

function handleInteraction(obj) {
  switch(obj.type) {
    case 'sword':
      // Marquer comme découvert et incrémenter
      if (!obj.discovered) {
        obj.discovered = true;
        projectsFound++;
        updateProjectsUI();
      }
      showProject(obj.projectId, obj.title);
      break;
    case 'npc':
      const basePath = window.siteBaseUrl || '';
      window.location.href = basePath + '/about';
      break;
    case 'chest':
      openSocialLink(obj.link);
      break;
  }
}

function showProject(projectId, title) {
  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  
  // Données des projets
  const projects = {
    1: {
      title: "Projet 1 - Klivio",
      description: "Un site de formation.",
      technologies: ["HTML", "CSS"],
      features: [
        "Interface responsive",
        "Identique à une maquette lors de mon projet en école",
      ],
      link: "https://kvrmea.github.io/klivio_EPITECH/"
    },
    2: {
      title: "Projet 2 - Klivio.v2",
      description: "Site de formation dynamque.",
      technologies: ["HTML", "CSS", "Tailwind"],
      features: [
        "Site responsive et dynamque",
        "Intégration de tailwind",
        "Modération automatique"
      ],
      link: "https://kvrmea.github.io/klivio_tailwind/"
    },
    3: {
      title: "Projet 3 - Portfolio Interactif en jeu",
      description: "Ce portfolio que vous explorez actuellement !",
      technologies: ["Jekyll", "JavaScript", "Canvas API"],
      features: [
        "Jeu platformer",
        "Interactions dynamiques",
        "Design pixel art"
      ],
      link: "https://kvrmea.github.io/PORTFOLIO/"
    },
    4: {
      title: "Projet 4 - Système solaire 3D",
      description: "Site d'une animation en 3D.",
      technologies: ["HTML", "API", "JavaScript", "Three.js", "CSS"],
      features: [
        "3d three.js",
        "fetch API",
      ],
      link: "#"
    },
    5: {
      title: "Projet 5 - Site E-commerce",
      description: "Plateforme e-commerce complète avec panier et paiement.",
      technologies: ["Vue.js", "Stripe", "PostgreSQL"],
      features: [
        "Gestion de panier",
        "Paiement sécurisé",
        "Dashboard admin"
      ],
      link: "#"
    },
    6: {
      title: "Projet 6 - IA & Machine Learning",
      description: "Projet utilisant le machine learning pour la reconnaissance d'images.",
      technologies: ["Python", "TensorFlow", "OpenCV"],
      features: [
        "Reconnaissance d'objets",
        "Apprentissage automatique",
        "API de prédiction"
      ],
      link: "#"
    }
  };
  
  const project = projects[projectId];
  
  modalTitle.textContent = project.title;
  modalBody.innerHTML = `
    <p>${project.description}</p>
    
    <h3>🛠️ Technologies utilisées</h3>
    <ul>
      ${project.technologies.map(tech => `<li>${tech}</li>`).join('')}
    </ul>
    
    <h3>✨ Fonctionnalités principales</h3>
    <ul>
      ${project.features.map(feature => `<li>${feature}</li>`).join('')}
    </ul>
    
    <a href="${project.link}" class="project-link" target="_blank">Voir le projet →</a>
  `;
  
  modal.classList.remove('hidden');
  // gameRunning = false; // Pause le jeu
  // modalOpen = true;
  openProjectModal();
}

function openSocialLink(platform) {
    const links = {
        github: 'https://github.com/Kvrmea',
        linkedin: 'https://www.linkedin.com/in/hugo-munoz03/'
    };
    if (links[platform]) {
        window.open(links[platform], '_blank');
    }
}

function openProjectModal () {
  gameRunning = false;
  modalOpen = true;
  document.getElementById('game-hud').classList.add('hidden');
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal')
    modal.classList.add('hidden');

    document.getElementById('game-hud').classList.remove('hidden');
    
    gameRunning = true;
    modalOpen = false;
    lastTime = performance.now();

    requestAnimationFrame(gameLoop);
}

function updateProjectsUI() {
  const countEl = document.getElementById("projects-found");
  const fillEl = document.getElementById("progress-fill");

  countEl.textContent = projectsFound;
  const percent = (projectsFound / totalProjects) * 100;
  fillEl.style.width = percent + "%";
}