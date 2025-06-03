'use client';

import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Stage, Layer, Image, Text, Transformer, Group } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { Stage as StageType } from 'konva/lib/Stage';
import type { Image as ImageType } from 'konva/lib/shapes/Image';
import type { Text as TextType } from 'konva/lib/shapes/Text';
import type { Transformer as TransformerType } from 'konva/lib/shapes/Transformer';

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

export interface KonvaStageWrapperProps {
  tshirtImage: HTMLImageElement | null;
  elements: DesignElement[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onElementsChange: (elements: DesignElement[]) => void;
}

export interface KonvaStageWrapperRef {
  downloadCanvas: () => void;
}

const DeleteButton = ({ onClick, x, y }: { onClick: () => void; x: number; y: number }) => (
  <Group
    x={x}
    y={y}
    onClick={onClick}
    onTap={onClick}
  >
    <Text
      text="×"
      fill="#000000"
      fontSize={36}
      fontFamily="Arial"
      fontStyle="bold"
      shadowColor="white"
      shadowBlur={2}
      shadowOpacity={1}
      shadowOffset={{ x: 0, y: 0 }}
    />
  </Group>
);

const DesignElement = ({ 
  element, 
  isSelected, 
  onSelect, 
  onChange,
  onDelete 
}: { 
  element: DesignElement;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Partial<DesignElement>) => void;
  onDelete: () => void;
}) => {
  const imageRef = useRef<ImageType | null>(null);
  const textRef = useRef<TextType | null>(null);
  const trRef = useRef<TransformerType | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteButtonPos, setDeleteButtonPos] = useState({ x: 0, y: 0 });

  const shapeRef = element.type === 'image' ? imageRef : textRef;

  // Add function to measure text width
  const measureText = (text: string, fontSize: number) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return { width: 200, height: fontSize };

    context.font = `${fontSize}px Arial`;
    const metrics = context.measureText(text);
    
    return {
      width: Math.ceil(metrics.width + 20), // Add fixed padding
      height: Math.ceil(fontSize * 1.2) // Add line height
    };
  };

  useEffect(() => {
    // Only measure and update when content changes and not editing
    if (element.type === 'text' && textRef.current && !isEditing) {
      const { width } = measureText(element.content, element.height);
      
      // Only update if the new width is significantly larger than current width
      if (width > element.width + 10) {
        onChange({
          width: width
        });
      }
    }
  }, [element.content]); // Only depend on content changes

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();

      // Update delete button position based on transformer bounds
      const transformer = trRef.current;
      const box = transformer.getClientRect();
      setDeleteButtonPos({
        x: box.x + box.width,
        y: box.y
      });
    }
  }, [isSelected, shapeRef]);

  useEffect(() => {
    if (element.type === 'image') {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        setImage(img);
      };
      img.onerror = (error) => {
        console.error('Error loading image:', error);
      };

      // Check if the image is an SVG (either by data URL or file extension)
      const isSVG = element.content.startsWith('data:image/svg+xml') || 
                    element.content.endsWith('.svg');

      if (isSVG) {
        // For SVGs, we need to encode the data URL properly
        fetch(element.content)
          .then(response => response.blob())
          .then(blob => {
            const url = URL.createObjectURL(blob);
            img.src = url;
          })
          .catch(error => {
            console.error('Error loading SVG:', error);
          });
      } else {
        img.src = element.content;
      }
    }
  }, [element.content, element.type]);

  const handleTransform = () => {
    if (!shapeRef.current) return;

    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    if (element.type === 'text') {
      const fontSize = Math.max(5, element.height * scaleY);
      node.scaleX(1);
      node.scaleY(1);
      
      onChange({
        x: node.x(),
        y: node.y(),
        height: fontSize,
        width: node.width() * scaleX,
        rotation: node.rotation(),
      });
    } else {
      node.scaleX(1);
      node.scaleY(1);

      onChange({
        x: node.x(),
        y: node.y(),
        width: Math.max(5, node.width() * scaleX),
        height: Math.max(5, node.height() * scaleY),
        rotation: node.rotation(),
      });
    }

    // Update delete button position after transform
    if (trRef.current) {
      const box = trRef.current.getClientRect();
      setDeleteButtonPos({
        x: box.x + box.width,
        y: box.y
      });
    }
  };

  const handleTextDblClick = () => {
    if (element.type !== 'text' || !textRef.current) return;
    
    const textNode = textRef.current;
    const stage = textNode.getStage();
    if (!stage) return;

    setIsEditing(true);

    const stageBox = stage.container().getBoundingClientRect();
    const textPosition = textNode.absolutePosition();
    
    textNode.hide();
    stage.batchDraw();

    const areaPosition = {
      x: stageBox.left + textPosition.x,
      y: stageBox.top + textPosition.y + window.pageYOffset
    };
    
    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);

    textarea.value = element.content;
    textarea.style.position = 'absolute';
    textarea.style.top = `${areaPosition.y}px`;
    textarea.style.left = `${areaPosition.x}px`;
    textarea.style.width = `${textNode.width()}px`;
    textarea.style.height = `${textNode.height()}px`;
    textarea.style.fontSize = `${element.height}px`;
    textarea.style.border = '1px dashed #000';
    textarea.style.padding = '10px';
    textarea.style.margin = '0px';
    textarea.style.overflow = 'hidden';
    textarea.style.background = 'rgba(255, 255, 255, 0.9)';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.lineHeight = '1.2';
    textarea.style.fontFamily = 'Arial';
    textarea.style.transformOrigin = 'left top';
    textarea.style.textAlign = 'center';
    textarea.style.color = element.color || '#8B575C';
    textarea.style.whiteSpace = 'pre';
    textarea.style.boxSizing = 'border-box';

    textarea.focus();

    const handleBlur = () => {
      const newText = textarea.value;
      document.body.removeChild(textarea);
      textNode.show();
      stage.batchDraw();
      
      setIsEditing(false);
      
      // Only update if the text has actually changed
      if (newText !== element.content) {
        onChange({ content: newText });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        textarea.blur();
      }
      if (e.key === 'Escape') {
        textarea.blur();
      }
    };

    textarea.addEventListener('blur', handleBlur);
    textarea.addEventListener('keydown', handleKeyDown);
  };

  const commonProps = {
    x: element.x,
    y: element.y,
    width: element.width,
    height: element.height,
    rotation: element.rotation,
    onClick: onSelect,
    onTap: onSelect,
    onDragEnd: (e: KonvaEventObject<DragEvent>) => {
      onChange({
        x: e.target.x(),
        y: e.target.y(),
      });
    },
    onTransformEnd: handleTransform,
    draggable: true,
  };

  return (
    <>
      {element.type === 'image' && (
        <Image
          {...commonProps}
          ref={imageRef}
          image={image || undefined}
          alt={`Design element ${element.id}`}
        />
      )}
      {element.type === 'text' && (
        <Text
          {...commonProps}
          ref={textRef}
          text={element.content}
          fontSize={element.height}
          fill={element.color || '#8B575C'}
          fontFamily="Arial"
          align="center"
          verticalAlign="middle"
          onDblClick={handleTextDblClick}
          onDblTap={handleTextDblClick}
          padding={10}
          width={element.width}
        />
      )}
      {isSelected && !isEditing && (
        <>
          <Transformer
            ref={trRef}
            boundBoxFunc={(oldBox, newBox) => {
              const minWidth = 20;
              const minHeight = 20;
              if (newBox.width < minWidth || newBox.height < minHeight) {
                return oldBox;
              }
              return newBox;
            }}
            rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
            enabledAnchors={[
              'top-left', 'top-center', 'top-right',
              'middle-right', 'middle-left',
              'bottom-left', 'bottom-center', 'bottom-right'
            ]}
            onTransform={() => {
              if (trRef.current) {
                const box = trRef.current.getClientRect();
                setDeleteButtonPos({
                  x: box.x + box.width,
                  y: box.y
                });
              }
            }}
          />
          <DeleteButton
            x={deleteButtonPos.x}
            y={deleteButtonPos.y}
            onClick={onDelete}
          />
        </>
      )}
    </>
  );
};

