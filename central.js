import { API_BASE_URL } from "./config.js";

// Token is kept in memory only — never written to logs or URLs.
// localStorage stores only the minimal session envelope for restoration.
let _sessionToken = null;

const storageKeys = {
  session: "the-eleventh-labs-session",
  waitlist: "the-eleventh-labs-waitlist",
  notes: "the-eleventh-labs-central-notes",
  backlog: "the-eleventh-labs-central-backlog"
};

import { API_BASE_URL } from "./config.js";

// ─── Security note ────────────────────────────────────────────────────────────
// Token is held in a module-scoped variable. It is NEVER written to URLs,
// console logs, or the DOM. localStorage stores only the email + verified flag
// so the UI can show a loading state while /auth/me revalidates the token.
// ──────────────────────────────────────────────────────────────────────────────
let _sessionToken = null;

const storageKeys = {
  session: "the-eleventh-labs-session",
  waitlist: "the-eleventh-labs-waitlist",
  notes: "the-eleventh-labs-central-notes",
  backlog: "the-eleventh-labs-central-backlog"
};

const defaultBacklog = [
  { id: 1, label: "Fechar fluxo de sessao e verificacao do usuario", done: true },
  { id: 2, label: "Definir primeira area privada real do usuario", done: false },
  { id: 3, label: "Projetar perfil, preferencias e estado da conta", done: false },
  { id: 4, label: "Preparar proximos modulos protegidos da central", done: false }
];

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const authGate = document.getElementById("authGate");
const dashboardShell = document.getElementById("dashboardShell");

const gateTabRegister = document.getElementById("gateTabRegister");
const gateTabLogin = document.getElementById("gateTabLogin");
const gateRegisterForm = document.getElementById("gateRegisterForm");
const gateLoginForm = document.getElementById("gateLoginForm");
const gateRegFeedback = document.getElementById("gateRegFeedback");
const gateLoginFeedback = document.getElementById("gateLoginFeedback");

const gateRegEmail = document.getElementById("gateRegEmail");
const gateRegPassword = document.getElementById("gateRegPassword");
const gateRegConfirm = document.getElementById("gateRegConfirm");
const gateLoginEmail = document.getElementById("gateLoginEmail");
const gateLoginPassword = document.getElementById("gateLoginPassword");

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

// ─── Auth gate visibility ─────────────────────────────────────────────────────
function showGate() {
  authGate.hidden = false;
  dashboardShell.hidden = true;
  gateRegFeedback.textContent = "";
  gateLoginFeedback.textContent = "";
}

function showDashboard() {
  authGate.hidden = true;
  dashboardShell.hidden = false;
}

// ─── Tab toggle ───────────────────────────────────────────────────────────────
function activateTab(tab) {
  if (tab === "register") {
    gateTabRegister.classList.add("gate-tab-active");
    gateTabLogin.classList.remove("gate-tab-active");
    gateRegisterForm.hidden = false;
    gateLoginForm.hidden = true;
    gateRegEmail.focus();
  } else {
    gateTabLogin.classList.add("gate-tab-active");
    gateTabRegister.classList.remove("gate-tab-active");
    gateLoginForm.hidden = false;
    gateRegisterForm.hidden = true;
    gateLoginEmail.focus();
  }
}

gateTabRegister.addEventListener("click", () => activateTab("register"));
gateTabLogin.addEventListener("click", () => activateTab("login"));

// ─── Feedback helpers (use textContent — never innerHTML with user data) ──────
function setFeedback(el, message, tone = "error") {
  el.textContent = message;
  el.className = `gate-feedback gate-feedback-${tone}`;
}

function setSubmitState(form, loading) {
  const btn = form.querySelector("button[type='submit']");
  btn.disabled = loading;
  btn.textContent = loading ? "Aguarde..." : btn.dataset.label ?? btn.textContent;
  if (!btn.dataset.label) btn.dataset.label = btn.textContent;
}

