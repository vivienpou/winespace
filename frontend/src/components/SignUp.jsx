import React, { Component } from 'react';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  Row,
  Container,
  Alert,
} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import './SignUp.scss';
import { API_SERVER } from '../constants';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: '',
      firstname: '',
      lastname: '',
      mail: '',
      pwd: '',
      confirmPwd: '',
      certification: false,
      visibleEmptyField: false,
      visiblePwd: false,
      visibleAge: false,
      visibleMailDouble: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onDismissEmptyField = this.onDismissEmptyField.bind(this);
    this.onDismissPwd = this.onDismissPwd.bind(this);
    this.onDismissAge = this.onDismissAge.bind(this);
    this.onDismissMailDouble = this.onDismissMailDouble.bind(this);
  }

  componentDidMount() {
    const height = window.innerHeight;
    this.setState({
      height,
    });
  }

  onDismissEmptyField() {
    this.setState({ visibleEmptyField: false });
  }

  onDismissPwd() {
    this.setState({ visiblePwd: false });
  }

  onDismissAge() {
    this.setState({ visibleAge: false });
  }

  onDismissMailDouble() {
    this.setState({ visibleMailDouble: false });
  }

  handleChange(e) {
    const { certification } = this.state;
    if (e.target.id === 'certification') {
      const certif = !certification;
      this.setState({
        [e.target.id]: certif,
      });
    } else {
      this.setState({
        [e.target.id]: e.target.value,
      });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const { history } = this.props;
    const {
      lastname,
      firstname,
      mail,
      pwd,
      confirmPwd,
      certification,
    } = this.state;
    const data = {
      lastname,
      firstname,
      email: mail,
      password: pwd,
    };
    if ((pwd === confirmPwd) && (certification) && (lastname !== '') && (firstname !== '') && (mail !== '') && (pwd !== '')) {
      fetch(`${API_SERVER}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((datab) => {
          if (!datab.ok) {
            this.setState({
              visibleMailDouble: true,
            });
            setTimeout(() => this.setState({ visibleMailDouble: false }), 2000);
          } else {
            history.push({
              pathname: '/',
              state: { redirect: true },
            });
          }
        });
    } else if ((lastname === '') && (firstname === '') && (mail === '') && (pwd === '')) {
      // error field empty
      this.setState({
        visibleEmptyField: true,
      });
      setTimeout(() => this.setState({ visibleEmptyField: false }), 2000);
    } else if (pwd !== confirmPwd) {
      // error confirm password
      this.setState({
        visiblePwd: true,
      });
      setTimeout(() => this.setState({ visiblePwd: false }), 2000);
    } else if (!certification) {
      // erreur certification
      this.setState({
        visibleAge: true,
      });
      setTimeout(() => this.setState({ visibleAge: false }), 2000);
    }
  }

  render() {
    const {
      height,
      visibleEmptyField,
      visiblePwd,
      visibleAge,
      visibleMailDouble,
    } = this.state;

    return (
      <Container fluid className="SignUp" style={{ minHeight: height }}>
        <Alert color="danger" isOpen={visibleEmptyField} toggle={this.onDismissEmptyField} className="mt-5 text-center awp">
          Veuillez remplir tous les champs.
        </Alert>
        <Alert color="danger" isOpen={visiblePwd} toggle={this.onDismissPwd} className="mt-5 text-center awp">
          Les mots de passe saisis sont différents.
        </Alert>
        <Alert color="danger" isOpen={visibleAge} toggle={this.onDismissAge} className="mt-5 text-center awp">
          Veuillez certifier avoir plus de 18 ans.
        </Alert>
        <Alert color="danger" isOpen={visibleMailDouble} toggle={this.onDismissMailDouble} className="mt-5 text-center awp">
          Cette adresse mail est déjà utilisée.
        </Alert>
        <Row style={{ minHeight: height }}>
          <Col className="form_left" lg={5} md={6} sm={12}>
            <div>
              <img
                className="logo_winespace"
                src="./images/Logo.png"
                alt="the_logo"
              />
            </div>
            <div className="form_left_wrap">
              <Form className="SignUpAll" onSubmit={this.handleSubmit}>
                <Col className="form">
                  <h5 className="form_title" color="danger">
                    CREER UN COMPTE
                  </h5>
                  <FormGroup className="form_prenom mb-2 mr-sm-2 mb-sm-0">
                    <Label for="exampleName" className="form_tags mr-sm-2 mt-2">
                      PRENOM *
                    </Label>
                    <Input
                      className="form_input"
                      type="text"
                      name="firstname"
                      id="firstname"
                      bsSize="sm"
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                  <FormGroup className="form_nom mb-2 mr-sm-2 mb-sm-0">
                    <Label
                      for="exampleLastname"
                      className="form_tags mr-sm-2 mt-2"
                    >
                      NOM *
                    </Label>
                    <Input
                      className="form_input"
                      type="text"
                      name="lastname"
                      id="lastname"
                      bsSize="sm"
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                  <FormGroup className="fieldmail mb-2 mr-sm-2 mb-sm-0">
                    <Label
                      for="exampleEmail"
                      className="form_tags mr-sm-2 mt-2"
                    >
                      ADRESSE MAIL *
                    </Label>
                    <Input
                      className="form_input"
                      type="email"
                      name="email"
                      id="mail"
                      bsSize="sm"
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                  <FormGroup className="formpassword mb-2 mr-sm-2 mb-sm-0 mt-2">
                    <Label
                      for="examplePassword"
                      className="form_tags labelpassword mr-sm-2"
                    >
                      MOT DE PASSE *
                    </Label>
                    <Input
                      className="form_input"
                      type="password"
                      name="pwd"
                      id="pwd"
                      bsSize="sm"
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                  <FormGroup className="confirm_password mb-2 mr-sm-2 mb-sm-0">
                    <Label
                      for="confirmPassword"
                      className="form_tags mr-sm-2 mt-2"
                    >
                      CONFIRMATION MOT DE PASSE *
                    </Label>
                    <Input
                      className="form_input"
                      type="password"
                      name="confirmPwd"
                      id="confirmPwd"
                      bsSize="sm"
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                  <FormGroup className="check" check>
                    <Label check>
                      <Input
                        type="checkbox"
                        id="certification"
                        onChange={this.handleChange}
                      />
                      {' '}
                      Je certifie avoir plus de 18 ans
                    </Label>
                  </FormGroup>
                  <div className="group_button">
                    <Button className="btn_inscription" color="danger">
                      INSCRIPTION
                    </Button>
                  </div>
                  <NavLink to="/" className="btn_connexion">
                    CONNEXION
                  </NavLink>
                </Col>
              </Form>
            </div>
            <div className="termes">
              <p>
                En créant un compte j&apos;accepte les
                {' '}
                <a href="https://www.winespace.fr/cgu_winespace.pdf">
                  Conditions Générales
                </a>
                {' '}
                de WineSPACE
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default SignUp;
