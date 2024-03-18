import React, { Component } from 'react';
import variables from './../variables';
import { Link} from 'react-router-dom';
import { Button, Table, Modal, ModalHeader, ModalBody, FormGroup, Label, Input, ModalFooter, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export class Booklet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            booklet_id: 0,
            modalTitle: "",
            student: {
                id: "",
                first_name: "",
                last_name: "",
                department: "",
                phone: "",
                image: "",
                blood_group: "",
                hall_name: "",
                gender: "",
            },
            booklets: [],
            students: [],
            showModal: false,
            dropdownOpen: false,
            selectedBookletId: null,
            selectedBooklet: null,
            shouldNavigate: false,
            navigateFlag: false,
        }
    }

    refreshList() {
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

        fetch(variables.API_URL + 'user/')
            .then(response => response.json())
            .then(data => {
                if ('data' in data && Array.isArray(data.data)) {
                    const students = data.data.map(student => {
                        if (!student.is_staff && !student.is_superuser && student.verified) {
                            return {
                                id: student.id,
                                first_name: student.first_name,
                                last_name: student.last_name,
                                department: student.department,
                                phone: student.phone,
                                permanent_address: student.permanent_address,
                                blood_group: student.blood_group,
                                hall_name: student.hall_name,
                                room_no: student.room_no,
                                image: student.image,
                                gender: student.gender

                            };
                        }
                        return null;
                    }).filter(student => student !== null); // Remove undefined values
                    console.log(students);
                    this.setState({
                        students: students
                    });
                    console.log(this.state.students);
                } else {
                    console.error('Expected an object with a data property containing a single booklet object, but got ', data);
                }
            });
    }

    componentDidMount() {
        this.refreshList();
    }
    changeBookletId = (e) => {
        this.setState({ booklet_id: e.target.value })
    }

    toggle = () => {
        this.setState(prevState => ({
            showModal: !prevState.showModal
        }));
    };

    toggleDropdown = () => {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    };


    addClick = () => {
        this.setState({
            modalTitle: "Register Ebooklet",
            booklet_id: "",
        });
        this.toggle();
    }

    handleStudentSelection(selectedId) {
        this.setState({
            selectedStudentId: selectedId
        });
    }
    handleBookletClick = (booklet_id) => {
        this.setState({
            selectedBookletId: booklet_id,
            shouldNavigate: true,
        });
    }

    handleBookletSelection = (booklet) => {
        const student = this.state.students.find(student => student.id === booklet.student.id);
        this.setState({
            selectedBooklet: booklet,
            selectedStudent: student
        });
    }




    createClick = () => {
        fetch(variables.API_URL + 'ebooklet/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                booklet_id: this.state.booklet_id,
                student: this.state.selectedStudentId
            })
        })
            .then(res => res.json())
            .then(result => {
                alert(JSON.stringify(result));
                this.refreshList();
            }, (error) => {
                alert('Failed');
            })
    }



    deleteClick = (id) => {
        if (window.confirm('Are you sure?')) {
            fetch(variables.API_URL + 'ebooklet/' + id, {
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
            booklets,
            booklet_id,
            modalTitle,
            showModal,

        } = this.state;


        return (
            <div style={{ margin: '20px', padding: '20px' }}>
                <Button color="primary" className="float-end" onClick={this.addClick}>
                    Register E-booklet
                </Button>
                <Table striped style={{ marginTop: '20px' }}>
                    <thead>
                        <tr>
                            <th>Booklet Id</th>
                            <th>Student Id</th>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Phone</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {booklets.map(booklet => (
                            <tr key={booklet.booklet_id}>
                                <td>{booklet.booklet_id}</td>
                                <td>{booklet.student.id}</td>
                                <td>{booklet.student.first_name} {booklet.student.last_name}</td>
                                <td>{booklet.student.department}</td>
                                <td>{booklet.student.phone}</td>
                                <td>
                                    <td>
                                        <Link to={`/admin/PrescriptionForm?booklet_id=${booklet.booklet_id}`}>
                                            <Button outline color="primary">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                                                </svg>
                                            </Button>
                                        </Link>
                                    </td>
                                    <td>
                                        <Link to={`/admin/Prescriptions?booklet_id=${booklet.booklet_id}`}>
                                            <Button outline color="info">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                                                    <path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
                                                </svg>
                                            </Button>
                                        </Link>
                                    </td>

                                    <td> <Button outline color="danger" onClick={() => this.deleteClick(booklet.booklet_id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                                        </svg>
                                    </Button>
                                    </td>

                                    <td>
                                        <Button color="primary" onClick={() => this.handleBookletSelection(booklet)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                                        </svg></Button>
                                    </td>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <Modal isOpen={showModal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>{modalTitle}</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="bookletId">Booklet ID</Label>
                            <Input type="text" name="bookletId" id="bookletId" placeholder="e.g.B1804001" value={booklet_id} onChange={this.changeBookletId} />
                        </FormGroup>
                        <FormGroup>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Label for="studentId">Student ID</Label>
                                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
                                    <DropdownToggle caret color='light'>
                                        {this.state.selectedStudentId ? this.state.selectedStudentId : "Select Student ID"}
                                    </DropdownToggle>
                                    <DropdownMenu light>
                                        {this.state.students.filter(student => !this.state.booklets.some(booklet => booklet.student.id === student.id)).map((student) => (
                                            <DropdownItem key={student.id} onClick={() => this.handleStudentSelection(student.id)}>
                                                {student.id}
                                            </DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.createClick}>
                            Register
                        </Button>
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                


            </div>
        )
    }
}

export default Booklet;