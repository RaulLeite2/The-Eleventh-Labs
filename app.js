import { API_BASE_URL } from "./config.js";

const translations = {
  pt: {
    nav_about: "Sobre",
    nav_how: "Como funciona",
    nav_benefits: "Beneficios",
    nav_auth: "Auth",
    nav_central: "Central",
    nav_access: "Acessar",
    hero_kicker: "Launch layer for builders and premium projects",
    hero_title: "Crie projetos com cara de produto serio desde a primeira tela.",
    hero_subtitle: "The Eleventh Labs foi pensada para unir branding forte, onboarding elegante e auth real, para que o usuario entre, crie e avance sem sentir que esta num prototipo improvisado.",
    hero_cta_primary: "Criar conta",
    hero_cta_secondary: "Entrar",
    hero_cta_workspace: "Abrir workspace",
    signal_auth: "Auth real",
    signal_projects: "Projetos do usuario",
    signal_bilingual: "PT / EN",
    signal_ready: "Base pronta para dashboard",
    metric_1_title: "Entrada premium",
    metric_1_text: "Uma home com peso visual para apresentar o produto sem parecer holding page vazia.",
    metric_2_title: "Auth conectado",
    metric_2_text: "Cadastro, login e verificacao falam com a API real da The Abyss no Railway.",
    metric_3_title: "Proxima camada",
    metric_3_text: "Depois do login, o usuario entra numa central pronta para receber projetos, perfil e configuracoes.",
    preview_kicker: "Workspace preview",
    preview_auth: "API ativa",
    preview_primary_label: "Project cockpit",
    preview_title: "Uma entrada que ja parece a casa dos projetos do usuario.",
    preview_text: "Em vez de falar sobre bastidor, a homepage agora entrega uma sensacao clara: criar, acessar e continuar dentro de um produto premium.",
    preview_card_1_label: "Create",
    preview_card_1_title: "Project setup",
    preview_card_1_text: "Comece com uma conta, entre no workspace e prepare o primeiro projeto sem friccao.",
    preview_card_2_label: "Identity",
    preview_card_2_title: "User layer",
    preview_card_2_text: "Perfil, preferencias e recursos privados entram como extensao natural da sessao atual.",
    preview_stat_1_value: "Auth real",
    preview_stat_1_text: "cadastro, login e sessao ja conectados",
    preview_stat_2_value: "Proximo passo",
    preview_stat_2_text: "projetos, perfil e modulos protegidos",
    about_kicker: "Sobre",
    about_title: "O ponto de entrada para projetos que precisam nascer com presenca",
    about_text: "The Eleventh Labs combina identidade forte, acesso elegante e uma experiencia pronta para receber usuarios desde o primeiro contato.",
    how_kicker: "Como funciona",
    how_title: "Uma experiencia pensada para apresentar, autenticar e continuar",
    how_card_1_title: "Entrada clara",
    how_card_1_text: "A primeira tela apresenta valor com ritmo, contraste e uma hierarquia visual que conduz sem confundir.",
    how_card_2_title: "Acesso fluido",
    how_card_2_text: "Cadastro, login e verificacao funcionam numa camada unica, com um fluxo consistente do inicio ao fim.",
    how_card_3_title: "Continuidade real",
    how_card_3_text: "A sessao segue para a central e abre caminho para projetos, perfil e modulos privados sem ruptura.",
    benefits_kicker: "Beneficios",
    benefits_title: "Entre, crie e avance com uma base que parece produto de verdade",
    benefits_text: "The Eleventh Labs reune identidade forte, acesso elegante e continuidade real num unico fluxo que respeita o usuario desde o primeiro clique.",
    benefit_chip_1: "Marca forte",
    benefit_chip_2: "Auth real",
    benefit_chip_3: "Sessao persistida",
    benefit_chip_4: "Entrada premium",
    benefits_cta: "Ir para a central",
    launch_kicker: "Launch path",
    launch_title: "De visitante a usuario em minutos",
    launch_step_1: "Crie sua conta numa tela com peso e identidade visual de produto.",
    launch_step_2: "Login conectado a um backend real, com sessao persistida entre telas.",
    launch_step_3: "Acesse projetos, perfil e modulos privados direto do workspace.",
    launch_step_4: "Expanda conforme o produto cresce, sem reescrever o inicio.",
    auth_kicker: "Auth",
    auth_title: "Cadastro e login com backend real",
    auth_open: "Abrir auth",
    auth_text: "A camada de entrada ja usa a API da The Abyss para registrar usuario, autenticar sessao e reenviar verificacao por email.",
    auth_create: "Criar conta",
    auth_logout: "Sair",
    security_kicker: "Seguranca",
    security_title: "Uma entrada pronta para virar produto serio",
    security_item_1: "Mesmo backend para cadastro, login e sessao.",
    security_item_2: "JWT reaproveitavel nas areas privadas.",
    security_item_3: "Sessao revalidada quando a pagina abre.",
    security_item_4: "Estrutura pronta para perfil, preferencias e recursos protegidos.",
    access_kicker: "Acesso antecipado",
    access_title: "Enquanto o dashboard cresce, voce ja pode medir interesse",
    access_text: "A lista de interesse continua local por enquanto, mas ela ajuda a testar a linguagem da home e os gatilhos de entrada antes de ligar um fluxo real para leads.",
    access_stat_1: "interesses salvos localmente",
    access_stat_2: "camada atual de autenticacao",
    form_name: "Nome",
    form_email: "Email",
    form_interest: "O que voce quer fazer primeiro?",
    form_submit: "Salvar interesse",
    waitlist_empty: "Nenhum interesse salvo ainda nesta sessao local.",
    faq_title: "Perguntas que o usuario pode fazer antes de entrar",
    faq_q1: "Eu ja consigo entrar hoje?",
    faq_a1: "Sim. A home ja conversa com a API real para cadastro, login, sessao e reenvio de verificacao.",
    faq_q2: "Depois do login eu vou para onde?",
    faq_a2: "Para a central, que ja reconhece a sessao atual e esta pronta para evoluir para projetos, perfil e configuracoes.",
    faq_q3: "A home ja esta final?",
    faq_a3: "Nao. Ela ja esta forte o suficiente para funcionar agora, mas ainda pode evoluir junto com o produto.",
    footer_text: "Uma camada premium de lancamento da The Abyss para produtos guiados por projetos.",
    modal_kicker: "Acesso",
    modal_title: "Cadastro e login",
    modal_subtitle: "Este fluxo ja usa a API real da The Abyss. Depois do cadastro, a verificacao por email continua no backend hospedado no Railway.",
    modal_password: "Senha",
    modal_register: "Criar conta",
    modal_login: "Entrar",
    modal_verify: "Reenviar verificacao",
    modal_feedback: "Preencha seu email e senha para testar o fluxo.",
    input_name_placeholder: "Seu nome",
    input_email_placeholder: "voce@exemplo.com",
    input_password_placeholder: "Minimo de 6 caracteres",
    interest_1: "Criar projeto",
    interest_2: "Entrar no workspace",
    interest_3: "Ver a central",
    interest_4: "Acompanhar o lancamento",
    auth_state_idle_title: "Auth real ativo",
    auth_state_idle_text: "Backend conectado. Crie uma conta ou entre para testar verificacao real por email.",
    auth_state_verified_title: "Conta verificada",
    auth_state_pending_title: "Conta criada, verificacao pendente",
    auth_state_verified_text: "Voce esta autenticado como {email}.",
    auth_state_pending_text: "Voce entrou como {email}. Verifique o email para concluir.",
    auth_status_active: "API ativa",
    auth_status_verified: "Verificado",
    auth_status_pending: "Pendente",
    register_success: "Conta criada. Verifique o email para poder entrar.",
    register_error: "Nao foi possivel criar a conta: {message}",
    login_success: "Login realizado com sucesso.",
    login_error: "Nao foi possivel entrar: {message}",
    verify_empty: "Digite seu email para reenviar a verificacao.",
    verify_success: "Email de verificacao reenviado.",
    verify_error: "Falha na verificacao: {message}",
    logout_success: "Sessao encerrada.",
    waitlist_success: "Interesse salvo localmente com sucesso. Depois isso pode virar um fluxo real com backend.",
    current_auth_mode: "API"
  },
  en: {
    nav_about: "About",
    nav_how: "How it works",
    nav_benefits: "Benefits",
    nav_auth: "Auth",
    nav_central: "Central",
    nav_access: "Access",
    hero_kicker: "Launch layer for builders and premium projects",
    hero_title: "Build projects with a serious product feel from the very first screen.",
    hero_subtitle: "The Eleventh Labs was designed to combine strong branding, elegant onboarding and real auth, so users can enter, create and move forward without feeling trapped in a rough prototype.",
    hero_cta_primary: "Create account",
    hero_cta_secondary: "Sign in",
    hero_cta_workspace: "Open workspace",
    signal_auth: "Real auth",
    signal_projects: "User projects",
    signal_bilingual: "PT / EN",
    signal_ready: "Dashboard-ready base",
    metric_1_title: "Premium entry",
    metric_1_text: "A landing with enough visual weight to present the product without feeling like an empty holding page.",
    metric_2_title: "Connected auth",
    metric_2_text: "Signup, login and verification already talk to The Abyss real API on Railway.",
    metric_3_title: "Next layer",
    metric_3_text: "After login, the user lands in a central area ready for projects, profile and settings.",
    preview_kicker: "Workspace preview",
    preview_auth: "API active",
    preview_primary_label: "Project cockpit",
    preview_title: "An entry layer that already feels like the home of the user's projects.",
    preview_text: "Instead of talking about internal status, the homepage now delivers a clear feeling: create, access and continue inside a premium product.",
    preview_card_1_label: "Create",
    preview_card_1_title: "Project setup",
    preview_card_1_text: "Start with an account, enter the workspace and prepare the first project with minimal friction.",
    preview_card_2_label: "Identity",
    preview_card_2_title: "User layer",
    preview_card_2_text: "Profile, preferences and private features come in as a natural extension of the current session.",
    preview_stat_1_value: "Real auth",
    preview_stat_1_text: "signup, login and session already connected",
    preview_stat_2_value: "Next step",
    preview_stat_2_text: "projects, profile and protected modules",
    about_kicker: "About",
    about_title: "The entry point for projects that need to launch with presence",
    about_text: "The Eleventh Labs combines strong identity, elegant access and an experience ready to welcome users from the very first contact.",
    how_kicker: "How it works",
    how_title: "An experience built to present, authenticate and continue",
    how_card_1_title: "Clear entry",
    how_card_1_text: "The first screen presents value with rhythm, contrast and visual hierarchy that guides without getting in the way.",
    how_card_2_title: "Smooth access",
    how_card_2_text: "Signup, login and verification work inside one unified layer with a consistent flow from start to finish.",
    how_card_3_title: "Real continuity",
    how_card_3_text: "The session carries into the central and opens the way for projects, profile and private modules without friction.",
    benefits_kicker: "Benefits",
    benefits_title: "Enter, create and advance on a base that looks like a real product",
    benefits_text: "The Eleventh Labs brings strong identity, elegant access and real continuity into one flow that respects the user from the very first click.",
    benefit_chip_1: "Strong brand",
    benefit_chip_2: "Real auth",
    benefit_chip_3: "Persistent session",
    benefit_chip_4: "Premium entry",
    benefits_cta: "Go to central",
    launch_kicker: "Launch path",
    launch_title: "From visitor to user in minutes",
    launch_step_1: "Create your account on a screen with real visual weight and product identity.",
    launch_step_2: "Login connected to a real backend, with persistent session across screens.",
    launch_step_3: "Access projects, profile and private modules directly from the workspace.",
    launch_step_4: "Scale as the product grows, without rewriting the foundation.",
    auth_kicker: "Auth",
    auth_title: "Signup and login with a real backend",
    auth_open: "Open auth",
    auth_text: "The entry layer already uses The Abyss API to register users, authenticate sessions and resend email verification.",
    auth_create: "Create account",
    auth_logout: "Logout",
    security_kicker: "Security",
    security_title: "An entry layer ready to become a serious product",
    security_item_1: "Same backend for signup, login and session.",
    security_item_2: "Reusable JWT for private areas.",
    security_item_3: "Session revalidated when the page opens.",
    security_item_4: "Structure ready for profile, preferences and protected features.",
    access_kicker: "Early access",
    access_title: "While the dashboard grows, you can already measure interest",
    access_text: "The interest list is still local for now, but it helps test the homepage language and entry triggers before wiring a real lead flow.",
    access_stat_1: "interests saved locally",
    access_stat_2: "current auth layer",
    form_name: "Name",
    form_email: "Email",
    form_interest: "What do you want to do first?",
    form_submit: "Save interest",
    waitlist_empty: "No interest saved in this local session yet.",
    faq_title: "Questions a user may ask before entering",
    faq_q1: "Can I already get in today?",
    faq_a1: "Yes. The homepage already talks to the real API for signup, login, session and verification resend.",
    faq_q2: "Where do I go after login?",
    faq_a2: "To the central area, which already recognizes the current session and is ready to evolve into projects, profile and settings.",
    faq_q3: "Is the homepage final already?",
    faq_a3: "No. It is already strong enough to work now, but it can still evolve with the product.",
    footer_text: "A premium launch layer by The Abyss for project-driven products.",
    modal_kicker: "Access",
    modal_title: "Sign up and login",
    modal_subtitle: "This flow already uses The Abyss real API. After signup, email verification continues in the backend hosted on Railway.",
    modal_password: "Password",
    modal_register: "Create account",
    modal_login: "Sign in",
    modal_verify: "Resend verification",
    modal_feedback: "Fill in your email and password to test the flow.",
    input_name_placeholder: "Your name",
    input_email_placeholder: "you@example.com",
    input_password_placeholder: "Minimum 6 characters",
    interest_1: "Create a project",
    interest_2: "Enter the workspace",
    interest_3: "See the central",
    interest_4: "Follow the launch",
    auth_state_idle_title: "Real auth active",
    auth_state_idle_text: "Backend connected. Create an account or sign in to test real email verification.",
    auth_state_verified_title: "Verified account",
    auth_state_pending_title: "Account created, verification pending",
    auth_state_verified_text: "You are authenticated as {email}.",
    auth_state_pending_text: "You signed in as {email}. Verify your email to continue.",
    auth_status_active: "API active",
    auth_status_verified: "Verified",
    auth_status_pending: "Pending",
    register_success: "Account created. Verify your email before signing in.",
    register_error: "Could not create the account: {message}",
    login_success: "Login completed successfully.",
    login_error: "Could not sign in: {message}",
    verify_empty: "Type your email to resend verification.",
    verify_success: "Verification email resent.",
    verify_error: "Verification failed: {message}",
    logout_success: "Session ended.",
    waitlist_success: "Interest saved locally. Later this can become a real backend flow.",
    current_auth_mode: "API"
  }
};

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
  waitlistInterest: document.getElementById("waitlistInterest"),
  langButtons: document.querySelectorAll("[data-lang]"),
  i18nNodes: document.querySelectorAll("[data-i18n]")
};

