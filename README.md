# DSH Node Studio

A visual node-based workflow editor plugin for **DeepSeek Harness (DSH)**.
Build multi-step AI pipelines with multiple inputs, project file readers, chained LLM agents, and one-click export to Markdown or a new workspace session.

## Features

- **Multi-Input & Sequential Agent Chains**: Connect any number of input nodes, project files, and upstream LLM agents into a single node. Downstream agents wait for all connected upstream nodes to finish before running.
- **Auto-Discovery of Models**: Automatically loads all configured providers and models from your DSH profile (OpenRouter, GPTunnel, DeepSeek, local Ollama, etc.).
- **Per-Node Controls**: Set individual system prompts and temperature (`0.0 – 1.8`) for each LLM node.
- **Project File Reader (`+ File`)**: Read `.md`, `.txt`, `.json`, and `.yaml` files directly from your active workspace folder with live preview and automatic refresh before execution.
- **Output & Session Export (`+ Output`)**: Automatically save generated results as `.md` files into your project folder or send them straight into a new DSH session.
- **Multi-Board Mini-Projects**: Create, rename, switch, and auto-save multiple node boards on disk.
- **Infinite Canvas**: Pan with middle-mouse drag, zoom smoothly with the mouse wheel, and resize any node card from its bottom-right handle.
- **Native Localization**: Automatically follows DSH UI language settings (**English**, **Русский**, **简体中文**).

## Installation

1. Clone or download this repository into a local folder (e.g. `~/plugins/dsh-node-studio`).
2. Add the plugin to your DSH profile (`~/.dsh/profiles/desktop/package.json`):

3. 

## Usage & Controls

- **Connect Nodes**: Click the blue output port on a source node and then the green input port on the target node.
- **Disconnect / Delete a Wire**: Left-click on the blue connection line.
- **Rename a Node**: Double-click the node title in its header.
- **Move & Resize Nodes**: Drag a node by its header or use the handle at the bottom-right corner.
- **Canvas Navigation**: Hold the middle mouse button to pan and use the mouse wheel to zoom.

Full documentation and installation steps are available in the repository.


```json
{
  "dependencies": {
    "dsh-node-studio": "link:/path/to/dsh-node-studio"
  },
  "dsh": {
    "profile": {
      "bundles": [
        "dsh-node-studio"
      ]
    }
  }
}
```

3. Restart **DeepSeek Harness**. **Node Studio** will appear in the left sidebar.

## API Keys Configuration

The plugin automatically reads provider `baseURL` and API keys from your DSH profile (`cordis.patch.yml` and environment variables).
If your provider key is stored in the OS keychain and not exposed to environment variables, copy `keys.example.json` to `keys.json` in the plugin folder and fill in your keys:

```json
{
  "gptunnel": "sk-...",
  "openrouter": "sk-or-..."
}
```

## License

MIT
