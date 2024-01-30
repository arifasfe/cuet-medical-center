import React, { useState } from 'react';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import variables from './../variables';

function Verification({ students, setStudents }) {
 const [selectedStudent, setSelectedStudent] = useState(null);
 const [modal, setModal] = useState(false);

 const toggle = () => setModal(!modal);


 const handleConfirm = (studentId) => {
    // Send a request to the server to confirm the student
    fetch(variables.API_URL + 'user/' + studentId, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ verified: true })
    })
      .then(response => response.json())
      .then(data => {
        // Show a modal
        window.alert("Verification completed successfully");

        // Remove the confirmed student from the list
        setStudents(students.filter(student => student.id !== studentId));

        // Close the modal
        toggle();

        // Reload the page
        window.location.reload();
      })
      .catch(error => {
        console.error('Failed to confirm student:', error);
      });
 };

 const handleDelete = (studentId) => {
    // Send a request to the server to delete the student
    fetch(variables.API_URL + 'user/' + studentId, {
      method: 'DELETE'
    })
      .then(response => {
        // Remove the deleted student from the list
        setStudents(students.filter(student => student.id !== studentId));

        // Close the modal
        toggle();
      })
      .catch(error => {
        console.error('Failed to delete student:', error);
      });
 };

 const handleSeeDetails = (student) => {
    setSelectedStudent(student);
    toggle();
 };

 return (
    <div style={{ margin: '20px', padding: '20px' }}>
      <Table striped style={{ marginTop: '20px' }}>
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student.id}>
              <td>{index + 1}</td>
              <td>{student.id}</td>
              <td>{student.first_name} {student.last_name}</td>
              <td>
                <Button color="primary" onClick={() => handleSeeDetails(student)}>See Details</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>STUDENT DETAILS</ModalHeader>
        <ModalBody style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            {selectedStudent && (
              <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                <div>
                  <p><strong>ID:</strong> {selectedStudent.id}</p>
                  <p><strong>First Name:</strong> {selectedStudent.first_name}</p>
                  <p><strong>Last Name:</strong> {selectedStudent.last_name}</p>
                  <p><strong>Email:</strong> {selectedStudent.email}</p>
                  <p><strong>Gender:</strong> {selectedStudent.gender}</p>
                  <p><strong>Department:</strong> {selectedStudent.department}</p>
                  <p><strong>Phone:</strong> {selectedStudent.phone}</p>
                  <p><strong>Permanent Address:</strong> {selectedStudent.permanent_address}</p>
                  <p><strong>Hall Name:</strong> {selectedStudent.hall_name}</p>
                  <p><strong>Room No:</strong> {selectedStudent.room_no}</p>
                  <p><strong>Blood Group:</strong> {selectedStudent.blood_group}</p>
                  <p><strong>Transaction ID:</strong> {selectedStudent.transaction_id}</p>
                  <p><strong>Registered At:</strong> {selectedStudent.created_at}</p>
                </div>
                <img src={variables.CLOUDINARY_BASE_URL + selectedStudent.image} alt="Student" style={{width: '120px', height: '140px'}} />
              </div>
            )}
        </ModalBody>
        <ModalFooter>
            <Button color="success" onClick={() => handleConfirm(selectedStudent.id)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
  <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
</svg></Button>{' '}
            <Button color="danger" onClick={() => handleDelete(selectedStudent.id)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                                </svg></Button>{' '}
            {/* <Button color="secondary" onClick={toggle}>Cancel</Button> */}
        </ModalFooter>
        </Modal>
    </div>
 );
}

export default Verification;
