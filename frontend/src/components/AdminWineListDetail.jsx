/* This is a detail view of a wine */
import React from 'react';
import './AdminWineListDetail.scss';
import {
  Row,
  Col,
  Button,
} from 'reactstrap';
import { Link } from 'react-router-dom';
// we use Zoom library to animate while opening
import Zoom from 'react-reveal/Zoom';

const AdminWineListDetail = (props) => {
  const {
    id,
    picture,
    title,
    castle,
    color,
    millesime,
    appellation,
    borderColor,
    toggle,
  } = props;
  return (
    <Col xs="12" md="6" lg="4" className="AdminWineListDetail">
      <Zoom>
        <Link
          to={{
            pathname: '/admin-wine-detail',
            state: {
              id,
            },
          }}
        >
          <Row className={`cntnr-wl-dtl-adm ${borderColor}`}>
            <Col md="3" className="cntnr-img-wl-dtl-adm">
              <img src={picture} alt="Bouteille de vin" className="img-fluid img-wl-dtl-adm" />
            </Col>
            <Col md="9" className="cntnr-txt-wl-dtl-adm">
              <h5 className="title-wl-dtl-adm">{title}</h5>
              <h6>{castle}</h6>
              <ul className="list-txt-wl-dtl-adm">
                <li>{color}</li>
                <li>{millesime}</li>
                <li>{appellation}</li>
              </ul>
            </Col>
          </Row>
        </Link>
        <div className="cntnr-btn-wl-dtl-adm">
          <Button className="btn-wl-dtl-adm btn-delete-wl-dtl-adm" color="danger" value={id} onClick={toggle}>Supprimer</Button>
          <Link
            to={{
              pathname: '/admin-wine-modif',
              state: {
                id,
              },
            }}
          >
            <Button className="btn-wl-dtl-adm btn-modify-wl-dtl-adm" color="success">Modifier</Button>
          </Link>
        </div>
      </Zoom>
    </Col>
  );
};

export default AdminWineListDetail;
