/* This is the parent component of AdminWineVignette.
Here we display all the vignette of wines with the possibility to modify,delete them.
 */
import React, { Component } from 'react';
import './AdminWineList.scss';
import {
  Container,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import NavBar from './NavBar';
import AdminWineVignette from './AdminWineVignette';
import { API_SERVER } from '../constants';

class AdminWineList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 0,
      wineList: [],
      isLoading: true,
      modal: false,
      idDelete: -1,
      wineDelete: [],
      isAdmin: localStorage.getItem('myRole'),
    };
    this.toggle = this.toggle.bind(this);
    this.fetchWineList = this.fetchWineList.bind(this);
    this.fetchWineSearch = this.fetchWineSearch.bind(this);
    this.handleClickDelete = this.handleClickDelete.bind(this);
  }

  componentDidMount() {
    const heightWindow = window.innerHeight - 77;
    this.setState({
      height: heightWindow,
    });
    this.fetchWineList();
  }

  toggle(e) {
    const {
      modal,
      wineList,
    } = this.state;
    const card = [];
    // we needed here to transform string received from e.target.value into number.
    const idDeleteValue = parseInt(e.target.value, 10);
    wineList.map((item) => {
      if (item.id === idDeleteValue) {
        return card.push(item);
      }
      return null;
    });
    this.setState({
      modal: !modal,
      idDelete: idDeleteValue,
      wineDelete: card,
    });
  }

  fetchWineSearch(text) {
    if (text !== '') {
      fetch(`${API_SERVER}/searchwine/${text}`)
        .then(res => res.json())
        .then(data => this.setState({
          wineList: data,
        }));
    } else {
      this.fetchWineList();
    }
  }

  fetchWineList() {
    const token = localStorage.getItem('myToken');
    const myHeaders = new Headers({
      Authorization: `JWT  ${token}`,
    });
    fetch(`${API_SERVER}/wines-list`, { headers: myHeaders })
      .then(res => res.json())
      .then(data => this.setState({
        wineList: data,
        isLoading: false,
      }));
  }

  handleClickDelete(e) {
    fetch(`${API_SERVER}/admin/delete-wine/${e.target.value}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(() => this.fetchWineList());

    this.setState({
      modal: false,
    });
  }

  render() {
    const {
      height,
      isLoading,
      wineList,
      modal,
      idDelete,
      wineDelete,
      isAdmin,
    } = this.state;
    return (
      <div className="AdminWineList">
        <NavBar fetchWineSearch={this.fetchWineSearch} />
        <div style={{ minHeight: height }} className="containerGlobalListWineAdmin">
          <Container fluid className="containerListWineAdmin" style={{ minHeight: height }}>
            <h1 className="titleListWineAdmin display-3">Cave à vin</h1>
            <Row>
              {isLoading && (
                <div className="containerSpinnerLoadingListWineAdmin">
                  <p>Chargement ...</p>
                  <i className="fas fa-spinner spinnerLoadingListWineAdmin" />
                </div>
              )}
              {wineList.length === 0 && (
                <div className="noResultListWineAdmin">
                  <img src="/images/not-found.png" className="img-fluid" alt="Aucun résultat" />
                  <p>Aucun résultat</p>
                </div>
              )
                }
              {wineList.length > 0 && (wineList.map((item) => {
                let color;
                switch (item.colors) {
                  case 'Blanc':
                    color = 'wine-white';
                    break;
                  case 'Rouge':
                    color = 'wine-red';
                    break;
                  case 'Rosé':
                    color = 'wine-pink';
                    break;
                  default:
                    color = '';
                }
                return (
                  <AdminWineVignette
                    id={item.id}
                    picture={item.picture}
                    title={item.name_wine.toUpperCase()}
                    castle={item.name_castle}
                    color={item.colors}
                    millesime={item.millesime_wine}
                    appellation={item.appellation.toUpperCase()}
                    borderColor={color}
                    modal={modal}
                    toggle={this.toggle}
                    handleClickDelete={this.handleClickDelete}
                    isAdmin={isAdmin}
                  />
                );
              }))}
            )
            </Row>
            {wineDelete.map(item => (
              <Modal isOpen={modal} toggle={this.toggle}>
                <ModalHeader toggle={this.toggle}>Supprimer</ModalHeader>
                <ModalBody>
                  <span>Êtes-vous certain de vouloir supprimer le vin </span>
                  <span className="nameWineModal">
                    {item.name_wine}
                    {' '}
                  </span>
                  <span> ?</span>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" value={idDelete} onClick={this.handleClickDelete}>Valider</Button>
                  <Button color="secondary" onClick={this.toggle}>Annuler</Button>
                </ModalFooter>
              </Modal>
            ))}
          </Container>
        </div>
      </div>
    );
  }
}

export default AdminWineList;
