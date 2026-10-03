import React, { useState } from 'react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const imageList = images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800'];
  const [selectedImage, setSelectedImage] = useState<string>(imageList[0]);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-center h-80 sm:h-96 overflow-hidden">
        <img
          src={selectedImage}
          alt={productName}
          className="h-full w-full object-contain object-center transition-all duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800';
          }}
        />
      </div>

      {/* Thumbnails */}
      {imageList.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
          {imageList.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img)}
              className={`w-20 h-20 rounded-xl p-2 bg-white border-2 flex items-center justify-center overflow-hidden transition-all flex-shrink-0 ${
                selectedImage === img ? 'border-brand-600 shadow-md scale-105' : 'border-gray-100 opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`${productName} thumbnail ${idx + 1}`} className="h-full w-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
