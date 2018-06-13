import React from 'react';
import axios from 'axios';
import { Box, TextInput, Button } from 'grommet';
import { connect } from 'react-redux';
import { formDataChange } from '../../../../../../actions/drafts';
import { Map, fromJS } from 'immutable';

class AutoFillWidget extends React.Component {
    constructor(){
        super();

        this.onChange = this.onChange.bind(this);
        this.autoFillFields = this.autoFillFields.bind(this);
    }

    autoFillFields = (event) => {
        var url = this.props.options.url,
            value = event.target.value.toUpperCase(),
            fieldsMap = this.props.options.fields_map,
            formData = fromJS(this.props.formData);

        axios.get(`${url}${value}`)
            .then(({ data }) => {
                var _data = fromJS(data);
                fieldsMap.map((el) => {
                    formData = formData.setIn(el[1], _data.getIn(el[0]));
                });
                this.props.formDataChange(formData.toJS());
            });
    };

    onChange = (event) => {
        return this.props.onChange(event.target.value.toUpperCase());
    };

    render(){
        return (
            <TextInput 
                id={this.props.id}
                name={this.props.id}
                onDOMChange={this.onChange}
                onBlur={this.autoFillFields}
                value={this.props.value || ""}
            />
        );
    }
}

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
)(AutoFillWidget);
