# Project Overview

**Project Name:** ai-rl-lunarlander

**Description:**
This project appears to be a Python-based implementation or starter template for a Reinforcement Learning (RL) agent designed to solve the LunarLander environment. Currently, it consists of basic project scaffolding with a simple entry point.

**Key Technologies:**
*   **Language:** Python (>=3.8)
*   **Package Manager:** `uv`
*   **Configuration:** `pyproject.toml` for project metadata and dependency management.

## Architecture
*   **Entry Point:** `main.py` contains the main execution logic.
*   **Configuration:** Project settings are defined in `pyproject.toml`.

# Building and Running

## Prerequisites
*   [uv](https://github.com/astral-sh/uv) installed.

## Installation
The project uses `uv` for environment management. To sync the environment and install dependencies:

```bash
uv sync
```

## Running the Application
To run the main script using `u/v`:

```bash
uv run main.py
```

# Development Conventions

*   **Project Structure:** Follows a standard flat Python project layout.
*   **Dependency Management:** Dependencies are managed via `project.dependencies` in `pyproject.toml`.
*   **Code Style:** Standard Python conventions are expected.
