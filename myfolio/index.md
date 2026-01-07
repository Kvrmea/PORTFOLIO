---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
title: Portfolio - Jeu Interactif
---

<div id="game-container">
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

<script src="{{ '/assets/js/player.js' | relative_url }}"></script>
<script src="{{ '/assets/js/game.js' | relative_url }}"></script>
