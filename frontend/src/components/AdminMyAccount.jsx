/* This component is displayed on the website with
Mon compte > Espace Administrateur > Gérer les comptes;
This component is a parent of AdminUserTable */
import React, { Component } from 'react';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  Container,
  Alert,
} from 'reactstrap';
import { API_SERVER } from '../constants';
import './AdminMyAccount.scss';
import AdminUserTable from './AdminUserTable';

class AdminMyAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: '',
      prenom: '',
      nom: '',
      mail: '',
      mdp: '',
      confirmMdp: '',
      visibleMdp: false,
      visibleMailDouble: false,
      visibleSuccess: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onDismissMdp = this.onDismissMdp.bind(this);
    this.onDismissMailDouble = this.onDismissMailDouble.bind(this);
    this.onDismissSuccess = this.onDismissSuccess.bind(this);
  }

  componentDidMount() {
    /* on every page, you will find it, to adapt the height of the page,
    we use it in the main div as a style properties */
    const height = window.innerHeight;
    this.setState({
      height,
    });
  }

  // The 3 followed methods are linked to the alert in the render.

  onDismissMdp() {
    this.setState({ visibleMdp: false });
  }

  onDismissMailDouble() {
    this.setState({ visibleMailDouble: false });
  }

  onDismissSuccess() {
    this.setState({ visibleSuccess: false });
  }

  handleChange(e) {
    this.setState({
      [e.target.id]: e.target.value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const {
      nom, prenom, mail, mdp, confirmMdp,
    } = this.state;
    const data = {
      lastname: nom,
      firstname: prenom,
      email: mail,
      password: mdp,
    };
    if (mdp === confirmMdp) {
      fetch(`${API_SERVER}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then((datab) => {
        if (!datab.ok) {
          this.setState({
            visibleMailDouble: true,
          });
        } else if (datab.ok) {
          this.setState({
            visibleSuccess: true,
          });
        }
      });
    } else if (mdp !== confirmMdp) {
      this.setState({ visibleMdp: true });
    }
  }

  render() {
    // this is destructuring state, we do the same for props in React.
    const {
      height,
      visibleMdp,
      visibleMailDouble,
      visibleSuccess,
    } = this.state;
    return (
      <div className="AdminMyAccount" style={{ minHeight: height }}>
        <div className="alert-wrong-password-wrap">
          <Alert
            color="danger"
            isOpen={visibleMdp}
            toggle={this.onDismissMdp}
            className="text-center alert-wrong-password"
          >
            Les mots de passe saisis sont différents.
          </Alert>
        </div>
        <div className="alert-wrong-password-wrap">
          <Alert
            color="danger"
            isOpen={visibleMailDouble}
            toggle={this.onDismissMailDouble}
            className="text-center alert-wrong-password"
          >
            Cette adresse mail est déjà utilisée.
          </Alert>
        </div>
        <div className="alert-add-success-wrap">
          <Alert
            color="success"
            isOpen={visibleSuccess}
            toggle={this.onDismissSuccess}
            className="text-center alert-add-success"
          >
            Utilisateur ajouté avec succès
          </Alert>
        </div>
        <Container fluid className="AdminMyAccount" style={{ minHeight: height }}>
          <h1 className="title-admin-my-account">
            <i className="fas fa-user" />
            {' '}
            Gestion des droits d&apos;accès
          </h1>
          <AdminUserTable />
          <div className="form_left_wrap">
            <Form className="register" onSubmit={this.handleSubmit}>
              <Col className="form">
                <h2 className="form_title">
                  <i className="fas fa-user-plus" />
                  {' '}
                  Créer un nouvel utilisateur
                </h2>
                <FormGroup className="form_prenom mb-2 mr-sm-2 mb-sm-0">
                  <Label for="exampleName" className="form_tags mr-sm-2 mt-2">
                    PRENOM
                  </Label>
                  <Input
                    className="form_input"
                    type="text"
                    name="name"
                    id="prenom"
                    bsSize="sm"
                    onChange={this.handleChange}
                  />
                </FormGroup>
                <FormGroup className="form_nom mb-2 mr-sm-2 mb-sm-0">
                  <Label
                    for="exampleLastname"
                    className="form_tags mr-sm-2 mt-2"
                  >
                    NOM
                  </Label>
                  <Input
                    className=""
                    type="text"
                    name="name"
                    id="nom"
                    bsSize="sm"
                    onChange={this.handleChange}
                  />
                </FormGroup>
                <FormGroup className="fieldmail mb-2 mr-sm-2 mb-sm-0">
                  <Label
                    for="exampleEmail"
                    className="form_tags mr-sm-2 mt-2"
                  >
                    ADRESSE MAIL
                  </Label>
                  <Input
                    className=""
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
                    MOT DE PASSE
                  </Label>
                  <Input
                    className=""
                    type="password"
                    name="password"
                    id="mdp"
                    bsSize="sm"
                    onChange={this.handleChange}
                  />
                </FormGroup>
                <FormGroup className="confirm_password mb-2 mr-sm-2 mb-sm-0">
                  <Label
                    for="confirmPassword"
                    className="form_tags mr-sm-2 mt-2"
                  >
                    CONFIRMATION MOT DE PASSE
                  </Label>
                  <Input
                    className="input_form"
                    type="password"
                    name="password"
                    id="confirmMdp"
                    bsSize="sm"
                    onChange={this.handleChange}
                  />
                </FormGroup>
                <div className="group_button">
                  <Button className="btn_inscription" color="success">
                    Ajouter
                  </Button>
                </div>
              </Col>
            </Form>
          </div>
        </Container>
      </div>
    );
  }
}

export default AdminMyAccount;
