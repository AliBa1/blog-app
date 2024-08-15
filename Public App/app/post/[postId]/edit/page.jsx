"use client";
import { useEffect, useState } from "react";
import { getPost, updatePost } from "@/app/_library/posts";
import { usePathname } from "next/navigation";
import { authenticate } from "@/app/_library/users";
import Link from "next/link";
 
export default function EditPost() {
  const pathname = usePathname().split('/');
  const postId = pathname[2];
  const [post, setPost] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [notUser, setNotUser] = useState(true);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedContent, setUpdatedContent] = useState('');
  const [updateSuccessful, setUpdateSuccessful] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!postId) {
      return;
    }
    const fetchData = async () => {
      const loginState = await authenticate();
      // console.log("Login state: ", loginState);
      if (loginState) {
        setLoggedIn(loginState);
        const userId = localStorage.getItem('userId');
        setCurrentUserId(Number(userId));

        const data = await getPost(postId);
        // console.log("Data: ", data);
        // console.log("Author: ", data.author);
        setPost(data);

        if (data.author.id === Number(userId)) {
          setNotUser(false);
        } else {
          setNotUser(true);
          return;
        }

        setUpdatedTitle(data.title);
        setUpdatedContent(data.content);
      }
    }
    fetchData();
  }, [postId])

  if (notUser) {
    return (
      <main className="main-div text-center">
        <p>You do not have permission to edit this post</p>
        <button className="mb-4 text-blue-500 hover:underline">&#8592; <Link href={'/'}>Back to Posts</Link></button>
      </main>
    )
  }
  
  if (!post) {
    return <p>Loading...</p>
  }
  return (
    <main className="main-div">
      <button className="text-blue-500 hover:underline">&#8592; <Link href={'/user'}>Back to User</Link></button>
      {error && <p className="text-red-500">{error}</p>}
      <form className="flex flex-col" onSubmit={(e) => updatePost(e, postId, updatedTitle, updatedContent, setUpdateSuccessful, setError)}>
        <label htmlFor="title">Title</label>
        <input type="text" name="title" className="mb-2 p-2 rounded text-black" value={updatedTitle} onChange={(e) => setUpdatedTitle(e.target.value)} />

        <label htmlFor="content">Content</label>
        <textarea name="content" id="" cols="60" rows="20" className="mb-2 p-2 rounded text-black" value={updatedContent} onChange={(e) => setUpdatedContent(e.target.value)} />

        {/* <label htmlFor="published">Published
        <input type="button" name="published" className="self-start" />
        </label> */}

        {updateSuccessful && <p className="text-green-500 text-center my-2">Your post has been updated</p>}
        
        <button type="submit" className="button bg-blue-500 hover:bg-blue-600 w-1/3 self-center">Update</button>
      </form>
    </main>
  )
}