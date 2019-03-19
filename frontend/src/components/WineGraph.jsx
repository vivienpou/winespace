import React, { Component } from 'react';
// import { Bar } from 'react-chartjs-2';
import Radar from 'react-d3-radar';

// import { API_SERVER } from '../constants';
import './WineGraph.scss';


class WineGraph extends Component {
  componentDidMount() {
    // const { id } = this.props;
    // fetch(`${API_SERVER}/winelist/${id}`)
    //   .then(response => response.json())
    //   .then((datab) => {
    //     this.setState({
    //       datax: datab[0],
    //     });
    //   });
    // this.setState({
    // });
  }

  render() {
    // const { datax } = this.state;
    // const aroma_animal = 1;
    const legends = document.getElementsByTagName('text');
    for (let i = 0; i < legends.length; i += 1) {
      legends[i].setAttribute('fill', 'white');
    }
    return (
      <div className="WineGraph">
        <Radar
          width={500}
          height={500}
          padding={70}
          domainMax={5}
          highlighted={null}
          onHover={(point) => {
            if (point) {
              console.log('hovered over a data point');
            } else {
              console.log('not over anything');
            }
          }}
          data={{
            variables: [
              { key: 'aroma_red', label: 'Fruits rouges' },
              { key: 'aroma_dry', label: 'Fruits secs' },
              { key: 'aroma_flower', label: 'Floral' },
              { key: 'aroma_spice', label: 'Epicé' },
              { key: 'aroma_wood', label: 'Boisé' },
              { key: 'aroma_grill', label: 'Grillé' },
              { key: 'aroma_jam', label: 'Confituré' },
              { key: 'aroma_animal', label: 'Animal' },
              { key: 'aroma_vegetal', label: 'Végétal' },
              { key: 'aroma_citrus', label: 'Agrumes' },
              { key: 'aroma_white', label: 'Fruits blancs' },
              { key: 'aroma_exotic', label: 'Fruits exotiques' },
            ],
            sets: [
              {
                key: 'me',
                label: 'My Scores',
                values: {
                  aroma_red: 4,
                  aroma_dry: 5,
                  aroma_flower: 5,
                  aroma_spice: 2,
                  aroma_wood: 5,
                  aroma_grill: 1,
                  aroma_jam: 2,
                  aroma_animal: 3,
                  aroma_vegetal: 2,
                  aroma_citrus: 5,
                  aroma_white: 4,
                  aroma_exotic: 4,
                },
              },
            ],
          }}
        />
      </div>
    );
  }
}

export default WineGraph;
