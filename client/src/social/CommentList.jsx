import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/api';
import { apiFetch } from '../services/apiFetch';

const CommentList = ({ itemId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    apiFetch(`${API_BASE_URL}/social/comments?itemId=${itemId}`)
      .then(res => res.json())
      .then(data => setComments(data.comments || []));
  }, [itemId]);

  return (
    <ul className="comment-list">
      {comments.map((c, idx) => (
        <li key={idx}>
          <strong>{c.author}</strong>: {c.text}
        </li>
      ))}
    </ul>
  );
};

export default CommentList;
