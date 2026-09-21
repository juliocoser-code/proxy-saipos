module.exports = async (req, res) => {
  // Limpa o caminho para aceitar chamadas com ou sem /api
  const cleanUrl = req.url.replace(/^\/api\/?/, '').replace(/^\//, '');

  // Se abrir direto no navegador, confirma que o proxy está ativo
  if (!cleanUrl || cleanUrl === '/') {
    return res.status(200).json({
      ok: true,
      servidor: 'São Paulo (GRU1)',
      mensagem: 'Proxy Saipos NC Steakhouse 100% ativo'
    });
  }

  const targetUrl = new URL(`https://data.saipos.io/v1/${cleanUrl}`);

  try {
    const headers = {};
    if (req.headers.authorization) {
      headers.authorization = req.headers.authorization;
    }
    headers['accept'] = 'application/json';
    headers['content-type'] = 'application/json';

    const response = await fetch(targetUrl.toString(), {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined
    });

    const data = await response.text();
    const contentType = response.headers.get('content-type');
    if (contentType) res.setHeader('content-type', contentType);
    res.status(response.status).send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
