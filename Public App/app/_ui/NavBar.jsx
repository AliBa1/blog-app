'use client';
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { authenticate, logoutUser } from "../_library/users";

export default function NavBar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const path = usePathname();
  const router = useRouter();

  const fetchData = async () => {
    const loginState = await authenticate();
    // console.log("Login state: ", loginState);
    setLoggedIn(loginState);
  }
  
  useEffect(() => {
    fetchData();
  }, [path])

  async function logout() {
    logoutUser();
    fetchData();
    router.push('/');
  }

  return (
    <nav className="top-0 w-full flex justify-end space-x-8 text-xl font-semibold p-4">
      <Link href={'/'} className="hover:text-indigo-800 dark:hover:text-indigo-100 p-4">Posts</Link>
      {loggedIn ? 
        <>
          <Link href={'/user'} className="hover:text-indigo-800 dark:hover:text-indigo-100 p-4">Studio</Link>
          <button onClick={logout} className="hover:text-indigo-800 dark:hover:text-indigo-100 p-4">Logout</button>
        </>
        :
        <>
          <Link href={'/login'} className="hover:text-indigo-800 dark:hover:text-indigo-100 p-4">Login</Link>
          <Link href={'/register'} className="hover:text-indigo-800 dark:hover:text-indigo-100 p-4">Register</Link>
        </>
      }
    </nav>
  )
}