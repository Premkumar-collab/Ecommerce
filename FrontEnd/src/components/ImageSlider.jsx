import React, { useState, useEffect } from "react";
import "../componentStyles/ImageSlider.css";



const images = [
  "./images/banner1.jpeg",
  "./images/banner2.jpeg",
  "./images/banner3.jpeg",
  "./images/banner4.jpeg",
  "./images/banner5.jpeg",
];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [istransitioning, setIstransitioning] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="image-slider-container">
        <div
          className="slider-images"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, ind) => {
            return (
              <div className="slider-item" key={ind}>
                <img src={image} alt={`slider${ind + 1}`} />
              </div>
            );
          })}
        </div>

        <div className="slider-dots">
          {images.map((_, index) => (
            <span key={index}
              className={`dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      </div>

      
    </>
  );
};

export default ImageSlider;
