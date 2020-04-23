# Tag Widget :smiley:

The tag input belongs to a wide collection of widgets:

- [x] Checkbox
- [x] Radio
- [x] Select
- [x] Switch
- [x] Tags
- [x] Text
- [x] TextArea
- [x] UpDown

This input is generated from the `react-tagsinput` [library](https://github.com/olahol/react-tagsinput),

### General Information

The UI ecosystem of the [CAP](https://github.com/cernanalysispreservation/analysispreservation.cern.ch) platform relies to two main projects

- React Json Schema Forms for the form architecture [link](https://github.com/rjsf-team/react-jsonschema-form)

* Grommet V1 for the UI framework [link](https://github.com/grommet/grommet/tree/v1)

### Properties

| Name            | type        | Required | Description                                                | Values                                      |
| --------------- | ----------- | -------- | ---------------------------------------------------------- | ------------------------------------------- |
| disabled        | `boolean`   | No       | Assigned from the `props`. Fetches the `readonly` property | `true`or`false`                             |
| value           | `array`     | Yes      | The list with the entered tags                             | [...]                                       |
| onChange        | `func`      | Yes      | Updates the list with the `tagged` inputs                  | ()=>{...}                                   |
| placeholder     | `string`    | Yes      | Message for the user to understand what should be typed    | Any `string` value                          |
| validationRegex | `regex`     | No       | Provide a `regex` to validate the tag input if wanted      | if no provided then all the inputs accepted |
| renderInput     | `input tag` | Yes      | An input tag to provide different ways to accept input     | Any `input` tag                             |

### Examples

- TagsInput

```
    <TagsInput
        disabled={this.props.readonly}
        value={this.state.tags}
        onChange={this.handleChange}
        className={"cap-react-tagsinput"}
        tagProps={{ className: "cap-react-tagsinput-tag" }}
        inputProps={{
        className: "cap-react-tagsinput-input",
        placeholder: this.props.placeholder
        }}
        renderInput={this.renderInput}
        maxTags={10}
        validationRegex={TAGS_REGEX}
        onValidationReject={this.onValidationReject}
    />
```

- Render Input

```
  renderInput(props) {
    let { onChange, value, ...other } = props;
    return (
      <input
        type="text"
        style={{ border: "none" }}
        onChange={onChange}
        value={value}
        {...other}
      />
    );
  }
```
