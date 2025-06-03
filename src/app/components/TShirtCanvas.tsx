'use client';

import { useState, useRef, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import dynamic from 'next/dynamic';
import type { KonvaStageWrapperProps, KonvaStageWrapperRef } from './KonvaStageWrapper';
import type { RefAttributes } from 'react';

// Create a wrapper component for the entire Konva stage
const KonvaStageWrapper = dynamic<
  KonvaStageWrapperProps & RefAttributes<KonvaStageWrapperRef>
>(() => import('./KonvaStageWrapper'), {
  ssr: false,
  loading: () => (
    <div className="bg-[#BFD7EA] p-12 rounded-lg relative w-[1000px] h-[1200px] overflow-hidden mx-auto">
      <div className="text-[#0B3954] text-center">
        <p>Loading canvas...</p>
      </div>
    </div>
  ),
});

interface TShirtCanvasProps {
  uploadedImage: string | null;
}

interface DesignElement {
  id: string;
  type: 'image' | 'text';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  content: string;
  color?: string;
}

export interface TShirtCanvasRef {
  addText: () => void;
  downloadCanvas: () => void;
}

const useLoadImage = (src: string | null) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!src) return;

    const img = new window.Image();
    
    const handleLoad = () => {
      setImage(img);
      setError(null);
    };

    const handleError = () => {
      setImage(null);
      setError(`Failed to load image: ${src}`);
      console.error(`Failed to load image: ${src}`);
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);
    img.src = src;

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [src]);

  return { image, error };
};

const TShirtCanvas = forwardRef<TShirtCanvasRef, TShirtCanvasProps>(({ uploadedImage }, ref) => {
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { image: tshirtImage, error: tshirtError } = useLoadImage('/tshirt-template.png');
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<KonvaStageWrapperRef | null>(null);

  const handleStageRef = useCallback((node: KonvaStageWrapperRef | null) => {
    stageRef.current = node;
  }, []);

  const addText = () => {
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2 - 50;
    const centerY = rect.height / 2 - 25;

    const defaultText = 'Text';
    const fontSize = 50;
    
    // Create a canvas to measure text width
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.font = `${fontSize}px Arial`;
    const metrics = context.measureText(defaultText);
    const width = metrics.width + 40; // Add some padding

    const newElement: DesignElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: defaultText,
      x: centerX,
      y: centerY,
      width: width,
      height: fontSize,
      rotation: 0,
    };
    setElements(prev => [...prev, newElement]);
    setSelectedId(newElement.id);
  };

  useImperativeHandle(ref, () => ({
    addText,
    downloadCanvas: () => {
      if (stageRef.current?.downloadCanvas) {
        stageRef.current.downloadCanvas();
      }
    }
  }), []);

  useEffect(() => {
    if (uploadedImage) {
      const newElement: DesignElement = {
        id: `image-${Date.now()}`,
        type: 'image',
        content: uploadedImage,
        x: 100,
        y: 100,
        width: 200,
        height: 200,
        rotation: 0,
      };
      setElements(prev => [...prev, newElement]);
    }
  }, [uploadedImage]);

  if (tshirtError) {
    return (
      <div ref={containerRef} className="bg-[#BFD7EA] p-4 rounded-lg relative w-full aspect-[7/9] overflow-hidden">
        <div className="text-red-600 text-center">
          <p>Error loading t-shirt template. Please refresh the page.</p>
          <p className="text-sm mt-2">{tshirtError}</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="bg-[#BFD7EA] p-4 rounded-lg relative w-full aspect-[7/9] overflow-hidden">
      <KonvaStageWrapper
        ref={handleStageRef}
        tshirtImage={tshirtImage}
        elements={elements}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onElementsChange={setElements}
      />
    </div>
  );
});

TShirtCanvas.displayName = 'TShirtCanvas';

export default TShirtCanvas; 