let currentLanguage = localStorage.getItem("the-eleventh-labs-language") || "pt";
let currentUser = null;

function t(key, vars = {}) {
  const dictionary = translations[currentLanguage] || translations.pt;
  let message = dictionary[key] || translations.pt[key] || key;
  Object.entries(vars).forEach(([name, value]) => {
    message = message.replace(`{${name}}`, value);
  });
  return message;
}

function applyTranslations() {
  document.documentElement.lang = currentLanguage === "pt" ? "pt-BR" : "en";
  dom.i18nNodes.forEach((node) => {
    const key = node.dataset.i18n;
    if (key) {
      node.textContent = t(key);
    }
  });

  dom.waitlistName.placeholder = t("input_name_placeholder");
  dom.waitlistEmail.placeholder = t("input_email_placeholder");
  dom.emailInput.placeholder = t("input_email_placeholder");
  dom.passwordInput.placeholder = t("input_password_placeholder");

  const options = dom.waitlistInterest.querySelectorAll("option[data-i18n]");
  options.forEach((option) => {
    option.textContent = t(option.dataset.i18n);
  });

  dom.langButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.lang === currentLanguage);
  });

  if (!currentUser) {
    dom.authStateTitle.textContent = t("auth_state_idle_title");
    dom.authStateText.textContent = t("auth_state_idle_text");
    dom.authStatusBadge.textContent = t("auth_status_active");
    dom.authModeLabel.textContent = t("current_auth_mode");
  } else {
    updateUiForUser(currentUser);
  }

  if (!dom.waitlistFeedback.dataset.tone) {
    dom.waitlistFeedback.textContent = t("waitlist_empty");
  }
}

