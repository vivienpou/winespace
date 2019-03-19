// This component allow to modify a detail wine page.
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
  Modal,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import './AdminWineModif.scss';
import { connect } from 'react-redux';
// this module is used to encode in base 64 the path of the image to keep it secret.
import FileBase64 from 'react-file-base64';
import { NavLink } from 'react-router-dom';
import { API_SERVER } from '../constants';
import NavBar from './NavBar';


class AdminWineModif extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: [],
      arrDegre: [],
      height: '',
      files: [],
      modal: false,
      modification: {
        name_wine: '',
        name_castle: '',
        desc_wine: '',
        txt_wine: '',
        appellation: '',
        region_wine: '',
        millesime_wine: '',
        couleur_wine: '',
        alcool_wine: '',
        picture: '',
        comment_wine: '',
      },
    };
    this.transferWineCard4modif = this.transferWineCard4modif.bind(this);
    this.updateWineCard = this.updateWineCard.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getFiles = this.getFiles.bind(this);
    this.toggle = this.toggle.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    const { location: { state: { id } } } = this.props;
    const height = window.innerHeight;
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
    this.transferWineCard4modif(id);
  }

  onChange(e) {
    const { modification } = this.state;
    modification[e.target.name] = e.target.value;
    this.setState(modification);
  }

  getFiles(files) {
    this.setState({
      files,
    });
  }

  closeModal() {
    this.setState({
      modal: false,
    });
  }

  toggle() {
    const { files, modal } = this.state;
    this.setState({
      modal: !modal,
    });
    if (files.length !== 0) {
      /* if we try to change the picture,
      here we tracked it and we modify the state with the path encoded in base 64 */
      this.setState(
        prevState => ({
          modification: {
            ...prevState.modification,
            picture: files['0'].base64,
          },
        }),
      );
    }
  }

  transferWineCard4modif(id) {
    // here, we retrieve data of the wine in order to fill the inputs.
    const { modification } = this.state;
    const url = `${API_SERVER}/winelist/modify/`;
    fetch(url + id)
      .then(res => res.json())
      .then((res) => {
        modification.name_wine = res[0].name_wine;
        modification.name_castle = res[0].name_castle;
        modification.desc_wine = res[0].desc_wine;
        modification.txt_wine = res[0].txt_wine;
        modification.appellation = res[0].appellation;
        modification.region_wine = res[0].region_wine;
        modification.millesime_wine = res[0].millesime_wine;
        modification.couleur_wine = res[0].couleur_wine;
        modification.alcool_wine = res[0].alcool_wine;
        modification.picture = res[0].picture;
        modification.comment_wine = res[0].comment_wine;
        return this.setState({ modification });
      });
  }

  updateWineCard() {
    // here we update the database with the modified inputs
    const { location: { state: { id } } } = this.props;
    const { history } = this.props;
    const { modal, modification } = this.state;
    this.setState({ modal: !modal });
    const url = `${API_SERVER}/winelist/modify/processing/`;
    fetch(url + id, {
      method: 'put',
      body: JSON.stringify(modification),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    // we put a setimeout of 1 sec to let the fetch happen and then redirect.
      .then(() => setTimeout(() => history.push('/admin-wine-list'), 1000));
  }

  render() {
    const {
      height, modal, modification, files, date, arrDegre,
    } = this.state;
    const { className } = this.props;
    return (
      <div className="AdminWineModif" style={{ minHeight: height }}>
        <NavBar />
        <Container fluid className="h-100">
          <Modal
            isOpen={modal}
            modalTransition={{ timeout: 400 }}
            backdropTransition={{ timeout: 700 }}
            toggle={this.toggle}
            className={className}
          >
            <ModalBody>
              <span>Voulez-vous confirmer la modification de ce vin ?</span>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={() => this.updateWineCard()}>Oui</Button>
              {' '}
              <Button color="secondary" onClick={this.closeModal}>Non</Button>
            </ModalFooter>
          </Modal>
          <NavLink to="/admin-wine-list">
            <Button color="black" className="blackWineCardAdminModif">
              <i className="fas fa-angle-left" />
              <span>RETOUR</span>
            </Button>
          </NavLink>
          <Form>
            <Row className="d-flex justify-content-center align-items-center">
              <Col xs="12" lg="4" className="d-flex justify-content-center">
                <img
                  src={files['0'] === undefined ? modification.picture : files['0'].base64}
                  alt="picture_logo"
                />
              </Col>
              <Col xs="12" lg="6" className="centerWineCardAdminModif">
                <div className="w-100">
                  <FormGroup>
                    <Label for="name_wine" className="labelAdminModif">Nom du vin *</Label>
                    <Input
                      type="text"
                      id="name_wine"
                      name="name_wine"
                      className="inputAdminModif"
                      onChange={this.onChange}
                      value={modification.name_wine}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="name_castle" className="labelAdminModif">Nom du chateau *</Label>
                    <Input
                      type="text"
                      name="name_castle"
                      id="name_castle"
                      className="inputAdminModif"
                      onChange={this.onChange}
                      value={modification.name_castle}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="colorWine" className="labelAdminModif">Couleur *</Label>
                    <Input
                      type="select"
                      id="colorWine"
                      className="inputAdminModif"
                      onChange={this.onChange}
                    >
                      <option className="colorWineSelectModif">Blanc</option>
                      <option className="colorWineSelectModif">Rosé</option>
                      <option className="colorWineSelectModif">Rouge</option>
                    </Input>
                  </FormGroup>
                  <FormGroup>
                    <Label for="appellation" className="labelAdminModif">Appélation *</Label>
                    <Input
                      type="text"
                      name="appellation"
                      id="appellation"
                      className="inputAdminModif"
                      onChange={this.onChange}
                      value={modification.appellation}
                    />
                  </FormGroup>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label for="millesime_wine" className="labelAdminModif">Millesime *</Label>
                        <Input type="select" id="millesime_wine" name="millesime_wine" className="inputAdminModif" onChange={this.onChange}>
                          <option>Aucun</option>
                          {date.map(item => (
                            (modification.millesime_wine === item.toString()) ? <option className="colorWineSelectModif" selected>{item}</option> : <option className="colorWineSelectModif">{item}</option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label for="alcool_wine" className="labelAdminModif">Degrés alcool</Label>
                        <Input type="select" id="alcool_wine" name="alcool_wine" className="inputAdminModif" onChange={this.onChange}>
                          {arrDegre.map(item => (
                            (modification.alcool_wine === item) ? <option className="colorWineSelectModif" selected>{item}</option> : <option className="colorWineSelectModif">{item}</option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <FormGroup>
                    <Label for="region_wine" className="labelAdminModif">Région</Label>
                    <Input
                      type="text"
                      name="region_wine"
                      id="region_wine"
                      className="inputAdminModif"
                      onChange={this.onChange}
                      value={modification.region_wine}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="desc_wine" className="labelAdminModif">Description sommaire du vin</Label>
                    <Input
                      type="text"
                      name="desc_wine"
                      id="desc_wine"
                      className="inputAdminModif"
                      onChange={this.onChange}
                      value={modification.desc_wine}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="txt_wine" className="labelAdminModif">Description complète du vin</Label>
                    <Input
                      type="textarea"
                      name="txt_wine"
                      id="txt_wine"
                      rows="5"
                      className="inputAdminModifTextWine"
                      onChange={this.onChange}
                      value={modification.txt_wine}
                    />
                  </FormGroup>
                  <FormGroup>
                    <FileBase64
                      multiple
                      onDone={this.getFiles}
                    />
                    <FormText color="muted">
                      <span>Veuillez choisir une photo de la bouteille que vous souhaitez </span>
                      <span>afficher dans la fiche produit.</span>
                    </FormText>
                  </FormGroup>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={{ size: 10, offset: 1 }}>
                <FormGroup>
                  <Label for="txt_wine" className="labelCommentAdminModif">Commentaire du vin :</Label>
                  <Input
                    type="textarea"
                    name="comment_wine"
                    id="comment_wine"
                    rows="3"
                    className="inputAdminModifCommentWine"
                    onChange={this.onChange}
                    value={modification.comment_wine}
                  />
                </FormGroup>
              </Col>
            </Row>
            <div className="WineCardAdminModifBtnSubmit">
              <Button color="success" onClick={this.toggle}>Valider</Button>
            </div>
          </Form>
        </Container>
        <br />
      </div>
    );
  }
}

function mstp(state) {
  return {
    idModif: state.idModif,
  };
}

export default connect(mstp)(AdminWineModif);
