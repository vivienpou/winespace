
/* This component is displayed on the website with
Mon compte > Espace Administrateur > Gérer les arômes;

This is the parent's component of AdminAromaFr & AdminAromaEng;
*/

import React, { Component } from 'react';
import { Button } from 'reactstrap';
import './AdminAroma.scss';
import AdminAromaFr from './AdminAromaFr';
import AdminAromaEng from './AdminAromaEng';

class AdminAroma extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // In the constructor, the state 'langSelected' is by default 'fr' to display french aromas.
      langSelected: 'fr',
    };
    this.handleClick = this.handleClick.bind(this);
  }
  // handleClick is the method to change 'langSelected' depending on the clicked flag's button

  handleClick(lang) {
    this.setState({
      langSelected: lang,
    });
  }

  render() {
    const { langSelected } = this.state;
    return (
      <div className="AdminAroma">
        <div className="container-btn-lang-aroma-admin">
          <Button className="btn-lang-aroma-admin" onClick={() => this.handleClick('fr')}>
            <img src="/images/fr-flag.png" alt="Français" className="img-lang-aroma-admin" />
          </Button>
          <Button className="btn-lang-aroma-admin" onClick={() => this.handleClick('ang')}>
            <img src="/images/uk-flag.png" alt="Anglais" className="img-lang-aroma-admin" />
          </Button>
        </div>
        {
          (langSelected === 'fr')
            ? <AdminAromaFr />
            : <AdminAromaEng />
        }
      </div>
    );
  }
}

export default AdminAroma;
