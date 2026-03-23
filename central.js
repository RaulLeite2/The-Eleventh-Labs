
const gateDiscordBtn = document.getElementById("gateDiscordBtn");
if (gateDiscordBtn) {
  gateDiscordBtn.addEventListener("click", () => {
    window.location.href = "https://discord.com/oauth2/authorize?client_id=1485651103763796029&response_type=code&redirect_uri=https%3A%2F%2Ftheabyssauth.up.railway.app%2Fauth%2Fdiscord%2Fcallback&scope=identify+email";
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