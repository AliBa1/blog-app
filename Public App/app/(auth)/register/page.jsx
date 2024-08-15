'use client';
import { useEffect, useState } from "react";
import { createUser } from "@/app/_library/users";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  useEffect(() => {
    if (registerSuccess) {
      router.push('/');
    }
  }, [registerSuccess, router])
  
  return (
    <main className="main-div">
      <h1 className="mb-2">Create Account</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={(e) => createUser(e,firstName, lastName, username, password, confirmPassword, setError, setRegisterSuccess)} className="flex flex-col space-y-4">
        <input 
          type="text" 
          name="firstname" 
          placeholder="First Name" 
          value={firstName} 
          onChange={(e) => setFirstName(e.target.value)} 
          className="text-black p-1 rounded" 
          required />
        <input 
          type="text" 
          name="lastname" 
          placeholder="Last Name" 
          value={lastName} 
          onChange={(e) => setLastName(e.target.value)} 
          className="text-black p-1 rounded" 
          required />
        <input 
          type="text" 
          name="username" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          className="text-black p-1 rounded" 
          required />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="text-black p-1 rounded" 
          required />
        <input 
          type="password" 
          name="confirmPassword" 
          placeholder="Confirm Password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          className="text-black p-1 rounded" 
          required />
        <button className="button bg-blue-500 hover:bg-blue-600" type="submit">Create Account</button>
      </form>

      <Link href={'/login'} className="text-blue-500 hover:underline">Login</Link>
    </main>
  )
}