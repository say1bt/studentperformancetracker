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
  z-index: 1000; /* Ensure this is higher than other content */
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  z-index: 1001; /* Ensure this is above the overlay */
`;

const StyledInput = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 80%;
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

const NameModal = ({ onSubmit, isLoading }) => {
  const [name, setName] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (name.trim()) {
      onSubmit(name);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Please Enter Your Name</h2>
        <form onSubmit={handleSubmit}>
          <StyledInput type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
          <StyledButton type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Submit"}
          </StyledButton>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default NameModal;
