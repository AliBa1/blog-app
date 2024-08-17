"use client";
import { useEffect, useState } from "react";
import { getPosts } from "./_library/posts";
import { formatDate } from "./_library/tools";
import { useRouter } from "next/navigation";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      console.log("before the fetch.");
      const data = await getPosts();
      console.log("after the fetch.");
      // console.log("Data: ", data);
      setPosts(data);
    }
    fetchPosts();
  }, [])

  if (!posts) {
    return (
      <main className="main-div text-start">
        <h1>Posts</h1>
        {error && <p className="text-red-500">{error}</p>}
      </main>
    )
  }

  return (
    <main className="main-div">
      <h1>Posts</h1>

      {/* <div className="grid grid-cols-3 gap-8"> */}
      <div className="w-full">
        {posts.map((post) => 
          <div key={post.id} className="border-b last:border-none p-4 hover:cursor-pointer" onClick={() => {router.push(`/post/${post.id}`);}}>
            <h3>{post.title}</h3>
            <p className="truncate">{post.content}</p>
            <p>{post.author.firstName} {post.author.lastName} &middot; {formatDate(post.createdAt)}</p>
          </div>
        )}
      </div>
      
    </main>
  )
}