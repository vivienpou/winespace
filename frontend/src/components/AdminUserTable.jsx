/* This is a children of the AdminMyAccount component.
In this component, we do the table of users.

*/

import React from 'react';
import './AdminUserTable.scss';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter, Table,
} from 'reactstrap';
import { API_SERVER } from '../constants';

class AdminUserTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      modal: false,
      idUserDelete: -1,
    };
    this.fetchUsers = this.fetchUsers.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers() {
    fetch(`${API_SERVER}/admin/my-account`)
      .then(res => res.json())
      .then(data => this.setState({ users: data }));
  }

  // linked to the logo button of arrows to change admin status
  handleChangeStatus(id) {
    const url = `${API_SERVER}/admin/my-account/toggleadmin/`;
    fetch(url + id, {
      method: 'put',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(() => this.fetchUsers());
  }

  handleDelete() {
    const { idUserDelete, modal } = this.state;
    const url = `${API_SERVER}/admin/my-account/${idUserDelete}`;
    fetch(url, {
      method: 'delete',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(() => this.fetchUsers())
      .then(this.setState({
        modal: !modal,
      }));
  }

  toggle(id) {
    const { modal } = this.state;
    this.setState({
      modal: !modal,
      idUserDelete: id,
    });
  }

  render() {
    const { users, modal } = this.state;
    return (
      <div className="AdminUsertable">
        <div className="under-pressure">
          <Table hover striped responsive>
            <thead className="head-table">
              <tr>
                <th>Prénom</th>
                <th>Nom</th>
                <th>Adresse mail</th>
                <th>Droits d&apos;accès</th>
                <th>Changer le status</th>
                <th>Supprimer un utilisateur</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr>
                  <th scope="row">{user.firstname}</th>
                  <td>{user.lastname}</td>
                  <td>{user.email}</td>
                  <td>{user.isAdmin === 1 ? 'Admin' : 'Utilisateur'}</td>
                  <td>
                    <Button
                      onClick={() => this.handleChangeStatus(user.id)}
                      type="submit"
                      color="warning"
                    >
                      <i className="fas fa-exchange-alt" />
                    </Button>
                  </td>
                  <td>
                    <Button
                      onClick={() => this.toggle(user.id)}
                      color="danger"
                      value={user.id}
                      className={user.id}
                    >
                      <i className="fas fa-trash-alt" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Modal isOpen={modal} toggle={this.toggle}>
            <ModalHeader toggle={this.toggle}>Attention</ModalHeader>
            <ModalBody>
              <span>Voulez vous vraiment supprimer cet utilisateur ?</span>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit" onClick={this.handleDelete}>Supprimer</Button>
              {' '}
              <Button color="secondary" onClick={this.toggle}>Annuler</Button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    );
  }
}

export default AdminUserTable;
