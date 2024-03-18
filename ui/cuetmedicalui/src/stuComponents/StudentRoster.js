import React, { Component } from "react";
import variables from './../variables';
import { Table, Alert } from 'reactstrap';

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
    if (hours >= 9 && hours < 15) {
        return 'Morning';
    } else if (hours >= 21 || hours < 9) {
        return 'Evening';
    } else {
        return 'Noon';
    }
}

export function getCurrentDayOfWeek() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
}


export class StudentRoster extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roster_id: 0,
            month: "",
            year: "",
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
                    console.log(dayslots); // Log the mapped dayslots array
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


    render() {
        const {
            rosters,

            groupedByDay,
            doctor: {
                doctor_id,
                doctor_name,
            },
            dayslot: {
                day,
                slot,
            },

        } = this.state;

        const now = new Date();
        const utcMonth = now.getUTCMonth() + 1;
        const utcYear = now.getUTCFullYear();
        const currentDayOfWeek = getCurrentDayOfWeek();
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

                </div>


                <Table bordered className="mt-3 mx-auto" style={{ maxWidth: '90%', textAlign: 'center' }}>
                    <thead>
                        <tr>

                            <th>Day</th>
                            <th>Slot</th>
                            <th>Doctor Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(groupedByDay).map((day, dayIndex) => (
                            <React.Fragment key={dayIndex}>
                                {groupedByDay[day].map((roster, rosterIndex) => {
                                    // Only render the roster if its month and year match the current UTC month and year
                                    if (roster.month === utcMonth && roster.year === utcYear) {
                                        return (
                                            <tr key={roster.roster_id}>

                                                <td>{day}</td>
                                                <td>{roster.dayslot.slot}</td>
                                                <td>{roster.doctor.doctor_name}</td>

                                            </tr>
                                        );
                                    }
                                })}
                            </React.Fragment>
                        ))}
                    </tbody>
                </Table>
            </div>
        )
    }

}
export default StudentRoster;

