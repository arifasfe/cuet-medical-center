import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Card, CardBody, CardTitle, CardText } from 'reactstrap';
import variables from './../variables';
import PropTypes from 'prop-types';
import home from './../images/student.png';

function StudentHome() {
 const user = JSON.parse(localStorage.getItem('user'));
 const [modal, setModal] = useState(false);
 const [formData, setFormData] = useState(user);

 const toggle = () => setModal(!modal);

 const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
 };

 const handleUpdate = (event) => {
    event.preventDefault();

    fetch(variables.API_URL + 'user/' + user.id , {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(result => {
        const userData = result.data;
        localStorage.setItem('user', JSON.stringify(userData));
        alert('Profile updated successfully!');
        toggle();
    }, (error) => {
        alert('Failed to update profile');
    })
};

 return (
    <div>
    <h1 style={{paddingLeft:"10%", paddingTop:"10px"}}>Welcome, {user.first_name} {user.last_name}!</h1>
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'auto',}}>
      <img src={home} alt="Student" style={{ position: 'absolute', width:"25%", marginRight: '40%' }} />
      <div style={{display: 'flex', flexWrap: 'wrap', marginLeft: '65%', width: '600px', overflowY: 'hidden', maxHeight: 'calc(100vh - 100px)'}}>
        <Card className="shadow p-3 mb-5 bg-white rounded" style={{ transition: 'opacity 0.5s ease-in-out',marginBottom:"20px" }}>
          <CardBody>
            <CardTitle tag={'h5'} className="d-flex justify-content-between align-items-center">
              <img src={variables.CLOUDINARY_BASE_URL + user.image} alt="Student" style={{ width: '120px', height: '120px' }}/>
            </CardTitle>
            <CardText><strong>Email:</strong> {user.email}</CardText>
            <CardText><strong>Gender:</strong> {user.gender}</CardText>
            <CardText><strong>Department:</strong> {user.department}</CardText>
            <CardText><strong>Phone:</strong> {user.phone}</CardText>
            <CardText><strong>Permanent Address:</strong> {user.permanent_address}</CardText>
            <CardText><strong>Hall Name:</strong> {user.hall_name}</CardText>
            <CardText><strong>Room No:</strong> {user.room_no}</CardText>
            <CardText><strong>Blood Group:</strong> {user.blood_group}</CardText>
            <Button onClick={toggle}>Update Profile</Button>
          </CardBody>
        </Card>
      </div>
    </div>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Update Profile</ModalHeader>
        <ModalBody>
        <Form onSubmit={handleUpdate}>
            <FormGroup>
                <Label for="phone">Phone No.</Label>
                <Input type="text" name="phone" id="phone" placeholder="Enter Phone No." value={formData.phone} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
                <Label for="hall_name">Hall Name</Label>
                <Input type="text" name="hall_name" id="hall_name" placeholder="Enter Hall Name" value={formData.hall_name} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
                <Label for="room_no">Room No.</Label>
                <Input type="text" name="room_no" id="room_no" placeholder="Enter Room No." value={formData.room_no} onChange={handleInputChange} />
            </FormGroup>
            <Button color="primary" type="submit">Update</Button>
            </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
 );
}

StudentHome.propTypes = {
 user: PropTypes.object.isRequired,
 toggle: PropTypes.func.isRequired,
 formData: PropTypes.object.isRequired,
 handleInputChange: PropTypes.func.isRequired,
 handleUpdate: PropTypes.func.isRequired,
};

export default StudentHome;
