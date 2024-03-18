import React from 'react';
import { Card, CardBody, CardText, CardTitle } from 'reactstrap';
import { getCurrentDayOfWeek, getCurrentTimeSlot } from './Roster';
import { FaUserCheck, FaUserAlt, FaUserGraduate, FaClock } from 'react-icons/fa';
import variables from '../variables';
import logo from '../images/home.png';

// Function to fetch unverified students count
const fetchUnverifiedCount = () => {
  return fetch(variables.API_URL + 'unverified/')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data); // Log the entire response data
      return data.length; // Return the count of unverified students
    })
    .catch(error => {
      console.error('Error:', error);
    });
};

// Function to fetch the currently available doctor
const fetchAvailableDoctor = () => {
  const currentDayOfWeek = getCurrentDayOfWeek();
  const currentTimeSlot = getCurrentTimeSlot();

  return fetch(variables.API_URL + 'roster/')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(rosterList => {
      console.log(rosterList); // Log the entire response data
      // Find the roster for the current day and time slot
      const currentRoster = rosterList.data.find(roster =>
        roster.dayslot.day === currentDayOfWeek && roster.dayslot.slot === currentTimeSlot
      );
      // Return the doctor from the current roster, or null if no roster found
      return currentRoster ? currentRoster.doctor : null;
    })
    .catch(error => {
      console.error('Error:', error);
    });
};
const fetchVerifiedStudents = () => {
  return fetch(variables.API_URL + 'user/')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if ('data' in data && Array.isArray(data.data)) {
        const students = data.data.map(student => {
          if (!student.is_staff && !student.is_superuser && student.verified) {
            return student;
          }
          return null;
        }).filter(student => student !== null); // Remove undefined values
        return students.length; // Return the count of Verified students
      } else {
        throw new Error('Unexpected data format');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
};




class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unverifiedCount: 0,
      availableDoctor: null,
      verifiedStudentsCount: 0,
    };
  }

  componentDidMount() {
    Promise.all([fetchUnverifiedCount(), fetchAvailableDoctor(), fetchVerifiedStudents()])
      .then(([unverifiedCount, availableDoctor, verifiedStudentsCount]) => {
        this.setState({ unverifiedCount, availableDoctor, verifiedStudentsCount });
      });
  }


  render() {
    const { unverifiedCount, availableDoctor, verifiedStudentsCount } = this.state;

    return (
      <div>
        <h3 style={{ paddingLeft: "10%", paddingTop: "10px" }}>Welcome, Admin!</h3>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>

          <img src={logo} alt="Logo" style={{ position: 'absolute', width: "25%", marginRight: '40%' }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', marginLeft: '45%', width: '600px', overflowY: 'auto', maxHeight: 'calc(100vh - 100px)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1em', padding: '1em' }}>

              <div>
                <Card className="shadow p-3 mb-5 bg-white rounded" style={{ transition: 'opacity 0.5s ease-in-out' }}>
                  <CardBody>
                    <CardTitle tag={'h5'} className="d-flex justify-content-between align-items-center">
                      <span>Students to Be Verified</span>
                      <FaUserCheck size={32} color="#80BCBD" />
                    </CardTitle>
                    <CardText>{unverifiedCount}</CardText>
                  </CardBody>
                </Card>
              </div>

              <div>
                <Card className="shadow p-3 mb-5 bg-white rounded" style={{ transition: 'opacity 0.5s ease-in-out' }}>
                  <CardBody>
                    <CardTitle tag={'h5'} className="d-flex justify-content-between align-items-center">
                      <span>Doctor On Duty</span>
                      <FaUserAlt size={32} color="#AAD9BB" />
                    </CardTitle>
                    <CardText>{availableDoctor ? availableDoctor.doctor_name : 'n/a'}</CardText>
                  </CardBody>
                </Card>
              </div>

              <div>
                <Card className="shadow p-3 mb-5 bg-white rounded" style={{ transition: 'opacity 0.5s ease-in-out' }}>
                  <CardBody>
                    <CardTitle tag={'h5'} className="d-flex justify-content-between align-items-center">
                      <span>Verified Students</span>
                      <FaUserGraduate size={32} color="#365486" />
                    </CardTitle>
                    <CardText>{verifiedStudentsCount}</CardText>
                  </CardBody>
                </Card>
              </div>

              <div>
                <Card className="shadow p-3 mb-5 bg-white rounded" style={{ transition: 'opacity 0.5s ease-in-out' }}>
                  <CardBody>
                    <CardTitle tag={'h5'} className="d-flex justify-content-between align-items-center">
                      <span>Current Slot</span>
                      <FaClock size={32} color="#7FC7D9" />
                    </CardTitle>
                    <CardText>{getCurrentTimeSlot()}</CardText>
                  </CardBody>
                </Card>
              </div>
            </div>


          </div>
        </div>
      </div>
    );
  }
}

export default Home;