const KonvaStageWrapper = forwardRef<KonvaStageWrapperRef, KonvaStageWrapperProps>(({
  tshirtImage,
  elements,
  selectedId,
  onSelect,
  onElementsChange,
}, ref) => {
  const stageRef = useRef<StageType>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useImperativeHandle(ref, () => ({
    downloadCanvas: () => {
      if (stageRef.current) {
        // Temporarily hide the transformer and delete buttons
        const transformers = stageRef.current.find('Transformer');
        const deleteButtons = stageRef.current.find('Group');
        transformers.forEach((tr) => tr.hide());
        deleteButtons.forEach((btn) => btn.hide());
        
        // Get the stage as a data URL
        const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
        
        // Show the transformer and delete buttons again
        transformers.forEach((tr) => tr.show());
        deleteButtons.forEach((btn) => btn.show());
        
        // Create a download link
        const link = document.createElement('a');
        link.download = 'meme-shirt-design.png';
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }), []);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setSize({ width, height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const checkDeselect = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      onSelect(null);
    }
  };

  const handleDelete = () => {
    if (selectedId) {
      onElementsChange(elements.filter(el => el.id !== selectedId));
      onSelect(null);
    }
  };

  if (!tshirtImage) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-[#0B3954]">Loading t-shirt template...</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full">
      <Stage
        width={size.width}
        height={size.height}
        ref={stageRef}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <Layer>
          <Image
            image={tshirtImage}
            width={size.width * 1.3}
            height={size.height * 1.3}
            x={-(size.width * 1.3 - size.width) / 2}
            y={-(size.height * 1.3 - size.height) / 2}
            listening={false}
            alt="T-shirt template"
          />

          {elements.map((element) => (
            <DesignElement
              key={element.id}
              element={element}
              isSelected={element.id === selectedId}
              onSelect={() => onSelect(element.id)}
              onChange={(newAttrs) => {
                onElementsChange(
                  elements.map((el) =>
                    el.id === element.id ? { ...el, ...newAttrs } : el
                  )
                );
              }}
              onDelete={handleDelete}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
});

KonvaStageWrapper.displayName = 'KonvaStageWrapper';

export default KonvaStageWrapper; 