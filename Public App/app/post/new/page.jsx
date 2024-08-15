"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPost } from "@/app/_library/posts";
import { authenticate } from "@/app/_library/users";
import Link from "next/link";
 
export default function NewPost() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [created, setCreated] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (created) {
      router.push('/user');
    }
    const fetchData = async () => {
      const loginState = await authenticate();
      console.log("Login state: ", loginState);
      if (loginState) {
        setLoggedIn(loginState);
        const userId = localStorage.getItem('userId');
        setCurrentUserId(Number(userId));
      }
    }
    fetchData();
  }, [created, router])

  if (!loggedIn) {
    return (
      <main className="main-div text-center">
        <p>You do not have permission to create a post</p>
        <button className="mb-4 text-blue-500 hover:underline">&#8592; <Link href={'/'}>Back to Posts</Link></button>
      </main>
    )
  }
  
  if (created) {
    return <p className="text-green-500 text-center my-2">Your post has been created</p>
  }
  return (
    <main className="main-div">
      <button className="text-blue-500 hover:underline">&#8592; <Link href={'/user'}>Back to User</Link></button>
      {error && <p className="text-red-500">{error}</p>}
      <form className="flex flex-col" onSubmit={(e) => createPost(e, title, content, setCreated, setError)}>
        <label htmlFor="title">Title</label>
        <input type="text" name="title" className="mb-2 p-2 rounded text-black" value={title} onChange={(e) => setTitle(e.target.value)} />

        <label htmlFor="content">Content</label>
        <textarea name="content" id="" cols="60" rows="20" className="mb-2 p-2 rounded text-black" value={content} onChange={(e) => setContent(e.target.value)} />

        {/* <label htmlFor="published">Published
        <input type="button" name="published" className="self-start" />
        </label> */}
        
        <button type="submit" className="button bg-blue-500 hover:bg-blue-600 w-1/3 self-center">Create</button>        
      </form>

    </main>
  )
}