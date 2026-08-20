// Cloudflare Pages Function — démarre la connexion GitHub pour l'admin (Decap CMS).
// Route : /auth  → redirige vers l'autorisation GitHub.
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const clientId = env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return new Response("GITHUB_CLIENT_ID manquant dans les variables Cloudflare.", { status: 500 });
  }

  // jeton anti-CSRF (state), stocké en cookie le temps de l'aller-retour
  const state = crypto.randomUUID();

  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("redirect_uri", `${url.origin}/callback`);
  authorize.searchParams.set("scope", "repo,user");
  authorize.searchParams.set("state", state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorize.toString(),
      "Set-Cookie": `csrf=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`,
    },
  });
}
