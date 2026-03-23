import { API_BASE_URL } from "./config.js";

const storageKeys = {
  users: "the-eleventh-labs-users",
  session: "the-eleventh-labs-session",
  waitlist: "the-eleventh-labs-waitlist",
  notes: "the-eleventh-labs-central-notes",
  backlog: "the-eleventh-labs-central-backlog"
};

const defaultBacklog = [
  { id: 1, label: "Fechar direcao visual da central", done: true },
  { id: 2, label: "Definir primeira area privada real", done: false },
  { id: 3, label: "Conectar verificacao por email no Firebase", done: false },
  { id: 4, label: "Preparar deploy quando o fluxo estiver validado", done: false }
];

const dom = {
  centralAuthMode: document.getElementById("centralAuthMode"),
  centralAuthHint: document.getElementById("centralAuthHint"),
  centralUserLabel: document.getElementById("centralUserLabel"),
  centralUserSub: document.getElementById("centralUserSub"),
  centralUserEmail: document.getElementById("centralUserEmail"),
  centralVerificationText: document.getElementById("centralVerificationText"),
  centralWaitlistCount: document.getElementById("centralWaitlistCount"),
  centralLogoutBtn: document.getElementById("centralLogoutBtn"),
  userStatusDot: document.getElementById("userStatusDot"),
  backlogList: document.getElementById("backlogList"),
  notesForm: document.getElementById("notesForm"),
  notesInput: document.getElementById("notesInput"),
  notesFeedback: document.getElementById("notesFeedback"),
  notesList: document.getElementById("notesList")
};

let currentUser = null;

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getSession() {
  return readJson(storageKeys.session, null);
}

function setSession(user) {
  if (user) {
    writeJson(storageKeys.session, user);
  } else {
    localStorage.removeItem(storageKeys.session);
  }
}

function setNotesFeedback(message, tone = "neutral") {
  dom.notesFeedback.textContent = message;
  dom.notesFeedback.classList.toggle("success", tone === "success");
}

function refreshWaitlistCount() {
  const waitlist = readJson(storageKeys.waitlist, []);
  dom.centralWaitlistCount.textContent = `${waitlist.length} ${waitlist.length === 1 ? "registro" : "registros"}`;
}

function renderBacklog() {
  const backlog = readJson(storageKeys.backlog, defaultBacklog);
  dom.backlogList.innerHTML = "";

  backlog.forEach((item) => {
    const wrapper = document.createElement("label");
    wrapper.className = `checklist-item${item.done ? " done" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.done;
    checkbox.addEventListener("change", () => {
      const nextBacklog = backlog.map((entry) => {
        if (entry.id === item.id) {
          return { ...entry, done: checkbox.checked };
        }
        return entry;
      });
      writeJson(storageKeys.backlog, nextBacklog);
      renderBacklog();
    });

    const text = document.createElement("span");
    text.textContent = item.label;

    wrapper.append(checkbox, text);
    dom.backlogList.appendChild(wrapper);
  });
}

function renderNotes() {
  const notes = readJson(storageKeys.notes, []);
  dom.notesList.innerHTML = "";

  if (!notes.length) {
    setNotesFeedback("Nenhuma nota salva ainda.");
    return;
  }

  setNotesFeedback(`${notes.length} ${notes.length === 1 ? "nota salva" : "notas salvas"}.`, "success");

  notes
    .slice()
    .reverse()
    .forEach((note) => {
      const item = document.createElement("li");
      item.textContent = note.text;
      dom.notesList.appendChild(item);
    });
}

function updateUiForUser(user) {
  currentUser = user;
  if (dom.centralAuthMode) dom.centralAuthMode.textContent = "API";
  if (dom.centralAuthHint) dom.centralAuthHint.textContent = "Sessao vinda do backend real (Railway).";

  if (!user) {
    dom.centralUserLabel.textContent = "Visitante";
    dom.centralUserSub.textContent = "Entre pela landing para liberar a experiencia completa";
    dom.centralUserEmail.textContent = "Sem sessao ativa";
    dom.centralVerificationText.textContent = "Voce ainda nao tem uma sessao nesta central.";
    dom.centralLogoutBtn.disabled = true;
    dom.userStatusDot.classList.remove("active");
    return;
  }

  dom.centralUserLabel.textContent = user.emailVerified ? "Usuario verificado" : "Usuario autenticado";
  dom.centralUserSub.textContent = user.emailVerified ? "Tudo certo para proxima fase" : "Ainda falta verificacao";
  dom.centralUserEmail.textContent = user.email;
  dom.centralVerificationText.textContent = user.emailVerified
    ? "A conta atual ja esta verificada."
    : "Verifique seu email para concluir o acesso real.";
  dom.centralLogoutBtn.disabled = false;
  dom.userStatusDot.classList.add("active");
}

async function handleLogout() {
  setSession(null);
  updateUiForUser(null);
}

function handleNotesSubmit(event) {
  event.preventDefault();
  const text = dom.notesInput.value.trim();

  if (!text) {
    setNotesFeedback("Escreva alguma nota antes de salvar.");
    return;
  }

  const notes = readJson(storageKeys.notes, []);
  notes.push({ text, createdAt: new Date().toISOString() });
  writeJson(storageKeys.notes, notes);
  dom.notesInput.value = "";
  renderNotes();
}

async function restoreSession() {
  const session = getSession();
  if (!session || !session.token) {
    updateUiForUser(null);
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${session.token}` }
    });
    if (!res.ok) {
      setSession(null);
      updateUiForUser(null);
      return;
    }
    const me = await res.json();
    const user = { email: me.email, emailVerified: me.is_verified, token: session.token };
    setSession(user);
    updateUiForUser(user);
  } catch {
    setSession(null);
    updateUiForUser(null);
  }
}

dom.centralLogoutBtn.addEventListener("click", () => {
  handleLogout().catch(() => updateUiForUser(getSession()));
});

dom.notesForm.addEventListener("submit", handleNotesSubmit);

writeJson(storageKeys.backlog, readJson(storageKeys.backlog, defaultBacklog));
refreshWaitlistCount();
renderBacklog();
renderNotes();
restoreSession();