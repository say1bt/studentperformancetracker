import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Table from "./components/Table";
import Button from "./components/Button";
import Section from "./components/Section";
import axios from "axios";
import NameModal from "./components/NameModal";
import StudySessionModal from "./components/StudySessionModal";
import BreakSessionModal from "./components/BreakSessionModal";
import KnowledgeLevelModal from "./components/KnowledgeLevelModal";
import WeeklyViewModal from "./components/WeeklyViewModal";
import PredictGradesModal from "./components/PredictGradesModal";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Container = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Header = styled.h1`
  text-align: center;
  color: #333;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const App = () => {
  const studySessionHeaders = ["Subject", "Time spent"];
  const breakSessionHeaders = ["Subject", "Time spent"];
  const subjectKnowledgeHeaders = ["Subject", "Level"];

  const [showNameModal, setShowNameModal] = useState(true);
  const [showStudySessionModal, setShowStudySessionModal] = useState(false);
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [showKnowledgeLevelModal, setShowKnowledgeLevelModal] = useState(false);
  const [showWeeklyViewModal, setShowWeeklyViewModal] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [currentBreak, setCurrentBreak] = useState(null);
  const [currentKnowledgeLevel, setCurrentKnowledgeLevel] = useState(null);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [studySessionData, setStudySessionData] = useState([]);
  const [breakSessionData, setBreakSessionData] = useState([]);
  const [subjectKnowledgeData, setSubjectKnowledgeData] = useState([]);
  const [randomNumber, setRandomNumber] = useState(1);
  const [predictedGrades, setPredictedGrades] = useState({});
  const [showPredictGradesModal, setShowPredictGradesModal] = useState(false);

  useEffect(() => {
    const storedName = sessionStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
      setShowNameModal(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const userId = sessionStorage.getItem("userId");
      try {
        const response = await axios.get(`https://users-hrf3b6bqfth3frgb.eastus-01.azurewebsites.net/api/users/${userId}`);
        setStudySessionData(response?.data?.studySessions || []);
        setBreakSessionData(response?.data?.breaks || []);
        const knowledgeLevelData = [...response?.data?.knowledgeLevels];
        const parsedKnowledgeLevelData = knowledgeLevelData.map((item) => ({ ...item, level: item.level.toString() }));
        console.log("parsedKnowledgeLevelData", parsedKnowledgeLevelData);
        setSubjectKnowledgeData(parsedKnowledgeLevelData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [randomNumber]);

  const handleNameSubmit = async (name) => {
    setIsLoading(true);
    try {
      const response = await axios.post("https://users-hrf3b6bqfth3frgb.eastus-01.azurewebsites.net/api/users", { name });
      sessionStorage.setItem("userId", response?.data?.id);
      setUserName(name);
      sessionStorage.setItem("userName", name);
      setShowNameModal(false);
    } catch (error) {
      console.error("Error submitting name:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStudySessionClick = () => {
    setCurrentSession(null);
    setShowStudySessionModal(true);
  };
  const handleAddBreakClick = () => {
    setCurrentBreak(null);
    setShowBreakModal(true);
  };

  const handleEditStudySessionClick = async (id) => {
    console.log(id);
    setIsLoading(true);
    try {
      const response = await axios.get(`https://studysession-ewcxekc3a4afayaq.eastus-01.azurewebsites.net/api/studysessions/${id}`);
      console.log("handleEditStudySessionClick", response);
      setCurrentSession(response?.data);
      setShowStudySessionModal(true);
    } catch (error) {
      console.error("Error fetching session data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStudySessionClick = async (id) => {
    setIsLoading(true);
    try {
      await axios.delete(`https://studysession-ewcxekc3a4afayaq.eastus-01.azurewebsites.net/api/studysessions/${id}`);
      setRandomNumber(Math.random());
    } catch (error) {
      console.error("Error deleting session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudySessionSave = () => {
    setShowStudySessionModal(false);
    setRandomNumber(Math.random());
  };

  const handleEditBreakClick = async (id) => {
    console.log(id);
    setIsLoading(true);
    try {
      const response = await axios.get(`https://breaks-anayfvbdb7g5dhf8.eastus-01.azurewebsites.net/api/breaks/${id}`);
      console.log("handleEditBreakClick", response);
      setCurrentBreak(response?.data);
      setShowBreakModal(true);
    } catch (error) {
      console.error("Error fetching session data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBreakClick = async (id) => {
    setIsLoading(true);
    try {
      await axios.delete(`https://breaks-anayfvbdb7g5dhf8.eastus-01.azurewebsites.net/api/breaks/${id}`);
      setRandomNumber(Math.random());
    } catch (error) {
      console.error("Error deleting session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBreakSave = () => {
    setShowBreakModal(false);
    setRandomNumber(Math.random());
  };

  const handleAddKnowledgeLevelClick = () => {
    setCurrentKnowledgeLevel(null);
    setShowKnowledgeLevelModal(true);
  };

  const handleEditKnowledgeLevelClick = async (id) => {
    console.log(id);
    setIsLoading(true);
    try {
      const response = await axios.get(`https://knowledgelevel-akavgpg2g7g7c2c0.eastus-01.azurewebsites.net/api/KnowledgeLevels/${id}`);
      console.log("handleEditKnowledgeLevelClick", response);
      setCurrentKnowledgeLevel(response?.data);
      setShowKnowledgeLevelModal(true);
    } catch (error) {
      console.error("Error fetching session data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteKnowledgeLevelClick = async (id) => {
    setIsLoading(true);
    try {
      await axios.delete(`https://knowledgelevel-akavgpg2g7g7c2c0.eastus-01.azurewebsites.net/api/KnowledgeLevels/${id}`);
      setRandomNumber(Math.random());
    } catch (error) {
      console.error("Error deleting session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKnowledgeLevelSave = () => {
    setShowKnowledgeLevelModal(false);
    setRandomNumber(Math.random());
  };

  const handleWeeklyViewClick = () => {
    setShowWeeklyViewModal(true);
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    const userName = sessionStorage.getItem("userName") || "User";

    const calculateDuration = (startTime, endTime) => {
      const start = new Date(startTime);
      const end = new Date(endTime);
      const duration = (end - start) / (1000 * 60); // Duration in minutes
      return duration.toFixed(2); // Format duration to 2 decimal places
    };

    // Define table columns and data for Study Sessions
    const studySessionHeaders = [["Subject", "Start Time", "End Time", "Duration (minutes)"]];
    const studySessionDataRows = studySessionData.map((session) => {
      const duration = calculateDuration(session.startTime, session.endTime);
      return [session.subject, new Date(session.startTime).toLocaleString(), new Date(session.endTime).toLocaleString(), duration];
    });

    // Define table columns and data for Break Sessions
    const breakSessionHeaders = [["Subject", "Start Time", "End Time", "Duration (minutes)"]];
    const breakSessionDataRows = breakSessionData.map((breakSession) => {
      const duration = calculateDuration(breakSession.startTime, breakSession.endTime);
      return [breakSession.subject, new Date(breakSession.startTime).toLocaleString(), new Date(breakSession.endTime).toLocaleString(), duration];
    });

    // Define table columns and data for Knowledge Levels
    const knowledgeLevelHeaders = [["Subject", "Knowledge Level"]];
    const knowledgeLevelDataRows = subjectKnowledgeData.map((knowledge) => {
      return [knowledge.subject, `Level ${knowledge.level}`];
    });

    // Add report title
    doc.setFontSize(16);
    doc.text(`${userName}'s Student Performance Tracking Report`, 20, 20);

    // Add Study Sessions table
    doc.setFontSize(12);
    doc.text("Study Sessions", 20, 30);
    doc.autoTable({
      startY: 40,
      head: studySessionHeaders,
      body: studySessionDataRows,
      margin: { left: 20, right: 20 },
    });

    // Add Break Sessions table
    doc.addPage();
    doc.setFontSize(16);
    doc.text(`${userName}'s Student Performance Tracking Report (cont.)`, 20, 20);
    doc.setFontSize(12);
    doc.text("Break Sessions", 20, 30);
    doc.autoTable({
      startY: 40,
      head: breakSessionHeaders,
      body: breakSessionDataRows,
      margin: { left: 20, right: 20 },
    });

    // Add Knowledge Levels table
    doc.addPage();
    doc.setFontSize(16);
    doc.text(`${userName}'s Student Performance Tracking Report (cont.)`, 20, 20);
    doc.setFontSize(12);
    doc.text("Knowledge Levels", 20, 30);
    doc.autoTable({
      startY: 40,
      head: knowledgeLevelHeaders,
      body: knowledgeLevelDataRows,
      margin: { left: 20, right: 20 },
    });

    // Save the PDF
    doc.save("report.pdf");
  };

  const handlePredictGradesClick = () => {
    const studyHoursPerSubject = {};
    const breakHoursPerSubject = {};
    const knowledgeLevels = {};

    studySessionData.forEach((session) => {
      const duration = (new Date(session.endTime) - new Date(session.startTime)) / (1000 * 60 * 60);
      studyHoursPerSubject[session.subject] = (studyHoursPerSubject[session.subject] || 0) + duration;
    });

    breakSessionData.forEach((breakSession) => {
      const duration = (new Date(breakSession.endTime) - new Date(breakSession.startTime)) / (1000 * 60 * 60);
      breakHoursPerSubject[breakSession.subject] = (breakHoursPerSubject[breakSession.subject] || 0) + duration;
    });

    subjectKnowledgeData.forEach((knowledge) => {
      knowledgeLevels[knowledge.subject] = knowledge.level;
    });

    const baseGrade = 50;
    const studyImpactCoefficient = 2;
    const breakImpactCoefficient = 1;

    const predictedGrades = {};

    for (const subject in studyHoursPerSubject) {
      const studyImpact = studyHoursPerSubject[subject] * studyImpactCoefficient;
      const breakImpact = breakHoursPerSubject[subject] ? breakHoursPerSubject[subject] * breakImpactCoefficient : 0;
      const currentKnowledgeLevel = knowledgeLevels[subject] || 0;
      let predictedGrade = baseGrade + studyImpact - breakImpact + currentKnowledgeLevel;
      predictedGrade = Math.max(0, Math.min(100, predictedGrade));
      predictedGrades[subject] = predictedGrade;
    }

    setPredictedGrades(predictedGrades);
    setShowPredictGradesModal(true);
  };

  return (
    <div>
      {showNameModal && <NameModal onSubmit={handleNameSubmit} isLoading={isLoading} />}
      {showStudySessionModal && <StudySessionModal setRandomNumber={setRandomNumber} onClose={() => setShowStudySessionModal(false)} onSave={handleStudySessionSave} isLoading={isLoading} session={currentSession} />}
      {showBreakModal && <BreakSessionModal setRandomNumber={setRandomNumber} onClose={() => setShowBreakModal(false)} onSave={handleBreakSave} isLoading={isLoading} session={currentBreak} />}
      {showKnowledgeLevelModal && <KnowledgeLevelModal setRandomNumber={setRandomNumber} onClose={() => setShowKnowledgeLevelModal(false)} onSave={handleKnowledgeLevelSave} isLoading={isLoading} session={currentKnowledgeLevel} />}
      {showWeeklyViewModal && <WeeklyViewModal onClose={() => setShowWeeklyViewModal(false)} studySessionData={studySessionData} breakSessionData={breakSessionData} />}
      {showPredictGradesModal && <PredictGradesModal onClose={() => setShowPredictGradesModal(false)} predictedGrades={predictedGrades} />}
      <Container>
        <Header>Welcome, {userName}!</Header>

        <Section title="Study sessions">
          <Table headers={studySessionHeaders} data={studySessionData} onEditClick={handleEditStudySessionClick} onDeleteClick={handleDeleteStudySessionClick} />
        </Section>

        <Section title="Break sessions">
          <Table headers={breakSessionHeaders} data={breakSessionData} onEditClick={handleEditBreakClick} onDeleteClick={handleDeleteBreakClick} />
        </Section>

        <Section title="Subject Knowledge">
          <Table headers={subjectKnowledgeHeaders} data={subjectKnowledgeData} onEditClick={handleEditKnowledgeLevelClick} onDeleteClick={handleDeleteKnowledgeLevelClick} />
        </Section>

        <Section title="Quick Add">
          <ButtonContainer>
            <Button onClick={handleAddStudySessionClick}>Add Study Session</Button>
            <Button onClick={handleAddBreakClick}>Add Break</Button>
            <Button onClick={handleAddKnowledgeLevelClick}>Add Knowledge</Button>
          </ButtonContainer>
        </Section>

        <Section title="More Options">
          <ButtonContainer>
            <Button onClick={handlePredictGradesClick}>Predict Grades</Button>
            <Button onClick={handleWeeklyViewClick}>Weekly View</Button>
            <Button onClick={generatePDF}>Generate PDF</Button>
          </ButtonContainer>
        </Section>
      </Container>
    </div>
  );
};

export default App;
