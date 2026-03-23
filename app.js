import { API_BASE_URL } from "./config.js";

const storageKeys = {
  session: "the-eleventh-labs-session",
  waitlist: "the-eleventh-labs-waitlist"
};

const dom = {
  modal: document.getElementById("authModal"),
  authFeedback: document.getElementById("authFeedback"),
  authStateTitle: document.getElementById("authStateTitle"),
  authStateText: document.getElementById("authStateText"),
  authStatusBadge: document.getElementById("authStatusBadge"),
  authForm: document.getElementById("authForm"),
  emailInput: document.getElementById("emailInput"),
  passwordInput: document.getElementById("passwordInput"),
  loginBtn: document.getElementById("loginBtn"),
  verifyBtn: document.getElementById("verifyBtn"),
  logoutBtn: document.getElementById("logoutBtn"),
  authOpeners: document.querySelectorAll("[data-auth-open]"),
  authClosers: document.querySelectorAll("[data-auth-close]"),
  revealTargets: document.querySelectorAll(".reveal-target"),
  authModeLabel: document.getElementById("authModeLabel"),
  waitlistCount: document.getElementById("waitlistCount"),
  waitlistFeedback: document.getElementById("waitlistFeedback"),
  waitlistForm: document.getElementById("waitlistForm"),
  waitlistName: document.getElementById("waitlistName"),
  waitlistEmail: document.getElementById("waitlistEmail"),
  waitlistInterest: document.getElementById("waitlistInterest")
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

function setFeedback(element, message, tone = "neutral") {
  element.textContent = message;
  element.dataset.tone = tone;
}

function openModal() {
  dom.modal.classList.add("is-open");
  dom.modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  dom.modal.classList.remove("is-open");
  dom.modal.setAttribute("aria-hidden", "true");
}

function setupReveal() {
  if (!dom.revealTargets.length) {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  dom.revealTargets.forEach((item) => observer.observe(item));
}

function setupModal() {
  dom.authOpeners.forEach((button) => button.addEventListener("click", openModal));
  dom.authClosers.forEach((button) => button.addEventListener("click", closeModal));

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });
}

function updateUiForUser(user) {
  currentUser = user;
  if (dom.authModeLabel) dom.authModeLabel.textContent = "API";
  if (dom.verifyBtn) dom.verifyBtn.textContent = "Reenviar verificacao";

  if (!user) {
    dom.logoutBtn.disabled = true;
    dom.authStateTitle.textContent = "Auth real ativo";
    dom.authStateText.textContent = "Backend conectado. Crie uma conta ou entre para testar verificacao real por email.";
    dom.authStatusBadge.textContent = "API ativa";
    return;
  }

  dom.logoutBtn.disabled = false;
  dom.authStateTitle.textContent = user.emailVerified ? "Conta verificada" : "Conta criada, verificacao pendente";
  dom.authStateText.textContent = user.emailVerified
    ? `Voce esta autenticado como ${user.email}.`
    : `Voce entrou como ${user.email}. Verifique o email para concluir.`;
  dom.authStatusBadge.textContent = user.emailVerified ? "Verificado" : "Pendente";
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

async function handleRegister(event) {
  event.preventDefault();
  const email = dom.emailInput.value.trim();
  const password = dom.passwordInput.value;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Erro ao criar conta.");
    setFeedback(dom.authFeedback, "Conta criada! Verifique o email para poder entrar.", "success");
  } catch (error) {
    setFeedback(dom.authFeedback, `Nao foi possivel criar a conta: ${error.message}`, "error");
  }
}

async function handleLogin() {
  const email = dom.emailInput.value.trim();
  const password = dom.passwordInput.value;

  try {
    const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) throw new Error(loginData.detail || "Credenciais invalidas.");

    const meRes = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${loginData.access_token}` }
    });
    const me = await meRes.json();
    const user = { email: me.email, emailVerified: me.is_verified, token: loginData.access_token };
    setSession(user);
    updateUiForUser(user);
    setFeedback(dom.authFeedback, "Login realizado com sucesso.", "success");
    closeModal();
  } catch (error) {
    setFeedback(dom.authFeedback, `Nao foi possivel entrar: ${error.message}`, "error");
  }
}

async function handleVerify() {
  const email = dom.emailInput.value.trim() || (currentUser && currentUser.email);
  if (!email) {
    setFeedback(dom.authFeedback, "Digite seu email para reenviar a verificacao.", "error");
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Erro ao reenviar.");
    setFeedback(dom.authFeedback, "Email de verificacao reenviado.", "success");
  } catch (error) {
    setFeedback(dom.authFeedback, `Falha na verificacao: ${error.message}`, "error");
  }
}

async function handleLogout() {
  setSession(null);
  updateUiForUser(null);
  setFeedback(dom.authFeedback, "Sessao encerrada.", "success");
}

function refreshWaitlistUi() {
  const waitlist = readJson(storageKeys.waitlist, []);
  dom.waitlistCount.textContent = String(waitlist.length);
}

function handleWaitlistSubmit(event) {
  event.preventDefault();

  const waitlist = readJson(storageKeys.waitlist, []);
  waitlist.push({
    name: dom.waitlistName.value.trim(),
    email: dom.waitlistEmail.value.trim(),
    interest: dom.waitlistInterest.value,
    createdAt: new Date().toISOString()
  });

  writeJson(storageKeys.waitlist, waitlist);
  refreshWaitlistUi();
  dom.waitlistForm.reset();
  setFeedback(dom.waitlistFeedback, "Interesse salvo localmente com sucesso. Quando voce quiser, isso pode virar um fluxo real com backend ou provider externo.", "success");
}

function setupEvents() {
  dom.authForm.addEventListener("submit", handleRegister);
  dom.loginBtn.addEventListener("click", handleLogin);
  dom.verifyBtn.addEventListener("click", handleVerify);
  dom.logoutBtn.addEventListener("click", handleLogout);
  dom.waitlistForm.addEventListener("submit", handleWaitlistSubmit);
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

setupReveal();
setupModal();
setupEvents();
refreshWaitlistUi();
restoreSession();
