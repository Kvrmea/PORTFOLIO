---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
title: Portfolio - Jeu Interactif
---

<div id="game-container">
  <!-- Background layers -->
  <div class="bg-layer bg-layer-1"></div>
  <div class="bg-layer bg-layer-2"></div>
  <div class="bg-layer bg-layer-3"></div>
  
  <!-- Écran titre -->
  <div id="title-screen">
    <h1 class="game-title">Mon Portfolio en Jeu</h1>
    <button id="play-button" class="pixel-button">PLAY</button>
  </div>
  
  <!-- Canvas du jeu -->
  <canvas id="gameCanvas"></canvas>
  
  <!-- UI overlay pour les interactions -->
  <div id="ui-overlay"></div>
</div>

<!-- Modal pour les projets -->
<div id="project-modal" class="project-modal hidden">
  <div class="modal-content">
    <div class="modal-header">
      <h2 class="modal-title" id="modal-title">Projet</h2>
      <button class="close-button" id="close-modal">X</button>
    </div>
    <div class="modal-body" id="modal-body">
      <!-- Contenu dynamique -->
    </div>
  </div>
</div>

<script src="{{ '/assets/js/player.js' | relative_url }}"></script>
<script src="{{ '/assets/js/game.js' | relative_url }}"></script>