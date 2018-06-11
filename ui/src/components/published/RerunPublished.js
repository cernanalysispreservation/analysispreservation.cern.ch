import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {
  Box,
  Title,
  Button
} from 'grommet';

import {getPublishedItem, rerunPublished} from '../../actions/published';

import CleanForm from '../deposit/form/CleanForm';

const schema = {
  type: "object",
  properties: {
      analysis: {
        title: "Analysis",
        type: "string"
      },
      input_parameters: {
        title: "Input Parameters",
        type: "object",
        properties: {
          n_events: {
            title: "nevents",
            type: "string"
          },
          mc_weight: {
            title: "MC Weight",
            type: "string"
          },
          ali_physics: {
            title: "AliPhysics",
            type: "string"
          }
      }
    }
  }
};

const uiSchema = {
  "analysis": {
    "ui:readonly": true
  },
  "input_parameters": {
    "ui:readonly": true
  }
};

const formData = {
  "analysis": "JetSpectrum"
}

export class RerunPublished extends React.Component {

  componentDidMount() {
    let {id} = this.props.match.params;
    this.props.getPublishedItem(id);
  }

  render() {
    let depid = this.props.published.metadata._deposit.id;
    let {id} = this.props.match.params;
    return (
      <Box size={{width: {min: "large"}}} flex={true}  wrap={false}>
        <Box align="center" justify="center">
          <Title>Rerun your analysis</Title>
        </Box>
        <Box align="center" flex={true} wrap={false}>
          <Box size={{width: "xlarge"}} pad="large" flex={false} wrap={false}>
              <CleanForm
                schema={schema}
                uiSchema={uiSchema}
                onSubmit={(data) => {
                  this.props.rerunPublished(depid, id);
                }}
                formData={formData}
              >
              <Box margin={{top:'small'}}>
                <Button
                  label='Run On Reana'
                  type='submit'
                  primary={true}
                />
              </Box>
            </CleanForm>
          </Box>
        </Box>
      </Box>
    )
  }
}

RerunPublished.propTypes = {};

function mapStateToProps(state) {
  return {
    published: state.published.getIn(['current_item', 'data'])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rerunPublished: (draft_id, id) => dispatch(rerunPublished(draft_id, id)),
    getPublishedItem: (id) => dispatch(getPublishedItem(id))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RerunPublished);
