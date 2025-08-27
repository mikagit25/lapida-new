import React, { useState } from 'react';

const LikeButton = ({ initialCount = 0, itemId }) => {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    if (liked) return;
    await fetch(`/api/social/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId })
    });
    setCount(count + 1);
    setLiked(true);
  };

  return (
    <button onClick={handleLike} disabled={liked} className="like-btn">
      👍 {count}
    </button>
  );
};

export default LikeButton;
