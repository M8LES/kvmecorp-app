# KVMECORP – BRIEF DU PROJET

## Vision du projet

KVMECORP est une application musicale immersive construite autour d’un système de **capsules artistiques**.

Chaque capsule représente l’univers d’un artiste.

L’utilisateur explore ces capsules via une **planète interactive** qui sert de hub principal.

Le projet mélange :

* musique
* univers visuel
* narration
* exploration

L’application fonctionne comme une **carte mentale vivante**, inspirée du graph d’Obsidian :
les connexions et éléments apparaissent progressivement dans le temps.

KVMECORP n’est pas seulement un label.
C’est un **univers artistique évolutif**.

---

# Structure générale de l'application

Le projet repose sur trois couches principales :

DATA → LOGIC → INTERFACE

---

# DATA

La couche data contient toutes les informations utilisées par l'application :

* artistes
* capsules
* audio
* villes
* couleurs
* univers

Fichier principal :

```
data/artists.js
```

Les informations des artistes doivent être définies dans ce fichier.

L'interface et les systèmes doivent **lire les données automatiquement**.

---

# LOGIC

La logique contient les comportements du système.

Elle gère :

* rotation de la planète
* interaction souris / doigt
* zoom
* apparition des points artistes
* ouverture des cartes artistes
* apparition des capsules
* radio dynamique
* système futur de connexions (flashback / carte mentale)

Fichier principal :

```
script.js
```

---

# INTERFACE

L'interface affiche les éléments visuels :

* planète
* cartes artistes
* capsules
* radio
* animations

Fichiers :

```
index.html
style.css
```

---

# La planète (élément central)

La planète est **le cœur de l'application**.

Elle n'est pas un simple décor.
Elle sert de système principal de navigation.

La planète doit conserver toutes les fonctionnalités suivantes :

* rotation lente
* déplacement avec souris ou doigt (drag)
* zoom
* points artistes visibles
* logique continents / villes
* animation de focus sur une ville
* apparition d'une carte artiste
* orbites visibles autour de la planète
* futur système de connexions (carte mentale)

Aucune fonctionnalité liée à la planète ne doit être supprimée pour simplifier le développement.

---

# Points artistes

Chaque artiste possède un point sur la planète.

Les points doivent être générés automatiquement à partir des données dans :

```
data/artists.js
```

Quand un utilisateur clique sur un point :

1. la planète zoom sur la zone
2. la ville devient visible
3. une carte artiste apparaît

---

# Cartes artistes

Chaque artiste possède une carte contenant :

* nom d'artiste
* ville
* pays
* inspiration musicale
* mots définissant son univers
* influences artistiques
* énergie (couleur)
* symbole
* phrase signature

Exemple de structure :

Nom : MVK
Ville : Plateau Caillou
Pays : La Réunion

Inspiration musicale :
Hoodtrap

Univers :

* rue
* ambition
* pression

Influences :

* rap US
* trap
* culture urbaine

Energie :
violet

Symbole :
couronne

Phrase :
"Rent dans la capsule"

---

# Capsules

Chaque artiste possède une capsule.

Une capsule représente :

* un morceau
* un projet
* une sortie musicale

Les capsules apparaissent visuellement comme des **objets entrant depuis l’espace**.

Effets possibles :

* déplacement rapide
* trainée lumineuse
* mise en orbite autour de la planète

Une fois arrivées, les capsules deviennent sélectionnables.

---

# Radio

La radio est un système dynamique.

Elle se construit automatiquement avec :

* les capsules débloquées
* les morceaux disponibles

La radio évolue à mesure que l'utilisateur découvre les capsules.

---

# Système futur : carte mentale / flashback

Le projet inclura un système inspiré d'Obsidian.

Les connexions apparaîtront progressivement entre :

* artistes
* capsules
* villes
* influences
* moments importants

Visuellement cela formera une **constellation musicale vivante** autour de la planète.

---

# Ordre actuel des artistes

Capsules prévues :

1. MVK
2. ENDEN
3. LAMOULA.16
4. LATR2IIX
5. SAIYAN
6. GOTEN

Chaque artiste possède une capsule principale.

---

# Palette d'énergie (actuelle)

Couleurs électriques mais non saturées :

* rouge sang
* vert palmier
* bleu océan
* violet

Le jaune n'est pas utilisé pour l'instant et sera introduit plus tard.

---

# Prototype actuel

Objectif : prototype fonctionnel en **2 semaines**.

Priorités :

1. planète interactive
2. génération automatique des points artistes
3. zoom sur artiste
4. carte artiste
5. capsule MVK fonctionnelle
6. radio dynamique

---

# Philosophie KVMECORP

KVMECORP doit donner l'impression d'explorer un **univers musical vivant**.

Le système doit être :

* immersif
* évolutif
* minimaliste
* lisible
* narratif
