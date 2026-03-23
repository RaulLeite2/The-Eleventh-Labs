const gateDiscordBtn = document.getElementById("gateDiscordBtn");

if (gateDiscordBtn) {
  gateDiscordBtn.addEventListener("click", () => {
    const next = "/central.html";
    window.location.href = `${API_BASE_URL}/auth/discord/login?next=${encodeURIComponent(next)}`;
  });
}

function parseHashParams() {
  if (!window.location.hash) return {};
  return Object.fromEntries(
    window.location.hash.slice(1).split("&").map(p => {
      const [k, v] = p.split("=");
      return [decodeURIComponent(k), decodeURIComponent(v ?? "")];
    })
  );
}

async function handleDiscordOAuth() {
  const params = parseHashParams();
  if (params.auth_token && params.provider === "discord") {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${params.auth_token}` }
      });
      if (res.ok) {
        const me = await res.json();
        _sessionToken = params.auth_token;
        localStorage.setItem("the-eleventh-labs-session", JSON.stringify({ email: me.email, emailVerified: me.is_verified, hasToken: true }));
        window.location.hash = "";
        document.getElementById("authGate").hidden = true;
        document.getElementById("dashboardShell").hidden = false;
        return;
      }
    } catch {}
    document.getElementById("gateLoginFeedback").textContent = "Falha ao validar login Discord.";
    window.location.hash = "";
  }
}

handleDiscordOAuth();