import React from 'react';
import './WineListDetail.scss';
import {
  Row,
  Col,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import Zoom from 'react-reveal/Zoom';

const WineListDetail = ({
  id,
  picture,
  title,
  castle,
  color,
  millesime,
  appellation,
  borderColor,
}) => (
  <Col xs="12" md="6" lg="4" className="WineListDetail">
    <Zoom>
      <Link
        to={{
          pathname: '/wine-detail',
          state: {
            id,
          },
        }}
      >
        <Row className={`container-wld ${borderColor}`}>
          <Col md="3" className="container-img-wld">
            <img src={picture} alt="Bouteille de vin" className="img-fluid img-wld" />
          </Col>
          <Col md="9" className="container-txt-wld">
            <h5 className="title-wld">{title}</h5>
            <h6>{castle}</h6>
            <ul className="list-txt-wld">
              <li>{color}</li>
              <li>{millesime}</li>
              <li>{appellation}</li>
            </ul>
          </Col>
        </Row>
      </Link>
    </Zoom>
  </Col>
);

export default WineListDetail;
