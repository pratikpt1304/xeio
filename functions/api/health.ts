export const onRequestGet = async () => {
  return new Response(
    JSON.stringify({ status: 'ok', service: 'XeIO Edge API (Cloudflare)' }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
};
