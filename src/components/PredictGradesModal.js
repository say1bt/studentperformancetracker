import React from "react";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  z-index: 1001;
  width: 600px;
`;

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

const StyledButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  margin-right: 10px;
`;

const PredictGradesModal = ({ onClose, predictedGrades }) => {
  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Predicted Grades</h2>
        <TableContainer>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Predicted Grade</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(predictedGrades).length > 0 ? (
              Object.entries(predictedGrades).map(([subject, grade], index) => (
                <tr key={index}>
                  <td>{subject}</td>
                  <td>{grade.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No predicted grades available</td>
              </tr>
            )}
          </tbody>
        </TableContainer>
        <StyledButton onClick={onClose}>Close</StyledButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default PredictGradesModal;
