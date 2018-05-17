# react-desc

[![Slack](http://alansouzati.github.io/artic/img/slack-badge.svg)](http://slackin.grommet.io)
[![Build Status](https://travis-ci.org/grommet/react-desc.svg?branch=master)](https://travis-ci.org/grommet/react-desc)
[![Code Climate](https://codeclimate.com/github/grommet/react-desc/badges/gpa.svg)](https://codeclimate.com/github/grommet/react-desc)
[![Test Coverage](https://codeclimate.com/github/grommet/react-desc/badges/coverage.svg)](https://codeclimate.com/github/grommet/react-desc/coverage)

Add an schema to your React components based on React PropTypes

## Installation

```bash
npm install react-desc
```

## Usage

### Adding documentation

```javascript
// Anchor.js

import React from 'react';
import ReactPropTypes from 'prop-types';
import { schema, PropTypes } from 'react-desc';

const Anchor = (props) => {
  const { path, ...rest } = props;
  return (
    <a href={path} {...rest}>{props.children}</a>
  );
};

schema(Anchor, {
  description: 'A text link',
  props: {
    path: [
      PropTypes.string, 'React-router path to navigate to when clicked', {
        required: true
      }
    ],
    href: [PropTypes.string, 'link location.', {
      deprecated: 'use path instead'
    }],
    id: ReactPropTypes.string, // this will be ignored for documentation purposes
    title: [
      (prop, propName) => { return ... }, 'title used for accessibility.', {
        format: 'XXX-XX'
      }
    ],
    target: [PropTypes.string, 'target link location.', {
      defaultProp: '_blank'
    }]
  }
});

export default Anchor;
```

### Accessing documentation

* JSON output

  ```javascript
    import { getDocAsJSON } from 'react-desc';
    import Anchor from './Anchor';

    const documentation = getDocAsJSON(Anchor);
  ```

  Expected output:

  ```json
    {
        "name": "Anchor",
        "description": "A text link",
        "properties": [
          {
            "description": "React-router path to navigate to when clicked",
            "name": "path",
            "required": true,
            "format": "string"
          },
          {
            "description": "link location.",
            "name": "href",
            "deprecated": "use path instead",
            "format": "string"
          },
          {
            "description": "title used for accessibility.",
            "name": "title",
            "format": "XXX-XX"
          },
          {
            "description": "target link location.",
            "name": "target",
            "defaultValue": "_blank",
            "format": "string"
          }
        ]
      }
  ```

* Markdown output

  ```javascript
    import { getDocAsJSON } from 'react-desc';
    import Anchor from './Anchor';

    const documentation = getDocAsMarkdown(Anchor);
  ```

  Expected output:

  ```markdown
    ## Anchor Component
    A text link

    ### Properties

    | Property | Description | Format | Default Value | Required | Details |
    | ---- | ---- | ---- | ---- | ---- | ---- |
    | **path** | React-router path to navigate to when clicked | string |  | Yes |  |
    | **~~href~~** | link location. | string |  | No | **Deprecated**: use path instead |
    | **title** | title used for accessibility. | XXX-XX |  | No |  |
    | **target** | target link location. | string | _blank | No |  |
  ```

## API

* `schema(component, schema)`

  Documents a ReactJS component where schema is a required object with metadata
  about the component.

  Schema known attributes are:

    * **description**: required string with the component description.
    * **props**: optional object with the properties in the following format:

        ```
          {
            propName: [
              PropTypes.string, 'description', {
                required: true
              }
            ]
          }
        ```

        Use a regular React.PropType if you want to skip schema for a given
        property.
    * **deprecated**: optional string with the deprecation message.

* `docPropType(validate, description, options)`

   Documents a propType where description is a required explanation about the property. Validate is the PropType which is required to be an instance from `react-desc`, **not** from `react`. The reason is that react desc project needs to augment the react PropType with the documentation for the given component that allow it to work without an AST parser.

   Options are:

    * **deprecated**: optional string with the deprecation message.
    * **required**: optional boolean that indicates whether the property is required or not.
    * **format**: optional string that defines the propType format. It can be useful when used in conjuction with custom propType validation function.

* `getDocAsJSON(component)`

  Returns a JSON object with the documentation for the given component.

* `getDocAsMarkdown(component)`

  Returns a Markdown string with the documentation for the given component.

* `PropTypes`

  Wrapper around the React propTypes, all properties are supported. See all options [here](https://facebook.github.io/react/docs/typechecking-with-proptypes.html).

## Why not [react-docgen](https://github.com/reactjs/react-docgen)?

react-docgen is a great project but it relies on an AST parser to generate documentation. Most of the time this is ok, but for us the following use cases were hard to solve without a more verbose way to define propTypes:

* Define deprecated properties
* Define a required property for custom function:

  ```javascript
  Anchor.propTypes = {
    test: () => { ... } // isRequired is not present here
  }
  ```
* Allow internal comments for properties without it showing up in the documentation

## Limitations

`react-docgen` base documentation on comments, which are automatically removed by most bundling tools out there (e.g. webpack). This is not the case with `react-desc`. We augment the propTypes object with documentation and this can affect the size of your bundle. We recommend you to use [babel-plugin-transform-react-remove-prop-types](https://github.com/oliviertassinari/babel-plugin-transform-react-remove-prop-types) to remove unnecessary propTypes from production build, which is a good idea anyways.
