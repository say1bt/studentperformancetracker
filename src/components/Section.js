import React from "react";
import styled from "styled-components";

const SectionContainer = styled.div`
  margin: 20px 0;
`;

const SectionHeader = styled.h2`
  margin-bottom: 10px;
  color: #555;
`;

const Section = ({ title, children }) => {
  return (
    <SectionContainer>
      <SectionHeader>{title}</SectionHeader>
      {children}
    </SectionContainer>
  );
};

export default Section;
