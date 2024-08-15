'use client';
import { useEffect, useState } from "react";
import { loginUser } from "@/app/_library/users";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login(params) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    if (loginSuccess) {
      router.push('/');
    }
  }, [loginSuccess, router])
  
  return (
    <main className="main-div">
      <h1 className="mb-2">Login</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={(e) => loginUser(e, username, password, setError, setLoginSuccess)} className="flex flex-col space-y-4">
        <input 
          type="text" 
          name="username" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          className="text-black p-2 rounded" 
          required />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="text-black p-2 rounded" 
          required />
        <button className="button bg-blue-500 hover:bg-blue-600" type="submit">Login</button>
      </form>

      <Link href={'/register'} className="text-blue-500 hover:underline">Create Account</Link>
    </main>
  )
}