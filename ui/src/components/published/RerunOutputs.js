import React from 'react';
// import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {
  Box,
  Table,
  TableRow
} from 'grommet';
import DownloadIcon from 'grommet/components/icons/base/Download';

import {getAnalysisOutputs} from '../../actions/published';

export class RerunOutputs extends React.Component {

  componentDidMount() {
    this.props.getAnalysisOutputs(this.props.workflow_id);
  }

  render() {
    let data = this.props.outputs;
    return (
      <Box>
      <Table>
          <thead>
            <tr>
              <th>
                File
              </th>
              <th>
                Size
              </th>
              <th>
                Download
              </th>
            </tr>
          </thead>
          <tbody>
            {data && data.map((item, i) =>
                <TableRow key={`item-${i}`}>
                  <td>
                    {item.name}
                  </td>
                  <td>
                    {item.size}
                  </td>
                  <td>
                    <a href={`http://reana-qa.cern.ch/api/analyses/${this.props.workflow_id}/workspace/outputs/${item.name}?token=BPIfQ93pAGRLv0FiQI0UE4S7Qvfb2NabH81m1o82cLg&organization=default`}>
                    <DownloadIcon /></a>
                  </td>
                </TableRow>
              )
            }
          </tbody>
        </Table>
      </Box>
    );
  }
}

RerunOutputs.propTypes = {};

function mapStateToProps(state) {
  return {
    outputs: state.published.getIn(['current_run', 'outputs'])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAnalysisOutputs: (id) => dispatch(getAnalysisOutputs(id))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RerunOutputs);