function setupLanguageSwitch() {
  dom.langButtons.forEach((button) => {
    button.addEventListener("click", () => {
      currentLanguage = button.dataset.lang;
      localStorage.setItem("the-eleventh-labs-language", currentLanguage);
      applyTranslations();
    });
  });
}

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
  if (dom.authModeLabel) dom.authModeLabel.textContent = t("current_auth_mode");
  if (dom.verifyBtn) dom.verifyBtn.textContent = t("modal_verify");

  if (!user) {
    dom.logoutBtn.disabled = true;
    dom.authStateTitle.textContent = t("auth_state_idle_title");
    dom.authStateText.textContent = t("auth_state_idle_text");
    dom.authStatusBadge.textContent = t("auth_status_active");
    return;
  }

  dom.logoutBtn.disabled = false;
  dom.authStateTitle.textContent = user.emailVerified ? t("auth_state_verified_title") : t("auth_state_pending_title");
  dom.authStateText.textContent = user.emailVerified
    ? t("auth_state_verified_text", { email: user.email })
    : t("auth_state_pending_text", { email: user.email });
  dom.authStatusBadge.textContent = user.emailVerified ? t("auth_status_verified") : t("auth_status_pending");
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
    setFeedback(dom.authFeedback, data.message || t("register_success"), "success");
  } catch (error) {
    setFeedback(dom.authFeedback, t("register_error", { message: error.message }), "error");
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
    setFeedback(dom.authFeedback, t("login_success"), "success");
    closeModal();
  } catch (error) {
    setFeedback(dom.authFeedback, t("login_error", { message: error.message }), "error");
  }
}

async function handleVerify() {
  const email = dom.emailInput.value.trim() || (currentUser && currentUser.email);
  if (!email) {
    setFeedback(dom.authFeedback, t("verify_empty"), "error");
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
    setFeedback(dom.authFeedback, data.message || t("verify_success"), "success");
  } catch (error) {
    setFeedback(dom.authFeedback, t("verify_error", { message: error.message }), "error");
  }
}

async function handleLogout() {
  setSession(null);
  updateUiForUser(null);
  setFeedback(dom.authFeedback, t("logout_success"), "success");
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
  setFeedback(dom.waitlistFeedback, t("waitlist_success"), "success");
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
setupLanguageSwitch();
setupEvents();
refreshWaitlistUi();
applyTranslations();
restoreSession();
