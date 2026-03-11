# AGENT INSTRUCTIONS – KVMECORP APP

This repository contains a prototype for the KVMECORP application.

The goal is to build a minimal but expandable interactive music platform centered around an interactive globe.

## Core philosophy

The globe is the core of the application.

Do NOT simplify or remove the globe experience.

The globe must remain the main interactive system and must preserve all existing and intended core features.

## Mandatory globe features

The globe must support and preserve:

- slow rotation
- visible orbit lines
- mouse / touch drag interaction
- zoom on artist location
- visible artist markers
- continent / city / location logic
- focus animation on selected artist location
- artist card appearing after focus
- future flashback / mental-map logic
- future orbiting capsule logic

No feature related to the globe should be removed just to simplify development.

The globe is not decoration.
It is the central interface and narrative system.

## Data → Logic → Interface

Always respect this order:

DATA → LOGIC → INTERFACE

Data files are the source of truth.

Use:

data/artists.js

Do not hardcode artist content directly inside UI blocks if it can be data-driven.

## Artist cards

Each artist card contains:

- artist name
- city
- country
- musical inspiration
- universe keywords
- artistic influences
- energy
- symbol
- signature quote

Influences are useful as profile data, but should not create unnecessary complexity in the prototype.

## Energy palette

Current active palette:

- blood red
- palm green
- ocean blue
- purple

Yellow is reserved for later and should not be used in the main current system.

## Current prototype priorities

The current prototype must focus on:

1. globe interaction
2. automatic artist markers
3. artist focus / zoom
4. artist card display
5. capsule display logic
6. radio built from unlocked capsules

## Technical rules

- Do not break existing interactions
- Do not remove drag controls
- Do not remove zoom behavior
- Do not remove orbit visuals
- Keep code readable
- Keep code modular
- Avoid unnecessary complexity
- Prefer data-driven systems

## Design direction

The UI must stay:

- minimal
- immersive
- futuristic
- readable

The globe must feel alive and central.