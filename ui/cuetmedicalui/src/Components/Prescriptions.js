import React, { Component} from 'react';
import { Button, Table, Modal, ModalHeader, ModalBody, Alert, ModalFooter, Badge, Card, CardBody, CardTitle, CardSubtitle } from 'reactstrap';
import variables from './../variables';
export class Prescriptions extends Component {
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
            confirmation: "",
            doctor: {
                doctor_id: "",
                doctor_name: "",
            },
            booklet: {
                booklet_id: "",
            },
            booklets: [],
            doctors: [],
            prescriptions: [],
            confirmation: false,
            modal: {},
            hover: false,
            hoverId: null,
            selectedBookletId: null,
            filteredPrescriptions: [],
        };
        this.toggle = this.toggle.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
    }


    refreshList() {
        fetch(variables.API_URL + 'prescription/')
            .then(response => response.json())
            .then(data => {
                if ('data' in data && Array.isArray(data.data)) {
                    console.log(data)
                    let sortedData = data.data.sort((a, b) => {
                        const dateA = new Date(a.date_time).getTime();
                        const dateB = new Date(b.date_time).getTime();
                        return dateB - dateA;
                    });
                    this.setState({
                        prescriptions: sortedData
                    });
                    console.log(this.state.prescriptions);
                } else {
                    console.error('Expected an object with a data property containing a single booklet object, but got ', data);
                }
            });

        fetch(variables.API_URL + 'ebooklet/')
            .then(response => response.json())
            .then(data => {
                if ('data' in data && Array.isArray(data.data)) {
                    this.setState({
                        booklets: data.data,
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

    

    toggle(prescription_id) {
        this.setState(prevState => ({
            modal: { ...prevState.modal, [prescription_id]: !prevState.modal[prescription_id] }
        }));
    }
    handleMouseEnter(prescription_id) {
        this.setState({ hover: true, hoverId: prescription_id });
    }

    handleMouseLeave() {
        this.setState({ hover: false, hoverId: null });
    }

    render() {
        const params = new URLSearchParams(window.location.search);
        const booklet_id = params.get('booklet_id');

        const filteredPrescriptions = this.state.prescriptions.filter(prescription => prescription.booklet?.booklet_id === booklet_id);

        if (filteredPrescriptions.length === 0) {
            return <div>No prescriptions found for this booklet ID.</div>;
        }
        return (
            <div className="mt-3 mx-auto" style={{ maxWidth: '90%' }}>
                <Alert color="info">
                    <h3>Prescription history of Booklet ID: {filteredPrescriptions[0]?.booklet?.booklet_id}</h3>
                </Alert>
                
                {filteredPrescriptions.map((prescription, index) => (
                <Card key={index}
                     onClick={() => this.toggle(prescription.prescription_id)} 
                     onMouseEnter={() => this.handleMouseEnter(prescription.prescription_id)} 
                     onMouseLeave={this.handleMouseLeave} 
                     style={{ position:"relative", backgroundColor: '#FAFAFA', borderRadius: '5px', marginBottom: '10px', transform: this.state.hover && this.state.hoverId === prescription.prescription_id ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.3s ease-in-out' }}>
                        {prescription.confirmation ? 
                            <Badge color="success" style={{ position: 'absolute', top: '10px', right: '10px' }}>Confirmed</Badge> : 
                            <Badge color="danger" style={{ position: 'absolute', top: '10px', right: '10px' }}>Not Confirmed</Badge>
                        }
                    <CardBody>
                        <CardTitle tag="h5">Prescription {prescription.prescription_id}</CardTitle>
                        <CardSubtitle tag="h6" className="mb-2 text-muted">Ebooklet ID: {prescription.booklet?.booklet_id}</CardSubtitle>

                        <Button outline color="info">Open Prescription</Button>
                    </CardBody>
                    <Modal isOpen={this.state.modal[prescription.prescription_id]} toggle={() => this.toggle(prescription.prescription_id)} fullscreen>
                        <ModalHeader toggle={() => this.toggle(prescription.prescription_id)}>Prescription</ModalHeader>
                        <ModalBody>
                            <Table striped>
                                <tbody>
                                <tr>
                                        <th>Prescription ID</th>
                                        <td>{prescription.doctor.doctor_name}</td>
                                    </tr>
                                    <tr>
                                        <th>Prescription ID</th>
                                        <td>{prescription.prescription_id}</td>
                                    </tr>
                                    <tr>
                                        <th>Complaints</th>
                                        <td>{prescription.complaints}</td>
                                    </tr>
                                    <tr>
                                        <th>Diagnosis</th>
                                        <td>{prescription.diagnosis}</td>
                                    </tr>
                                    <tr>
                                        <th>Rx</th>
                                        <td>{prescription.rx}</td>
                                    </tr>
                                    <tr>
                                        <th>Investigation</th>
                                        <td>{prescription.investigation}</td>
                                    </tr>
                                    <tr>
                                        <th>Lifestyle</th>
                                        <td>{prescription.lifestyle}</td>
                                    </tr>
                                    <tr>
                                        <th>Last Checkup ID</th>
                                        <td>{prescription.last_checkup_id}</td>
                                    </tr>
                                    <tr>
                                        <th>Pulse Rate (bpm)</th>
                                        <td>{prescription.pulse_rate}</td>
                                    </tr>
                                    <tr>
                                        <th>BP(mmHg)</th>
                                        <td>{prescription.bp}</td>
                                    </tr>
                                    <tr>
                                        <th>Temperature (Fahrenheit)</th>
                                        <td>{prescription.temp}</td>
                                    </tr>
                                    <tr>
                                        <th>Weight (kg)</th>
                                        <td>{prescription.weight}</td>
                                    </tr>
                                    <tr>
                                        <th>Age</th>
                                        <td>{prescription.age}</td>
                                    </tr>
                                    <tr>
                                    <th>Confirmation</th>
                                        <td>
                                            {prescription.confirmation ? 
                                                <Badge color="success">Confirmed</Badge> : 
                                                <Badge color="danger">Not Confirmed</Badge>
                                            }
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </ModalBody>
                        <ModalFooter>
                            
                            <Button color="secondary" onClick={() => this.toggle(prescription.prescription_id)}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </Modal>
                </Card>
            ))}
            </div>

        );
    }
}

export default Prescriptions;
