import React, { useState } from 'react';
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import variables from './variables';

function Login() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modal, setModal] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [hallName, setHallName] = useState('');
  const [roomNo, setRoomNo] = useState('');
  const [image, setImage] = useState(null);
  const [bloodGroup, setBloodGroup] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(prevState => !prevState);

  const toggleModal = () => setModal(!modal);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${variables.API_URL}login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, password })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const token = data.token; // assuming the token is returned under the key 'token'
      localStorage.setItem('token', token); // store the token in localStorage

      const user = data.user;
      localStorage.setItem('user', JSON.stringify(user)); // store the user details in localStorage

      const isStaff = Boolean(user.is_staff);
      const isSuperuser = Boolean(user.is_superuser);
      const isVerified = Boolean(user.verified);

      if (isStaff && isSuperuser && user.is_active && isVerified) {
        navigate('/admin/home');
      } else if (!isStaff && !isSuperuser && user.is_active && isVerified) {
        navigate('/student/home');
      } else if (!isStaff && !isSuperuser && !isVerified) {
        toggleModal();
      }
    } catch (error) {
      console.error("Failed to login: ", error);
      alert("Failed to login. Please check your credentials.");
    }
  };



  const handleRegister = async (event) => {
    event.preventDefault();
    // Define the regular expression
    const emailPattern = /^u\d{7}@student\.cuet\.ac\.bd$/;
    if (!emailPattern.test(email) || email.slice(1, 8) !== id) {
      // If the email does not match the pattern, show an error
      window.alert('Please input the e-mail provided by CUET');
      return;
    }

    // Create a FormData object
    const formData = new FormData();
    formData.append('id', id);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('gender', gender);
    formData.append('department', department);
    formData.append('phone', phone);
    formData.append('permanent_address', permanentAddress);
    formData.append('hall_name', hallName);
    formData.append('room_no', roomNo);
    formData.append('image', image);
    formData.append('blood_group', bloodGroup);
    formData.append('transaction_id', transactionId);

    try {
      const response = await fetch(`${variables.API_URL}create-user/`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Show a confirmation message
      window.alert('Your registration has been submitted. Please wait until the admin verifies your account.');
      window.location.reload();
    } catch (error) {
      console.error("Failed to register: ", error);
    }
  };



  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <img src="cuet.png" alt="Logo" style={{ position: 'absolute', left: '19%', width: "18s%" }} />
      {isRegister ? (
        <Form style={{ display: 'flex', flexWrap: 'wrap', marginLeft: '50%', width: '600px', overflowY: 'auto', maxHeight: 'calc(100vh - 100px)' }} onSubmit={handleRegister}>
          <h1 style={{ textAlign: 'center', fontSize: "1.9em", width: '100%' }}>CUET Medical Center</h1>
          <h2 style={{ textAlign: 'center', fontSize: "1.5em", width: '100%' }}>Sign Up</h2>
          <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            <div style={{ width: '50%', marginRight: '10px' }}>
              <FormGroup>
                <Label for="id">Student ID</Label>
                <Input type="text" name="id" id="id" placeholder="Enter Student ID" value={id} onChange={e => setId(e.target.value)} required />
              </FormGroup>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input type="email" name="email" id="email" placeholder="Enter Email" value={email} onChange={e => setEmail(e.target.value)} required />
              </FormGroup>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input type="password" name="password" id="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
              </FormGroup>
              <FormGroup>
                <Label for="firstName">First Name</Label>
                <Input type="text" name="firstName" id="firstName" placeholder="Enter First Name" value={firstName} onChange={e => setFirstName(e.target.value)} required />
              </FormGroup>
              <FormGroup>
                <Label for="lastName">Last Name</Label>
                <Input type="text" name="lastName" id="lastName" placeholder="Enter Last Name" value={lastName} onChange={e => setLastName(e.target.value)} required />
              </FormGroup>
              <FormGroup>
                <Label for="gender">Gender</Label>
                <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                  <DropdownToggle caret color='light'>
                    {gender || "Select your gender"}
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={() => { setGender('Male'); toggle(); console.log('Selected gender: Male'); }}>Male</DropdownItem>
                    <DropdownItem onClick={() => { setGender('Female'); toggle(); console.log('Selected gender: Female'); }}>Female</DropdownItem>
                    <DropdownItem onClick={() => { setGender('Others'); toggle(); console.log('Selected gender: Others'); }}>Others</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </FormGroup>
              <FormGroup>
                <Label for="department">Department</Label>
                <Input type="text" name="department" id="department" placeholder="Enter Department" value={department} onChange={e => setDepartment(e.target.value)} required />
              </FormGroup>
            </div>
            <div style={{ width: '50%' }}>
              <FormGroup>
                <Label for="permanentAddress">Permanent Address</Label>
                <Input type="textarea" name="permanentAddress" id="permanentAddress" placeholder="Enter Permanent Address" value={permanentAddress} onChange={e => setPermanentAddress(e.target.value)} required />
              </FormGroup>
              <FormGroup>
                <Label for="phone">Phone no.</Label>
                <Input type="text" name="phone" id="phone" placeholder="Enter Phone Number" value={phone} onChange={e => setPhone(e.target.value)} required />
              </FormGroup>
              <FormGroup>
                <Label for="image">Image</Label>
                <Input type="file" name="image" id="image" onChange={e => { setImage(e.target.files[0]); console.log('Image: ', e.target.files[0]); }} />
              </FormGroup>
              <FormGroup>
                <Label for="hallName">Hall Name</Label>
                <Input type="text" name="hallName" id="hallName" placeholder="Enter Hall Name" value={hallName} onChange={e => setHallName(e.target.value)} required />
              </FormGroup>
              <FormGroup>
                <Label for="roomNo">Room No.</Label>
                <Input type="text" name="roomNo" id="roomNo" placeholder="Enter Room No" value={roomNo} onChange={e => setRoomNo(e.target.value)} required />
              </FormGroup>
              <FormGroup>
                <Label for="bloodGroup">Blood Group</Label>
                <Input type="text" name="bloodGroup" id="bloodGroup" placeholder="Enter Blood Group" value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} required />
              </FormGroup>
              <FormGroup>
                <Label for="transactionId">Online payment Trx ID</Label>
                <Input type="text" name="transactionId" id="transactionId" placeholder="Enter Transaction ID" value={transactionId} onChange={e => setTransactionId(e.target.value)} required />
              </FormGroup>
            </div>
          </div>
          <Button color="dark" block style={{ marginBottom: '10px' }}>Sign Up</Button>
          <p style={{ textAlign: 'center', color: 'black', fontStyle: 'italic', textDecoration: 'none' }}> <a href="#" onClick={() => setIsRegister(false)} style={{ color: 'inherit', textDecoration: 'none' }}>Already have an account? Log in</a></p>
        </Form>
      ) : (
        <Form style={{ marginLeft: '50%', width: '300px' }} onSubmit={handleSubmit}>
          <h1 style={{ textAlign: 'center', fontSize: "1.9em" }}>CUET Medical Center</h1>
          <h2 style={{ textAlign: 'center', fontSize: "1.5em" }}>Log In</h2>
          <FormGroup>
            <Label for="id">ID</Label>
            <Input type="text" name="id" id="id" placeholder="Enter ID" value={id} onChange={e => setId(e.target.value)} required />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input type="password" name="password" id="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          </FormGroup>
          <Button color="dark" block style={{ marginBottom: '10px' }}>Login</Button>
          <p style={{ textAlign: 'center', color: 'black', fontStyle: 'italic', textDecoration: 'none' }}><a href="#" onClick={() => setIsRegister(true)} style={{ color: 'inherit', textDecoration: 'none' }}>Don't have an account? Sign up</a></p>
          <Modal isOpen={modal} toggle={toggleModal}>
            <ModalHeader toggle={toggleModal}>Not Verified</ModalHeader>
            <ModalBody>
              You are not verified yet. Please wait for verification or contact administration. Thank you!
            </ModalBody>
          </Modal>
        </Form>
      )}
    </div>
  );
}

export default Login;

