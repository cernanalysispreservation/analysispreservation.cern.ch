import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {
  Box,
  Title,
  Button,
  Label,
  Paragraph,
  Value,
  Table,
  TableRow
} from 'grommet';
import DownloadIcon from 'grommet/components/icons/base/Download';

import {getAnalysisOutputs} from '../../actions/published';

export class RerunOutputs extends React.Component {

  componentDidMount() {
    this.props.getAnalysisOutputs();
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
            {data && data.map((item) => 
                <TableRow>
                  <td>
                    {item.name}
                  </td>
                  <td>
                    {item.size}
                  </td>
                  <td>
                    <a href={`http://reana-dev.cern.ch:32338/api/analyses/workflow.1/workspace/outputs/${item.name}?token=vesr7dxygvUR4AM8TAIz0RUmELJC197cqD1Fu_xqfdI&organization=default`}>
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

