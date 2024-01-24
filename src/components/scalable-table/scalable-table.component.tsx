import React, { useState, useEffect, useRef } from 'react';
import '../../components/scalable-table/scalable-table.style.css'

interface ScalableTableProps {
}

const ScalableTable: React.FC<ScalableTableProps> = ({ }) => {
  const [columnWidths, setColumnWidths] = useState<number[]>([150, 150]);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [resizingColumnIndex, setResizingColumnIndex] = useState<number | null>(null);
  const [initialMouseX, setInitialMouseX] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const maxColumnWidthPercentage = 50; // Set your maximum column width as a percentage

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing && resizingColumnIndex !== null) {
        const containerWidth = containerRef.current?.getBoundingClientRect().width || 0;
        const widthDifference = e.clientX - initialMouseX;

        setColumnWidths((prevWidths) => {
          const newWidths = [...prevWidths];
          newWidths[resizingColumnIndex] += widthDifference;

          // Calculate the maximum width based on the percentage of the container
          const maxColumnWidth = (maxColumnWidthPercentage / 100) * containerWidth;
          newWidths[resizingColumnIndex] = Math.min(maxColumnWidth, newWidths[resizingColumnIndex]);

          return newWidths;
        });

        setInitialMouseX(e.clientX);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizingColumnIndex(null);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizingColumnIndex, initialMouseX, maxColumnWidthPercentage]);

  useEffect(() => {

  }, []);

  const handleMouseDown = (columnIndex: number, e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsResizing(true);
    setResizingColumnIndex(columnIndex);
    setInitialMouseX(e.clientX);
  };

  return (

    <div className="resizable-table" ref={containerRef}>
      <table style={{ margin: '0px', padding: '0px',overflow:'hidden' }}>
        <thead>
          <tr>
            <th
              style={{ width: `${columnWidths[0]}px` }}
              onMouseDown={(e) => handleMouseDown(0, e)}
            >
              {columnWidths[0].toFixed(0)}px
            </th>
            <th
              style={{ width: `${columnWidths[1]}px` }}
              onMouseDown={(e) => handleMouseDown(1, e)}
            >
              {columnWidths[1].toFixed(0)}px
            </th>
          </tr>
        </thead>
        <tbody style={{ width:'100%',backgroundColor:'green',margin: '0px', padding: '0px',overflowY:'scroll' }}>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>

        </tbody>
      </table>
    </div>
  );
};

export default ScalableTable;
