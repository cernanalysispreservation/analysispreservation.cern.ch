import axios from 'axios';

import React from 'react';
import PropTypes from 'prop-types';

import { Box, TextInput} from 'grommet';

class AutocompleteWidget extends React.Component{
    constructor(){
        super();
        this.state = {
            suggestions: []
        };
    }

    updateSuggestions = (event) => {
        axios.get(`${this.props.options.url}?query=${event.target.value}`)
            .then(({ data }) => {
                this.setState({
                    suggestions: data
                })
            })

        return this.props.onChange(event.target.value);
    }

    updateValueOnSuggestion = ({ suggestion }) => {
        return this.props.onChange(suggestion);
    }

    render(){
        return (
            <TextInput
                id={this.props.id}
                name={this.props.id}
                suggestions={this.state.suggestions}
                onDOMChange={this.updateSuggestions}
                onSelect={this.updateValueOnSuggestion}
                value={this.props.value || ""}
                inline={true}
            />
        );
    }
};

AutocompleteWidget.propTypes = {
    onDOMChange: PropTypes.func,
    id: PropTypes.string,
    value: PropTypes.string,
};

export default AutocompleteWidget;
