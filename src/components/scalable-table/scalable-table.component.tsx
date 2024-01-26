import React, { useState, useEffect, useRef } from 'react';
import '../../components/scalable-table/scalable-table.style.css'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface TableColDef {
  field: string;
  headerName: string;
  sortable?: boolean;
  renderCell?: (params: any) => {};
}

interface PaginationModel {
  page: number;
  size: number;
}

interface SortModel {
  field: string;
  order: boolean;
}

interface ScalableTableProps {
  columns: TableColDef[];
  rows: any[];
  showPaginationFooter?: boolean;
  pageSizeOptions?: number[];
  total: number;
  pagination: PaginationModel;
  sortModel: SortModel;
  onPaginationChange: (model: PaginationModel) => void;
  onSortChange: (model: SortModel) => void;
}

const ScalableTable: React.FC<ScalableTableProps> = ({ columns, rows, pageSizeOptions, pagination, total, sortModel, onPaginationChange, onSortChange }) => {
  const [columnWidths, setColumnWidths] = useState<number[]>(Array.from({ length: columns.length }, (_, index) => index));
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [resizingColumnIndex, setResizingColumnIndex] = useState<number | null>(null);
  const [initialMouseX, setInitialMouseX] = useState<number>(0);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(1);
  const containerRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing && resizingColumnIndex !== null) {
        const containerWidth = columnWidths.reduce((sum, current) => sum + current, 0)
        const widthDifference = e.clientX - initialMouseX;

        setColumnWidths((prevWidths) => {
          const newWidths = [...prevWidths];
          if (resizingColumnIndex < newWidths.length - 1) {
            if (widthDifference > 0 && newWidths[resizingColumnIndex + 1] > 50) {
              newWidths[resizingColumnIndex] += widthDifference;
              newWidths[resizingColumnIndex + 1] -= widthDifference;
              newWidths[resizingColumnIndex] = Math.min(Math.max(newWidths[resizingColumnIndex], 50), containerWidth - newWidths.filter((_, index) => index !== resizingColumnIndex).reduce((sum, current) => sum + current, 0));
              newWidths[resizingColumnIndex + 1] = Math.min(Math.max(newWidths[resizingColumnIndex + 1], 50), containerWidth - newWidths.filter((_, index) => index !== resizingColumnIndex + 1).reduce((sum, current) => sum + current, 0));
            }
            if (widthDifference < 0 && newWidths[resizingColumnIndex] > 50) {
              newWidths[resizingColumnIndex] += widthDifference;
              newWidths[resizingColumnIndex + 1] -= widthDifference;
              newWidths[resizingColumnIndex] = Math.min(Math.max(newWidths[resizingColumnIndex], 50), containerWidth - newWidths.filter((_, index) => index !== resizingColumnIndex).reduce((sum, current) => sum + current, 0));
              newWidths[resizingColumnIndex + 1] = Math.min(Math.max(newWidths[resizingColumnIndex + 1], 50), containerWidth - newWidths.filter((_, index) => index !== resizingColumnIndex + 1).reduce((sum, current) => sum + current, 0));
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
    const handleMove = (clientX: number) => {
      if (isResizing && resizingColumnIndex !== null) {
        const containerWidth = columnWidths.reduce((sum, current) => sum + current, 0);
        const widthDifference = clientX - initialMouseX;
  
        setColumnWidths((prevWidths) => {
          const newWidths = [...prevWidths];
          if (resizingColumnIndex < newWidths.length - 1) {
            if (widthDifference > 0 && newWidths[resizingColumnIndex + 1] > 50) {
              newWidths[resizingColumnIndex] += widthDifference;
              newWidths[resizingColumnIndex + 1] -= widthDifference;
              newWidths[resizingColumnIndex] = Math.min(
                Math.max(newWidths[resizingColumnIndex], 50),
                containerWidth - newWidths.filter((_, index) => index !== resizingColumnIndex).reduce((sum, current) => sum + current, 0)
              );
              newWidths[resizingColumnIndex + 1] = Math.min(
                Math.max(newWidths[resizingColumnIndex + 1], 50),
                containerWidth - newWidths.filter((_, index) => index !== resizingColumnIndex + 1).reduce((sum, current) => sum + current, 0)
              );
            }
            if (widthDifference < 0 && newWidths[resizingColumnIndex] > 50) {
              newWidths[resizingColumnIndex] += widthDifference;
              newWidths[resizingColumnIndex + 1] -= widthDifference;
              newWidths[resizingColumnIndex] = Math.min(
                Math.max(newWidths[resizingColumnIndex], 50),
                containerWidth - newWidths.filter((_, index) => index !== resizingColumnIndex).reduce((sum, current) => sum + current, 0)
              );
              newWidths[resizingColumnIndex + 1] = Math.min(
                Math.max(newWidths[resizingColumnIndex + 1], 50),
                containerWidth - newWidths.filter((_, index) => index !== resizingColumnIndex + 1).reduce((sum, current) => sum + current, 0)
              );
            }
          }
          return newWidths;
        });
  
        setInitialMouseX(clientX);
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
      setResizingColumnIndex(null);
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
  }, [isResizing, resizingColumnIndex, initialMouseX,  columnWidths]);
  
  useEffect(() => {
    const containerWidth = (containerRef.current?.getBoundingClientRect().width || 0);
    const singleHeaderWidth = ((containerWidth - (columns.length * 16)) / columns.length);
    setColumnWidths(Array.from({ length: columns.length }, (_, index) => singleHeaderWidth));
  }, [pagination.page]);

  useEffect(() => {
    setSelectedRowIndex(-1);
  }, [pagination.page]);

  const handleMouseDown = (columnIndex: number, e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsResizing(true);
    setResizingColumnIndex(columnIndex);
    setInitialMouseX(e.clientX);
  };

  const handleTouchDown = (columnIndex: number, e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsResizing(true);
    setResizingColumnIndex(columnIndex);
    const touch = e.touches[0];
    if (touch) {
      setInitialMouseX(touch.clientX);
    }
  };

  return (
    <div className="resizable-table" >
      <table ref={containerRef} style={{
        margin: '0px',
        padding: '0px',
        overflow: 'hidden',
        flex: "1",
        marginRight: '8px',
      }}>
        <thead style={{ margin: '0px', padding: '0px', height: 'max-content', backgroundColor: '#f2f2f2' }}>
          <tr style={{ display: 'flex', alignItems: 'center' }}>
            {
              columns.map((col, index) => (
                <>
                  <th
                    style={{
                      width: `${columnWidths[index]}px`,
                      fontWeight: 'normal',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onClick={() => {
                      if (col.sortable) {
                        sortModel = { field: col.field, order: !sortModel.order, };
                        onSortChange(sortModel);
                      }
                    }}
                  >
                    {col.headerName}
                    {
                      sortModel.field === col.field ? sortModel.order ? <ArrowUpwardIcon
                        fontSize='small'
                      /> : <ArrowDownwardIcon
                        fontSize='small'
                      /> : null
                    }
                  </th>
                  {
                    index !== columns.length - 1 ? (
                      <div
                        className="resizable-handler"
                        onMouseDown={(e) => handleMouseDown(index, e)}
                        onTouchStart={(e) => handleTouchDown(index, e)}
                      ></div>
                    ) : null
                  }

                </>
              ))
            }

          </tr>
        </thead>
        <div
          style={{ borderBottom: "1px solid #bbb" }}
        ></div>
        <tbody style={{
          margin: '0px', padding: '0px', overflowY: 'scroll', flex: "1", marginRight: '6px'
        }}>
          {
            rows.map((row, index) => {

              return (
                <tr
                  style={{
                    backgroundColor: selectedRowIndex === index ? '#b2f2f2' : 'transparent',
                  }}
                  onClick={() => {
                    setSelectedRowIndex(index);
                  }}
                >
                  {
                    columns.map((col, i) => (
                      <td style={{
                        width: `${columnWidths[i]}px`,
                        maxWidth: `${columnWidths[i]}px`,
                      }}>{col.renderCell ? col.renderCell({ row }) : row[col.field!]}</td>

                    ))
                  }
                </tr>
              );
            })
          }
        </tbody>
      </table>
      <div
        style={{ borderBottom: "1px solid #bbb" }}
      ></div>
      <div style={{
        height: '64px',
        display: 'flex',
        justifyContent: 'end',
        alignItems: 'center',
      }}>
        <p>lignes par page: </p>
        <select
          name=""
          id=""
          onChange={(event) => {
            pagination.size = parseInt(event.target.value);
            pagination.page = 0;
            onPaginationChange(pagination);
          }}
          defaultValue={pagination ? pagination.size : 25}
          style={{
            border: "none",
            height: '16px',
            fontSize: '14px',
            marginRight: '16px'
          }}>
          {
            pageSizeOptions ? pageSizeOptions.map((size) => (
              <option value={size}>{size}</option>)) : (<>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option></>)
          }
        </select>
        <p
          style={{
            marginRight: '16px'
          }}>
          {rows.length > 0 ? ((pagination.page * pagination.size) + 1) : 0} - {((pagination.page * pagination.size) + rows.length)} de {total}
        </p>
        <KeyboardArrowLeftIcon
          style={{
            opacity: pagination.page > 0 ? '1' : '0.2'
          }}
          onClick={() => {
            if (pagination.page > 0) {
              pagination.page--;
              onPaginationChange(pagination);
            }
          }} />
        <p>
          {pagination!.page + 1}
        </p>
        <KeyboardArrowRightIcon
          style={{
            opacity: pagination.page < (Math.ceil(total / pagination.size) - 1) ? '1' : '0.2'
          }}

          onClick={() => {
            let maxPage: number = Math.ceil(total / pagination.size) - 1;
            if (pagination.page < maxPage) {
              pagination.page++;
              onPaginationChange(pagination);
            }
          }} />
      </div>
    </div>
  );
};

export default ScalableTable;
