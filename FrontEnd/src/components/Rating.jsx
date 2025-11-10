import React, { useState } from "react";
import "../componentStyles/Rating.css";

const Rating = ({ value = 0, onRatingChange, disabled }) => {
  const [hoverRating, setHoverRating] = useState(0);


  // on mouse enter
  const handleMouseEnter = (rating) => {
    if (!disabled) {
      setHoverRating(rating);
    }
  };

  // on mouse leave
  const handleMouseLeave = (rating) => {
    if (!disabled) {
      setHoverRating(0);
    }
  };

  const handleClick = (rating) => {
   if(!disabled && onRatingChange){
    onRatingChange(rating);
   }
  };

  // Function to generate the star
  const generateStar = () => {
    const star = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= (hoverRating || value);
      star.push(<span key={i}
      className={`star ${isFilled ? 'filled' : 'empty'}`}
      onMouseEnter={()=>handleMouseEnter(i)}
      onMouseLeave={handleMouseLeave}
      onClick={()=>handleClick(i)}
      style={{pointerEvents:disabled ? 'none':'auto'}}
      >★</span>);
    }
    return star;
  };
  return (
    <>
      <div className="rating">{generateStar()}</div>
    </>
  );
};

export default Rating;
