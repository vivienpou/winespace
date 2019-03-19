/* This component is displayed on the website with
Mon compte > Espace Administrateur > Gérer l'analyse des commentaires;

This is the parent of AdminPythonComments
*/

import React, { Component } from 'react';
import './AdminPython.scss';
import {
  Container,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import AdminPythonComments from './AdminPythonComments';

// these two constants allows to build the legend of category of words, used in the Modal.
const arrLegendFr = 'ADJ : adjectif,ADJWH : adjectif interrogatif,ADV : adverbe,ADVWH : adverbe interrogatif,CC : conjonction de coordination,CL : pronom clitique,CLO : pronom clitique objet,CLR : pronom clitique réfléchi,CLS : pronom clitique sujet,CS : conjonction de subordination,DET : déterminant,DETWH : déterminant interrogatif,ET : mot tiré d&apos;une langue étrangère,I : interjection,N : nom,NC : nom commun,NPP : nom propre,P : préposition,P+D : forme contractée préposition et déterminant,P+PRO : forme contractée préposition et pronom,PUNC : ponctuation,PREF : préfixe,PRO : pronom,PROREL : pronom relatif,PROWH : pronom interrogatif,V : verbe,VIMP : forme verbale à l&apos;impératif,VINF : forme verbale à l&apos;infinitif,VPP : participe passé,VPR : participe présent,VS : forme verbale au subjonctif';

const arrLegendEng = 'CC : coordinating conjunction,CD : cardinal digit,DT : determiner,EX : existential there (like : \'there is\' ... think of it like \'there exists\'),FW : foreign word,IN : preposition/subordinating conjunction,JJ : adjective \'big\',JJR : adjective, comparative\'bigger\',JJS : adjective, superlative \'biggest\',LS : list marker 1),MD : modal could, will,NN : noun, singular \'desk\',NNS : noun plural \'desks\',NNP : proper noun, singular \'Harrison\',NNPS : proper noun, plural \'Americans\',PDT : predeterminer \'all the kids\',POS : possessive ending parent\'s,PRP : personal pronoun I, he, she,PRP$ : possessive pronoun my, his, hers,RB : adverb very, silently,RBR : adverb, comparative better,RBS : adverb, superlative best,RP : particle give up,SYM : symbol,TO : to go \'to\' the store.,UH : interjection errrrrrrrm,VB : verb, base form take,VBD : verb, past tense took,VBG : verb, gerund/present participle taking,VBN : verb, past participle taken,VBP : verb, sing. present, non-3d take,VBZ : verb, 3rd person sing. present takes,WDT : wh-determiner which,WP : wh-pronoun who, what,WP$ : possessive wh-pronoun whose,WRB : wh-abverb where, when';

class AdminPython extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: '',
      modal: false,
      lang: 'fr',
    };
    this.toggle = this.toggle.bind(this);
    this.handleClickFr = this.handleClickFr.bind(this);
    this.handleClickEng = this.handleClickEng.bind(this);
  }

  componentDidMount() {
    // We put 77 cause it's the height of the navigation bar in pixels.
    const height = window.innerHeight - 77;
    this.setState({
      height,
    });
  }

  toggle() {
    const { modal } = this.state;
    this.setState({
      modal: !modal,
    });
  }

  handleClickFr() {
    this.setState({ lang: 'fr' });
  }

  handleClickEng() {
    this.setState({ lang: 'eng' });
  }

  render() {
    const {
      height,
      modal,
      lang,
    } = this.state;
    const { className } = this.props;
    return (
      <Container fluid className="AdminPython" style={{ height }}>
        {/* the modal component display the legend to explain categories of word */}
        <Modal isOpen={modal} toggle={this.toggle} className={className}>
          <ModalHeader toggle={this.toggle}>Légende</ModalHeader>
          <ModalBody>
            <Button className="btn-modal-adminPython" onClick={this.handleClickFr}>Français</Button>
            <Button className="btn-modal-adminPython" onClick={this.handleClickEng}>Anglais</Button>
            <ul>
              {
                (lang === 'fr')
                  ? arrLegendFr.split(',').map(item => <li>{item}</li>)
                  : arrLegendEng.split(',').map(item => <li>{item}</li>)
              }
            </ul>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggle}>Fermer</Button>
          </ModalFooter>
        </Modal>
        <div className="container-title-adminPython">
          <h1>
            <i className="fas fa-comments" />
            {' '}
            Analyse des commentaires de vins
          </h1>
        </div>
        <div>
          <Button onClick={this.toggle}>
            Voir la légende
            {' '}
            <i className="fas fa-external-link-alt" />
          </Button>
        </div>
        <AdminPythonComments />
      </Container>
    );
  }
}

export default AdminPython;
