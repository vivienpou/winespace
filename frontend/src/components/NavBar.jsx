import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  FormGroup,
  Input,
  Button,
} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import './NavBar.scss';

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = {
      isOpen: false,
      isAdmin: true,
      isWineList: false,
    };
  }

  onChange(e) {
    const { fetchWineSearch } = this.props;
    fetchWineSearch(e.target.value);
  }

  toggle() {
    const { isOpen } = this.state;
    this.setState({
      isOpen: !isOpen,
    });
  }

  render() {
    const { isOpen, isAdmin, isWineList } = this.state;
    return (
      <div className="NavBar">
        <Navbar dark className="navbar_wrap" expand="md">
          { isAdmin
            ? (
              <NavbarBrand>
                <NavLink to="/admin-wine-list">
                  <img
                    className="logo_winespace"
                    src="./images/Logo.png"
                    alt="the_logo"
                  />
                </NavLink>
                <NavLink to="/admin-wine-create"><Button className="nvbadmin_button center" color="success">Créer une fiche</Button></NavLink>
              </NavbarBrand>
            )
            : (
              <NavbarBrand>
                <NavLink to="wine-list">
                  <img
                    className="logo_winespace"
                    src="./images/Logo.png"
                    alt="the_logo"
                  />
                </NavLink>
              </NavbarBrand>
            )}
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {isWineList && (
              <FormGroup className="pt-1 pr-5">
                <Input
                  type="search"
                  name="search"
                  id="exampleSearch"
                  placeholder="Rechercher"
                  onChange={this.onChange}
                />
              </FormGroup>
              )}
              <UncontrolledDropdown className="drop_wrap" nav inNavbar>
                <DropdownToggle className="navbar_text" nav caret>
                    Mon Compte
                </DropdownToggle>
                <DropdownMenu className="dropdownMenu" right>
                  {isAdmin && (
                  <NavLink to="/admin-wine-house">
                    <DropdownItem className="dropdownItem">
                    Espace administrateur
                    </DropdownItem>
                  </NavLink>
                  )}
                  <NavLink to="/">
                    <DropdownItem className="dropdownItem">
                      Déconnexion
                    </DropdownItem>
                  </NavLink>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}
