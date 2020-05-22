const proxy = [
  {
    context: [
      '/pessoas',
      '/lancamentos',
      '/categorias'
    ],
    target: 'http://localhost:8080'
  }
];
module.exports = proxy;
