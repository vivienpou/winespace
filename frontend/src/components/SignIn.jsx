import React, { Component } from 'react';
import {
  Button, Form, Col, Row, Container,
} from 'reactstrap';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import './SignIn.scss';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Modale from './Modale';
import { API_SERVER } from '../constants';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: '',
      email: '',
      password: '',
      modal2: false,
      modal1: false,
    };
    this.toggle = this.toggle.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggle2 = this.toggle2.bind(this);
  }

  componentDidMount() {
    const height = window.innerHeight;
    this.setState({
      height,
    });
    const { modal1 } = this.state;
    const { history, location: { state } } = this.props;
    if (state && state.redirect) {
      this.setState({ modal1: !modal1 }, () => {
        // #FIX fix bug, when refresh page after redirect
        // state is not cleared
        delete state.redirect;
        history.replace({ ...history.location, state });
      });
    } else {
      this.setState({ modal1: false });
    }
    this.toggle2();
  }

handleChange = (event) => {
  this.setState({
    [event.target.id]: event.target.value,
  });
}

handleSubmit = (e) => {
  e.preventDefault();
  const { history } = this.props;
  const { email, password } = this.state;
  const data = { email, password };
  const {
    modal2,
  } = this.state;
  fetch(`${API_SERVER}/signin`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then((res) => {
      localStorage.setItem('myToken', res.token);
      localStorage.setItem('myRole', res.user.isAdmin);
    })
    .then(() => {
      if (localStorage.getItem('myToken') !== null) {
        history.push('/admin-wine-list');
      } else {
        this.setState({ modal2: !modal2 });
        setTimeout(
          this.toggle,
          2000,
        );
      }
    });
}

toggle() {
  this.setState({
    modal2: false,
  });
}

toggle2() {
  setTimeout(() => this.setState({
    modal1: false,
  }), 2000);
}


validateForm() {
  const { email, password } = this.state;
  return email.length > 0 && password.length > 0;
}

render() {
  const {
    height,
    email,
    password,
    modal1,
    modal2,
  } = this.state;

  return (
    <Container
      fluid
      className="SignIn"
      style={{ minHeight: height }}
    >
      <Modale isOpen={modal2} texte="Mot de passe ou utilisateur incorrect" className="modal-SignIn1" />
      <Modale isOpen={modal1} texte="Vous avez été enregistré" className="modal-SignIn2" />
      <Row style={{ minHeight: height }}>
        <Col className="form_left" lg={4} md={6} sm={12}>
          <div className="logo_winespace_pageone">
            <img
              className="logo_winespace mt-5"
              src="./images/Logo.png"
              alt="lelogo"
            />
          </div>
          <div className="form_left_div">
            <Form className="connection" onSubmit={this.handleSubmit}>
              <Col className="GroupConnectionPassword">
                <FormGroup className="formEmail" controlId="email">
                  <ControlLabel
                    for="labelEmail"
                    className="labelEmail"
                  >
                      ADRESSE MAIL
                  </ControlLabel>
                  <FormControl
                    autoFocus
                    className="inputEmail"
                    type="email"
                    value={email}
                    onChange={this.handleChange}
                    bsSize="sm"
                  />
                </FormGroup>
                <FormGroup controlId="password" className="formPassword ">
                  <ControlLabel
                    for="Password"
                    className="labelpassword"
                  >
                      MOT DE PASSE
                  </ControlLabel>
                  <FormControl
                    className="inputPassword"
                    value={password}
                    onChange={this.handleChange}
                    type="password"
                    bsSize="sm"
                  />
                </FormGroup>
              </Col>
              <div className="group_button">
                <Button
                  disabled={!this.validateForm()}
                  type="submit"
                  className="btn_connexion mt-5"
                  color="danger"
                >
                    CONNEXION
                </Button>
                <NavLink to="/sign-up" className="btn_inscription mt-5">
                  INSCRIPTION
                </NavLink>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
}

function mstp(state) {
  return {
    email: state.email,
    password: state.password,
    modal2: state.modal2,
  };
}

export default connect(mstp)(SignIn);
