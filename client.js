window.__ModuleLoader__.load({
  id: "dsh-node-studio",
  factory: (require) => {
    const module = { exports: {} };
    const exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

    const React = require("react");
    const { jsx, jsxs } = require("react/jsx-runtime");

    const PANEL_ID = "node-studio";
    const PANEL_ORDER = 35;
    const STORAGE_KEY = "dsh-node-studio-boards-v2";
    const inject = ["slots", "locale"];
    function NodeStudioIcon({ size }) {
      return jsxs("svg", {
        "data-dsh-panel-entry": PANEL_ID,
        viewBox: "0 0 16 16",
        width: size,
        height: size,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.3",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": "true",
        children: [
          jsx("rect", { x: "1.8", y: "2.5", width: "4.4", height: "3.4", rx: "1" }),
          jsx("rect", { x: "9.8", y: "2.5", width: "4.4", height: "3.4", rx: "1" }),
          jsx("rect", { x: "5.8", y: "10.1", width: "4.4", height: "3.4", rx: "1" }),
          jsx("path", { d: "M4 5.9v1.8c0 .8.6 1.2 1.4 1.2h5.2c.8 0 1.4-.4 1.4-1.2V5.9M8 8.9v1.2" })
        ]
      });
    }
    function makeStarterBoard(id, name, projectDir) {
      return {
        id: id || ("proj-" + Date.now()),
        name: name || "Мини-проект 1",
        projectDir: projectDir || "",
        view: { x: 0, y: 0, zoom: 1 },
        nodes: [
          { id: "n1", type: "input", title: "Мир", x: 40, y: 40, text: "Мрачный киберпанк-мегаполис под вечным дождём." },
          { id: "n2", type: "input", title: "Герои", x: 40, y: 240, text: "Детектив Кай и его напарник-андроид." },
          { id: "n3", type: "llm", title: "Сценарист", x: 410, y: 110, provider: "", model: "", systemPrompt: "Напиши яркую сцену, объединив все переданные вводные данные." },
          { id: "n4", type: "output", title: "Результат", x: 770, y: 80, text: "", saveMd: true, fileName: "scene.md" }
        ],
        edges: [
          { from: "n1", to: "n3" },
          { from: "n2", to: "n3" },
          { from: "n3", to: "n4" }
        ]
      };
    }
    function normalizeBoardsData(raw) {
      if (raw && Array.isArray(raw.boards) && raw.boards.length > 0) {
        const activeId = raw.boards.some((b) => b.id === raw.activeBoardId) ? raw.activeBoardId : raw.boards.at(0).id;
        return { boards: raw.boards, activeBoardId: activeId };
      }
      if (raw && Array.isArray(raw.nodes) && raw.nodes.length > 0) {
        const migrated = {
          id: "proj-initial",
          name: "Основной проект",
          projectDir: raw.projectDir || "",
          view: raw.view || { x: 0, y: 0, zoom: 1 },
          nodes: raw.nodes,
          edges: raw.edges || []
        };
        return { boards: [migrated], activeBoardId: migrated.id };
      }
      const first = makeStarterBoard("proj-1", "Мини-проект 1", "");
      return { boards: [first], activeBoardId: first.id };
    }

    function loadLocalBoards() {
      try {
        const str = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("dsh-node-studio-state-v1");
        if (str) return normalizeBoardsData(JSON.parse(str));
      } catch {}
      return normalizeBoardsData(null);
    }
    const I18N = {
      ru: {
        rename: "Имя",
        newBoard: "+ Новый проект",
        delBoard: "Удалить",
        addInput: "+ Ввод",
        addFile: "+ Файл",
        addLlm: "+ LLM",
        addOut: "+ Вывод",
        projectDirPh: "Папка проекта...",
        runGraph: "Запустить граф",
        modelsCount: "Моделей: ",
        running: "Выполнение графа...",
        readingInputs: "Чтение входных узлов...",
        done: "Граф выполнен!",
        providerModel: "Поставщик и модель:",
        temp: "Температура: ",
        sysPrompt: "Системный промпт:",
        sysPromptPh: "Роль или правила...",
        inputPh: "Введите текст...",
        selectFile: "-- Выберите файл --",
        refreshBtn: "Обн.",
        filePreviewPh: "Предпросмотр содержимого файла...",
        outputPh: "Результат...",
        saveMdChk: "Сохранять .md в папку проекта",
        fileNamePh: "Имя файла (например scene.md)",
        saveMdBtn: "Сохранить .md",
        newSessionBtn: "В новую сессию",
        nodeInput: "Ввод",
        nodeFile: "Файл проекта",
        nodeLlm: "LLM-Агент",
        nodeOutput: "Результат",
        boardPrefix: "Мини-проект "
      },
      en: {
        rename: "Rename",
        newBoard: "+ New Board",
        delBoard: "Delete",
        addInput: "+ Input",
        addFile: "+ File",
        addLlm: "+ LLM",
        addOut: "+ Output",
        projectDirPh: "Project folder...",
        runGraph: "Run Graph",
        modelsCount: "Models: ",
        running: "Running graph...",
        readingInputs: "Reading input nodes...",
        done: "Graph completed!",
        providerModel: "Provider & Model:",
        temp: "Temperature: ",
        sysPrompt: "System Prompt:",
        sysPromptPh: "Role or instructions...",
        inputPh: "Enter text...",
        selectFile: "-- Select file --",
        refreshBtn: "Ref.",
        filePreviewPh: "File content preview...",
        outputPh: "Output...",
        saveMdChk: "Save .md to project folder",
        fileNamePh: "File name (e.g. scene.md)",
        saveMdBtn: "Save .md",
        newSessionBtn: "To New Session",
        nodeInput: "Input",
        nodeFile: "Project File",
        nodeLlm: "LLM Agent",
        nodeOutput: "Output",
        boardPrefix: "Mini-project "
      },
      zh: {
        rename: "重命名",
        newBoard: "+ 新建项目",
        delBoard: "删除",
        addInput: "+ 输入",
        addFile: "+ 文件",
        addLlm: "+ 模型",
        addOut: "+ 输出",
        projectDirPh: "项目文件夹...",
        runGraph: "运行工作流",
        modelsCount: "可用模型: ",
        running: "正在运行...",
        readingInputs: "正在读取输入...",
        done: "运行完成！",
        providerModel: "供应商与模型:",
        temp: "温度 (Temperature): ",
        sysPrompt: "系统提示词:",
        sysPromptPh: "角色设定或规则...",
        inputPh: "输入文本...",
        selectFile: "-- 选择文件 --",
        refreshBtn: "刷新",
        filePreviewPh: "文件内容预览...",
        outputPh: "输出结果...",
        saveMdChk: "自动保存 .md 到项目文件夹",
        fileNamePh: "文件名 (如 scene.md)",
        saveMdBtn: "保存 .md",
        newSessionBtn: "发送到新会话",
        nodeInput: "输入",
        nodeFile: "项目文件",
        nodeLlm: "LLM 代理",
        nodeOutput: "输出",
        boardPrefix: "子项目 "
      }
    };

    function detectLang(localeSvc) {
      const raw = (localeSvc && (localeSvc.current || localeSvc.locale || localeSvc.lang))
        || (typeof document !== "undefined" && document.documentElement && document.documentElement.lang)
        || (typeof navigator !== "undefined" && navigator.language)
        || "ru";
      const low = String(raw).toLowerCase();
      if (low.startsWith("en")) return "en";
      if (low.startsWith("zh")) return "zh";
      return "ru";
    }
    function NodeStudioPage({ localeSvc }) {
      const initial = React.useMemo(() => loadLocalBoards(), []);
      const [lang, setLang] = React.useState(() => detectLang(localeSvc));
      React.useEffect(() => {
        const sync = () => setLang(detectLang(localeSvc));
        sync();
        const timer = setInterval(sync, 800);
        return () => clearInterval(timer);
      }, [localeSvc]);
      const t = I18N[lang] || I18N.ru;
      const [boards, setBoards] = React.useState(initial.boards);
      const [activeBoardId, setActiveBoardId] = React.useState(initial.activeBoardId);
      const [models, setModels] = React.useState([]);
      const [workspaces, setWorkspaces] = React.useState([]);
      const [projectFiles, setProjectFiles] = React.useState([]);
      const [status, setStatus] = React.useState("Загрузка...");
      const [selectedSourceId, setSelectedSourceId] = React.useState(null);
      const [editingTitleId, setEditingTitleId] = React.useState(null);
      const [renamingBoard, setRenamingBoard] = React.useState(false);
      const [nodeStates, setNodeStates] = React.useState({});
      const [isPanning, setIsPanning] = React.useState(false);

      const activeBoard = React.useMemo(
        () => boards.find((b) => b.id === activeBoardId) || boards.at(0),
        [boards, activeBoardId]
      );

      const nodes = activeBoard.nodes || [];
      const edges = activeBoard.edges || [];
      const view = activeBoard.view || { x: 0, y: 0, zoom: 1 };
      const projectDir = activeBoard.projectDir || "";
      const canvasRef = React.useRef(null);
      const viewRef = React.useRef(view);
      viewRef.current = view;
      const [, forceTick] = React.useState(0);

      const updateActiveBoard = React.useCallback((updater) => {
        setBoards((prev) =>
          prev.map((b) => {
            if (b.id !== activeBoardId) return b;
            const patch = typeof updater === "function" ? updater(b) : updater;
            return { ...b, ...patch };
          })
        );
      }, [activeBoardId]);

      const setNodes = (fn) => updateActiveBoard((b) => ({ nodes: typeof fn === "function" ? fn(b.nodes) : fn }));
      const setEdges = (fn) => updateActiveBoard((b) => ({ edges: typeof fn === "function" ? fn(b.edges) : fn }));
      const setView = (fn) => updateActiveBoard((b) => ({ view: typeof fn === "function" ? fn(b.view || { x: 0, y: 0, zoom: 1 }) : fn }));
      const setProjectDir = (dir) => updateActiveBoard({ projectDir: dir });
      React.useEffect(() => {
        const payload = { boards, activeBoardId };
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); } catch {}
        const timer = setTimeout(() => {
          fetch("dsh-node-studio/api/state", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          }).catch(() => {});
        }, 350);
        return () => clearTimeout(timer);
      }, [boards, activeBoardId]);

      const refreshProjectFiles = React.useCallback(async (dir) => {
        if (!dir) { setProjectFiles([]); return; }
        try {
          const res = await fetch("dsh-node-studio/api/files?dir=" + encodeURIComponent(dir), { cache: "no-store" });
          const data = await res.json();
          setProjectFiles(Array.isArray(data.files) ? data.files : []);
        } catch {
          setProjectFiles([]);
        }
      }, []);

      React.useEffect(() => {
        refreshProjectFiles(projectDir);
      }, [projectDir, refreshProjectFiles]);
      const loadInitialData = React.useCallback(async () => {
        try {
          const stRes = await fetch("dsh-node-studio/api/state", { cache: "no-store" });
          const stData = await stRes.json();
          if (stData && !stData.empty) {
            const norm = normalizeBoardsData(stData);
            setBoards(norm.boards);
            setActiveBoardId(norm.activeBoardId);
          }
          const res = await fetch("dsh-node-studio/api/models", { cache: "no-store" });
          const data = await res.json();
          const list = Array.isArray(data.models) ? data.models : [];
          const ws = Array.isArray(data.workspaces) ? data.workspaces : [];
          setModels(list);
          setWorkspaces(ws);

          const defaultDir = ws.length > 0 ? ws.at(0).path : "";
          const first = list.at(0);
          setBoards((prev) =>
            prev.map((b) => ({
              ...b,
              projectDir: b.projectDir || defaultDir,
              nodes: first
                ? b.nodes.map((n) => (n.type === "llm" && !n.model ? { ...n, provider: first.provider, model: first.id } : n))
                : b.nodes
            }))
          );
          setStatus(t.modelsCount + list.length);
        } catch (e) {
          setStatus("Ошибка загрузки данных");
        }
      }, []);

      React.useEffect(() => { loadInitialData(); }, [loadInitialData]);
      const createNewBoard = () => {
        const num = boards.length + 1;
        const id = "proj-" + Date.now();
        const defModel = models.at(0) || { provider: "", id: "" };
        const fresh = {
          id,
          name: t.boardPrefix + num,
          projectDir: projectDir || (workspaces.at(0) ? workspaces.at(0).path : ""),
          view: { x: 0, y: 0, zoom: 1 },
          nodes: [
            { id: "n1", type: "input", title: "Ввод", x: 60, y: 90, text: "" },
            { id: "n2", type: "llm", title: "LLM-Агент", x: 420, y: 80, provider: defModel.provider, model: defModel.id, systemPrompt: "" },
            { id: "n3", type: "output", title: "Результат", x: 780, y: 80, text: "", saveMd: true, fileName: "project-" + num + ".md" }
          ],
          edges: [
            { from: "n1", to: "n2" },
            { from: "n2", to: "n3" }
          ]
        };
        setBoards((prev) => [...prev, fresh]);
        setActiveBoardId(id);
        setNodeStates({});
        setSelectedSourceId(null);
        setRenamingBoard(true);
      };

      const deleteActiveBoard = () => {
        if (boards.length <= 1) {
          setStatus("Нельзя удалить единственный мини-проект");
          return;
        }
        const rest = boards.filter((b) => b.id !== activeBoardId);
        setBoards(rest);
        setActiveBoardId(rest.at(0).id);
        setNodeStates({});
        setSelectedSourceId(null);
      };
      const groupedModels = React.useMemo(() => {
        const map = new Map();
        for (const m of models) {
          const key = m.providerLabel || m.provider;
          if (!map.has(key)) map.set(key, []);
          map.get(key).push(m);
        }
        return Array.from(map.entries());
      }, [models]);

      const updateNode = (id, patch) => setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)));

      const loadFileIntoNode = async (nodeId, relPath) => {
        updateNode(nodeId, { filePath: relPath });
        if (!relPath) { updateNode(nodeId, { text: "" }); return; }
        try {
          const resp = await fetch("dsh-node-studio/api/read-file", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ projectDir, filePath: relPath })
          });
          const data = await resp.json();
          if (!resp.ok) throw new Error(data.error || "Ошибка чтения");
          updateNode(nodeId, { text: data.content || "" });
          setStatus("Прочитан файл: " + relPath);
        } catch (err) {
          setStatus("Ошибка чтения: " + err.message);
        }
      };

      const addNode = (type) => {
        const id = "n" + Date.now().toString().slice(-4);
        const def = models.at(0) || { provider: "", id: "" };
        const v = viewRef.current;
        const rect = canvasRef.current ? canvasRef.current.getBoundingClientRect() : { width: 900, height: 600 };
        const cx = Math.round(((rect.width / 2 - v.x) / v.zoom) - 150 + (Math.random() * 60 - 30));
        const cy = Math.round(((rect.height / 2 - v.y) / v.zoom) - 90 + (Math.random() * 60 - 30));
        const title = type === "input" ? t.nodeInput : type === "file" ? t.nodeFile : type === "llm" ? t.nodeLlm : t.nodeOutput;
        setNodes((prev) => [...prev, {
          id, type, title, x: cx, y: cy,
          provider: def.provider, model: def.id, systemPrompt: "", text: "", filePath: "", saveMd: true, fileName: "output.md"
        }]);
        if (type === "file") refreshProjectFiles(projectDir);
      };

      const startResize = (e, node) => {
        if (e.button !== 0) return;
        e.stopPropagation();
        e.preventDefault();
        const startX = e.clientX;
        const startY = e.clientY;
        const origW = node.w || (node.type === "output" ? 420 : 320);
        const origH = node.h || (node.type === "output" ? 310 : 210);
        const onMove = (ev) => {
          const z = viewRef.current.zoom || 1;
          updateNode(node.id, {
            w: Math.max(250, Math.round(origW + (ev.clientX - startX) / z)),
            h: Math.max(150, Math.round(origH + (ev.clientY - startY) / z))
          });
          forceTick((t) => t + 1);
        };
        const onUp = () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
      };
      const deleteNode = (id) => {
        setNodes((prev) => prev.filter((n) => n.id !== id));
        setEdges((prev) => prev.filter((e) => e.from !== id && e.to !== id));
      };
      const startDrag = (e, node) => {
        if (e.button !== 0) return;
        if (e.target.closest("button, select, textarea, input, label")) return;
        e.stopPropagation();
        const startClientX = e.clientX;
        const startClientY = e.clientY;
        const origX = node.x;
        const origY = node.y;
        const onMove = (ev) => {
          const z = viewRef.current.zoom || 1;
          updateNode(node.id, {
            x: Math.round(origX + (ev.clientX - startClientX) / z),
            y: Math.round(origY + (ev.clientY - startClientY) / z)
          });
          forceTick((t) => t + 1);
        };
        const onUp = () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
      };

      const handleCanvasMouseDown = (e) => {
        const isMiddle = e.button === 1;
        const isBgLeft = e.button === 0 && !e.target.closest("[data-ns-node]");
        if (!isMiddle && !isBgLeft) return;
        e.preventDefault();
        setIsPanning(true);
        const startClientX = e.clientX;
        const startClientY = e.clientY;
        const origX = viewRef.current.x;
        const origY = viewRef.current.y;
        const onMove = (ev) => {
          setView((prev) => ({ ...prev, x: Math.round(origX + (ev.clientX - startClientX)), y: Math.round(origY + (ev.clientY - startClientY)) }));
        };
        const onUp = () => {
          setIsPanning(false);
          window.removeEventListener("mousemove", onMove);
          window.removeEventListener("mouseup", onUp);
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
      };

      const handleWheel = (e) => {
        if (e.target.closest("textarea, select") && !e.ctrlKey) return;
        e.preventDefault();
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const v = viewRef.current;
        const factor = e.deltaY < 0 ? 1.12 : 0.89;
        const nextZoom = Math.min(2.0, Math.max(0.25, Math.round(v.zoom * factor * 100) / 100));
        const worldX = (mx - v.x) / v.zoom;
        const worldY = (my - v.y) / v.zoom;
        setView({
          x: Math.round(mx - worldX * nextZoom),
          y: Math.round(my - worldY * nextZoom),
          zoom: nextZoom
        });
      };
      const saveNodeToMd = async (node, textOverride) => {
        const content = textOverride !== undefined ? textOverride : (node.text || "");
        if (!content.trim()) { setStatus("Нечего сохранять — текст пуст"); return; }
        try {
          const resp = await fetch("dsh-node-studio/api/save-md", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ projectDir, fileName: node.fileName || (node.title + ".md"), content })
          });
          const data = await resp.json();
          if (!resp.ok) throw new Error(data.error || "Ошибка записи");
          setStatus("Сохранено: " + data.path);
          refreshProjectFiles(projectDir);
        } catch (err) {
          setStatus("Ошибка файла: " + err.message);
        }
      };

      const sendToNewSession = async (node) => {
        const content = node.text || "";
        if (!content.trim()) { setStatus("Сначала получите результат"); return; }
        try {
          setStatus("Создание сессии в проекте...");
          const resp = await fetch("dsh-node-studio/api/create-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ projectDir, title: activeBoard.name + " / " + node.title, content })
          });
          const data = await resp.json();
          if (!resp.ok) throw new Error(data.error || "Ошибка создания сессии");
          setStatus("Сессия создана в проекте слева!");
        } catch (err) {
          setStatus("Ошибка сессии: " + err.message);
        }
      };
      const runGraph = async () => {
        const values = new Map();
        const nodeMap = new Map(nodes.map((n) => [n.id, n]));
        setNodeStates({});
        setStatus(t.readingInputs);

        for (const n of nodes) {
          if (n.type === "input") {
            values.set(n.id, n.text || "");
          } else if (n.type === "file") {
            if (!n.filePath) {
              setNodeStates((s) => ({ ...s, [n.id]: "error" }));
              setStatus('В узле "' + n.title + '" не выбран файл');
              return;
            }
            setNodeStates((s) => ({ ...s, [n.id]: "running" }));
            try {
              const resp = await fetch("dsh-node-studio/api/read-file", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ projectDir, filePath: n.filePath })
              });
              const data = await resp.json();
              if (!resp.ok) throw new Error(data.error || "Ошибка чтения файла");
              const freshText = data.content || "";
              updateNode(n.id, { text: freshText });
              values.set(n.id, freshText);
              setNodeStates((s) => ({ ...s, [n.id]: "done" }));
            } catch (err) {
              setNodeStates((s) => ({ ...s, [n.id]: "error" }));
              setStatus('Ошибка в "' + n.title + '": ' + err.message);
              return;
            }
          }
        }

        setStatus(t.running);
        for (let step = 0; step < 15; step++) {
          let progressed = false;
          for (const n of nodes) {
            if (values.has(n.id)) continue;
            const incomingEdges = edges.filter((ed) => ed.to === n.id);
            if (incomingEdges.length === 0) continue;
            if (!incomingEdges.every((ed) => values.has(ed.from))) continue;

            const combinedInput = incomingEdges.length === 1
              ? values.get(incomingEdges.at(0).from)
              : incomingEdges.map((ed) => {
                  const src = nodeMap.get(ed.from);
                  return "=== " + (src ? src.title : ed.from) + " ===\n" + values.get(ed.from);
                }).join("\n\n");

            if (n.type === "output") {
              updateNode(n.id, { text: combinedInput });
              values.set(n.id, combinedInput);
              setNodeStates((s) => ({ ...s, [n.id]: "done" }));
              if (n.saveMd) await saveNodeToMd(n, combinedInput);
              progressed = true;
            } else if (n.type === "llm") {
              setNodeStates((s) => ({ ...s, [n.id]: "running" }));
              try {
                const resp = await fetch("dsh-node-studio/api/run", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ provider: n.provider, model: n.model, systemPrompt: n.systemPrompt, userPrompt: combinedInput, temperature: n.temperature !== undefined ? n.temperature : 0.7 })
                });
                const data = await resp.json();
                if (!resp.ok) throw new Error(data.error || "Ошибка API");
                values.set(n.id, data.output);
                setNodeStates((s) => ({ ...s, [n.id]: "done" }));
                progressed = true;
              } catch (err) {
                setNodeStates((s) => ({ ...s, [n.id]: "error" }));
                setStatus('Ошибка в "' + n.title + '": ' + err.message);
                return;
              }
            }
          }
          if (!progressed) break;
        }
        setStatus(t.done);
      };
      const renderCurves = () => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        const cRect = canvas.getBoundingClientRect();
        const z = view.zoom || 1;
        return edges.map((edge, idx) => {
          const fromEl = canvas.querySelector('[data-port-out="' + edge.from + '"]');
          const toEl = canvas.querySelector('[data-port-in="' + edge.to + '"]');
          if (!fromEl || !toEl) return null;
          const r1 = fromEl.getBoundingClientRect();
          const r2 = toEl.getBoundingClientRect();
          const x1 = (r1.left + r1.width / 2 - cRect.left - view.x) / z;
          const y1 = (r1.top + r1.height / 2 - cRect.top - view.y) / z;
          const x2 = (r2.left + r2.width / 2 - cRect.left - view.x) / z;
          const y2 = (r2.top + r2.height / 2 - cRect.top - view.y) / z;
          const dx = Math.max(50, Math.abs(x2 - x1) * 0.5);
          const d = "M " + x1 + " " + y1 + " C " + (x1 + dx) + " " + y1 + ", " + (x2 - dx) + " " + y2 + ", " + x2 + " " + y2;
          return jsx("path", { d, stroke: "var(--dsw-alias-brand-primary, #3b82f6)", strokeWidth: "3", fill: "none", style: { cursor: "pointer", pointerEvents: "stroke" }, onClick: () => setEdges((prev) => prev.filter((e) => !(e.from === edge.from && e.to === edge.to))) }, edge.from + "-" + edge.to + "-" + idx);
        });
      };

      const btn = { background: "var(--dsw-alias-bg-layer-3, #21262d)", color: "var(--dsw-alias-label-primary, #e5e7eb)", border: "1px solid var(--dsw-alias-border-l2, #30363d)", borderRadius: "8px", padding: "5px 9px", fontSize: "12px", cursor: "pointer" };
      const inp = { width: "100%", boxSizing: "border-box", background: "var(--dsw-alias-bg-base, #0d1117)", color: "var(--dsw-alias-label-primary, #e5e7eb)", border: "1px solid var(--dsw-alias-border-l2, #30363d)", borderRadius: "7px", padding: "6px 8px", fontSize: "14px", lineHeight: "1.45", fontFamily: "inherit" };
      const gridStep = Math.max(8, Math.round(20 * view.zoom));
      return jsxs("div", {
        style: { display: "flex", flexDirection: "column", height: "100%", width: "100%", overflow: "hidden", color: "var(--dsw-alias-label-primary, #e5e7eb)", background: "var(--dsw-alias-bg-base, #0f1117)" },
        children: [
          jsxs("div", {
            style: { display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderBottom: "1px solid var(--dsw-alias-border-l2, #30363d)", background: "var(--dsw-alias-bg-layer-2, #161b22)", flexWrap: "wrap" },
            children: [
              renamingBoard
                ? jsx("input", { autoFocus: true, style: { ...inp, width: "175px", padding: "4px 7px", fontWeight: 600 }, value: activeBoard.name, onChange: (e) => updateActiveBoard({ name: e.target.value }), onBlur: () => setRenamingBoard(false), onKeyDown: (e) => { if (e.key === "Enter" || e.key === "Escape") setRenamingBoard(false); } })
                : jsx("select", { style: { ...inp, width: "180px", padding: "4px 6px", fontWeight: 600 }, value: activeBoardId, onChange: (e) => { setActiveBoardId(e.target.value); setNodeStates({}); setSelectedSourceId(null); }, children: boards.map((b) => jsx("option", { value: b.id, children: b.name }, b.id)) }),
              jsx("button", { type: "button", style: btn, onClick: () => setRenamingBoard((v) => !v), children: t.rename }),
              jsx("button", { type: "button", style: { ...btn, background: "#1f6feb", borderColor: "#388bfd", color: "#fff" }, onClick: createNewBoard, children: t.newBoard }),
              boards.length > 1 ? jsx("button", { type: "button", style: { ...btn, color: "#f87171" }, onClick: deleteActiveBoard, children: t.delBoard }) : null,
              jsx("span", { style: { opacity: 0.35 }, children: "|" }),
              jsx("button", { type: "button", style: btn, onClick: () => addNode("input"), children: t.addInput }),
              jsx("button", { type: "button", style: btn, onClick: () => addNode("file"), children: t.addFile }),
              jsx("button", { type: "button", style: btn, onClick: () => addNode("llm"), children: t.addLlm }),
              jsx("button", { type: "button", style: btn, onClick: () => addNode("output"), children: t.addOut }),
              jsx("button", { type: "button", style: btn, onClick: () => setView({ x: 0, y: 0, zoom: 1 }), children: Math.round(view.zoom * 100) + "%" }),
              jsx("span", { style: { opacity: 0.35 }, children: "|" }),
              jsx("input", { style: { ...inp, width: "170px", padding: "4px 7px" }, list: "dsh-ns-ws-list", value: projectDir, placeholder: t.projectDirPh, onChange: (e) => setProjectDir(e.target.value) }),
              jsx("datalist", { id: "dsh-ns-ws-list", children: workspaces.map((w) => jsx("option", { value: w.path, children: w.name }, w.path)) }),
              jsx("div", { style: { flex: 1 } }),
              jsx("span", { style: { fontSize: "12px", opacity: 0.8 }, children: status }),
              jsx("button", { type: "button", onClick: runGraph, style: { ...btn, background: "#238636", borderColor: "#2ea043", color: "#fff", fontWeight: 600 }, children: t.runGraph })
            ]
          }),
          jsxs("div", {
            ref: canvasRef,
            onMouseDown: handleCanvasMouseDown,
            onWheel: handleWheel,
            onAuxClick: (e) => { if (e.button === 1) e.preventDefault(); },
            style: { position: "relative", flex: 1, overflow: "hidden", cursor: isPanning ? "grabbing" : "grab", backgroundImage: "radial-gradient(rgba(140,150,165,0.22) 1px, transparent 1px)", backgroundSize: gridStep + "px " + gridStep + "px", backgroundPosition: view.x + "px " + view.y + "px" },
            children: [
              jsxs("div", {
                style: { position: "absolute", left: "0px", top: "0px", transform: "translate(" + view.x + "px, " + view.y + "px) scale(" + view.zoom + ")", transformOrigin: "0 0" },
                children: [
                  jsx("svg", { style: { position: "absolute", left: "0px", top: "0px", width: "8000px", height: "8000px", overflow: "visible", pointerEvents: "none" }, children: renderCurves() }),
                  nodes.map((node) => {
                    const st = nodeStates[node.id];
                    const bc = st === "running" ? "#f59e0b" : st === "done" ? "#2ea043" : st === "error" ? "#f85149" : "var(--dsw-alias-border-l2, #30363d)";
                    const sel = node.provider && node.model ? node.provider + "::" + node.model : "";
                    const inCount = edges.filter((e) => e.to === node.id).length;
                    const isSourceOnly = node.type === "input" || node.type === "file";
                    return jsxs("div", {
                      "data-ns-node": node.id,
                      style: { position: "absolute", left: node.x + "px", top: node.y + "px", width: (node.w || (node.type === "output" ? 420 : 320)) + "px", minWidth: "280px", minHeight: "170px", height: node.h ? node.h + "px" : "auto", display: "flex", flexDirection: "column", background: "var(--dsw-alias-bg-layer-2, #161b22)", border: "1.5px solid " + bc, borderRadius: "10px", boxShadow: "0 8px 24px rgba(0,0,0,0.35)", cursor: "default" },
                      children: [
                        !isSourceOnly ? jsx("div", { "data-port-in": node.id, title: "Вход (" + inCount + ")", onClick: (e) => { e.stopPropagation(); if (selectedSourceId && selectedSourceId !== node.id) { setEdges((prev) => prev.some((ed) => ed.from === selectedSourceId && ed.to === node.id) ? prev : [...prev, { from: selectedSourceId, to: node.id }]); setSelectedSourceId(null); } }, style: { position: "absolute", left: "-8px", top: "50%", transform: "translateY(-50%)", width: "14px", height: "14px", borderRadius: "50%", background: "#10b981", border: "2px solid #0f1117", cursor: "crosshair" } }) : null,
                        node.type !== "output" ? jsx("div", { "data-port-out": node.id, title: "Выход", onClick: (e) => { e.stopPropagation(); setSelectedSourceId((cur) => (cur === node.id ? null : node.id)); }, style: { position: "absolute", right: "-8px", top: "50%", transform: "translateY(-50%)", width: "14px", height: "14px", borderRadius: "50%", background: "#3b82f6", border: "2px solid #0f1117", outline: selectedSourceId === node.id ? "3px solid #f59e0b" : "none", cursor: "crosshair" } }) : null,
                        jsxs("div", {
                          onMouseDown: (e) => startDrag(e, node),
                          onDoubleClick: () => setEditingTitleId(node.id),
                          style: { padding: "8px 12px", borderBottom: "1px solid var(--dsw-alias-border-l2, #30363d)", fontSize: "13px", fontWeight: 600, cursor: "grab", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "6px" },
                          children: [
                            editingTitleId === node.id
                              ? jsx("input", { autoFocus: true, style: { ...inp, padding: "2px 6px", fontWeight: 600 }, value: node.title, onChange: (e) => updateNode(node.id, { title: e.target.value }), onBlur: () => setEditingTitleId(null), onKeyDown: (e) => { if (e.key === "Enter") setEditingTitleId(null); } })
                              : jsx("span", { children: node.title + (inCount > 1 ? " (" + inCount + " вх.)" : "") }),
                            jsx("button", { type: "button", onClick: () => deleteNode(node.id), style: { background: "none", border: "none", color: "inherit", cursor: "pointer", opacity: 0.7 }, children: "X" })
                          ]
                        }),
                        jsxs("div", {
                          style: { padding: "10px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", flex: 1, minHeight: 0 },
                          children: [
                            node.type === "input" ? jsx("textarea", { rows: 4, style: { ...inp, flex: 1, minHeight: "85px", resize: "none" }, value: node.text || "", placeholder: t.inputPh, onChange: (e) => updateNode(node.id, { text: e.target.value }) }) : null,
                            node.type === "file" ? jsxs(React.Fragment, {
                              children: [
                                jsxs("div", {
                                  style: { display: "flex", gap: "4px" },
                                  children: [
                                    jsxs("select", { style: { ...inp, flex: 1 }, value: node.filePath || "", onChange: (e) => loadFileIntoNode(node.id, e.target.value), children: [jsx("option", { value: "", children: t.selectFile }), projectFiles.map((f) => jsx("option", { value: f, children: f }, f))] }),
                                    jsx("button", { type: "button", style: { ...btn, padding: "4px 8px" }, onClick: () => { refreshProjectFiles(projectDir); if (node.filePath) loadFileIntoNode(node.id, node.filePath); }, children: t.refreshBtn })
                                  ]
                                }),
                                jsx("textarea", { rows: 4, readOnly: true, style: { ...inp, flex: 1, minHeight: "85px", opacity: 0.85, resize: "none" }, value: node.text || "", placeholder: t.filePreviewPh })
                              ]
                            }) : null,
                            node.type === "llm" ? jsxs(React.Fragment, {
                              children: [
                                jsx("label", { style: { opacity: 0.75 }, children: t.providerModel }),
                                jsx("select", { style: inp, value: sel, onChange: (e) => { const p = e.target.value.split("::"); updateNode(node.id, { provider: p.at(0), model: p.at(1) }); }, children: groupedModels.length === 0 ? jsx("option", { value: "", children: "Нет моделей" }) : groupedModels.map(([g, items]) => jsx("optgroup", { label: g, children: items.map((m) => { const v = m.provider + "::" + m.id; return jsx("option", { value: v, children: m.name + " (" + m.id + ")" }, v); }) }, g)) }),
                                jsxs("div", {
  style: { display: "flex", alignItems: "center", gap: "8px" },
  children: [
    jsx("span", { style: { opacity: 0.75, whiteSpace: "nowrap" }, children: t.temp + (node.temperature !== undefined ? Number(node.temperature) : 0.7).toFixed(1) }),
    jsx("input", {
      type: "range", min: "0", max: "1.8", step: "0.1",
      value: String(node.temperature !== undefined ? node.temperature : 0.7),
      style: { flex: 1, cursor: "pointer" },
      onChange: (e) => updateNode(node.id, { temperature: Number(e.target.value) })
    })
  ]
}),
jsx("label", { style: { opacity: 0.75 }, children: t.sysPrompt }),
jsx("textarea", { rows: 3, style: { ...inp, flex: 1, minHeight: "75px", resize: "none" }, value: node.systemPrompt || "", placeholder: t.sysPromptPh, onChange: (e) => updateNode(node.id, { systemPrompt: e.target.value }) })
]
}) : null,
node.type === "output" ? jsxs(React.Fragment, {
children: [
jsx("textarea", { rows: 6, style: { ...inp, flex: 1, minHeight: "130px", resize: "none" }, value: node.text || "", placeholder: t.outputPh, onChange: (e) => updateNode(node.id, { text: e.target.value }) }),
jsxs("label", { style: { display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", opacity: 0.9 }, children: [jsx("input", { type: "checkbox", checked: Boolean(node.saveMd), onChange: (e) => updateNode(node.id, { saveMd: e.target.checked }) }), jsx("span", { children: t.saveMdChk })] }),
node.saveMd ? jsx("input", { style: { ...inp, padding: "4px 7px" }, value: node.fileName || "", placeholder: t.fileNamePh, onChange: (e) => updateNode(node.id, { fileName: e.target.value }) }) : null,
jsxs("div", { style: { display: "flex", gap: "6px", flexWrap: "wrap" }, children: [jsx("button", { type: "button", style: { ...btn, flex: 1 }, onClick: () => saveNodeToMd(node), children: t.saveMdBtn }), jsx("button", { type: "button", style: { ...btn, flex: 1 }, onClick: () => sendToNewSession(node), children: t.newSessionBtn })] })
]
}) : null
]
})
                      , jsx("div", { onMouseDown: (e) => startResize(e, node), title: "Потяните за уголок", style: { position: "absolute", right: "0px", bottom: "0px", width: "18px", height: "18px", cursor: "nwse-resize", background: "linear-gradient(135deg, transparent 50%, #3b82f6 50%)", borderRadius: "0 0 9px 0", zIndex: 10 } })]
                    }, node.id);
})
]
})
]
})
]
});
}
function apply(ctx) {
const slots = ctx.slots;
ctx.effect(() => {
const d1 = slots.inject("sidebar.panellist", () => slots.register({ name: "sidebar.panellist", id: PANEL_ID, order: PANEL_ORDER, label: () => "Node Studio" }, NodeStudioIcon));
const d2 = slots.inject("main", () => slots.register({ name: "main", key: PANEL_ID }, () => jsx(NodeStudioPage, { localeSvc: ctx.locale })));
return () => { d1(); d2(); };
}, "dsh-node-studio: sidebar and main panel");
}
exports.apply = apply;
exports.inject = inject;
return module.exports;
}
});