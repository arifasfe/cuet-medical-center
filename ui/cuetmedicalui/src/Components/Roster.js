import React, { Component } from "react";
import variables from './../variables';
import { Button, Popover, PopoverBody, Alert, Table, Modal, ModalHeader, ModalBody, FormGroup, Label, Input, ModalFooter, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';


function getMonthName() {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const d = new Date();
    return months[d.getUTCMonth()];
}

export function getCurrentTimeSlot() {
    const hours = new Date().getHours();
    if (hours >= 21 || hours < 9) {
        return 'Evening';
    } else if (hours >= 9 && hours < 15) {
        return 'Morning';
    } else {
        return 'Noon';
    }
}

export function getCurrentDayOfWeek() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
}

export class Roster extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roster_id: 0,
            month: "",
            year: "",
            modalTitle: "",
            doctor: {
                doctor_id: "",
                doctor_name: "",
            },
            rosters: [],
            groupedByDay: {},
            dayslot: {
                day: "",
                slot: "",
            },
            doctors: [],
            dayslots: [],
            showModal: false,
            dropdownOpenDoctor: false,
            dropdownOpenDayslot: false
        }
    }
    refreshList() {

        fetch(variables.API_URL + 'roster/')
            .then(response => response.json())
            .then(data => {
                if ('data' in data && Array.isArray(data.data)) {
                    // Group the rosters by day
                    const groupedByDay = data.data.reduce((acc, roster) => {
                        const day = roster.dayslot.day;
                        if (!acc[day]) {
                            acc[day] = [];
                        }
                        acc[day].push(roster);
                        return acc;
                    }, {});

                    this.setState({
                        rosters: data.data,
                        groupedByDay: groupedByDay // Store the grouped rosters in the state
                    });
                } else {
                    console.error('Expected an object with a data property containing an array, but got ', data);
                }
            });


        fetch(variables.API_URL + 'dayslot/')
            .then(response => response.json())
            .then(data => {
                if ('data' in data && Array.isArray(data.data)) {
                    const dayslots = data.data.map(dayslot => {
                        return {
                            id: dayslot.id,
                            day: dayslot.day,
                            slot: dayslot.slot
                        };
                    });
                    console.log(dayslots);
                    this.setState({
                        dayslots: dayslots
                    });
                } else {
                    console.error('Expected an object with a data property containing an array of dayslot objects, but got ', data);
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
                    console.log(doctors);
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
    }
    changeRosterId = (e) => {
        this.setState({ roster_id: e.target.value })
    }
    changeMonth = (e) => {
        this.setState({ month: e.target.value })
    }
    changeYear = (e) => {
        this.setState({ year: e.target.value })
    }
    toggle = () => {
        this.setState(prevState => ({
            showModal: !prevState.showModal
        }));
    };

    toggleDropdownDoctor = () => {
        this.setState(prevState => ({
            dropdownOpenDoctor: !prevState.dropdownOpenDoctor
        }));
    };

    toggleDropdownDayslot = () => {
        this.setState(prevState => ({
            dropdownOpenDayslot: !prevState.dropdownOpenDayslot
        }));
    };


    addClick = () => {
        this.setState({
            modalTitle: "Add Roster",
            roster_id: "",
            month: "",
            year: "",
            selectedDoctorId: "",
            selectedDayslotId: ""
        });
        this.toggle();
    }

    handleDoctorSelection(selectedId) {
        this.setState({
            selectedDoctorId: selectedId
        });
    }

    handleDayslotSelection(selectedId) {
        this.setState({
            selectedDayslotId: selectedId
        });
    }



    createClick = () => {
        const url = `${variables.API_URL}roster/?month=${this.state.month}&year=${this.state.year}&doctor=${this.state.selectedDoctorId}&dayslot=${this.state.selectedDayslotId}`;

        // Making GET request to the roster API
        fetch(url)
            .then(res => res.json())
            .then(result => {
                if (result.length > 0) {
                    alert('Roster already exists.');
                    return;
                }

                // Making POST request to create a new roster
                fetch(variables.API_URL + 'roster/', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        roster_id: this.state.roster_id,
                        month: this.state.month,
                        year: this.state.year,
                        doctor: this.state.selectedDoctorId,
                        dayslot: this.state.selectedDayslotId
                    })
                })
                    .then(res => res.json())
                    .then(result => {
                        alert('Roster entry added Successfully!');
                        this.refreshList();
                    }, (error) => {
                        alert('Roster entry Failed');
                    })
            })
    }

    groupByDay(rosters) {
        return rosters.reduce((groups, roster) => {
            const day = roster.dayslot.day;
            if (!groups[day]) {
                groups[day] = [];
            }
            groups[day].push(roster);
            return groups;
        }, {});
    }

    deleteClick(id) {
        if (window.confirm('Are you sure?')) {
            fetch(variables.API_URL + 'roster/' + id, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(result => {
                    alert('Roster entry deleted successfully!');
                    this.refreshList();

                }, (error) => {
                    alert('Roster entry deletion Failed');
                })
        }
    }


    render() {
        const {
            rosters,
            modalTitle,
            groupedByDay,
            roster_id,
            month,
            year,
            doctors,
            dayslots,
            showModal,
            doctor: {
                doctor_id,
                doctor_name,
            },
            dayslot: {
                day,
                slot,
            },
            selectedDoctorId,
            selectedDayslotId
        } = this.state;



        const now = new Date();
        const utcMonth = now.getUTCMonth() + 1;
        const utcYear = now.getUTCFullYear();
        const currentDayOfWeek = getCurrentDayOfWeek();
        const currentTimeSlot = getCurrentTimeSlot();
        const currentDoctor = this.state.rosters.find(roster => roster.dayslot.day === currentDayOfWeek && roster.dayslot.slot === getCurrentTimeSlot());


        return (
            <div>
                <div color="secondary" className="mt-3 mx-auto" style={{ maxWidth: '80%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Alert color="primary" className="float-start">
                            Doctor Roster:<h4> {getMonthName(rosters[0]?.month)} </h4>
                        </Alert>
                        <Alert color="info " className="float-start">
                            Current Day:<h4> {currentDayOfWeek} </h4>
                        </Alert>
                        <Alert color="info" className="float-start">
                            Current Time Slot: <h4>{getCurrentTimeSlot()}</h4>
                        </Alert>
                        <Alert color="success" className="float-start">
                            Doctor on Duty: <h4>{currentDoctor ? currentDoctor.doctor.doctor_name : 'No Doctor Assigned'}</h4>
                        </Alert>
                        <Alert color="dark" className="float-end">
                            Time Slots: <h6> Morning(9:00-15:00)</h6><h6>Noon(15:00-21:00)</h6><h6>Evening(21:00-9:00)</h6>
                        </Alert>
                    </div>
                    <Button color="primary" className="float-end" onClick={this.addClick}>
                        Update Roster
                    </Button>
                </div>

                <div className="mt-3 mx-auto" style={{ maxWidth: '90%' }}>

                    <Table bordered className="mt-3 mx-auto" style={{ maxWidth: '90%', textAlign: 'center' }}>
                        <thead>
                            <tr>

                                <th>Day</th>
                                <th>Slot</th>
                                <th>Doctor Name</th>
                                <th>Options</th>
                            </tr>
                        </thead>
                        <tbody>

                            {Object.keys(groupedByDay).map((day, dayIndex) => (
                                <React.Fragment key={dayIndex}>
                                    {groupedByDay[day].map((roster, rosterIndex) => {
                                        if (roster.month === utcMonth && roster.year === utcYear) {
                                            return (
                                                <tr key={roster.roster_id}>

                                                    <td>{day}</td>
                                                    <td>{roster.dayslot.slot}</td>
                                                    <td>{roster.doctor.doctor_name}</td>
                                                    <td>
                                                        <Button outline color="danger" onClick={() => this.deleteClick(roster.roster_id)}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                                                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                                                            </svg>
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    })}
                                </React.Fragment>
                            ))}

                        </tbody>
                    </Table>


                </div>

                <Modal isOpen={showModal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Add Roster</ModalHeader>

                    <ModalBody>
                        <FormGroup>
                            <Label for="month">Month</Label>
                            <Input type="select" name="month" id="month" value={this.state.month} onChange={this.changeMonth}>
                                <option value="">Select Month</option>
                                <option value="1">January</option>
                                <option value="2">February</option>
                                <option value="3">March</option>
                                <option value="4">April</option>
                                <option value="5">May</option>
                                <option value="6">June</option>
                                <option value="7">July</option>
                                <option value="8">August</option>
                                <option value="9">September</option>
                                <option value="10">October</option>
                                <option value="11">November</option>
                                <option value="12">December</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="year">Year</Label>
                            <Input type="number" name="year" id="year" value={this.state.year} onChange={this.changeYear} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="doctor">Doctor</Label>
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
                        </FormGroup>
                        <FormGroup>
                            <Label for="dayslot">Day Slot</Label>
                            <Dropdown isOpen={this.state.dropdownOpenDayslot} toggle={this.toggleDropdownDayslot}>
                                <DropdownToggle caret>
                                    {this.state.selectedDayslotId ? this.state.selectedDayslotId : "Select Day Slot"}
                                </DropdownToggle>
                                <DropdownMenu>
                                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                        {this.state.dayslots.map((dayslot) => (
                                            <DropdownItem key={dayslot.id} onClick={() => this.handleDayslotSelection(dayslot.id)}>
                                                {dayslot.day}-{dayslot.slot}
                                            </DropdownItem>
                                        ))}
                                    </div>
                                </DropdownMenu>
                            </Dropdown>
                        </FormGroup>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.createClick}>Save</Button>
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>


            </div>
        )

    }
}
export default Roster;