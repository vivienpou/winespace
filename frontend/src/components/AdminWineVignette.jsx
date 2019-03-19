import React from 'react';
import './AdminWineVignette.scss';
import {
  Row,
  Col,
  Button,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import Zoom from 'react-reveal/Zoom';

const AdminWineVignette = (props) => {
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
    isAdmin,
  } = props;

  return (
    <Col xs="12" md="6" lg="4" className="admin-wine-vignette">
      <Zoom>
        <Link
          to={{
            pathname: '/admin-wine-detail',
            state: {
              id,
            },
          }}
        >
          <Row className={`container-clw-adm ${borderColor}`}>
            <Col md="3" className="container-img-clw-adm">
              <img src={picture} alt="Bouteille de vin" className="img-fluid img-clw-adm" />
            </Col>
            <Col md="9" className="container-txt-clw-adm">
              <h5 className="title-clw-adm">{title}</h5>
              <h6>{castle}</h6>
              <ul className="list-txt-clw-adm">
                <li>{color}</li>
                <li>{millesime}</li>
                <li>{appellation}</li>
              </ul>
            </Col>
          </Row>
        </Link>
        <div>
          {isAdmin === 1 && (
          <div className="container-btn-clw-adm">
            <Button className="btn-clw-adm btn-delete-clw-adm" color="danger" value={id} onClick={toggle}>Supprimer</Button>
            <Link
              to={{
                pathname: '/admin-wine-modif',
                state: {
                  id,
                },
              }}
            >
              <Button className="btn-clw-adm btn-modify-clw-adm" color="success">Modifier</Button>
            </Link>
          </div>
          )}
        </div>
      </Zoom>
    </Col>
  );
};

export default AdminWineVignette;
