// Updated React component with improved layout for exam details and premium styling
import React, { useEffect, useState } from "react";
import "./App.css";

const sheetUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRhSO2Nzg2LWwa-7JP4klIuV8Z55wNi7JP7etR6bTeqv-nQQmou2PrrBz8RbOVSwn5VSgIvWAnM4x4w/pub?gid=0&single=true&output=csv";

const getConductingBody = (rawCategory) => {
  const category = rawCategory.trim().toLowerCase();
  const map = {
    upsc: "Union Public Service Commission",
    ssc: "Staff Selection Commission",
    banking: "IBPS / SBI / RBI",
    technical: "IIT / BARC / DRDO / ISRO",
    "state psc": "Respective State PSC",
    defense: "Indian Army / Air Force",
    police: "State Police Departments",
    teaching: "CBSE / NTA / State Boards"
  };
  return map[category] || "Official Body";
};

function App() {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [daysLeft, setDaysLeft] = useState(null);

  useEffect(() => {
    fetch(sheetUrl)
      .then((res) => res.text())
      .then((data) => {
        const rows = data.trim().split("\n").slice(1);
        const parsed = rows.map((row) => {
          const [name, date, category] = row.split(",");
          return { name: name.trim(), date: date.trim(), category: category.trim() };
        });
        setExams(parsed);
      });
  }, []);

  useEffect(() => {
    if (selectedExam) {
      const exam = exams.find((e) => e.name === selectedExam);
      if (exam) {
        const today = new Date();
        const examDate = new Date(exam.date);
        const diff = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
        setDaysLeft(diff);
      }
    }
  }, [selectedExam, exams]);

  const groupByCategory = () => {
    const groups = {};
    exams.forEach((exam) => {
      if (!groups[exam.category]) groups[exam.category] = [];
      groups[exam.category].push(exam);
    });
    return groups;
  };

  const grouped = groupByCategory();

  return (
    <div className="container">
      <header className="site-header">
        <h1>📚 Exam Countdown Tracker India</h1>
        <p>Find days left for UPSC, SSC, Banking, Railways, Police, and Government Exams</p>
      </header>

      <main>
        <select
          className="dropdown"
          onChange={(e) => setSelectedExam(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            -- Select an Exam --
          </option>
          {exams.map((exam, i) => (
            <option key={i} value={exam.name}>
              {exam.name}
            </option>
          ))}
        </select>

        {selectedExam && daysLeft !== null && (
          <div className={`countdown ${daysLeft <= 7 ? "alert" : ""}`}>
            {daysLeft >= 0 ? (
              <>
                {selectedExam} is in <strong>{daysLeft}</strong> days
              </>
            ) : (
              <>⏱ {selectedExam} has passed</>
            )}
          </div>
        )}

        <button className="download-btn">📥 Download Planner</button>

        <div className="categories">
          {Object.entries(grouped).map(([category, exams]) => (
            <div key={category} className="category-block">
              <h3>{category} Exams</h3>
              <ul>
                {exams.map((exam, idx) => {
                  const today = new Date();
                  const examDate = new Date(exam.date);
                  const diff = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
                  const isSoon = diff <= 7 && diff >= 0;
                  return (
                    <li key={idx} className="exam-item">
                      <div className="exam-entry premium-style">
                        <div className="exam-info">
                          <strong className="exam-name">{exam.name}</strong>
                        </div>
                        <div className={`exam-date ${isSoon ? "red-text" : ""}`}>
                          📅 {examDate.toDateString()} <br />
                          <span className="exam-body-tag"><strong>Conducted by : </strong> {getConductingBody(exam.category)}</span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </main>

      <footer className="site-footer">
        <p>📌 Stay updated with the latest <strong>Indian competitive exam countdowns</strong>.</p>
        <p>Includes: UPSC, SSC, Railway, Banking, Defense, Teaching, and more.</p>
        <p>Made for students, by students. 🎓</p>
      </footer>
    </div>
  );
}

export default App;
