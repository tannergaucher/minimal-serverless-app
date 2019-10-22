import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'

import { IsAuthContext, UserContext } from '../context'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { setIsAuth } = useContext(IsAuthContext)
  const { setUser } = useContext(UserContext)

  const history = useHistory()

  return (
    <fieldset disabled={loading}>
      {error && `Error: ${error.message}`}
      <form
        onSubmit={async e => {
          e.preventDefault()
          try {
            setLoading(true)
            const res = await fetch(`/.netlify/functions/signup`, {
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
              setIsAuth(true)
              setLoading(false)
              setUser(data)
              history.push(`/`)
            } else {
              const { error } = await res.json()
              console.log('ELSE')
              console.log(error)
              setError(error)
            }
          } catch (error) {
            console.log('CATCH!')
            setError(error)
          }
        }}
      >
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button type="submit">Sign Up</button>
      </form>
    </fieldset>
  )
}
