import React, { useState, useEffect } from "react";
import styled from "styled-components";
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
  width: 400px;
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

const KnowledgeLevelModal = ({ onClose, onSave, isLoading, setRandomNumber, session }) => {
  const [subject, setSubject] = useState("");
  const [knowledgeLevel, setKnowledgeLevel] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (session) {
      setSubject(session.subject);
      setKnowledgeLevel(session.knowledgeLevel);
    }
  }, [session]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (subject.trim() && knowledgeLevel.trim()) {
      const parsedKnowledgeLevel = parseInt(knowledgeLevel);
      if (isNaN(parsedKnowledgeLevel)) {
        setError("Knowledge level must be a valid number.");
        return;
      }

      try {
        const userId = sessionStorage.getItem("userId");
        const requestData = {
          userId,
          subject,
          level: parsedKnowledgeLevel,
        };
        if (session) {
          await axios.put(`https://knowledgelevel-akavgpg2g7g7c2c0.eastus-01.azurewebsites.net/api/KnowledgeLevels/${session.id}`, requestData);
        } else {
          await axios.post("https://knowledgelevel-akavgpg2g7g7c2c0.eastus-01.azurewebsites.net/api/KnowledgeLevels", requestData);
        }

        setRandomNumber(Math.random());
        onSave();
      } catch (error) {
        console.error("Error saving knowledge level:", error);
        setError("Failed to save knowledge level. Please try again.");
      }
    } else {
      setError("Both fields are required.");
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>{session ? "Edit Knowledge Level" : "Add Knowledge Level"}</h2>
        <form onSubmit={handleSubmit}>
          <FieldWrapper>
            <FieldLabel htmlFor="subject">Subject</FieldLabel>
            <StyledInput id="subject" type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Enter subject" />
          </FieldWrapper>
          <FieldWrapper>
            <FieldLabel htmlFor="knowledgeLevel">Knowledge Level</FieldLabel>
            <StyledInput id="knowledgeLevel" type="text" value={knowledgeLevel} onChange={(e) => setKnowledgeLevel(e.target.value)} placeholder="Enter knowledge level" />
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

export default KnowledgeLevelModal;
