export const onRequestGet = async () => {
  return new Response(
    JSON.stringify({
      status: 'ok',
      service: 'XeIO Edge Platform (Cloudflare)',
      timestamp: new Date().toISOString(),
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
};
