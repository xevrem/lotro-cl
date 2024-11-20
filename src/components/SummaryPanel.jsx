/*
Copyright 2018 Erika Jonell

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SummaryPanel.scss';

import { Panel } from './Common';

import { getStore } from './../Store';
import { ACTION_TYPES } from './../constants';
import { openDatabase, get_all_deeds } from './../database';

class SummaryPanel extends Component {
  /** @type {{
  characters: any[];
  selected_character: number;
  }} */
  props;

  constructor(props) {
    super(props);
    this.state = { deeds: null };

    //ensure deeds are loaded after initialization is complete
    getStore().subscribe(
      ACTION_TYPES.INITIALIZATION_DONE,
      this.handle_deeds_update.bind(this)
    );
  }

  async handle_deeds_update() {
    //refresh deed data
    const database = await openDatabase();
    const deeds = await get_all_deeds(database);
    this.setState({ deeds });
  }

  render() {
    //dont render if no character selected
    if (
      !this.props.characters ||
      this.props.selected_character < 0 ||
      !this.state.deeds
    )
      return '';

    let total_deeds = 0; //1926;
    let total_quests = 0; //1553;

    let total_deeds_complete = 0; //500;
    let total_quests_complete = 0; //40;

    let character = this.props.characters[this.props.selected_character];
    let completed = character.completed;

    //tally deed total counts
    this.state.deeds.forEach((deed_type, i) => {
      deed_type.forEach((deed, j) => {
        switch (deed.Type) {
          case 'Q': //count quests separately
            total_quests++;
            if (completed[i]) {
              if (completed[i][j]) {
                total_quests_complete++;
              }
            }
            break;
          default:
            total_deeds++;
            if (completed[i]) {
              if (completed[i][j]) {
                total_deeds_complete++;
              }
            }
            break;
        }
      });
    });

    //account for potential NaNs
    let percent_deeds = (100.0 * (total_deeds_complete / total_deeds)).toFixed(
      2
    );
    let percent_quests = (
      100.0 *
      (total_quests_complete / total_quests)
    ).toFixed(2);
    percent_deeds = percent_deeds === 'NaN' ? 0.0 : percent_deeds;
    percent_quests = percent_quests === 'NaN' ? 0.0 : percent_quests;

    return (
      <Panel panel_class="container panel summary-panel">
        <h2 className="panel-header">Summary for {character.name}</h2>
        <div className="summary-details">
          <p style={{ display: 'inline-flex' }}>Deeds: </p>
          <p className="summary-stat">Total: {total_deeds}</p>
          <p className="summary-stat">Total Complete: {total_deeds_complete}</p>
          <p className="summary-stat">Percent Complete: {percent_deeds}%</p>
        </div>
        <div className="summary-details">
          <p style={{ display: 'inline-flex' }}>Quests: </p>
          <p className="summary-stat">Total: {total_quests}</p>
          <p className="summary-stat">
            Total Complete: {total_quests_complete}
          </p>
          <p className="summary-stat">Percent Complete: {percent_quests}%</p>
        </div>
      </Panel>
    );
  }
}

export default SummaryPanel;

SummaryPanel.propTypes = {
  characters: PropTypes.array,
  selected_character: PropTypes.number,
};
