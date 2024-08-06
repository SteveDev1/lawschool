import React from 'react';
import { Route, Routes } from 'react-router-dom'; 
import MainContent from '../pages/Homepage'; // Make sure this path is correct
import SubmissionForm from '../pages/QuestionsPage/SubmissionForm';
import SubmissionList from '../pages/QuestionsPage/SubmissionList';
import AnswerForm from '../pages/QuestionsPage/AnswerForm';


const PageRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainContent />} />
      <Route path='/submission' element={<SubmissionForm />} />
      <Route path='/questions' element={<SubmissionList />} />
      <Route path='/answer' element={<AnswerForm />} />
    </Routes>
  );
};

export default PageRoutes;
