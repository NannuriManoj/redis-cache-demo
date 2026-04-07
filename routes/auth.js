// simple login handler — just for testing rate limiting
export async function loginHandler(request, reply) {
  const { username, password } = request.body

  // simulate login logic
  if (username === 'admin' && password === 'admin123') {
    return reply.send({ message: 'Login successful', token: 'fake-jwt-token' })
  }

  return reply.code(401).send({ error: 'Invalid credentials' })
}