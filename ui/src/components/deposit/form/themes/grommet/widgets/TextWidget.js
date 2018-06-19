import axios from 'axios';
import React from 'react';
import PropTypes from 'prop-types';

import { Box, TextInput } from 'grommet';
import { connect } from 'react-redux';
import { formDataChange } from '../../../../../../actions/drafts';
import { fromJS } from 'immutable';

class TextWidget extends React.Component{
    /* To use suggestions, add in options file for your schema, e.g
     * "my_field": {
     *       "ui:options":{
     *           "suggestions": "/api/lhcb/analysis?query="
     *        }
     * }
     * input value will be appended to url
     * 
     * To autofill other fields, specify url and fields map,    
     * as an array of pairs [from, to], where both are arrays with full paths to fields, e.g
     * "my_field": {
     *       "ui:options":{
     *         "autofill_from": "/api/lhcb/analysis/details?title=",
     *         "autofill_fields": [
     *             [["measurement", "measurement_detail"],["basic_info", "measurement", 0]],
     *             [["another_field_from"],["field_name", "status_field"]],
     *         ]
     *     }
     * }
     * input value will be appended to url
     */
    constructor(){
        super();
        this.state = {
            suggestions: []
        };
    }

    // TOFIX onBlur, onFocus
    _onChange = (_ref) => {
        let value = _ref.target.value;
        return this.props.onChange(value === '' ? this.props.options.emptyValue : value);
    };

    updateSuggestions = (event) => {
        axios.get(`${this.props.options.suggestions}${event.target.value}`)
            .then(({ data }) => {
                this.setState({
                    suggestions: data
                });
            });

        return this.props.onChange(event.target.value);
    }

    updateValueOnSuggestion = ({ suggestion }) => {
        return this.props.onChange(suggestion);
    }

    autoFillOtherFields = (event) => {
        var url = this.props.options.autofill_from,
            fieldsMap = this.props.options.autofill_fields,
            formData = fromJS(this.props.formData);

        axios.get(`${url}${event.target.value}`)
            .then(({ data }) => {
                var _data = fromJS(data);
                fieldsMap.map((el) => {
                    formData = formData.setIn(el[1], _data.getIn(el[0]));
                });
                this.props.formDataChange(formData.toJS());
            });
    };

    render(){
        return (
            <Box flex={true} pad={{'horizontal': 'medium'}}>
                <TextInput
                    id={this.props.id}
                    name={this.props.id}
                    placeHolder={this.props.placeholder}
                    onDOMChange={this._onChange}
                    {...(this.props.readonly ? {
                        readOnly: 'true'
                    } : {})}
                    {...(this.props.options.suggestions ? {
                        suggestions: this.state.suggestions,
                        onDOMChange: this.updateSuggestions,
                        onSelect: this.updateValueOnSuggestion
                    } : {})}
                    {...(this.props.options.autofill_from ? {
                        onBlur: this.autoFillOtherFields
                    } : {})}
                    value={this.props.value || ''}/>
            </Box>
        );
    }
};

TextWidget.propTypes = {
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    id: PropTypes.string,
    value: PropTypes.string,
    options: PropTypes.object,
    placeholder: PropTypes.string
};

function mapStateToProps(state) {
    return {
        formData: state.drafts.getIn(['current_item', 'formData'])
    };
}

function mapDispatchToProps(dispatch) {
    return {
        formDataChange: (data) => dispatch(formDataChange(data))
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TextWidget);
