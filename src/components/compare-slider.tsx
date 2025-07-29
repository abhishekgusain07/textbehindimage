import React from 'react';
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
  ReactCompareSliderHandle,
} from 'react-compare-slider';

interface CompareSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

const CompareSlider: React.FC<CompareSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  className = '',
}) => {
  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      {/* Responsive labels */}
      <div className="absolute top-2 left-2 md:top-4 md:left-4 z-20">
        <span className="bg-black/70 backdrop-blur-sm px-2 py-1 md:px-3 md:py-1.5 rounded-md text-xs md:text-sm font-medium text-white shadow-lg">
          {beforeLabel}
        </span>
      </div>
      <div className="absolute top-2 right-2 md:top-4 md:right-4 z-20">
        <span className="bg-black/70 backdrop-blur-sm px-2 py-1 md:px-3 md:py-1.5 rounded-md text-xs md:text-sm font-medium text-white shadow-lg">
          {afterLabel}
        </span>
      </div>

      <ReactCompareSlider
        itemOne={
          <ReactCompareSliderImage
            src={beforeImage}
            alt={beforeLabel}
            style={{ objectFit: 'contain' }}
          />
        }
        itemTwo={
          <ReactCompareSliderImage
            src={afterImage}
            alt={afterLabel}
            style={{ objectFit: 'contain' }}
          />
        }
        handle={
          <ReactCompareSliderHandle
            buttonStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '2px solid rgba(59, 130, 246, 0.8)',
              borderRadius: '50%',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              color: '#1f2937',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              cursor: 'grab',
            }}
            linesStyle={{
              background: 'rgba(59, 130, 246, 0.8)',
              width: '2px',
            }}
          />
        }
        style={{
          height: '250px', // Mobile height
          width: '100%',
          borderRadius: '0.5rem',
        }}
        className="sm:!h-[300px] md:!h-[400px] lg:!h-[525px]" // Responsive heights
        changePositionOnHover={true}
        onlyHandleDraggable={false}
        position={50}
      />
    </div>
  );
};

export default CompareSlider;
