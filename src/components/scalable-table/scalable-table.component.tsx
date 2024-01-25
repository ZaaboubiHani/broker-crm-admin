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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing && resizingColumnIndex !== null) {
        const containerWidth = (containerRef.current?.getBoundingClientRect().width || 0)-66;
        const widthDifference = e.clientX - initialMouseX;

        setColumnWidths((prevWidths) => {
          const newWidths = [...prevWidths];
          if (resizingColumnIndex < newWidths.length - 1) {
            // Calculate the new widths
            newWidths[resizingColumnIndex] += widthDifference;
            newWidths[resizingColumnIndex + 1] -= widthDifference;

            // Ensure minimum width
            newWidths[resizingColumnIndex] = Math.min(Math.max(newWidths[resizingColumnIndex], 150),containerWidth-150);
            newWidths[resizingColumnIndex + 1] =  Math.min(Math.max(newWidths[resizingColumnIndex + 1], 150),containerWidth-150);

            // Check if the total width exceeds the container width
            const totalWidth = newWidths.reduce((sum, current) => sum + current, 0);
            if (totalWidth > containerWidth) {
              const overflow = totalWidth - containerWidth;

              // Adjust the widths to fit within the container
              newWidths[resizingColumnIndex] -= overflow;
              newWidths[resizingColumnIndex + 1] += overflow;
            }
          }

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
  }, [isResizing, resizingColumnIndex, initialMouseX]);

  useEffect(() => {
    const containerWidth = containerRef.current?.getBoundingClientRect().width || 0;
    const singleHeaderWidth = (containerWidth / columnWidths.length) - (columnWidths.length - 1) * 5 - 28;
    setColumnWidths([singleHeaderWidth, singleHeaderWidth]);
  }, []);

  const handleMouseDown = (columnIndex: number, e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsResizing(true);
    setResizingColumnIndex(columnIndex);
    setInitialMouseX(e.clientX);
  };
  
  return (
    <div className="resizable-table" ref={containerRef}>
      <table style={{
        margin: '0px',
        padding: '0px',
        overflow: 'hidden',
        flex: "1",
        marginRight: '16px',
        border: "1px solid #bbb"
      }}>
        <thead style={{ margin: '0px', padding: '0px', height: 'max-content', }}>
          <tr style={{ display: 'flex' }}>
            <th
              style={{ width: `${columnWidths[0]}px` }}
            >
              {columnWidths[0].toFixed(0)}px
            </th>
            <div
              style={{ borderRight: "5px solid #bbb", height: '32px',cursor:'e-resize' }}
              onMouseDown={(e) => handleMouseDown(0, e)}
            ></div>
            <th
              style={{ width: `${columnWidths[1]}px` }}
            >
              {columnWidths[1].toFixed(0)}px
            </th>

          </tr>
        </thead>
        <div
          style={{ borderBottom: "1px solid #bbb" }}
        ></div>
        <tbody style={{ margin: '0px', padding: '0px', overflowY: 'scroll' }}>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
          <tr>
            <td style={{ width: `${columnWidths[0]}px` }}>Data 1</td>
            <td style={{ width: `${columnWidths[1]}px` }}>Data 2</td>
          </tr>
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
