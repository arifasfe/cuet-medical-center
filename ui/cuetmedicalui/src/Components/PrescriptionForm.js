import React, { Component } from "react";
import variables from './../variables';

import { Button, Modal, ModalHeader, ModalBody, FormGroup, Label, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Form, Row, Col } from 'reactstrap';

export class PrescriptionForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            prescription_id: 0,
            complaints: "",
            diagnosis: "",
            rx: "",
            investigation: "",
            lifestyle: "",
            last_checkup_id: "",
            pulse_rate: "",
            bp: "",
            temp: "",
            weight: "",
            age: "",

            doctor: {
                doctor_id: "",
                doctor_name: "",
            },
            ebooklet: {
                booklet_id: "",
            },
            booklets: [],
            doctors: [],
            prescriptions: [],
            confirmation: false,
            model: false,
            selectedBookletId: null,

        }
    }


    refreshList() {
        fetch(variables.API_URL + 'prescription/')
            .then(response => response.json())
            .then(data => {
                if ('data' in data && Array.isArray(data.data)) {
                    console.log(data)
                    this.setState({
                        prescriptions: data.data

                    });
                } else {
                    console.error('Expected an object with a data property containing a single booklet object, but got ', data);
                }
            });

        fetch(variables.API_URL + 'ebooklet/')
            .then(response => response.json())
            .then(data => {
                if ('data' in data && Array.isArray(data.data)) {
                    this.setState({
                        booklets: data.data
                    });
                } else {
                    console.error('Expected an object with a data property containing a single booklet object, but got ', data);
                }
            });

        fetch(variables.API_URL + 'doctor/')
            .then(response => response.json())
            .then(data => {
                if ('data' in data && Array.isArray(data.data)) {
                    const doctors = data.data.map(doctor => {
                        return {
                            doctor_id: doctor.doctor_id,
                            doctor_name: doctor.doctor_name,
                            specialization: doctor.specialization
                        };
                    });
                    console.log(doctors); // Log the mapped doctors array
                    this.setState({
                        doctors: doctors
                    });
                } else {
                    console.error('Expected an object with a data property containing an array of doctor objects, but got ', data);
                }
            });
    }
    componentDidMount() {
        this.refreshList();
        const params = new URLSearchParams(window.location.search);
        const booklet_id = params.get('booklet_id');

        this.setState({
            selectedBookletId: booklet_id
        });

    }

    toggleModal = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    openModal = () => {
        this.setState({
            modal: true
        });
    }

    closeModal = () => {
        this.setState({
            modal: false
        });
    }

    toggleDropdownDoctor = () => {
        this.setState(prevState => ({
            dropdownOpenDoctor: !prevState.dropdownOpenDoctor
        }));
    };
    handleDoctorSelection(selectedId) {
        this.setState({
            selectedDoctorId: selectedId
        });
    }

    toggleDropdownBooklet = () => {
        this.setState(prevState => ({
            dropdownOpenBooklet: !prevState.dropdownOpenBooklet
        }));
    };

    handleBookletSelection(selectedId) {
        this.setState({
            selectedBookletId: selectedId
        });
    }




    changePrescriptionId = (e) => {
        this.setState({ prescription_id: e.target.value })
    }
    changeLast_checkup_id = (e) => {
        this.setState({ last_checkup_id: e.target.value })
    }
    changePulse_rate = (e) => {
        this.setState({ pulse_rate: e.target.value })
    }


    changeComplaints = (e) => {
        this.setState({ complaints: e.target.value })
    }

    changeDiagnosis = (e) => {
        this.setState({ diagnosis: e.target.value })
    }

    changeRx = (e) => {
        this.setState({ rx: e.target.value })
    }

    changeInvestigation = (e) => {
        this.setState({ investigation: e.target.value })
    }

    changeLifestyle = (e) => {
        this.setState({ lifestyle: e.target.value })
    }

    changeBp = (e) => {
        this.setState({ bp: e.target.value })
    }

    changeTemp = (e) => {
        this.setState({ temp: e.target.value })
    }

    changeWeight = (e) => {
        this.setState({ weight: e.target.value })
    }

    changeAge = (e) => {
        this.setState({ age: e.target.value })
    }
    handleConfirmationChange = (e) => {
        this.setState({ confirmation: e.target.checked })
    }
    handleDoctorSelection(selectedId) {
        this.setState({
            selectedDoctorId: selectedId
        });
    }

    handleBookletSelection(selectedId) {
        this.setState({
            selectedBookletId: selectedId
        });
    }

    createPrescription = () => {
        fetch(variables.API_URL + 'prescription/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prescription_id: this.state.prescription_id,
                complaints: this.state.complaints,
                diagnosis: this.state.diagnosis,
                rx: this.state.rx,
                investigation: this.state.investigation,
                lifestyle: this.state.lifestyle,
                last_checkup_id: this.state.last_checkup_id,
                pulse_rate: this.state.pulse_rate,
                bp: this.state.bp,
                temp: this.state.temp,
                weight: this.state.weight,
                age: this.state.age,
                confirmation: this.state.confirmation,
                doctor: this.state.selectedDoctorId, // assuming selectedDoctorId holds the selected doctor's id
                booklet: this.state.selectedBookletId, // assuming selectedBookletId holds the selected booklet's id
            })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(result => {
                this.openModal();
            })
            .catch(error => {
                alert('Failed');
            });
    }




    render() {

        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh', // Use vh unit for height
                marginTop: '120px', // Use vh unit for top margin
            }}>

                <Form responsive>
                    <Row>
                        <Col xs="12" sm="6" md="4">
                            <FormGroup required>
                                <Label for="doctor">Doctors List</Label>
                                <Dropdown isOpen={this.state.dropdownOpenDoctor} toggle={this.toggleDropdownDoctor}>
                                    <DropdownToggle caret>
                                        {this.state.selectedDoctorId ? this.state.selectedDoctorId : "Select Doctor"}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        {this.state.doctors.map((doctor) => (
                                            <DropdownItem key={doctor.doctor_id} onClick={() => this.handleDoctorSelection(doctor.doctor_id)}>
                                                {doctor.doctor_name} - {doctor.specialization}
                                            </DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                </Dropdown>
                            </FormGroup></Col>

                    </Row>
                    <Row>
                        <Col xs="12" sm="6" md="4">
                            <FormGroup>
                                <Label for="booklet">Ebooklets List</Label>
                                <Input plaintext value={this.state.selectedBookletId} />
                            </FormGroup>
                        </Col>
                    </Row>


                    <Row>
                        <FormGroup>
                            <Label for="complaints">Complaints</Label>
                            <Input type="textarea" name="complaints" id="complaints" value={this.state.complaints} onChange={this.changeComplaints} />
                        </FormGroup>
                    </Row>




                    
                    <Row>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="temp">Temperature(Fahrenheit)</Label>
                                <Input type="number" name="temp" id="temp" value={this.state.temp} onChange={this.changeTemp} />
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="weight">Weight(kg)</Label>
                                <Input type="number" name="weight" id="weight" value={this.state.weight} onChange={this.changeWeight} />
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="age">Age</Label>
                                <Input type="number" name="age" id="age" value={this.state.age} onChange={this.changeAge} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <FormGroup>
                            <Label for="diagnosis">Diagnosis</Label>
                            <Input type="textarea" name="diagnosis" id="diagnosis" value={this.state.diagnosis} onChange={this.changeDiagnosis} />
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup row>
                            <Label
                                for="exampleText"
                            >
                                <h4>R<sub>x</sub></h4>
                            </Label>
                            <Input type="textarea" name="rx" id="rx" value={this.state.rx} onChange={this.changeRx} />
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup>
                            <Label for="investigation">Investigation</Label>
                            <Input type="textarea" name="investigation" id="investigation" value={this.state.investigation} onChange={this.changeInvestigation} />
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup>
                            <Label for="lifestyle">Lifestyle</Label>
                            <Input type="textarea" name="lifestyle" id="lifestyle" value={this.state.lifestyle} onChange={this.changeLifestyle} />
                        </FormGroup>
                    </Row>
                    
                    <Button className="padding:50px" color="primary" onClick={this.createPrescription}>Submit</Button>
                </Form>
                <div>

                    <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                        <ModalHeader toggle={this.toggleModal}><h3>Prescription</h3></ModalHeader>
                        <ModalBody>
                            Prescription created successfully!
                        </ModalBody>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default PrescriptionForm;