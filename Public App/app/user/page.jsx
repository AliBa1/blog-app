"use client";
import { useEffect, useState } from "react";
import { formatDate } from "../_library/tools";
import { useRouter } from "next/navigation";
import { getUser } from "../_library/users";
import Icon from "@mdi/react";
import { mdiDelete, mdiEye, mdiPencil } from "@mdi/js";
import Link from "next/link";
import { authenticate } from "../_library/users";
import { deletePost } from "../_library/posts";

export default function User() {
  const [user, setUser] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [updatePosts, setUpdatePosts] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const loginState = await authenticate();
      // console.log("Login state: ", loginState);
      setLoggedIn(loginState);
      if (loginState) {
        const userId = localStorage.getItem("userId");
        const data = await getUser(userId);
        // console.log("Data: ", data);
        setUser(data);
        setPosts(data?.posts);
      }
    }
    fetchData();
    setLoading(false);
  }, [])

  useEffect(() => {
    if (updatePosts) {
      setLoading(true);
      const updateData = async () => {
        const userId = localStorage.getItem("userId");
        const data = await getUser(userId);
        // console.log("Data: ", data);
        setPosts(data.posts);
      }
      updateData();
      setLoading(false);
    }
  }, [updatePosts])

  if (loading) {
    return (
      <div className='main-div justify-center'>
        <h3>LOADING...</h3>
      </div>
    )
  }

  if (!loggedIn) {
    return (
      <main className="main-div text-center">
        <h2><Link href={'/login'} className="text-blue-500">Login</Link> to access this page</h2>
      </main>
    );
  }

  if (!posts) {
    return (
      <main className="main-div text-start">
        <h1>Studio</h1>
        <button className="text-2xl text-green-500 hover:text-green-600" onClick={() => {router.push(`/post/new`)}}>New Post +</button>
        {error && <p className="text-red-500">{error}</p>}
      </main>
    )
  }

  return (
    <main className="main-div text-start">
      <h1>Studio</h1>

      {/* <button className="text-xl button bg-green-500 hover:bg-green-600" onClick={() => {router.push(`/post/new`)}}>New Post +</button> */}
      <button className="text-2xl text-green-500 hover:text-green-600" onClick={() => {router.push(`/post/new`)}}>New Post +</button>
      
      {error && <p className="text-red-500">{error}</p>}
      {/* <div className="grid grid-cols-3 gap-4"> */}
      <ul className="w-full">
        {posts.map((post) => 
          <li key={post.id} className="mb-4 p-4 flex border-b last:border-none justify-between items-center">
            <div className="w-1/2">
              <h3>{post.title}</h3>
              <p className="truncate">{post.content}</p>
              <p>{formatDate(post.createdAt)}</p>
            </div>

            <div className="flex space-x-8">
              <button className="p-1 flex flex-col items-center" onClick={() => {router.push(`/post/${post.id}`)}}>
                <Icon path={mdiEye} size={1}></Icon>
                View
              </button>

              <button className="p-1 flex flex-col items-center" onClick={() => {router.push(`/post/${post.id}/edit`)}}>
                <Icon path={mdiPencil} size={1}></Icon>
                Edit
              </button>

              <button className="p-1 flex flex-col items-center" onClick={(e) => deletePost(e, post.id, setUpdatePosts, setError)}>
                <Icon path={mdiDelete} size={1}></Icon>
                Delete
              </button>
            </div>
          </li>
        )}
      </ul>
      
    </main>
  )
}