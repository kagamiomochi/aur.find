export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const q = url.searchParams.get('q');

  if (!q || q.length < 2) {
    return new Response(JSON.stringify({ error: 'query too short' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const archUrl = `https://archlinux.org/packages/search/json/?q=${encodeURIComponent(q)}&limit=100`;

  try {
    const res = await fetch(archUrl, {
      headers: { 'User-Agent': 'aur-search-app/1.0' },
    });
    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=120',
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Arch APIへの接続に失敗しました' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
