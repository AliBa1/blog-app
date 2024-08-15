"use client";
// import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getPost, getComments } from "@/app/_library/posts";
import { usePathname } from "next/navigation";
import { formatDateTime } from "@/app/_library/tools";
import { authenticate } from "@/app/_library/users";
import Link from "next/link";
import { sendComment, deleteComment } from "@/app/_library/comments";
import Icon from '@mdi/react';
import { mdiDelete } from '@mdi/js';
 
export default function Post() {
  const pathname = usePathname().split('/');
  const postId = pathname[2];
  const [post, setPost] = useState([]);
  const [comments, setCommments] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [updateComments, setUpdateComments] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!postId) {
      return;
    }
    if (updateComments) {
      const refreshComments = async () => {
        const comments = await getComments(postId);
        setCommments(comments);
        setUpdateComments(false);
      }
      refreshComments();
      return;
    }
    const fetchData = async () => {
      const data = await getPost(postId);
      // console.log("Data: ", data);
      // console.log("Author: ", data.author);
      // console.log("Comments: ", data.comments);
      setPost(data);
      setCommments(data.comments);

      const loginState = await authenticate();
      // console.log("Login state: ", loginState);
      if (loginState) {
        const userId = localStorage.getItem('userId');
        setCurrentUserId(Number(userId))
      }
      setLoggedIn(loginState);
    }
    fetchData();
  }, [postId, updateComments])
  
  if (!post) {
    return <p>Loading...</p>
  }
  return (
    <main className="main-div">
      <div className="self-start p-4 w-full">
        {/* <button className="mb-4 text-blue-500 hover:underline">&#8592; <Link href={'/'}>Back to Posts</Link></button> */}
        <h1>{post.title}</h1>
        <p>{post.author?.firstName} {post.author?.lastName}</p>
        {post.updatedAt !== post.createdAt ? 
          <div className="font-thin">
            <p className="font-thin">{formatDateTime(post.createdAt)}</p>
            <p className="font-thin">Last Updated: {formatDateTime(post.updatedAt)}</p>
          </div>:<p className="font-thin">{formatDateTime(post.createdAt)}</p>}

        <p className="mt-12">{post.content}</p>

        <h2 className="mt-12">Comments</h2>
        <ul className="">
          {comments?.map(comment => (
            <li key={comment.id} className="py-4">
              <div className="font-extralight flex items-center">
                {comment.user?.firstName} {comment.user?.lastName} &middot;&nbsp; 
                <span className="font-thin">{formatDateTime(comment.createdAt)}</span>
                {comment.userId === currentUserId ? <button className="ml-2" onClick={(e) => deleteComment(e, comment.id, setUpdateComments, setError)}><Icon path={mdiDelete} size={1} /></button>:''}
              </div>
              <p className="mt-2">{comment.comment}</p>
            </li>
          ))}
        </ul>

        {error && <p className="text-red-500">{error}</p>}
        {loggedIn ? 
        <form className="flex flex-col py-4 w-full" onSubmit={(e) => sendComment(e, newComment, currentUserId, postId, setUpdateComments, setError, setNewComment)}>
          <input type="text" value={newComment} onChange={e => setNewComment(e.target.value)} className="border-b border-black dark:border-inherit bg-inherit mr-2" placeholder="Add a comment"/>
          <button className="button bg-blue-500 hover:bg-blue-600 w-24 my-4">Send</button>
        </form>
        :
        <h3><Link href={'/login'} className="text-blue-500">Login</Link> to send comments</h3>
        }
        
      </div>

    </main>
  )
}