// ─── Input validation ─────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email) {
  return typeof email === "string" && EMAIL_RE.test(email.trim()) && email.trim().length <= 254;
}

function validatePassword(password) {
  return typeof password === "string" && password.length >= 8 && password.length <= 128;
}

// ─── Session helpers ──────────────────────────────────────────────────────────
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

function getStoredSession() {
  return readJson(storageKeys.session, null);
}

// Store only non-sensitive fields — token goes to module memory
function persistSession(email, emailVerified, token) {
  _sessionToken = token;
  writeJson(storageKeys.session, { email, emailVerified, hasToken: true });
}

function clearSession() {
  _sessionToken = null;
  localStorage.removeItem(storageKeys.session);
}

// ─── Register ─────────────────────────────────────────────────────────────────
gateRegisterForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = gateRegEmail.value.trim();
  const password = gateRegPassword.value;
  const confirm = gateRegConfirm.value;

  if (!validateEmail(email)) {
    setFeedback(gateRegFeedback, "Informe um email valido.");
    gateRegEmail.focus();
    return;
  }
  if (!validatePassword(password)) {
    setFeedback(gateRegFeedback, "A senha precisa ter entre 8 e 128 caracteres.");
    gateRegPassword.focus();
    return;
  }
  if (password !== confirm) {
    setFeedback(gateRegFeedback, "As senhas nao conferem.");
    gateRegConfirm.focus();
    return;
  }

  setSubmitState(gateRegisterForm, true);
  setFeedback(gateRegFeedback, "", "neutral");

  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json().catch(() => ({}));

    if (res.status === 409) {
      setFeedback(gateRegFeedback, "Nao foi possivel criar a conta. Tente entrar.");
      return;
    }
    if (!res.ok) {
      setFeedback(gateRegFeedback, "Nao foi possivel criar a conta. Tente novamente.");
      return;
    }

    setFeedback(gateRegFeedback, data.message ?? "Conta criada. Verifique seu email antes de entrar.", "success");
    gateRegisterForm.reset();
    // Switch to login tab after successful registration
    setTimeout(() => activateTab("login"), 1800);
  } catch {
    setFeedback(gateRegFeedback, "Erro de conexao. Verifique sua internet e tente novamente.");
  } finally {
    setSubmitState(gateRegisterForm, false);
  }
});

