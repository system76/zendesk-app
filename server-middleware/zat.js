export default (req, res, next) => {
  if (req.url === '/zat') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type'
    })

    res.end('ok')
  } else {
    return next()
  }
}
