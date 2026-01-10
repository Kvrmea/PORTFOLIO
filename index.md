---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
title: Portfolio - Jeu Interactif
body_class: game-page
---

<div id="game-container">
  <!-- Background layers -->
  <div class="bg-layer bg-layer-1"></div>
  <div class="bg-layer bg-layer-2"></div>
  <div class="bg-layer bg-layer-3"></div>
  
  <!-- Écran titre -->
  <div id="title-screen">
    <h1 class="game-title">Bienvenu sur mon Portfolio Interactif</h1>
    <p class="game-subtitle">Explorez mes projets dans un univers pixel art</p>
    <button id="play-button" class="pixel-button">PLAY</button>
  </div>
  
  <!-- HUD moderne -->
  <div id="game-hud" class="hidden">
    <div class="hud-left">
      <div class="hud-card">
        <div class="hud-title">Projets découverts</div>
        <div class="hud-value">
          <span id="projects-found">0</span> / 6
        </div>
        <div class="progress-bar">
          <div class="progress-fill" id="progress-fill" style="width: 0%"></div>
        </div>
      </div>
    </div>
    <div class="hud-right">
      <div class="hud-card">
        <div class="hud-title">Contrôles</div>
        <div class="hud-value" style="font-size: 0.8rem;">
          ← → | Q D Déplacer<br>
          ↑ / ESPACE Sauter<br>
          E Interagir
        </div>
      </div>
    </div>
  </div>
  
  <!-- Canvas du jeu -->
  <canvas id="gameCanvas"></canvas>

  <!-- Onboarding -->
  <div id="onboarding" class="onboarding hidden">
    <p>
      ← → ou Q D pour te déplacer<br>
      ↑ ou ESPACE pour sauter<br>
      <strong>E</strong> pour interagir
    </p>
  </div>
    
  
  <!-- UI overlay pour les interactions -->
  <div id="ui-overlay"></div>
</div>

<!-- Modal pour les projets -->
<div id="project-modal" class="project-modal hidden">
  <div class="modal-content">
    <div class="modal-header">
      <h2 class="modal-title" id="modal-title">Projet</h2>
      <button class="close-button" id="close-modal">✕</button>
    </div>
    <div class="modal-body" id="modal-body">
      <!-- Contenu dynamique -->
    </div>
  </div>
</div>

<script>
  window.siteBaseUrl = "{{ site.baseurl }}";
</script>

<script src="{{ '/assets/js/player.js' | relative_url }}"></script>
<script src="{{ '/assets/js/game.js' | relative_url }}"></script>