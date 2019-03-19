// This component is the house of al the analyze of comments and aroms
import React from 'react';
import {
  Table, Button, Row, Col, Label, Input, Form, Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  FormGroup,
} from 'reactstrap';
/* We use withRouter to wrap the export default component
to access the history object in the whole component. */
import { withRouter } from 'react-router-dom';
import './AdminPythonComments.scss';
// ClipLoader is a npm module, this is the animation of spinning while we analyze.
import { ClipLoader } from 'react-spinners';
import { API_SERVER } from '../constants';

class AdminPythonComments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      // we put random value in this state object to allows methods works.
      modification: {
        aroma_citrus: 2,
        aroma_dry: 3,
        aroma_exotic: 5,
        aroma_flower: 2,
        aroma_gourmet: 2,
        aroma_grill: 5,
        aroma_jam: 4,
        aroma_plants: 0,
        aroma_red: 0,
        aroma_spice: 5,
        aroma_underwood: 2,
        aroma_vegetal: 4,
        aroma_white: 5,
        aroma_wood: 5,
      },
      winesdata: [],
      loading: true,
    };
    this.fetchComments = this.fetchComments.bind(this);
    this.fetchAnalyzefr = this.fetchAnalyzefr.bind(this);
    this.fetchAnalyzeeng = this.fetchAnalyzeeng.bind(this);
    this.fetchEraseComment = this.fetchEraseComment.bind(this);
    this.fetchAromeng = this.fetchAromeng.bind(this);
    this.fetchAromfr = this.fetchAromfr.bind(this);
    this.toggle = this.toggle.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateAroms = this.updateAroms.bind(this);
  }

  componentDidMount() {
    this.fetchComments();
  }

  /* in this method, we filter the data (this.state.winesdata) retrieved from database;
  the state modification is then fill with the value. */
  aromscategories = (num) => {
    const { winesdata } = this.state;
    const obj = winesdata.filter(elem => elem.id === num);
    const modification = {
      aroma_citrus: obj[0].aroma_citrus,
      aroma_dry: obj[0].aroma_dry,
      aroma_exotic: obj[0].aroma_exotic,
      aroma_flower: obj[0].aroma_flower,
      aroma_gourmet: obj[0].aroma_gourmet,
      aroma_grill: obj[0].aroma_grill,
      aroma_jam: obj[0].aroma_jam,
      aroma_plants: obj[0].aroma_plants,
      aroma_red: obj[0].aroma_red,
      aroma_spice: obj[0].aroma_spice,
      aroma_underwood: obj[0].aroma_underwood,
      aroma_vegetal: obj[0].aroma_vegetal,
      aroma_white: obj[0].aroma_white,
      aroma_wood: obj[0].aroma_wood,
      aroma_animal: obj[0].aroma_animal,
    };
    this.setState({ modification, modal: true, currentid: num });
  }


  transcriptAroms=(data) => {
    /* is the method to transform data arrived from python;
    the data arrived in text, we removed some characters to make it stringified,
    then we transform it in json();
    the data mixed the aromas matched at 100% and at 50%, we separate them here
    in two constants to rebuild a new array of two arrays of datas.
     */
    if (data !== null && data.length > 10) {
      const datato = data;
      let aroms50cst = [];
      let aroms100cst = [];
      const aroms50 = datato.replace(/'/g, '"').replace('}], [', '}] ; [').slice(1, -2).split(';')[0].trim();
      const aroms100 = datato.replace(/'/g, '"').replace('}], [', '}] ; [').slice(1, -1).split(';')[1].trim();
      aroms50cst = JSON.parse(aroms50);
      aroms100cst = JSON.parse(aroms100);
      const result = [];
      result.push(aroms50cst);
      result.push(aroms100cst);
      return (result);
    }
    return 'null';
  }

  fetchComments() {
    this.setState({ loading: true });
    fetch(`${API_SERVER}/admin/comments`)
      .then(res => res.json())
      .then(data => this.setState({ winesdata: data }))
      .then(() => this.setState({ loading: false }));
  }

  fetchAnalyzefr(id) {
    const { loading } = this.state;
    this.setState({ loading: !loading });
    fetch(`${API_SERVER}/admin/comments/analyzefr?id=${id}`)
      .then(res => res.text())
      .then(() => this.fetchComments())
      .then(() => this.setState({ loading: !loading }));
  }

  fetchAnalyzeeng(id) {
    const { loading } = this.state;
    this.setState({ loading: !loading });
    fetch(`${API_SERVER}/admin/comments/analyzeeng?id=${id}`)
      .then(res => res.text())
      .then(() => this.fetchComments())
      .then(() => this.setState({ loading: !loading }));
  }

  fetchEraseComment(id) {
    fetch(`${API_SERVER}/admin/comments-analyzed/${id}`, {
      method: 'put',
      body: '',
    })
      .then(() => this.fetchComments());
  }

  fetchAromeng(id) {
    const { loading } = this.state;
    this.setState({ loading: !loading });
    fetch(`${API_SERVER}/admin/comments/aromeng?id=${id}`)
      .then(res => res.text())
      .then(() => this.fetchComments())
      .then(() => this.setState({ loading: !loading }));
  }

  fetchAromfr(id) {
    const { loading } = this.state;
    this.setState({ loading: !loading });
    fetch(`${API_SERVER}/admin/comments/aromfr?id=${id}`)
      .then(res => res.text())
      .then(() => this.fetchComments())
      .then(() => this.setState({ loading: !loading }));
  }

  handleChange(e) {
    const { modification } = this.state;
    modification[e.target.name] = e.target.value;
    this.setState(modification);
  }

  closeModal() {
    this.setState({
      modal: false,
    });
  }

  toggle() {
    const { modal } = this.state;
    this.setState({
      modal: !modal,
    });
  }

  updateAroms(id) {
    const { modal, modification } = this.state;
    this.setState({ modal: !modal });
    const url = `${API_SERVER}/admin/aroms/${id}`;
    fetch(url, {
      method: 'put',
      body: JSON.stringify(modification),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    // we put a timeout of 1 sec, to call the fetchComments method in order to refresh the results.
    setTimeout(() => this.fetchComments(), 1000);
  }

  render() {
    const {
      winesdata, loading, modification, currentid, modal,
    } = this.state;
    return (
      <div className="AdminPythonComments">
        <Modal
          isOpen={modal}
          modalTransition={{ timeout: 400 }}
          backdropTransition={{ timeout: 700 }}
          toggle={this.toggle}
          className="modal-lg"
        >
          <ModalHeader className="modal-lg">
            Notation des catégories d&apos;arômes pour ce commentaire
          </ModalHeader>
          <ModalBody className="modal-lg bg-info">
            <Form>
              <Row>
                {Object.keys(modification).map(
                  column => (
                    <Col lg={3}>
                      <FormGroup>
                        <Label>{column}</Label>
                        <Input
                          name={column}
                          value={modification[column]}
                          onChange={this.handleChange}
                        />
                      </FormGroup>
                    </Col>
                  ),
                )}
              </Row>
            </Form>
          </ModalBody>
          <ModalFooter className="modal-lg">
                                Voulez-vous conserver ces modifications ?
            <Button color="primary" className="ml-2" onClick={() => this.updateAroms(currentid)}>Oui</Button>
            {' '}
            <Button color="danger" onClick={this.closeModal}>Non</Button>
          </ModalFooter>
        </Modal>
        <div className="under-admin-python-comments">
          {winesdata.map(wine => (
            <div className="card-admin-python-comments" key={wine.id}>
              <h3 className="title-card-admin-python-comments">
                {wine.name_wine}
              </h3>
              <h4 className="subtitle-card-admin-python-comments">
                {wine.name_castle}
                {' '}
                {wine.millesime_wine}
                {' '}
                {wine.couleur_wine}
              </h4>
              <p className="para-com-admin-python-comments">
                <span className="com-admin-python-comments">Commentaire : </span>
                {wine.comment_wine}
              </p>
              <div>
                {
                  (wine.comment_wine_analyzed === '')
                    ? (
                      <div className="analyze-admin-python-comments">
                        <span className="notanalyzed">Non analysé</span>
                        {
                          loading
                            ? (
                              <div className="sweet-loading">
                                <ClipLoader
                                  sizeUnit="px"
                                  size={50}
                                  color="#123abc"
                                  loading={loading}
                                />
                              </div>
                            )
                            : ''
                        }
                        <div className="d-flex mt-2">
                          <Button className="d-flex align-items-center mr-2" color="success" onClick={() => this.fetchAnalyzefr(wine.id)} type="submit">
                            Analyse FR
                            <i className="ml-2 fab fa-python fa-2x fa-spin" />
                          </Button>
                          <Button className="d-flex align-items-center" color="success" onClick={() => this.fetchAnalyzeeng(wine.id)} type="submit">
                            Analyse EN
                            <i className="ml-2 fab fa-python fa-2x fa-spin" />
                          </Button>
                        </div>
                      </div>
                    )
                    : (
                      <div className="container-analyze-admin-python-comments">
                        <div className="words-analyze-admin-python-comments">
                          <span className="title-analyze-admin-python-comments">Analyse : </span>
                          {/* we build above the pos tagging with different
                          className's color depends on the category */}
                          {
                            wine.comment_wine_analyzed == null
                              ? <div>null</div>
                              : wine.comment_wine_analyzed.split(',').map((word) => {
                                const wordSplitted = word.split(':');
                                let result = null;
                                if (wordSplitted[1] === "'NC'" || wordSplitted[1] === "'NPP'" || wordSplitted[1] === "'N'" || wordSplitted[1] === "'NN'" || wordSplitted[1] === "'NNS'" || wordSplitted[1] === "'NNP'") {
                                  result = (
                                    <div className="word blue">
                                      <span className="word-weight">{wordSplitted[0]}</span>
                                      {' '}
                                      {wordSplitted[1]}
                                    </div>
                                  );
                                } else if (wordSplitted[1] === "'DET'" || wordSplitted[1] === "'DT'") {
                                  result = (
                                    <div className="word orange">
                                      <span className="word-weight">{wordSplitted[0]}</span>
                                      {' '}
                                      {wordSplitted[1]}
                                    </div>
                                  );
                                } else if (wordSplitted[1] === "'V'" || wordSplitted[1] === "'VBD'" || wordSplitted[1] === "'VB'" || wordSplitted[1] === "'VPR'" || wordSplitted[1] === "'VPP'") {
                                  result = (
                                    <div className="word red">
                                      <span className="word-weight">{wordSplitted[0]}</span>
                                      {' '}
                                      {wordSplitted[1]}
                                    </div>
                                  );
                                } else if (wordSplitted[1] === "'ADV'") {
                                  result = (
                                    <div className="word green">
                                      <span className="word-weight">{wordSplitted[0]}</span>
                                      {' '}
                                      {wordSplitted[1]}
                                    </div>
                                  );
                                } else if (wordSplitted[1] === "'CLS'") {
                                  result = (
                                    <div className="word yellow">
                                      <span className="word-weight">{wordSplitted[0]}</span>
                                      {' '}
                                      {wordSplitted[1]}
                                    </div>
                                  );
                                } else if (wordSplitted[1] === "'ADJ'" || wordSplitted[1] === "'JJ'") {
                                  result = (
                                    <div className="word pink">
                                      <span className="word-weight">{wordSplitted[0]}</span>
                                      {' '}
                                      {wordSplitted[1]}
                                    </div>
                                  );
                                } else {
                                  result = (
                                    <div className="word grey">
                                      <span className="word-weight">{wordSplitted[0]}</span>
                                      {' '}
                                      {wordSplitted[1]}
                                    </div>
                                  );
                                }
                                return result;
                              })
                          }
                          <Row className="matching-analyze-admin-python-comment">
                            <h2 className="tle-match-admin-python-comment">Analyse des arômes du commentaire</h2>
                            <Col md={6}>
                              <h3 className="tle-table-admin-python-comment">Similitude à 50%</h3>
                              <Table hover>
                                <thead className="thead-admin-python-comment">
                                  <tr className="">
                                    <th>Arômes du commentaire</th>
                                    <th>Arômes en base de données</th>
                                    <th>Catégorie d&apos;arômes</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {
                                    typeof (this.transcriptAroms(wine.aroms_analyzed)[0]) === 'string'
                                      ? (
                                        <tr>
                                          <td colSpan="3" className="text-center">
                                            <i className="fas fa-times-circle" />
                                            {' '}
                                            No matching
                                          </td>
                                        </tr>
                                      )
                                      : (
                                        this.transcriptAroms(wine.aroms_analyzed)[0].map(e => (
                                          <tr key={e.id}>
                                            <td className="arom">{e[Object.keys(e)[0]]}</td>
                                            <td className="arom">{e[Object.keys(e)[1]]}</td>
                                            <td className="arom">{e[Object.keys(e)[2]]}</td>
                                          </tr>
                                        ))
                                      )
                                  }
                                </tbody>
                              </Table>
                            </Col>
                            <Col md={6}>
                              <h3 className="tle-table-admin-python-comment">Similitude à 100%</h3>
                              <Table hover>
                                <thead className="thead-admin-python-comment">
                                  <tr>
                                    <th>Arômes du commentaire</th>
                                    <th>Arômes en base de données</th>
                                    <th>Catégorie d&apos;arômes</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {
                                    typeof (this.transcriptAroms(wine.aroms_analyzed)[0]) === 'string'
                                      ? (
                                        <tr>
                                          <td colSpan="3" className="text-center">
                                            <i className="fas fa-times-circle" />
                                            {' '}
                                            No matching
                                          </td>
                                        </tr>
                                      )
                                      : (
                                        (this.transcriptAroms(wine.aroms_analyzed)[1].map(e => (
                                          <tr key={e.id}>
                                            <td className="arom">{e[Object.keys(e)[0]]}</td>
                                            <td className="arom">{e[Object.keys(e)[1]]}</td>
                                            <td className="arom">{e[Object.keys(e)[2]]}</td>
                                          </tr>
                                        )))
                                      )
                                  }
                                </tbody>
                              </Table>
                            </Col>
                          </Row>
                          <Row className="d-flex justify-content-center">
                            <Button
                              className="m-2"
                              onClick={() => this.aromscategories(wine.id)}
                              type="submit"
                              color="success"
                            >
                              Modifier les notations d&apos;arômes pour ce commentaire
                            </Button>
                          </Row>
                        </div>
                        <div className="d-flex justify-content-center mt-4 mb-2">
                          <Button
                            className="mr-2"
                            onClick={() => this.fetchEraseComment(wine.id)}
                            type="submit"
                            color="danger"
                          >
                            Supprimer
                            <i className="ml-2 fas fa-trash-alt" />
                          </Button>
                          <Button
                            className="mr-2"
                            onClick={() => this.fetchAnalyzefr(wine.id)}
                            type="submit"
                            color="success"
                          >
                            Analyse FR
                            <i className="ml-2 fab fa-1x fa-python" />
                          </Button>
                          <Button
                            onClick={() => this.fetchAnalyzeeng(wine.id)}
                            type="submit"
                            color="success"
                          >
                            Analyse ENG
                            <i className="ml-2 fab fa-1x fa-python" />
                          </Button>
                          <Button
                            onClick={() => this.fetchAromeng(wine.id)}
                            type="submit"
                            color="primary"
                            className="ml-2"
                          >
                            Arômes ENG
                          </Button>
                          <Button
                            onClick={() => this.fetchAromfr(wine.id)}
                            type="submit"
                            color="primary"
                            className="ml-2"
                          >
                            Arômes FR
                          </Button>
                        </div>
                        {loading
                          ? (
                            <div className="sweet-loading">
                              <ClipLoader
                                sizeUnit="px"
                                size={50}
                                color="#123abc"
                                loading={loading}
                              />
                            </div>
                          ) : '' }
                      </div>
                    )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default withRouter(AdminPythonComments);
