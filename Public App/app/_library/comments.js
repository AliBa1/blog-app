import axios from "axios";

export async function sendComment(e, comment, userId, postId, setUpdateComments, setError, setNewComment) {
  e.preventDefault();
  try {
    const token = localStorage.getItem('token');
    const newComment = await axios.post('http://localhost:8000/comments', {
      comment: comment,
      userId: userId,
      postId: postId,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    // console.log(newComment);
    if (newComment.status === 201 || newComment.status === 200) {
      setNewComment('');
      setUpdateComments(true);
    }
  } catch (error) {
    console.error(error);
    setError(error.response?.data.error);
  }
}

export async function deleteComment(e, commentId, setUpdateComments, setError) {
  e.preventDefault();
  const confirmDel = confirm("Are you sure you want to delete this comment?");
  if (confirmDel) {
    try {
      const token = localStorage.getItem('token');
      const deletedComment = await axios.delete(`http://localhost:8000/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // console.log(deletedComment);
      if (deletedComment.status === 201 || deletedComment.status === 200) {
        setUpdateComments(true);
      }
    } catch (error) {
      console.error(error);
      setError(error.response?.data.error);
    }
  }
}