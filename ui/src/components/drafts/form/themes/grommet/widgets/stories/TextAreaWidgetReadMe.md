# TextArea Widget :smiley:

The textarea input belongs to a wide collection of widgets:

- [x] Checkbox
- [x] Radio
- [x] Select
- [x] Switch
- [x] Tags
- [x] Text
- [x] TextArea
- [x] UpDown

This input is generated from the textarea tag and then customised under the style guides of the platform.

### General Information

The UI ecosystem of the [CAP](https://github.com/cernanalysispreservation/analysispreservation.cern.ch) platform relies to two main projects

- React Json Schema Forms for the form architecture [link](https://github.com/rjsf-team/react-jsonschema-form)

* Grommet V1 for the UI framework [link](https://github.com/grommet/grommet/tree/v1)

### Properties

| Name     | type      | Required   | Description                                    | Values             |
| -------- | --------- | ---------- | ---------------------------------------------- | ------------------ |
| readonly | `boolean` | No         | Fetched from `props` and default value `false` | `true`or`false`    |
| onChange | `func`    | Yes        | Updates which `value` of the input.            | ()=>{...}          |
| onBlur   | `func`    | Yes        | The onBlur function is fetched from `props`    | ()=>{...}          |
| id       | `string`  | Yes        | The id is fetched from the `props`             | Any `string` value |
| name     | `string`  | Yes        | Assigned the `id` prop                         | Any `string` value |
| value    | `string`  | Yes        | The value is fetched from the `props`          | Any `string` value |
| rows     | `string`  | Predefined | Defines the number of the rows of the textarea | Any `number` value |
| type     | `string`  | Predefined | Defines the type of the textarea.              | The `text` value   |

### Example

- Text Input

```
    <textarea
      rows="3"
      type="text"
      id={this.props.id}
      name={this.props.id}
      onBlur={this.props.onBlur}
      value={this.props.value ? this.props.value : ""}
      onChange={this._onChange.bind(this)}
      style={{ fontSize: "1em" }}
    />
```

- If the readonly equals `true` then this text will be displayed

```
    <Box flex={true} pad={this.props.pad || { horizontal: "medium" }}>
      <Paragraph size="small" margin="none" style={{ color: "#a8a8a8" }}>
        {this.props.value || "empty value from the user"}
      </Paragraph>
    </Box>
```
