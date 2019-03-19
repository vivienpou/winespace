import React, { Component } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Alert,
} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import './AdminWineCreate.scss';
import { API_SERVER } from '../constants';
import NavBar from './NavBar';

class AdminWineCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: '',
      date: [],
      arrDegre: [],
      nameWine: '',
      nameCastle: '',
      regionWine: '',
      appellation: '',
      descriptionWine: '',
      textWine: '',
      millesime: 'Aucun',
      colorWine: 'Blanc',
      degreWine: '9',
      fileBottle: '',
      previewFileBottle: '',
      visibleErrorField: false,
      visibleSuccess: false,
      visibleErrorDegre: false,
    };
    this.onDismissErrorField = this.onDismissErrorField.bind(this);
    this.onDismissSuccess = this.onDismissSuccess.bind(this);
    this.onDismissDegre = this.onDismissDegre.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const height = window.innerHeight;
    // we need data, and getFullYear to display the list of millesime years from this year
    const date = new Date();
    const year = date.getFullYear();
    const arrDate = [];
    const arrDegre = [];
    for (let i = year - 30; i <= year; i += 1) {
      arrDate.push(i);
    }
    for (let j = 9; j <= 19; j += 0.5) {
      arrDegre.push(j);
    }
    this.setState({
      height,
      date: arrDate.reverse(),
      arrDegre,
    });
  }

  componentDidUpdate() {
    const {
      visibleErrorField,
      visibleSuccess,
      visibleErrorDegre,
    } = this.state;
    // all the alert have setimeout of 3 sec to let them displayed
    if (visibleErrorField) {
      setTimeout(() => {
        this.setState({
          visibleErrorField: false,
        });
      }, 3000);
    } else if (visibleSuccess) {
      setTimeout(() => {
        this.setState({
          visibleSuccess: false,
        });
      }, 3000);
    } else if (visibleErrorDegre) {
      setTimeout(() => {
        this.setState({
          visibleErrorDegre: false,
        });
      }, 3000);
    }
  }

  onDismissErrorField() {
    this.setState({ visibleErrorField: false });
  }

  onDismissSuccess() {
    this.setState({ visibleSuccess: false });
  }

  onDismissDegre() {
    this.setState({ visibleErrorDegre: false });
  }

  handleChange(e) {
    if (e.target.id === 'fileBottle') {
      // to manage the image's input
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        this.setState({
          fileBottle: file,
          previewFileBottle: reader.result,
        });
      };
      reader.readAsDataURL(file);
    } else {
      this.setState({
        [e.target.id]: e.target.value,
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const { history } = this.props;
    const {
      nameWine,
      nameCastle,
      regionWine,
      appellation,
      descriptionWine,
      textWine,
      millesime,
      colorWine,
      degreWine,
      previewFileBottle,
    } = this.state;
    const data = {
      name_wine: nameWine,
      name_castle: nameCastle,
      desc_wine: descriptionWine,
      txt_wine: textWine,
      appellation,
      region_wine: regionWine,
      millesime_wine: millesime,
      couleur_wine: colorWine,
      alcool_wine: degreWine,
      picture: previewFileBottle,
    };
    if ((nameWine === '') || (nameCastle === '') || (colorWine === '') || (appellation === '') || (millesime === '')) {
      this.setState({
        visibleErrorField: true,
      });
    // eslint-disable-next-line no-restricted-globals
    } else if (isNaN(degreWine)) {
      this.setState({
        visibleErrorDegre: true,
      });
    } else {
      if (millesime === 'Aucun') {
        data.millesime_wine = '-';
      }
      fetch(`${API_SERVER}/add-wine`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((res) => {
          if (res.ok) {
            this.setState({
              visibleSuccess: true,
            });
          }
        })
        // history.push do the redirection to another url.
        .then(() => setTimeout(() => history.push('/admin-wine-list'), 2000));
    }
  }

  render() {
    const {
      height,
      date,
      arrDegre,
      fileBottle,
      previewFileBottle,
      visibleErrorField,
      visibleSuccess,
      visibleErrorDegre,
    } = this.state;
    return (
      <div className="AdminWineCreate">
        <NavBar />
        <div className="WineCardAdminContainer" style={{ minHeight: height }}>
          <Alert className="alertWineCardAdmin" color="danger" isOpen={visibleErrorField} toggle={this.onDismissErrorField}>
            Veuillez remplir tous les champs obligatoires (*).
          </Alert>
          <Alert className="alertWineCardAdmin" color="success" isOpen={visibleSuccess} toggle={this.onDismissSuccess}>
            Votre annonce a bien été créée.
          </Alert>
          <Alert className="alertWineCardAdmin" color="danger" isOpen={visibleErrorDegre} toggle={this.onDismissDegre}>
            Veuillez entrer un degré d&apos;alcool correct.
          </Alert>

          <Container fluid className="h-100">
            <div className="containerTitleRetourWineCardAdmin">
              <div className="containerRetourWineCardAdmin">
                <NavLink to="/admin-wine-list">
                  <Button color="black" className="black">
                    <i className="fas fa-angle-left pr-2" />
                    {' '}
                    RETOUR
                  </Button>
                </NavLink>
              </div>
              <h1 className="title-wine-card-admin">Créer une fiche vin</h1>
            </div>
            <Row className="d-flex justify-content-center align-items-center">
              <Col xs="12" lg="5" className="d-flex justify-content-center">
                {(fileBottle === '') ? null : <img src={previewFileBottle} alt="picture_logo" />}
              </Col>
              <Col xs="12" lg="7" className="formWineCardAdmin">
                <Form className="w-100" onSubmit={this.handleSubmit}>
                  <FormGroup>
                    <Label for="nameWine" className="labelAdmin">Nom du vin *</Label>
                    <Input type="text" id="nameWine" className="inputAdmin" onChange={this.handleChange} />
                  </FormGroup>
                  <FormGroup>
                    <Label for="nameCastle" className="labelAdmin">Nom du chateau *</Label>
                    <Input type="text" id="nameCastle" className="inputAdmin" onChange={this.handleChange} />
                  </FormGroup>
                  <FormGroup>
                    <Label for="colorWine" className="labelAdmin">Couleur *</Label>
                    <Input type="select" id="colorWine" className="inputAdmin" onChange={this.handleChange}>
                      <option className="colorWineSelect">Blanc</option>
                      <option className="colorWineSelect">Rosé</option>
                      <option className="colorWineSelect">Rouge</option>
                    </Input>
                  </FormGroup>
                  <FormGroup>
                    <Label for="appellation" className="labelAdmin">Appélation *</Label>
                    <Input type="text" id="appellation" className="inputAdmin" onChange={this.handleChange} />
                  </FormGroup>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label for="millesime" className="labelAdmin">Millesime *</Label>
                        <Input type="select" id="millesime" className="inputAdmin" onChange={this.handleChange}>
                          <option>Aucun</option>
                          {date.map(item => (
                            <option className="colorWineSelect">{item}</option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label for="degreWine" className="labelAdmin">Degrés alcool</Label>
                        <Input type="select" id="degreWine" className="inputAdmin" onChange={this.handleChange}>
                          {arrDegre.map(item => (
                            <option className="colorWineSelect">{item}</option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <FormGroup>
                    <Label for="regionWine" className="labelAdmin">Région</Label>
                    <Input type="text" id="regionWine" className="inputAdmin" onChange={this.handleChange} />
                  </FormGroup>
                  <FormGroup>
                    <Label for="descriptionWine" className="labelAdmin">Description sommaire du vin</Label>
                    <Input type="text" id="descriptionWine" className="inputAdmin" onChange={this.handleChange} />
                  </FormGroup>
                  <FormGroup>
                    <Label for="textWine" className="labelAdmin">Description complète du vin</Label>
                    <Input type="textarea" rows="5" id="textWine" className="inputAdminTextWine" onChange={this.handleChange} />
                  </FormGroup>
                  <FormGroup>
                    <Input type="file" id="fileBottle" onChange={this.handleChange} />
                    <FormText color="muted">
                      Veuillez choisir une photo de la bouteille que vous souhaitez afficher dans la
                      fiche produit.
                    </FormText>
                  </FormGroup>
                  <div className="wine-card-admin-btn-submit">
                    <Button color="success">Valider</Button>
                  </div>
                </Form>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

export default AdminWineCreate;
