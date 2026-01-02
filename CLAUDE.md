# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Reinforcement Learning Lunar Lander project with a Svelte 5 web interface for training visualization and manual play.

## Development Commands

### Web Interface (Svelte 5)
```bash
cd web
npm install        # Install dependencies
npm run dev        # Start dev server (http://localhost:5173)
npm run build      # Production build
npm run preview    # Preview production build
```

### Python (RL Backend - future)
```bash
python main.py     # Run main script
```

## Architecture

### Web (`/web`)
- **Framework**: SvelteKit with Svelte 5 (uses runes: `$state`, `$props`)
- **Game Engine**: Custom physics in `src/lib/game/engine.ts`
- **Rendering**: Canvas-based in `src/lib/game/renderer.ts`
- **Game Component**: `src/lib/game/LunarLander.svelte`

Key game mechanics:
- Gravity simulation with thrust vectoring
- Terrain generation with random landing pads
- Landing detection based on velocity and angle thresholds
- Keyboard controls (arrows/WASD for movement)

### Python (`/`)
- Python 3.8+ (see `.python-version`)
- Entry point: `main.py`
- Dependencies: `pyproject.toml`
