import React, {Component} from "react";
import {connect} from "react-redux";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import MapContainer from "../google-maps/MapContainer";
import ProfileTable from "../profiles/ProfileTable";

class SelectDriver extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search_term: "",
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event){
        this.setState({search_term: event.target.value})
    };



    render() {
        return (
            <Container className="SelectDriver" style={{minWidth: "100%"}}>
                <h1>Select Driver</h1>
                <Form>
                    <Form.Group as={Row}>
                        <Col>
                            <Form.Control type="search" id="search" placeholder="Search" onChange={this.handleChange}/>
                        </Col>
                    </Form.Group>
                </Form>
                <hr/>
                <ProfileTable search_term={this.state.search_term} mode={ "driver"}/>
                <Row>
                    <Col>
                        <MapContainer>Trip Summary</MapContainer>
                    </Col>
                    <Col>
                        <Row>
                            <Col>Driver:</Col>
                            <Col>{`${this.props.active_ride.driver.first_name}`} {`${this.props.active_ride.driver.last_name}`}</Col>
                        </Row>
                        <Row>
                            <Col>Select Vehicle:</Col>
                            <Col>

                            </Col>
                        </Row>
                        <Row>
                            <Col>Trip Duration:</Col>
                            <Col>{`${this.props.active_ride.ride_data.time_total}`}</Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    active_ride: state.active_ride,
    users: state.users
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectDriver);
