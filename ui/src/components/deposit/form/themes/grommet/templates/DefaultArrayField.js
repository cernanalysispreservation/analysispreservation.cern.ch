import React from 'react';
import PropTypes from 'prop-types';

import {
    Box,
    List,
    ListItem
} from 'grommet';

import ArrayUtils from '../components/ArrayUtils';

class DefaultArrayField extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Box margin="none" size={{height: {max: "small"}}} >
                {this.props.items.length > 0 &&
                <Box margin={{top: "small", bottom: "medium"}}>
                    <List>
                        { this.props.items.length > 0 ?
                        this.props.items.map(element => (
                            <ListItem key={element.index} separator="none" pad="none">
                                <Box flex={true}>
                                    {element.children}
                                </Box>
                                {
                                    this.props.options && this.props.options.enableArrayUtils ?
                                    <ArrayUtils
                                        hasRemove={element.hasRemove}
                                        hasMoveDown={element.hasMoveDown}
                                        hasMoveUp={element.hasMoveUp}
                                        onDropIndexClick={element.onDropIndexClick}
                                        onReorderClick={element.onReorderClick}
                                        index={element.index}
                                    /> : null
                                }
                            </ListItem>
                        )) : null
                        }
                    </List>
                </Box>
                }
            </Box>
        );
    }
}

DefaultArrayField.propTypes = {
    items: PropTypes.array
};

export default DefaultArrayField;
