/* This component is displayed on the website with
Mon compte > Espace Administrateur > Gérer les arômes;

This component displayed the list of french aromas and the formular to add,modify,delete aroma;

We import 'import { API_SERVER } from '../constants' which is an environment variable.
It allows us to fetch data from database.
*/

import React, { Component } from 'react';
import './AdminAromaEng.scss';
import {
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
} from 'reactstrap';
import { API_SERVER } from '../constants';

class AdminAromaEng extends Component {
  /*
  In the constructor:
  allAroma allows to store all aromas from database.
  listAllAromaSelect allows to store all the categories of aroms available from the database.

  modalDelete,modalModif,alertCreate are Modal/Alert imported from ReactStrap,
  by default at false, when we need to display this windows alert, we change their
  state from false to true.
  idDelete & idModif are put to '-1' by default to be sure,nothing happen.
  */
  constructor(props) {
    super(props);
    this.state = {
      allAroma: [],
      listAllAromaSelect: [],
      modifications: {
        name: '',
        category: '',
      },
      modalDelete: false,
      modalModif: false,
      alertCreate: false,
      idDelete: -1,
      idModif: -1,
    };
    this.fetchGet = this.fetchGet.bind(this);
    this.toggleDelete = this.toggleDelete.bind(this);
    this.toggleModif = this.toggleModif.bind(this);
    this.handleSubmitModif = this.handleSubmitModif.bind(this);
    this.handleClickDelete = this.handleClickDelete.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmitCreate = this.handleSubmitCreate.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  componentDidMount() {
    // componentDidMount is a lifecycle method of React, rendered in first.
    this.fetchGet();
    // to retrieve all categories of aromas in english from database
    fetch(`${API_SERVER}/admin/list-aroma-eng`)
      .then(res => res.json())
      .then(data => this.setState({ listAllAromaSelect: data }));
  }

  onDismiss() {
    this.setState({ alertCreate: false });
  }

  // to retrieve all aromas in english from database
  fetchGet() {
    fetch(`${API_SERVER}/admin/aroma-eng`)
      .then(res => res.json())
      .then(data => this.setState({ allAroma: data }));
  }

  toggleDelete(id) {
    const { modalDelete } = this.state;
    this.setState({
      modalDelete: !modalDelete,
      idDelete: id,
    });
  }

  /* clicking the modifify button with this onClick's method, it try to
  match id with the list of aromas stored in the state.
  We do it to store in the state modification the name & category of the aroma selected.
  */
  toggleModif(id) {
    const { modalModif, allAroma } = this.state;
    const modifications = {
      name: '',
      category: '',
    };
    if (id >= 0) {
      allAroma.map((item) => {
        if (item.id === id) {
          modifications.name = item.name;
          modifications.category = item.category;
        }
        return null;
      });
    }
    this.setState({
      modalModif: !modalModif,
      idModif: id,
      modifications,
    });
  }

  handleClickDelete() {
    const { idDelete } = this.state;
    fetch(`${API_SERVER}/admin/aroma-eng/${idDelete}`, {
      method: 'DELETE',
    })
      .then(() => this.fetchGet());
    /* we call toggleDelete method with -1 as argument to refresh the DOM,
    after deleting the arom. */
    this.toggleDelete(-1);
  }

  handleChange(e) {
    const { modifications } = this.state;
    modifications[e.target.name] = e.target.value;
    this.setState({ modifications });
  }

  handleSubmitModif(e) {
    e.preventDefault();
    const { idModif, modifications } = this.state;
    fetch(`${API_SERVER}/admin/aroma-eng/${idModif}`, {
      method: 'PUT',
      body: JSON.stringify(modifications),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(() => this.fetchGet());
    /* we call toggleModif method with -1 as argument to refresh the DOM,
    after modifying the arom. */
    this.toggleModif(-1);
  }

  handleSubmitCreate(e) {
    e.preventDefault();
    const { modifications } = this.state;
    fetch(`${API_SERVER}/admin/aroma-eng`, {
      method: 'POST',
      body: JSON.stringify(modifications),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.ok) {
          this.setState({ alertCreate: true });
        }
      })
      .then(() => this.fetchGet());
    // we put a timeout to 2sec to let displayed the alert during 2 sec.
    setTimeout(() => this.onDismiss(), 2000);
  }

  render() {
    const {
      allAroma,
      listAllAromaSelect,
      modalDelete,
      modalModif,
      modifications,
      idModif,
      idDelete,
      alertCreate,
    } = this.state;
    return (
      <div className="AdminAromaEng">
        <Modal isOpen={modalDelete} toggle={this.toggleDelete}>
          <ModalHeader toggle={this.toggleDelete}>
            {allAroma.map(item => (
              (item.id === idDelete)
                ? <span>{item.name}</span>
                : null
            ))}
          </ModalHeader>
          <ModalBody>
            Etes-vous certain de vouloir suprimer cet arôme ?
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.handleClickDelete}>Valider</Button>
            {' '}
            <Button color="danger" onClick={() => this.toggleDelete(-1)}>Annuler</Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={modalModif} toggle={this.toggleModif}>
          <ModalHeader toggle={this.toggleModif}>
            {allAroma.map(item => (
              (item.id === idModif)
                ? <span>{item.name}</span>
                : null
            ))}
          </ModalHeader>
          <Form onSubmit={this.handleSubmitModif}>
            <ModalBody>
              <FormGroup>
                <Label for="nameAromaEng">Nom</Label>
                <Input type="text" name="name" id="nameAromaEng" value={modifications.name} onChange={this.handleChange} />
              </FormGroup>
              <FormGroup>
                <Label for="categoryAromaEng">Catégorie</Label>
                <Input type="select" name="category" id="categoryAromaEng" onChange={this.handleChange}>
                  {listAllAromaSelect.map(item => (
                    (item.category === modifications.category)
                      ? <option selected>{item.category}</option>
                      : <option>{item.category}</option>
                  ))}
                </Input>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="success" type="submit">Valider</Button>
              {' '}
              <Button color="danger" onClick={() => this.toggleModif(-1)}>Annuler</Button>
            </ModalFooter>
          </Form>
        </Modal>
        <Alert color="success" isOpen={alertCreate} toggle={this.onDismiss} className="alert-create-aroma-admin-eng">
          L&apos;arôme a été crée avec succès !
        </Alert>
        <div className="text-center">
          <h1>
            <i className="fas fa-apple-alt" />
            {' '}
            Gérer les arômes anglais
          </h1>
        </div>
        <div className="container-table-aroma-admin-eng">
          <Table hover striped responsive className="table-aroma-admin-eng">
            <thead className="head-table-aroma-admin-eng">
              <tr>
                <th>Nom</th>
                <th>Catégorie</th>
                <th>Modifier l&apos;arôme</th>
                <th>Supprimer l&apos;arôme</th>
              </tr>
            </thead>
            <tbody>
              {allAroma.map(item => (
                <tr>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td><Button color="warning" onClick={() => this.toggleModif(item.id)}><i className="fas fa-edit" /></Button></td>
                  <td><Button color="danger" onClick={() => this.toggleDelete(item.id)}><i className="fas fa-trash-alt" /></Button></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <div className="container-create-aroma-aroma-admin-eng">
          <div className="text-center">
            <h2>
              <i className="fas fa-plus-square" />
              {' '}
              Ajouter un arôme anglais
            </h2>
          </div>
          <Form onSubmit={this.handleSubmitCreate}>
            <FormGroup>
              <Label for="nameCreateAromaEng">Nom</Label>
              <Input type="text" name="name" id="nameCreateAromaEng" onChange={this.handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="categoryCreateAromaEng">Catégorie</Label>
              <Input type="select" name="category" id="categoryCreateAromaEng" onChange={this.handleChange}>
                {listAllAromaSelect.map(item => <option>{item.category}</option>)}
              </Input>
            </FormGroup>
            <Button color="success" type="submit">Ajouter</Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default AdminAromaEng;
