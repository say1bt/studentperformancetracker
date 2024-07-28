import React, { useState } from "react";
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

const WeeklyViewModal = ({ onClose, studySessionData, breakSessionData }) => {
  const [weekOffset, setWeekOffset] = useState(0);

  const getWeekDates = (offset) => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + offset * 7);
    const firstDay = currentDate.getDate() - currentDate.getDay();
    const firstDate = new Date(currentDate.setDate(firstDay));
    const lastDate = new Date(currentDate.setDate(firstDay + 6));

    // Set time to start and end of the day to ensure full day inclusion
    firstDate.setHours(0, 0, 0, 0);
    lastDate.setHours(23, 59, 59, 999);

    return [firstDate, lastDate];
  };

  const [startOfWeek, endOfWeek] = getWeekDates(weekOffset);

  const filterSessionsByWeek = (sessions) => {
    return sessions.filter((session) => new Date(session.startTime) >= startOfWeek && new Date(session.endTime) <= endOfWeek);
  };

  const formatTimeSpent = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diff = (end - start) / 1000 / 60;
    const hours = Math.floor(diff / 60);
    const minutes = Math.floor(diff % 60);
    return `${hours > 0 ? `${hours}hr ` : ""}${minutes}m`;
  };

  const filteredStudySessions = filterSessionsByWeek(studySessionData);
  const filteredBreakSessions = filterSessionsByWeek(breakSessionData);

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>
          Weekly Summary ({startOfWeek.toDateString()} - {endOfWeek.toDateString()})
        </h2>
        <h3>Study Sessions</h3>
        <TableContainer>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Time Spent</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudySessions.length > 0 ? (
              filteredStudySessions.map((session, index) => (
                <tr key={index}>
                  <td>{session.subject}</td>
                  <td>{new Date(session.startTime).toLocaleString()}</td>
                  <td>{new Date(session.endTime).toLocaleString()}</td>
                  <td>{formatTimeSpent(session.startTime, session.endTime)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No study sessions for this week</td>
              </tr>
            )}
          </tbody>
        </TableContainer>
        <h3>Breaks</h3>
        <TableContainer>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Time Spent</th>
            </tr>
          </thead>
          <tbody>
            {filteredBreakSessions.length > 0 ? (
              filteredBreakSessions.map((breakSession, index) => (
                <tr key={index}>
                  <td>{breakSession.subject}</td>
                  <td>{new Date(breakSession.startTime).toLocaleString()}</td>
                  <td>{new Date(breakSession.endTime).toLocaleString()}</td>
                  <td>{formatTimeSpent(breakSession.startTime, breakSession.endTime)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No breaks for this week</td>
              </tr>
            )}
          </tbody>
        </TableContainer>
        <div>
          <StyledButton onClick={() => setWeekOffset(weekOffset - 1)}>Previous Week</StyledButton>
          <StyledButton onClick={() => setWeekOffset(weekOffset + 1)}>Next Week</StyledButton>
          <StyledButton onClick={onClose}>Close</StyledButton>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
};

export default WeeklyViewModal;
