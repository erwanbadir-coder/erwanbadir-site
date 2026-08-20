// Cloudflare Pages Function — reçoit le retour de GitHub, échange le code
// contre un jeton d'accès, puis le renvoie à l'admin (Decap CMS).
// Route : /callback
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  // vérifie le state (anti-CSRF) via le cookie posé par /auth
  const cookie = request.headers.get("Cookie") || "";
  const csrf = cookie
    .split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith("csrf="))
    ?.slice("csrf=".length);

  if (!code || !state || !csrf || state !== csrf) {
    return htmlMessage("error", { error: "État invalide (CSRF). Réessaie la connexion." });
  }

  // échange code -> access_token
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await tokenRes.json();
  if (!data || !data.access_token) {
    return htmlMessage("error", { error: (data && data.error) || "Échec de l'obtention du jeton." });
  }

  return htmlMessage("success", { token: data.access_token, provider: "github" });
}

// Renvoie une page qui transmet le résultat à la fenêtre de l'admin (postMessage).
function htmlMessage(status, result) {
  const payload = JSON.stringify(result);
  const html = `<!doctype html><html><head><meta charset="utf-8"></head><body>
<script>
  (function () {
    function receiveMessage(e) {
      window.opener.postMessage(
        'authorization:github:${status}:' + ${JSON.stringify(payload)},
        e.origin
      );
      window.removeEventListener('message', receiveMessage, false);
    }
    window.addEventListener('message', receiveMessage, false);
    window.opener.postMessage('authorizing:github', '*');
  })();
</script>
<p>Connexion en cours… tu peux fermer cette fenêtre si elle ne se ferme pas seule.</p>
</body></html>`;
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // efface le cookie csrf
      "Set-Cookie": "csrf=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0",
    },
  });
}
