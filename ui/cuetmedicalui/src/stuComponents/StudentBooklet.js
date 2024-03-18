import React, { Component} from 'react';
import { Button, Alert, Badge, Modal, ModalHeader, ModalBody,Input, ModalFooter, Card, CardBody, CardTitle, CardSubtitle } from 'reactstrap';
import variables from './../variables';

export class StudentBooklet extends Component {
    constructor(props) {
        super(props);
        const user = JSON.parse(localStorage.getItem('user'));
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
                specialization: "",
            },
            booklet: {
                booklet_id: "",
            },
            booklets: [],
            doctors: [],
            prescriptions: [],
            confirmation: false,
            modal: {},
            modalOpen: false,
            modalMessage: '',
            hover: false,
            hoverId: null,
            selectedBookletId: null,
            user: user,
            selectedPrescription: null,
            updatedPrescriptions: [],
            confirmModalOpen: false,


        };
        this.toggle = this.toggle.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }


    refreshList() {
        fetch(variables.API_URL + 'prescription/')
        .then(response => response.json())
        .then(data => {
            if ('data' in data && Array.isArray(data.data)) {
                let sortedData = data.data
                    .filter(prescription => prescription.booklet.student.id === this.state.user.id)
                    .sort((a, b) => b.prescription_id - a.prescription_id); // Sort in descending order of prescription_id

                // Set the initial state of confirmation based on the data received from the backend
                const initialConfirmation = sortedData.reduce((acc, prescription) => {
                    acc[prescription.prescription_id] = prescription.confirmation || false;
                    return acc;
                }, {});
                this.setState({
                    prescriptions: sortedData,
                    confirmation: initialConfirmation
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
        this.state.prescriptions.sort((a, b) => {
            const dateA = new Date(a.date_time).getTime();
            const dateB = new Date(b.date_time).getTime();

            
            return dateB - dateA;
        });

    }



    toggle(prescription_id) {
        this.setState(prevState => ({
            modal: { ...prevState.modal, [prescription_id]: !prevState.modal[prescription_id] },
            selectedPrescription: prescription_id
        }));
    }
    
    handleMouseEnter(prescription_id) {
        this.setState({ hover: true, hoverId: prescription_id });
    }

    handleMouseLeave() {
        this.setState({ hover: false, hoverId: null });
    }
    openModal(message) {
        this.setState({
            modalOpen: true,
            modalMessage: message,
        }, () => {
            console.log(this.state.modalOpen);
        });
    }
    
    

    toggleConfirmModal = () => {
        this.setState(prevState => ({
          confirmModalOpen: !prevState.confirmModalOpen,
        }));
     };

     closeModal() {
        this.setState({
            modalMessage: '',
            modalOpen: false,
        });
    }
    
     handleConfirm = async () => {
        // Logic to update the confirmation status
        const response = await fetch(`${variables.API_URL}prescription/${this.state.selectedPrescription}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                confirmation: true,
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Update the confirmation state locally
        this.setState(prevState => ({
            confirmation: { ...prevState.confirmation, [this.state.selectedPrescription]: true },
            confirmModalOpen: false, // Close the modal after confirmation
        }));

        // Redirect to the same page to reflect the changes
        window.location.reload();
    };

    render() {
        return (
            <div className="mt-3 mx-auto" style={{ maxWidth: '90%' }}>
                <Alert color="info">
                    <h3>My EBooklet</h3>
                </Alert>


                {this.state.prescriptions.map((prescription, index) => (
                    <Card key={index} onClick={() => this.toggle(prescription.prescription_id)} onMouseEnter={() => this.handleMouseEnter(prescription.prescription_id)} onMouseLeave={this.handleMouseLeave} style={{ backgroundColor: '#FAFAFA', borderRadius: '5px', marginBottom: '10px', transform: this.state.hover && this.state.hoverId === prescription.prescription_id ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.3s ease-in-out' }}>
                        <CardBody>
                        <Badge pill color={this.state.confirmation[prescription.prescription_id] ? "success" : "danger"} style={{ position: 'absolute', top: '10px', right: '10px' }}>
                            {this.state.confirmation[prescription.prescription_id] ? "Confirmed" : "Not Confirmed"}
                        </Badge>
                            <CardTitle tag="h5">Prescription {prescription.prescription_id}</CardTitle>
                            <CardSubtitle tag="h6" className="mb-2 text-muted">Ebooklet ID: {prescription.booklet?.booklet_id}</CardSubtitle>

                            <Button outline color="info">Open Prescription</Button>
                        </CardBody>
                        <Modal isOpen={this.state.modal[prescription.prescription_id]} toggle={() => this.toggle(prescription.prescription_id)} fullscreen>
                            <ModalHeader toggle={() => this.toggle(prescription.prescription_id)}>Prescription ID: {prescription.prescription_id}</ModalHeader>
                            <ModalBody>
                                <ModalBody>
                                    <Card style={{ border: '1px solid #000', boxShadow: '0px 4px 8px 0px rgba(0,0,0,0.2)' }}>
                                        <Card style={{ border: 'none' }}>
                                            <CardBody>
                                                <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Doctor Information</div>
                                                <CardSubtitle tag="h6" className="mb-2 text-muted">Name: {prescription.doctor.doctor_name}</CardSubtitle>
                                            </CardBody>
                                        </Card>
                                        <hr />
                                        <Card style={{ border: 'none' }}>
                                            <CardBody>
                                                <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Complaints</div>
                                                <CardSubtitle tag="h6" className="mb-2 text-muted" style={{ marginBottom: '30px' }}>{prescription.complaints}</CardSubtitle>
                                            </CardBody>
                                        </Card>

                                        <Card style={{ border: 'none' }}>
                                            <CardBody>
                                                <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Vitals</div>
                                                <CardSubtitle tag="h6" className="mb-2 text-muted">Pulse Rate: {prescription.pulse_rate}</CardSubtitle>
                                                <CardSubtitle tag="h6" className="mb-2 text-muted">BP: {prescription.bp}</CardSubtitle>
                                                <CardSubtitle tag="h6" className="mb-2 text-muted">Temp: {prescription.temp}</CardSubtitle>
                                                <CardSubtitle tag="h6" className="mb-2 text-muted">Weight: {prescription.weight}</CardSubtitle>
                                                <CardSubtitle tag="h6" className="mb-2 text-muted">Age: {prescription.age}</CardSubtitle>
                                            </CardBody>
                                        </Card>

                                        <Card style={{ border: 'none' }}>
                                            <CardBody>
                                                <div style={{ fontSize: '25px', fontWeight: 'bold', marginBottom: '20px' }}>Diagnosis</div>
                                                <CardSubtitle tag="h6" className="mb-2 text-muted">{prescription.diagnosis}</CardSubtitle>
                                            </CardBody>
                                        </Card>

                                        <Card style={{ border: 'none' }}>
                                            <CardBody>
                                                <div style={{ fontSize: '25px', fontWeight: 'bold', marginBottom: '20px' }}>R<sub>x</sub></div>
                                                <CardSubtitle tag="h6" className="mb-2 text-muted">{prescription.rx}</CardSubtitle>
                                            </CardBody>
                                        </Card>

                                        <Card style={{ border: 'none' }}>
                                            <CardBody>
                                                <div style={{ fontSize: '25px', fontWeight: 'bold', marginBottom: '20px' }}>Investigation</div>
                                                <CardSubtitle tag="h6" className="mb-2 text-muted">{prescription.investigation}</CardSubtitle>
                                            </CardBody>
                                        </Card>

                                        <Card style={{ border: 'none' }}>
                                            <CardBody>
                                                <div style={{ fontSize: '25px', fontWeight: 'bold', marginBottom: '20px' }}>Lifestyle</div>
                                                <CardSubtitle tag="h6" className="mb-2 text-muted">{prescription.lifestyle}</CardSubtitle>
                                            </CardBody>
                                        </Card>
                                    </Card>
                                </ModalBody>

                                {this.state.selectedPrescription === prescription.prescription_id && !this.state.confirmation[prescription.prescription_id] && !this.state.updatedPrescriptions.includes(prescription.prescription_id) && (
                                    <Card style={{ border: 'none' }}>
                                        <CardBody>
                                            <div style={{ fontSize: '25px', fontWeight: 'bold', marginBottom: '20px' }}>Confirmation</div>
                                            <Button color="primary" onClick={this.toggleConfirmModal}>Update Confirmation</Button>
                                        </CardBody>
                                    </Card>
                                )}
                
                                <Modal isOpen={this.state.confirmModalOpen} toggle={this.toggleConfirmModal}>
                                    <ModalHeader toggle={this.toggleConfirmModal}>Confirmation</ModalHeader>
                                    <ModalBody>
                                        Do you want to confirm?
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={this.handleConfirm}>Yes</Button>
                                        <Button color="secondary" onClick={this.toggleConfirmModal}>No</Button>
                                    </ModalFooter>
                                </Modal>

                            </ModalBody>
                        </Modal>
                    </Card>
                ))}
            <Modal isOpen={this.state.modalOpen} toggle={this.closeModal}>
                <ModalBody>
                    {this.state.modalMessage}
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.closeModal}>OK</Button>
                </ModalFooter>
            </Modal>
        </div>

        );
    }


}
export default StudentBooklet;