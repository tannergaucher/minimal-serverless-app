import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'

import { IsAuthContext, UserContext } from '../context'
import { Fieldset, Form, Input, Button } from '../styles'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { setIsAuth } = useContext(IsAuthContext)
  const { setUser } = useContext(UserContext)
  const history = useHistory()

  async function postLogin(e) {
    e.preventDefault()
    setLoading(true)

    const res = await fetch(`/.netlify/functions/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })

    if (res.ok) {
      const { data } = await res.json()
      localStorage.setItem('token', data.token)
      setUser(data)
      setIsAuth(true)
      setLoading(false)
      history.push(`/`)
    } else {
      const { error } = await res.json()
      setError(error)
      setPassword('')
      setLoading(false)
    }
  }

  return (
    <Fieldset disabled={loading}>
      {error && `Error! ${error.message}`}
      <Form onSubmit={e => postLogin(e)}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Login</Button>
      </Form>
    </Fieldset>
  )
}
