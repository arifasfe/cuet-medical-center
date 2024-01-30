import React, { Component } from 'react';
import variables from './../variables';
import { Button, Table, Modal, ModalHeader, ModalBody, FormGroup, Label, Input, ModalFooter } from 'reactstrap';

export class Doctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doctor_id : 0,
            doctors: [],
            modalTitle: "",
            doctor_name : "", 
            specialization : "",
            address : "", 
            phone : "",
            showModal: false
        }
    }

refreshList() {
   fetch(variables.API_URL + 'doctor/')
       .then(response => response.json())
       .then(data => {
           if ('data' in data && Array.isArray(data.data)) {
               this.setState({ doctors: data.data });
           } else {
               console.error('Expected an object with a data property containing an array, but got ', data);
           }
       });
}


    componentDidMount() {
        this.refreshList();
    }

    changeDoctorName = (e) => {
        this.setState({ doctor_name: e.target.value })
    }
    changeSpecialization = (e) => {
        this.setState({ specialization: e.target.value })
    }
    changeAddress = (e) => {
        this.setState({ address: e.target.value })
    }
    changePhone = (e) => {
        this.setState({ phone: e.target.value })
    }
    toggle = () => {
        this.setState(prevState => ({
            showModal: !prevState.showModal
        }));
    };

    addClick = () => {
        this.setState({
            modalTitle: "Register Doctor",
            doctor_id : 0,
            doctor_name : "", 
            specialization : "",
            address : "", 
            phone : ""
        });
        this.toggle();
    }
    
    editClick = (doc) => {
        this.setState({
            modalTitle: "Edit Doctor Information",
            doctor_id: doc.doctor_id,
            doctor_name: doc.doctor_name,
            specialization: doc.specialization,
            address: doc.address,
            phone: doc.phone
        });
        this.toggle();
    }
    

    createClick = () => {
        fetch(variables.API_URL + 'doctor/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                doctor_name: this.state.doctor_name,
                specialization: this.state.specialization,
                address: this.state.address,
                phone: this.state.phone
            })
        })
            .then(res => res.json())
            .then(result => {
                alert(result);
                this.refreshList();

            }, (error) => {
                alert('Failed');
            })
    }

    updateClick = () => {
        fetch(variables.API_URL + '/doctor/' + this.state.doctor_id+'/', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                doctor_name: this.state.doctor_name,
                specialization: this.state.specialization,
                address: this.state.address,
                phone: this.state.phone
            })
        })
            .then(res => res.json())
            .then(result => {
                alert(result);
                this.refreshList();

            }, (error) => {
                alert('Failed');
            })
    }

    deleteClick = (id) => {
        if (window.confirm('Are you sure?')) {
            fetch(variables.API_URL + 'doctor/' + id, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(result => {
                    alert(result);
                    this.refreshList();

                }, (error) => {
                    alert('Failed');
                })
        }
    }

    render() {
        const {
            doctors,
            doctor_id,
            modalTitle,
            doctor_name,
            specialization,
            address,
            phone,
            showModal
        } = this.state;

        return (
            <div style={{ margin: '20px', padding: '20px' }}>
            <Button color="primary" className="float-end" onClick={this.addClick}>
                Register Doctor
            </Button>
            <Table striped style={{ marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th>DoctorName</th>
                        <th>Specialization</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {doctors.map(doc =>
                        <tr key={doc.doctor_id}>
                            <td>{doc.doctor_name}</td>
                            <td>{doc.specialization}</td>
                            <td>{doc.phone}</td>
                            <td>{doc.address}</td>
                            <td>
                                <Button style={{marginRight: "15px"}} outline onClick={() => this.editClick(doc)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                </svg>
                                </Button>
                                <Button outline color="danger" onClick={() => this.deleteClick(doc.doctor_id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                                </svg>
                                </Button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

                <Modal isOpen={showModal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>{modalTitle}</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="doctorName">Doctor Name</Label>
                            <Input type="text" name="doctorName" id="doctorName" placeholder="Doctor Name" value={doctor_name} onChange={this.changeDoctorName} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="specialization">Specialization</Label>
                            <Input type="text" name="specialization" id="specialization" placeholder="Specialization" value={specialization} onChange={this.changeSpecialization} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="address">Address</Label>
                            <Input type="text" name="address" id="address" placeholder="Address" value={address} onChange={this.changeAddress} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="phone">Phone No.</Label>
                            <Input type="text" name="phone" id="phone" placeholder="Phone No." value={phone} onChange={this.changePhone} />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={doctor_id === 0 ? this.createClick : this.updateClick}>
                            {doctor_id === 0 ? 'Create' : 'Update'}
                        </Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default Doctor;