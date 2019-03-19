import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import './Modale.scss';


const Modale = ({ isOpen, texte }) => (
  <Modal
    style={{ height: 300, width: 300 }}
    isOpen={isOpen}
    modalTransition={{ timeout: 700 }}
    backdropTransition={{ timeout: 1300 }}
  >
    <ModalBody>
      {texte}
    </ModalBody>
  </Modal>
);

export default Modale;
