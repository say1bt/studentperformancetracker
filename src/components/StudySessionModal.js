import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

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
  width: 400px; /* Set a fixed width for better layout */
`;

const FieldWrapper = styled.div`
  margin-bottom: 20px;
  text-align: left;
`;

const FieldLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const StyledInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
`;

const StyledButton = styled.button`
  background-color: ${(props) => (props.disabled ? "#ccc" : "#007bff")};
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  font-size: 16px;
  position: relative;

  &:disabled {
    cursor: not-allowed;
  }

  &::after {
    content: "";
    display: ${(props) => (props.disabled ? "block" : "none")};
    position: absolute;
    top: 50%;
    left: 50%;
    width: 24px;
    height: 24px;
    border: 3px solid white;
    border-top: 3px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    transform: translate(-50%, -50%);
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 10px;
`;

const StudySessionModal = ({ onClose, onSave, isLoading, setRandomNumber, session }) => {
  const [subject, setSubject] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [error, setError] = useState("");

  console.log("initiaData", session);

  useEffect(() => {
    if (session) {
      setSubject(session.subject);
      setStartTime(new Date(session.startTime));
      setEndTime(new Date(session.endTime));
    }
  }, [session]);

  const formatDateToISO = (date) => {
    return date.toISOString().split(".")[0] + "Z";
  };

  const validateTimes = () => {
    if (endTime <= startTime) {
      setError("End time must be greater than start time.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (subject.trim() && validateTimes()) {
      try {
        const userId = sessionStorage.getItem("userId");
        const requestData = {
          userId,
          subject,
          startTime: formatDateToISO(startTime),
          endTime: formatDateToISO(endTime),
        };
        if (session) {
          await axios.put(`https://studysession-ewcxekc3a4afayaq.eastus-01.azurewebsites.net/api/studysessions/${session.id}`, requestData);
        } else {
          await axios.post("https://studysession-ewcxekc3a4afayaq.eastus-01.azurewebsites.net/api/studysessions", requestData);
        }

        setRandomNumber(Math.random());
        onSave();
      } catch (error) {
        console.error("Error saving study session:", error);
      }
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>{session ? "Edit Study Session" : "Add Study Session"}</h2>
        <form onSubmit={handleSubmit}>
          <FieldWrapper>
            <FieldLabel htmlFor="subject">Subject</FieldLabel>
            <StyledInput id="subject" type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Enter subject" />
          </FieldWrapper>
          <FieldWrapper>
            <FieldLabel>Start Time</FieldLabel>
            <DatePicker selected={startTime} onChange={(date) => setStartTime(date)} showTimeSelect dateFormat="Pp" />
          </FieldWrapper>
          <FieldWrapper>
            <FieldLabel>End Time</FieldLabel>
            <DatePicker selected={endTime} onChange={(date) => setEndTime(date)} showTimeSelect dateFormat="Pp" />
          </FieldWrapper>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <StyledButton type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Save"}
          </StyledButton>
          <StyledButton type="button" onClick={onClose} disabled={isLoading} style={{ marginLeft: "10px" }}>
            Close
          </StyledButton>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default StudySessionModal;
