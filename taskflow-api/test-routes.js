const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3333,
  path: '/api/v1/auth/google',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers.location);
});

req.on('error', (error) => {
  console.error('Erro:', error.message);
});

req.end();
