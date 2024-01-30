import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import Home from './Components/Home';
import Booklet from './Components/Booklet';
import Doctor from './Components/Doctor';
import Roster from './Components/Roster';
import StudentHome from './stuComponents/StudentHome';
import PrescriptionForm from './Components/PrescriptionForm.js';
import Login from './Login';
import StudentRoster from './stuComponents/StudentRoster.js';
import NavbarComponent from './NavBarComponent.js'; 
import PrivateRoute from './PrivateRoute.js';
import Verification from './Components/Verification';
import Prescriptions from './Components/Prescriptions.js';
import StudentBooklet from './stuComponents/StudentBooklet.js'
import variables from './variables';
import PrescriptionList from './Components/PrescriptionList.js'

function App() {
 const [isOpen, setIsOpen] = useState(false);
 const toggle = () => setIsOpen(!isOpen);
 const [students, setStudents] = useState([]);

 useEffect(() => {
    // Fetch the list of all students from the server
    fetch(variables.API_URL + 'user/')
      .then(response => response.json())
      .then(data => {
        if ('data' in data && Array.isArray(data.data)) {
          const students = data.data.filter(student => !student.is_staff && !student.is_superuser && !student.verified);
          setStudents(students);
        } else {
          console.error('Expected an object with a data property containing a single booklet object, but got ', data);
        }
      });
 }, []); // Empty dependency array means this effect runs once on mount

 return (
 <BrowserRouter>
     <div>
       <NavbarComponent toggle={toggle} isOpen={isOpen} students={students}/>
       <Routes>
       <Route path='/admin/home' element={<PrivateRoute><Home /></PrivateRoute>} />
       <Route path='/admin/booklet' element={<PrivateRoute><Booklet /></PrivateRoute>} />
       <Route path='/admin/doctor' element={<PrivateRoute><Doctor /></PrivateRoute>} />
       <Route path='/admin/roster' element={<PrivateRoute><Roster /></PrivateRoute>} />
       <Route path='/admin/PrescriptionForm' element={<PrivateRoute><PrescriptionForm /></PrivateRoute>} />
       <Route path='/admin/Prescriptions' element={<PrivateRoute><Prescriptions /></PrivateRoute>} />
       <Route path='/admin/PrescriptionList' element={<PrivateRoute><PrescriptionList /></PrivateRoute>} />
       <Route path="/admin/verification" element={<PrivateRoute><Verification students={students} setStudents={setStudents} /></PrivateRoute>} />
       <Route path='/student/home' element={<PrivateRoute><StudentHome /></PrivateRoute>} />
       <Route path='/student/roster' element={<PrivateRoute><StudentRoster /></PrivateRoute>} />
       <Route path='/student/booklet' element={<PrivateRoute><StudentBooklet /></PrivateRoute>} />
       <Route path='/' element={<Login />} />
       </Routes>
     </div>
 </BrowserRouter>
 );
}

export default App;