// ─── Login ────────────────────────────────────────────────────────────────────
gateLoginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = gateLoginEmail.value.trim();
  const password = gateLoginPassword.value;

  if (!validateEmail(email)) {
    setFeedback(gateLoginFeedback, "Informe um email valido.");
    gateLoginEmail.focus();
    return;
  }
  if (!validatePassword(password)) {
    setFeedback(gateLoginFeedback, "Senha invalida.");
    gateLoginPassword.focus();
    return;
  }

  setSubmitState(gateLoginForm, true);
  setFeedback(gateLoginFeedback, "", "neutral");

  try {
    const body = new URLSearchParams({ username: email, password });
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString()
    });

    if (res.status === 401 || res.status === 403) {
      setFeedback(gateLoginFeedback, "Credenciais invalidas ou email nao verificado.");
      gateLoginPassword.value = "";
      gateLoginPassword.focus();
      return;
    }
    if (!res.ok) {
      setFeedback(gateLoginFeedback, "Nao foi possivel entrar. Tente novamente.");
      return;
    }

    const data = await res.json();
    if (!data.access_token) {
      setFeedback(gateLoginFeedback, "Resposta inesperada do servidor.");
      return;
    }

    // Validate token by calling /auth/me — never trust login response blindly
    const meRes = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${data.access_token}` }
    });
    if (!meRes.ok) {
      setFeedback(gateLoginFeedback, "Sessao nao pôde ser verificada. Tente novamente.");
      return;
    }
    const me = await meRes.json();

    persistSession(me.email, me.is_verified, data.access_token);
    gateLoginForm.reset();
    updateUiForUser({ email: me.email, emailVerified: me.is_verified });
    showDashboard();
  } catch {
    setFeedback(gateLoginFeedback, "Erro de conexao. Verifique sua internet e tente novamente.");
  } finally {
    setSubmitState(gateLoginForm, false);
  }
});

// ─── Dashboard UI ─────────────────────────────────────────────────────────────
function updateUiForUser(user) {
  if (dom.centralAuthMode) dom.centralAuthMode.textContent = "API";
  if (dom.centralAuthHint) dom.centralAuthHint.textContent = "Sessao validada via Railway.";

  if (!user) {
    dom.centralUserLabel.textContent = "Visitante";
    dom.centralUserSub.textContent = "Acesso nao autenticado";
    dom.centralUserEmail.textContent = "—";
    dom.centralVerificationText.textContent = "Faca login para acessar o workspace.";
    dom.centralLogoutBtn.disabled = true;
    dom.userStatusDot.classList.remove("active");
    return;
  }

  dom.centralUserLabel.textContent = user.emailVerified ? "Usuario verificado" : "Usuario autenticado";
  dom.centralUserSub.textContent = user.emailVerified ? "Acesso completo liberado" : "Verifique seu email para acesso completo";
  dom.centralUserEmail.textContent = user.email;
  dom.centralVerificationText.textContent = user.emailVerified
    ? "Conta verificada e ativa."
    : "Confira sua caixa de entrada para verificar o email.";
  dom.centralLogoutBtn.disabled = false;
  dom.userStatusDot.classList.add("active");
}

function setNotesFeedback(message, tone = "neutral") {
  dom.notesFeedback.textContent = message;
  dom.notesFeedback.classList.toggle("success", tone === "success");
}

function refreshWaitlistCount() {
  const waitlist = readJson(storageKeys.waitlist, []);
  const count = waitlist.length;
  dom.centralWaitlistCount.textContent = `${count} ${count === 1 ? "registro" : "registros"}`;
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
      const next = backlog.map((entry) =>
        entry.id === item.id ? { ...entry, done: checkbox.checked } : entry
      );
      writeJson(storageKeys.backlog, next);
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

// ─── Logout ───────────────────────────────────────────────────────────────────
dom.centralLogoutBtn.addEventListener("click", () => {
  clearSession();
  updateUiForUser(null);
  showGate();
  activateTab("login");
});

// ─── Notes ────────────────────────────────────────────────────────────────────
dom.notesForm.addEventListener("submit", (e) => {
  e.preventDefault();
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
});

// ─── Session restore on load ──────────────────────────────────────────────────
async function restoreSession() {
  const stored = getStoredSession();
  if (!stored || !stored.hasToken) {
    showGate();
    return;
  }

  // We know there was a token but page reloaded — localStorage has no raw token.
  // We need the user to log in again, but we can pre-fill the email for UX.
  // Actually we cannot restore without the token on a module-memory model.
  // The token was cleared on reload, so we show the gate pre-filled.
  activateTab("login");
  if (stored.email) {
    gateLoginEmail.value = stored.email;
  }
  showGate();

  // Edge case: session was stored in old format (had raw token in localStorage)
  // Migrate gracefully — do not use old token without re-validation attempt
  const legacyToken = stored.token;
  if (legacyToken && typeof legacyToken === "string" && legacyToken.length > 20) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${legacyToken}` }
      });
      if (res.ok) {
        const me = await res.json();
        persistSession(me.email, me.is_verified, legacyToken);
        updateUiForUser({ email: me.email, emailVerified: me.is_verified });
        showDashboard();
        return;
      }
    } catch {
      // network error — show gate
    }
    clearSession();
  }
}

// ─── Init ─────────────────────────────────────────────────────────────────────
writeJson(storageKeys.backlog, readJson(storageKeys.backlog, defaultBacklog));
refreshWaitlistCount();
renderBacklog();
renderNotes();
restoreSession();