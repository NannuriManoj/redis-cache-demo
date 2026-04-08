export async function loginHandler(request, reply) {
  const { username, password } = request.body

  request.log.info({ username }, 'Login attempt')

  if (username === 'admin' && password === 'admin123') {
    request.log.info({ username }, 'Login successful')
    return reply.send({ message: 'Login successful', token: 'fake-jwt-token' })
  }

  request.log.warn({ username }, 'Invalid login attempt')

  return reply.code(401).send({ error: 'Invalid credentials' })
}