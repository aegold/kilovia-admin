/**
 * QuanLyChuDe - Main Container
 * Two-column layout for managing Topics (left) and SubTopics (right)
 */

import React, { useState } from "react";
import QLCD_Layout from "./components/QLCD_Layout";
import TopicPanel from "./components/topic/TopicPanel";
import SubTopicPanel from "./components/subtopic/SubTopicPanel";
import "./QuanLyChuDe.css";

const QuanLyChuDe = () => {
  // Selected topic state - shared between left and right panels
  const [selectedTopic, setSelectedTopic] = useState(null);

  // Filter state for topics (Grade + Subject)
  const [topicFilters, setTopicFilters] = useState({
    gradeId: null,
    subjectGradeId: null,
  });

  // Refresh trigger for panels
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };

  const handleTopicFilterChange = (filters) => {
    setTopicFilters(filters);
    // Clear selected topic when filters change
    setSelectedTopic(null);
  };

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <QLCD_Layout>
      <div className="qlcd-container">
        {/* Left Panel: Topics */}
        <TopicPanel
          filters={topicFilters}
          onFilterChange={handleTopicFilterChange}
          selectedTopic={selectedTopic}
          onTopicSelect={handleTopicSelect}
          refreshTrigger={refreshTrigger}
          onDataChange={triggerRefresh}
        />

        {/* Right Panel: SubTopics */}
        <SubTopicPanel
          selectedTopic={selectedTopic}
          refreshTrigger={refreshTrigger}
          onDataChange={triggerRefresh}
        />
      </div>
    </QLCD_Layout>
  );
};

export default QuanLyChuDe;
