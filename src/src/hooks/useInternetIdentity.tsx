import React, { createContext, useContext, useState } from 'react'

type Identity = {
  getPrincipal: () => { toString: () => string };
} | null

const Context = createContext<any>(null)

export const InternetIdentityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [identity, setIdentity] = useState<Identity>(null)

  const makeIdentity = (principal: string) => ({
    getPrincipal: () => ({ toString: () => principal }),
  })

  const login = async () => {
    const id = makeIdentity('mock-principal')
    setIdentity(id)
    return id
  }

  // In development, auto-login as admin for quick testing
  if (process.env.NODE_ENV !== 'production' && identity === null) {
    // small timeout to avoid React state update during render
    setTimeout(() => setIdentity(makeIdentity('dev-admin')), 50)
  }

  const clear = () => setIdentity(null)

  return (
    <Context.Provider value={{ identity, login, clear, loginStatus: identity ? 'logged-in' : 'logged-out' }}>
      {children}
    </Context.Provider>
  )
}

export function useInternetIdentity() {
  return useContext(Context)
}

export default useInternetIdentity
