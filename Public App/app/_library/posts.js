import axios from "axios";

export const getPosts = async () => {
  try {
    console.log("In fetch p1");
    // const posts = await axios.get('http://localhost:8000/posts');
    const posts = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
    console.log("In fetch p2");
    // console.log(posts.data);
    return posts.data;
  } catch (error) {
    console.error(error.response?.data.error);
  }
}

export const getPost = async (postId) => {
  try {
    // const post = await axios.get(`http://localhost:8000/posts/${postId}`);
    const post = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`);
    return post.data;
  } catch (error) {
    console.error(error.response?.data.error);
    throw new Error("Failed to fetch post data");
  }
}

export async function getComments(postId) {
  try {
    // const comments = await axios.get(`http://localhost:8000/posts/${postId}/comments`);
    const comments = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/comments`);
    // console.log(comments.data);
    return comments.data;
  } catch (error) {
    console.error(error.response?.data.error);
  }
}

export async function updatePost(e, postId, updatedTitle, updatedContent, setUpdateSuccessful, setError) {
  e.preventDefault();
  try {
    const token = localStorage.getItem('token');
    // const updatedPost = await axios.put(`http://localhost:8000/posts/${postId}`, {
    const updatedPost = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`, {
      title: updatedTitle,
      content: updatedContent,
      published: true
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    // console.log(updatedPost);
    if (updatedPost.status === 201 || updatedPost.status === 200) {
      setUpdateSuccessful(true);
    }
  } catch (error) {
    console.error(error.response?.data.error || error.response?.data.errors[0].msg);
    setError(error.response?.data.error || error.response?.data.errors[0].msg);
  }
}

export async function createPost(e, title, content, setCreated, setError) {
  e.preventDefault();
  try {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    // const newPost = await axios.post(`http://localhost:8000/posts`, {
    const newPost = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
      title: title,
      content: content,
      published: true,
      authorId: userId
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    // console.log(newPost);
    if (newPost.status === 201 || newPost.status === 200) {
      setCreated(true);
    }
  } catch (error) {
    console.error(error.response?.data.error || error.response?.data.errors[0].msg);
    setError(error.response?.data.error || error.response?.data.errors[0].msg);
  }
}

export async function deletePost(e, postId, setUpdatePosts, setError) {
  e.preventDefault();
  const confirmDel = confirm("Are you sure you want to delete this post?");
  if (confirmDel) {
    try {
      const token = localStorage.getItem('token');
      // const deletedPost = await axios.delete(`http://localhost:8000/posts/${postId}`, {
      const deletedPost = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // console.log(deletedPost);
      if (deletedPost.status === 201 || deletedPost.status === 200) {
        setUpdatePosts(true);
      }
    } catch (error) {
      console.error(error.response?.data.error || error.response?.data.errors[0].msg);
      setError(error.response?.data.error || error.response?.data.errors[0].msg);
    }    
  }
}