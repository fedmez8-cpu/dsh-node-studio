# DSH Node Studio

A visual node-based workflow editor plugin for **DeepSeek Harness (DSH)** to build multi-step AI pipelines, chain LLM agents, and export results.

<img width="1362" height="817" alt="image" src="https://github.com/user-attachments/assets/6ae3d541-89b1-47d0-9b3d-91d66f3b8089" />
<img width="1340" height="898" alt="image" src="https://github.com/user-attachments/assets/499f5545-c05c-44fc-8c71-63f7b07fc49c" />



## Key Features

- **Multi-Project Workspaces**: Create, rename, switch between, and delete independent mini-project boards (`Мини-проект 1`, `2`, etc.) with automatic persistence to both local storage and disk.
- **Four Node Types**:
  - **Input (`+ Ввод`)**: Direct text input nodes for prompts, world-building notes, or data snippets.
  - **Project File (`+ Файл`)**: Read local `.md`, `.txt`, `.json`, `.js`, `.py`, and other text files directly from your project folder with a one-click refresh button (`Обн.`).
  - **LLM Agent (`+ LLM`)**: Connect any configured provider and model in DSH, adjust temperature (`0.0` – `1.8`), and define custom system prompts.
  - **Pass-Through Output (`+ Вывод`)**: Combine results from one or multiple upstream nodes, edit generated drafts manually mid-pipeline via its output port (Human-in-the-Loop), view live character/word counts, copy text with one click, auto-save to `.md` files, or send outputs directly to a new DSH chat session.
- **Built-in & Custom Skills Library**: Choose from 5 built-in role presets directly inside any LLM node, save your own system prompts as reusable skills (`+`), delete custom presets, or export/import skills as `.json` and `.md` files.
- **Graph Export & Import (`.json`)**: Export any board—including all nodes, connections, model settings, prompts, and viewport state—to a portable `.json` file, and import saved graphs back as new boards with one click.
- **Interactive Canvas & Controls**:
  - Smooth pan (`Space + Drag` or middle-click drag) and zoom (`Mouse Wheel` centered on cursor).
  - Multi-node box selection (`Left-click drag` on canvas) and `Ctrl/Shift + Click` toggling.
  - Full keyboard shortcuts: `Ctrl+C` / `Ctrl+V` (copy/paste nodes with internal connections), `Ctrl+A` (select all), `Ctrl+Z` / `Ctrl+Y` (undo/redo history), `Delete` / `Backspace` (remove selected), and `Esc` (clear selection).
  - Resizable node cards (drag the bottom-right corner handle), collapsible node bars (`▼` / `▶`), and editable node titles (`Double-click` on header).
- **Flexible Execution & Abort Controls**: Run the entire pipeline (`Run Graph`), run an individual LLM node and its directly connected output (`▶` in node header) without auto-triggering downstream agents, or halt execution at any moment (`Stop` / `■`).
- **Multilingual UI**: Automatically adapts to Russian, English, and Chinese based on your DSH locale.

## Installation

1. Clone or download this repository into a local folder (e.g., `dsh-node-studio`).
2. Install dependencies inside the plugin directory:
   ```bash
   npm install
   ```
3. Link or register the plugin in your **DeepSeek Harness** instance (via `cordis.patch.yml` or DSH Plugin Manager) and restart DSH.
4. Open **Node Studio** from the left sidebar navigation panel.

## API Keys Configuration

The plugin automatically reads provider `baseURL` and API keys from your DSH profile (`cordis.patch.yml` and environment variables).  
If your provider key is stored in the OS keychain and not exposed to environment variables, copy `keys.example.json` to `keys.json` in the plugin folder and fill in your keys:

```json
{
  "gptunnel": "YOUR_GPTUNNEL_API_KEY",
  "openrouter": "YOUR_OPENROUTER_API_KEY",
  "deepseek": "YOUR_DEEPSEEK_API_KEY"
}
```


## Usage & Controls

- **Connect Nodes**: Click the blue output port on the right side of a source node, then click the green input port on the left side of a target node.
- **Disconnect Nodes**: Click directly on any connecting curve to remove it.
- **Human-in-the-Loop Editing**: Place an `Output` node between two LLM agents, click `▶` on the first LLM node, edit the resulting text inside the `Output` node, and click `▶` on the next LLM node to continue.
- **Skills & Presets**: Use the dropdown above `System Prompt` in any LLM node to apply a preset, `+` to save the current prompt as a custom skill, and `Exp` / `Imp` to share or load `.skill.json` and `.md` files.
- **Backup & Share Boards**: Click `Export` in the top toolbar to download the current board as a `.json` file, or `Import` to load a saved graph as a new project tab.

## License

MIT
