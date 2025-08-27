import React, { useState } from 'react';

const LikeButton = ({ initialCount = 0, onLike }) => {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    if (!liked) {
      setCount(count + 1);
      setLiked(true);
      if (onLike) onLike();
    }
  };

  return (
    <button
      className={`px-3 py-1 rounded bg-pink-100 text-pink-700 font-semibold mr-2 ${liked ? 'bg-pink-200' : ''}`}
      onClick={handleLike}
      disabled={liked}
    >
      ❤ {count}
    </button>
  );
};

export default LikeButton;
