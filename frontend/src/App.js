import React from 'react';
import './App.css';
import Home from './Modules/Home';
import {Route, Routes, Outlet, Navigate} from 'react-router-dom';
import SignIn from './Modules/SignIn';
import SignUp from './Modules/SignUp';
import NurseDashboard from './Modules/NurseDashboard';
import RecordVisitForm from './Modules/RecordVisitForm';
import PatientDashboard from './Modules/PatientDashboard';
import DailyInformationForm from './Modules/DailyInformationForm';
import SymptomChecklistForm from './Modules/SymptomsChecklistForm';
import PreviousVisitsPage from './Modules/PreviousVisitData';
import MotivationalTipsForm from './Modules/MotivationalTipsForm';
import DisplayMotivationalTips from './Modules/DisplayMotivationalTips';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

function App() {
  const useAuth =  () => localStorage.getItem('token') ? true : false;

  const ProtectedRoutes = () => {
    const isAuth = useAuth();
    return isAuth ? <Outlet/> : <Navigate to={"/login"}/>
  }

  return (
    <>
    <ToastContainer />  
    <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route path="/login" element={<SignIn/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route element={<ProtectedRoutes/>}>
          <Route path="/nurse-dashboard" element={<NurseDashboard/>} />
          <Route path="/record-visit" element={<RecordVisitForm/>} />
          <Route path="/daily-information" element={<DailyInformationForm/>} />
          <Route path="/patient-dashboard" element={<PatientDashboard/>} />
          <Route path="/symptom-checklist" element={<SymptomChecklistForm/>} />
          <Route path="/previous-visit/:id" element={<PreviousVisitsPage/>} />
          <Route path="/motivational-form" element={< MotivationalTipsForm/>} />
          <Route path="/display-motivational-tips" element={< DisplayMotivationalTips/>} />
          
        </Route>
    </Routes>
    </>
  );
}

export default App;
