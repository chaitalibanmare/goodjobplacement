import React, { useState, useEffect } from 'react';
import slider1 from '../assets/slider1.jpeg';
import slider2 from '../assets/slider2.jpeg';
import slider3 from '../assets/slider3.jpeg';

const images = [slider1, slider2, slider3];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slider-container">
      <div className="slider-wrapper" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {images.map((img, index) => (
          <div key={index} className="slide">
            <img src={img} alt={`Slide ${index + 1}`} className="slider-image" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
