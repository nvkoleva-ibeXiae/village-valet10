import React, {Component} from 'react';
import {connect} from "react-redux";
import firestore from "../../modules/firestore.js";

import {LoadScript} from "@react-google-maps/api";

import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import SelectRider from "./SelectRider";
import RideInformation from "./RideInformation";
import SelectDriver from "./SelectDriver";
import Confirmation from "./Confirmation";

const PAGE_MAX = 3;

class Scheduler extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scheduler_page: 0,
            error_message: "",
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validate = this.validate.bind(this);
    }

    handleSubmit() {
        if (window.confirm("Are you sure you want to schedule this ride for " + this.props.active_ride.rider.first_name + " " + this.props.active_ride.rider.last_name + " on " + this.props.active_ride.ride_data.date)) {
            firestore.collection("rides").add(this.props.active_ride)
                .then((docRef) => {
                    this.props.addRide(this.props.active_ride, docRef.id);
                    if (this.props.active_ride.ride_data.meta.return === false && window.confirm("Would you like to schedule a return ride for " + this.props.active_ride.rider.first_name + " " + this.props.active_ride.rider.last_name + " on " + this.props.active_ride.ride_data.date)) {
                        this.props.returnRide();
                        this.setState({scheduler_page : 1});
                    }
                    else {
                        this.props.clearRide();
                        //This is part of react-router and allows forced page routing
                        this.props.history.push('/Dashboard');
                    }
                });
        }
    }

    changePage(increment) {
        if (increment <= 0 || this.validate()) {
            let proposed_page = this.state.scheduler_page + increment;
            //Handle minimum
            if (proposed_page < 0) proposed_page = 0;

            //Handle highest page number
            if (proposed_page > 3) proposed_page = 3;

            this.setState({scheduler_page: proposed_page, error_message: ""});
        } else {
            document.body.scrollTop = 0; // For Safari
            document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        }
    }

    showPage() {
        switch (this.state.scheduler_page) {
            case 0: //Rider
                return (<SelectRider/>);
            case 1: //Info
                return (
                    <LoadScript
                        id="script-loader"
                        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_TOKEN}
                        libraries={["places"]}
                    >
                        <RideInformation/>
                    </LoadScript>
                );
            case 2: //Driver
                return (<SelectDriver/>);
            case 3: //Confirm
                return (<Confirmation/>);
            default:
                return (<SelectRider/>);
        }
    }

    validate() {
        switch (this.state.scheduler_page) {
            case 0:
                //Need to select a rider
                if (this.props.active_ride.rider.id === "") {
                    this.setState({error_message: "Please select a rider."});
                    return false;
                }
                return true;
            case 1:
                //Need to specify a date
                if (this.props.active_ride.ride_data.date === "") {
                    this.setState({error_message: "INVALID DATE: Please provide a date."});
                    return false;
                } else if (new Date(this.props.active_ride.ride_data.date) + 1 <= (Date.now() + 6.04e+8)) {
                    this.setState({error_message: "INVALID DATE: Rides must be scheduled at least one (1) week in advance."});
                    return false;
                } else if (new Date(this.props.active_ride.ride_data.date) >= (Date.now() + (6.04e+8 * 4))) {
                    this.setState({error_message: "INVALID DATE: Rides must be scheduled no more than four (4) weeks in advance."});
                    return false;
                }
                //Add additional validation!
                return true;
            case 2:
                //Need to pick a driver
                if (this.props.active_ride.driver.id === "") {
                    this.setState({error_message: "INVALID DATE: Please select a driver."});
                    return false;
                }
                return true;
            case 3:
                return false;
            default:
                return false;
        }
    }

    render() {
        return (
            <Container style={{minWidth: "100%"}}>
                {this.state.error_message ? <Alert variant="danger">{this.state.error_message}</Alert> : null}
                {this.showPage()}
                <Row style={{
                    textAlign: "center",
                    position: "fixed",
                    left: "0",
                    bottom: "0",
                    height: "60px",
                    width: "100%",
                }}>
                    <Col></Col>
                    <Col>
                        {this.state.scheduler_page !== 0 ?
                            <Button variant="dark" disabled={this.state.scheduler_page === 0} size="lg" id="prev_button"
                                    onClick={() => {
                                        this.changePage(-1)
                                    }}>
                                PREV
                            </Button>
                            : null}
                    </Col>
                    <Col>
                        {this.state.scheduler_page === PAGE_MAX ?
                            <Button disabled={this.state.scheduler_page !== PAGE_MAX} size="lg" id="sched_submit_button"
                                    onClick={() => {
                                        this.handleSubmit()
                                    }}>
                                Submit Ride
                            </Button>
                            : null}
                    </Col>
                    <Col>
                        {this.state.scheduler_page !== PAGE_MAX ?
                            <Button variant="dark" size="lg" id="next_button" onClick={() => {
                                this.changePage(1)
                            }}>
                                NEXT
                            </Button>
                            : null}
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    active_ride: state.active_ride,
});

const mapDispatchToProps = dispatch => ({
    addRide: (user, id) => dispatch({
        type: "add_ride",
        payload: {...user, id: id}
    }),
    clearRide: () => dispatch({
        type: "clear_active_ride",
        payload: null
    }),
    returnRide: () => dispatch({
        type: "setup_return_ride",
        payload: null
    })
});

export default connect(mapStateToProps, mapDispatchToProps)(Scheduler);
