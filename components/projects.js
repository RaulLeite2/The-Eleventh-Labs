// Exemplo de dados de projetos (mock)
const projects = [
  {
    name: "Luma",
    status: "online",
    services: 6,
    github: true,
    db: true,
    updated: "2026-03-23 10:16"
  },
  {
    name: "The Eleventh Labs",
    status: "offline",
    services: 2,
    github: true,
    db: false,
    updated: "2026-03-20 18:42"
  }
];

function renderProjects() {
  const grid = document.getElementById("projectsGrid");
  grid.innerHTML = "";
  projects.forEach(proj => {
    const card = document.createElement("div");
    card.className = `project-card ${proj.status}`;
    card.innerHTML = `
      <div class="project-header">
        <strong>${proj.name}</strong>
        <span class="status-dot ${proj.status}"></span>
      </div>
      <div class="project-meta">
        <span>${proj.services} serviços</span>
        <span>${proj.github ? '<img src="../assets/github.svg" alt="GitHub" class="icon">' : ''}</span>
        <span>${proj.db ? '<img src="../assets/db.svg" alt="DB" class="icon">' : ''}</span>
      </div>
      <div class="project-updated">Atualizado: ${proj.updated}</div>
    `;
    grid.appendChild(card);
  });
}

renderProjects();

// --- Execução de código ---
function setupCodeExecution() {
  const container = document.createElement("div");
  container.className = "code-exec-container";
  container.innerHTML = `
    <h2>Console interativo</h2>
    <textarea id="codeInput" rows="6" placeholder="Digite seu código Python aqui..."></textarea>
    <button id="runCodeBtn">Executar código</button>
    <pre id="codeOutput" class="code-output"></pre>
  `;
  document.querySelector("main.dashboard-main")?.appendChild(container);

  document.getElementById("runCodeBtn").onclick = async () => {
    const code = document.getElementById("codeInput").value;
    const output = document.getElementById("codeOutput");
    output.textContent = "Executando...";
    try {
      const res = await fetch("https://localhost:8000/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: "python", code })
      });
      const data = await res.json();
      output.textContent =
        (data.stdout || "") + (data.stderr ? "\n[erro]\n" + data.stderr : "");
    } catch (e) {
      output.textContent = "Erro ao executar: " + e;
    }
  };
}

window.addEventListener("DOMContentLoaded", setupCodeExecution);
