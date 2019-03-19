// This is the parent component of AdminMyAccount, AdminAroma & AdminPython.
import React, { Component } from 'react';
import './AdminWineHouse.scss';
import {
  Col,
  Row,
  Container,
  Button,
} from 'reactstrap';
import AdminMyAccount from './AdminMyAccount';
import NavBar from './NavBar';
import AdminAroma from './AdminAroma';
import AdminPython from './AdminPython';

class AdminWineHouse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemSelected: 'welcome',
      height: 0,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const height = window.innerHeight - 77;
    this.setState({
      height,
    });
  }

  handleClick(name) {
    this.setState({
      itemSelected: name,
    });
  }

  render() {
    const { itemSelected, height } = this.state;
    if (itemSelected === 'welcome') {
      return (
        <div className="AdminWineHouse" style={{ minHeight: height }}>
          <NavBar />
          <Container fluid className="container-dashboardAdmin">
            <Row>
              <Col md={3} className="menu-dashboardAdmin" style={{ minHeight: height }}>
                <Button className="item-menu-dashboardAdmin" onClick={() => this.handleClick('comptes')}>
                  <i className="fas fa-user" />
                  {'  '}
                  Gérer les comptes
                </Button>
                <Button className="item-menu-dashboardAdmin" onClick={() => this.handleClick('commentaires')}>
                  <i className="fas fa-comments" />
                  {'  '}
                  Gérer l&apos;analyse des commentaires
                </Button>
                <Button className="item-menu-dashboardAdmin" onClick={() => this.handleClick('aromes')}>
                  <i className="fas fa-apple-alt" />
                  {'  '}
                  Gérer les arômes
                </Button>
              </Col>
              <Col md={9}>
                <h1>Bienvenue sur votre espace d&apos;administration</h1>
              </Col>
            </Row>
          </Container>
        </div>
      );
    } if (itemSelected === 'comptes') {
      return (
        <div className="AdminWineHouse" style={{ minHeight: height }}>
          <NavBar />
          <Container fluid className="container-dashboardAdmin">
            <Row>
              <Col md={3} className="menu-dashboardAdmin" style={{ minHeight: height }}>
                <Button className="item-menu-dashboardAdmin" onClick={() => this.handleClick('comptes')}>
                  <i className="fas fa-user" />
                  {'  '}
                  Gérer les comptes
                </Button>
                <Button className="item-menu-dashboardAdmin" onClick={() => this.handleClick('commentaires')}>
                  <i className="fas fa-comments" />
                  {'  '}
                  Gérer l&apos;analyse des commentaires
                </Button>
                <Button className="item-menu-dashboardAdmin" onClick={() => this.handleClick('aromes')}>
                  <i className="fas fa-apple-alt" />
                  {'  '}
                  Gérer les arômes
                </Button>
              </Col>
              <Col md={9}>
                <AdminMyAccount />
              </Col>
            </Row>
          </Container>
        </div>
      );
    } if (itemSelected === 'commentaires') {
      return (
        <div className="AdminWineHouse" style={{ minHeight: height }}>
          <NavBar />
          <Container fluid className="container-dashboardAdmin">
            <Row>
              <Col md={3} className="menu-dashboardAdmin" style={{ minHeight: height }}>
                <Button className="item-menu-dashboardAdmin" onClick={() => this.handleClick('comptes')}>
                  <i className="fas fa-user" />
                  {'  '}
                  Gérer les comptes
                </Button>
                <Button className="item-menu-dashboardAdmin" onClick={() => this.handleClick('commentaires')}>
                  <i className="fas fa-comments" />
                  {'  '}
                  Gérer l&apos;analyse des commentaires
                </Button>
                <Button className="item-menu-dashboardAdmin" onClick={() => this.handleClick('aromes')}>
                  <i className="fas fa-apple-alt" />
                  {'  '}
                  Gérer les arômes
                </Button>
              </Col>
              <Col md={9}>
                <AdminPython />
              </Col>
            </Row>
          </Container>
        </div>
      );
    } if (itemSelected === 'aromes') {
      return (
        <div className="AdminWineHouse" style={{ minHeight: height }}>
          <NavBar />
          <Container fluid className="container-dashboardAdmin">
            <Row>
              <Col md={3} className="menu-dashboardAdmin" style={{ minHeight: height }}>
                <Button className="item-menu-dashboardAdmin" onClick={() => this.handleClick('comptes')}>
                  <i className="fas fa-user" />
                  {'  '}
                  Gérer les comptes
                </Button>
                <Button className="item-menu-dashboardAdmin" onClick={() => this.handleClick('commentaires')}>
                  <i className="fas fa-comments" />
                  {'  '}
                  Gérer l&apos;analyse des commentaires
                </Button>
                <Button className="item-menu-dashboardAdmin" onClick={() => this.handleClick('aromes')}>
                  <i className="fas fa-apple-alt" />
                  {'  '}
                  Gérer les arômes
                </Button>
              </Col>
              <Col md={9}>
                <AdminAroma />
              </Col>
            </Row>
          </Container>
        </div>
      );
    }
    return null;
  }
}

export default AdminWineHouse;
