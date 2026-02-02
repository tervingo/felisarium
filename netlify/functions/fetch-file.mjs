const BASE_URL = "http://tervingo.com/Felisarium/";
const ALLOWED_FILES = ["felisadas.txt", "serranadas.txt", "otros.txt"];

export default async (req) => {
  const url = new URL(req.url);
  const file = url.searchParams.get("file");

  if (!file || !ALLOWED_FILES.includes(file)) {
    return new Response("Invalid file", { status: 400 });
  }

  try {
    const response = await fetch(`${BASE_URL}${file}`, {
      headers: { "User-Agent": "Felisarium/1.0" },
    });

    if (!response.ok) {
      return new Response(`Upstream error: ${response.status}`, {
        status: response.status,
      });
    }

    const text = await response.text();
    return new Response(text, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error("fetch-file error:", err);
    return new Response("Proxy error", { status: 502 });
  }
};
