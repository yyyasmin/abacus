import React, { useState, useEffect } from 'react';
import './Abacus.css';
import ReconnectingWebSocket from 'reconnecting-websocket';

const Abacus = () => {
  const [beadPositions, setBeadPositions] = useState(new Array(10).fill(null).map(() => new Array(10).fill(false)));
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new ReconnectingWebSocket('ws://localhost:3000');
    socket.onmessage = (event) => {
      setBeadPositions(JSON.parse(event.data));
    };
    setWs(socket);
    return () => socket.close();
  }, []);

  const handleBeadClick = (row, clickedIndex) => {
    const newPositions = [...beadPositions];
    const rowPositions = [...newPositions[row]];
    const beadIsToggled = rowPositions[clickedIndex];

    if (beadIsToggled) {
      for (let i = 0; i <= clickedIndex; i++) {
        rowPositions[i] = false;
      }
    } else {
      for (let i = clickedIndex; i < rowPositions.length; i++) {
        rowPositions[i] = true;
      }
    }

    newPositions[row] = rowPositions;
    setBeadPositions(newPositions);
    ws && ws.send(JSON.stringify(newPositions));
  };

  return (
    <div className="abacus-container">
      <svg className="abacus-svg" viewBox="0 0 100 100">
        {/* Vertical sticks */}
        <path d="M2.5 2.5v95M97.5 2.5v95" fill="none" stroke="tan" strokeWidth="5" strokeLinecap="round" />

        {/* Horizontal sticks */}
        {Array.from({ length: 10 }, (_, i) => (
          <path key={i} d={`M5 ${i * 10 + 5} h90`} fill="none" stroke="tan" strokeWidth="2" />
        ))}

        {/* Beads */}
        {beadPositions.map((positions, rowIndex) => (
          <g key={rowIndex} transform={`translate(0 ${rowIndex * 10})`} fill={getBeadColor(rowIndex)}>
            {positions.map((isRight, colIndex) => (
              <rect
                key={colIndex}
                className={`bead ${isRight ? 'toggled' : ''}`}
                x={`${colIndex * 5 + 5}`}
                y="1"
                height="8"
                width="5"
                rx="2"
                onClick={() => handleBeadClick(rowIndex, colIndex)}
              />
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
};

const getBeadColor = (rowIndex) => {
  const colors = ['#DBE33B', '#F7C757', '#EBAB73',
                  '#CF8F8F', '#B373AB', '#9757C7', 
                  '#7B3BE3', '#5F1FFF', '#4000E0', '#088F8F'];
  return colors[rowIndex % colors.length];
};

export default Abacus;
