# DSH Node Studio

A visual node-based workflow editor plugin for **DeepSeek Harness (DSH)** to build multi-step AI pipelines, chain LLM agents, and export results.

<img width="1362" height="817" alt="image" src="https://github.com/user-attachments/assets/6ae3d541-89b1-47d0-9b3d-91d66f3b8089" />


## Key Features

- **Multi-Input & Sequential Agent Chains**: Connect input nodes, project files, and upstream LLM agents; downstream agents wait for upstream completion.
- **Auto-Discovery & Controls**: Automatically loads models from your DSH profile with per-node system prompts and temperature settings (`0.0 – 1.8`).
- **File & Output Integration**: Read workspace files (`.md`, `.txt`, `.json`, `.yaml`) via `+ File` and save or export results via `+ Output`.
- **Canvas & Localization**: Infinite canvas with pan/zoom/resize, multi-board support, and native localization (**English**, **Русский**, **简体中文**).

## Quick Installation

1. Place the plugin files into a local directory (e.g. `~/plugins/dsh-node-studio`).
2. Register the plugin in your DSH profile (`~/.dsh/profiles/desktop/package.json`):
```json
{
  "dependencies": {
    "dsh-node-studio": "link:/path/to/dsh-node-studio"
  },
  "dsh": { "profile": { "bundles": ["dsh-node-studio"] } }
}
```
3. Restart **DeepSeek Harness** to access **Node Studio** in the sidebar.

## API Keys & Configuration

The plugin reads keys and `baseURL` from your DSH profile. For keys stored outside environment variables, copy `keys.example.json` to `keys.json` in the plugin directory:
```json
{
  "gptunnel": "sk-...",
  "openrouter": "sk-or-..."
}
```

## Usage & Controls

- **Select Nodes**: Left-click a node to select it, `Shift/Ctrl + Click` to toggle multiple nodes, or drag a selection box with the left mouse button on empty canvas space (`Ctrl+A` to select all).
- **Connect & Disconnect Nodes**: Click the blue output port on a source node and then the green input port on the target node. Left-click on any blue wire to delete it.
- **Move & Resize Nodes**: Drag any node (or a group of selected nodes) by its header, or use the handle at the bottom-right corner to resize.
- **Rename a Node**: Double-click the node title in its header.
- **Duplicate & Delete**: Press `Ctrl+C` / `Ctrl+V` to copy and paste selected nodes along with their internal connections, or `Delete` / `Backspace` to remove them.
- **Undo / Redo**: Press `Ctrl+Z` to undo and `Ctrl+Shift+Z` (or `Ctrl+Y`) to redo canvas changes.
- **Canvas Navigation**: Hold the middle mouse button (or `Space + Left Drag`) to pan and use the mouse wheel to zoom.

## License

MIT
