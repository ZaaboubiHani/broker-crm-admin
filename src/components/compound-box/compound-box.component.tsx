import React, { useState, useEffect, useRef } from 'react';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';

export enum RenderDirection {
  vertical,
  horizontal
}

interface CompoundBoxProps {
  direction?: RenderDirection;
  children: React.ReactNode[];
}

const CompoundBox: React.FC<CompoundBoxProps> = ({ direction = RenderDirection.vertical, children }) => {
  const [childSizes, setChildSizes] = useState<number[]>(Array(children.length).fill(1));
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [resizingDividerIndex, setResizingDividerIndex] = useState<number | null>(null);
  const [initialMousePosition, setInitialMousePosition] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMove = (clientPosition: number) => {
      if (isResizing && resizingDividerIndex !== null) {
        const containerSize = containerRef.current?.getBoundingClientRect().width ?? 0;
        const positionDifference = clientPosition - initialMousePosition;

        setChildSizes((prevSizes) => {
          const newSizes = [...prevSizes];
          if (resizingDividerIndex < newSizes.length - 1) {
            newSizes[resizingDividerIndex] += positionDifference;
            newSizes[resizingDividerIndex + 1] -= positionDifference;

            // Ensure minimum size (adjust this value as needed)
            newSizes[resizingDividerIndex] = Math.max(newSizes[resizingDividerIndex], 250);
            newSizes[resizingDividerIndex + 1] = Math.max(newSizes[resizingDividerIndex + 1], 250);

            // Ensure total size does not exceed the container size
            const totalSize = newSizes.reduce((sum, size) => sum + size, 0);
            const scaleFactor = containerSize / totalSize;
            newSizes.forEach((size, index) => {
              newSizes[index] = size * scaleFactor;
            });
          }
          return newSizes;
        });

        setInitialMousePosition(clientPosition);
      }
    };

    const handleMoveTouch = (e: TouchEvent) => {
      handleMove(e.touches[0].clientX);
    };

    const handleMoveMouse = (e: MouseEvent) => {
      handleMove(e.clientX);
    };

    const handleEnd = () => {
      setIsResizing(false);
      setResizingDividerIndex(null);
    };

    if (isResizing) {
      window.addEventListener('touchmove', handleMoveTouch);
      window.addEventListener('mousemove', handleMoveMouse);
      window.addEventListener('touchend', handleEnd);
      window.addEventListener('mouseup', handleEnd);
    }

    return () => {
      window.removeEventListener('touchmove', handleMoveTouch);
      window.removeEventListener('mousemove', handleMoveMouse);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('mouseup', handleEnd);
    };
  }, [isResizing, resizingDividerIndex, initialMousePosition]);
  useEffect(() => {
    const containerWidth = (containerRef.current?.getBoundingClientRect().width || 0);
    const singleHeaderWidth = ((containerWidth - (children.length * 25) ));
    setChildSizes(Array(children.length).fill(singleHeaderWidth));
  }, []);
  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: direction === RenderDirection.vertical ? 'column' : 'row', width: '100%' }}>
      {children.map((child, index) => (
        <>
          <div key={index} style={{ width: `${childSizes[index]}px` }}>
            {child}
          </div>
          {index !== children.length - 1 ? (
            <div
              style={{
                width: '25px',
                display:'grid',
                placeItems:'center',
              }}
            >
              <SettingsEthernetIcon
                onMouseDown={(e) => {
                  e.preventDefault();
                  setIsResizing(true);
                  setResizingDividerIndex(index);
                  setInitialMousePosition(e.clientX);
                }}
                onTouchStart={(e) => {
                  e.preventDefault();
                  setIsResizing(true);
                  setResizingDividerIndex(index);
                  const touch = e.touches[0];
                  if (touch) {
                    setInitialMousePosition(touch.clientX);
                  }
                }}
                sx={{
                  cursor: 'e-resize',
                }} />
            </div>
          ) : null}
        </>
      ))}
    </div>
  );
};

export default CompoundBox;
