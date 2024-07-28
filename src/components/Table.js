import React from "react";
import styled from "styled-components";

const TableContainer = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;

  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #f4f4f4;
  }
`;

const formatTimeSpent = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end - start;

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  return `${hours}h ${minutes}m`;
};

const Table = ({ headers, data, onEditClick, onDeleteClick }) => {
  console.log(data);
  return (
    <TableContainer>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {headers.map((header, headerIndex) => (
              <td key={headerIndex}>{header === "Time spent" ? formatTimeSpent(row.startTime, row.endTime) : row[header.toLowerCase()]}</td>
            ))}
            <td>
              <button
                onClick={() => {
                  console.log(row);
                  onEditClick(row.id);
                }}
              >
                Edit
              </button>
              <button
                onClick={() => {
                  console.log(row);
                  onDeleteClick(row.id);
                }}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </TableContainer>
  );
};

export default Table;
