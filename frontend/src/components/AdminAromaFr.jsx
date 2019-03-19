// Check the AdminAromaFr for the comments, this is a seebling component of.
import React, { Component } from 'react';
import './AdminAromaFr.scss';
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

class AdminAromaFr extends Component {
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
    this.fetchGet();
    fetch(`${API_SERVER}/admin/list-aroma-fr`)
      .then(res => res.json())
      .then(data => this.setState({ listAllAromaSelect: data }));
  }

  onDismiss() {
    this.setState({ alertCreate: false });
  }

  fetchGet() {
    fetch(`${API_SERVER}/admin/aroma-fr`)
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
    fetch(`${API_SERVER}/admin/aroma-fr/${idDelete}`, {
      method: 'DELETE',
    })
      .then(() => this.fetchGet());
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
    fetch(`${API_SERVER}/admin/aroma-fr/${idModif}`, {
      method: 'PUT',
      body: JSON.stringify(modifications),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(() => this.fetchGet());
    this.toggleModif(-1);
  }

  handleSubmitCreate(e) {
    e.preventDefault();
    const { modifications } = this.state;
    fetch(`${API_SERVER}/admin/aroma-fr`, {
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
      <div className="AdminAromaFr">
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
                <Label for="nameAromaFr">Nom</Label>
                <Input type="text" name="name" id="nameAromaFr" value={modifications.name} onChange={this.handleChange} />
              </FormGroup>
              <FormGroup>
                <Label for="categoryAromaFr">Catégorie</Label>
                <Input type="select" name="category" id="categoryAromaFr" onChange={this.handleChange}>
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
        <Alert color="success" isOpen={alertCreate} toggle={this.onDismiss} className="alert-create-aroma-admin-fr">
          L&apos;arôme a été crée avec succès !
        </Alert>
        <div className="text-center">
          <h1>
            <i className="fas fa-apple-alt" />
            {' '}
            Gérer les arômes français
          </h1>
        </div>
        <div className="container-table-aroma-admin-fr">
          <Table hover striped responsive className="table-aroma-admin-fr">
            <thead className="head-table-aroma-admin-fr">
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
        <div className="container-create-aroma-aroma-admin-fr">
          <div className="text-center">
            <h2>
              <i className="fas fa-plus-square" />
              {' '}
              Ajouter un arôme français
            </h2>
          </div>
          <Form onSubmit={this.handleSubmitCreate}>
            <FormGroup>
              <Label for="nameCreateAromaFr">Nom</Label>
              <Input type="text" name="name" id="nameCreateAromaFr" onChange={this.handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="categoryCreateAromaFr">Catégorie</Label>
              <Input type="select" name="category" id="categoryCreateAromaFr" onChange={this.handleChange}>
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

export default AdminAromaFr;
