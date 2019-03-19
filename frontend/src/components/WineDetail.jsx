import React, { Component } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import './WineDetail.scss';
import WineGraph from './WineGraph';
import { API_SERVER } from '../constants';
import NavBar from './NavBar';

class WineDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: '',
      data: [],
    };
    this.whichcolor = this.whichcolor.bind(this);
    this.whichyear = this.whichyear.bind(this);
  }

  componentDidMount() {
    const { location: { state: { id } } } = this.props;
    fetch(`${API_SERVER}/winelist/${id}`)
      .then(response => response.json())
      .then((datab) => {
        this.setState({
          data: datab,
        });
        this.whichcolor();
        this.whichyear();
      });
    const height = window.innerHeight;
    this.setState({
      height,
    });
  }

  whichcolor() {
    const { data } = this.state;
    if (data[0].couleur_wine === 'Rouge') {
      this.setState({ Color: 'Rouge' });
    } else if (data[0].couleur_wine === 'Rosé') {
      this.setState({ Color: 'Rose' });
    } else if (data[0].couleur_wine === 'Blanc') {
      this.setState({ Color: 'Blanc' });
    }
  }

  whichyear() {
    const { data } = this.state;
    if (data[0].millesime_wine.length <= 3) {
      this.setState({ year: 'year' });
    }
  }

  render() {
    const {
      height,
      Color,
      data,
      year,
    } = this.state;
    const { location: { state: { id } } } = this.props;
    return (
      <div className="WineDetail">
        <div className={Color}>
          <NavBar />
          <div className="winePage" style={{ minHeight: height }}>
            <Container fluid className="h-100">
              <NavLink to="/wine-list">
                <Button color="black" className="button_black">
                  <i className="fas fa-angle-left" />
                  {' '}
                  RETOUR
                </Button>
              </NavLink>
              {data.map(item => (
                <Row className="d-flex justify-content-center align-items-center">
                  <Col xs="12" lg="4" className="d-flex justify-content-center">
                    <img src={item.picture} alt="picture_logo" />
                  </Col>
                  <Col xs="12" lg="8" className="center">
                    <h1 className="bigsize">{item.name_wine}</h1>
                    <h2>{item.name_castle}</h2>
                    <br />
                    <p className="bold">
                      {item.region_wine}
                      -
                      {item.appellation}
                    </p>
                    <p>
                      <span className="bold">Couleur : </span>
                      {item.couleur_wine}
                    </p>
                    <p>{item.desc_wine}</p>
                    <p className="txt_justify">{item.txt_wine}</p>
                    <div className="bold">
                      <span className={year}>
                        Année :
                        {' '}
                        {item.millesime_wine}
                        {' '}
                        -
                      </span>
                      {' '}
                      Alc :
                      {' '}
                      {item.alcool_wine}
                      {' '}
                      %
                    </div>
                    <WineGraph id={id} />
                  </Col>
                </Row>
              ))}
            </Container>
          </div>
        </div>
      </div>
    );
  }
}

export default WineDetail;
