# Text Widget :smiley:

The checkbox input belongs to a wide collection of widgets:

- [x] Checkbox
- [x] Radio
- [x] Select
- [x] Switch
- [x] Tags
- [x] Text
- [x] TextArea
- [x] UpDown

This input is generated from the TextInput of the `Grommet` library and then customised under the style guides of the platform.

### General Information

The UI ecosystem of the [CAP](https://github.com/cernanalysispreservation/analysispreservation.cern.ch) platform relies to two main projects

- React Json Schema Forms for the form architecture [link](https://github.com/rjsf-team/react-jsonschema-form)

* Grommet V1 for the UI framework [link](https://github.com/grommet/grommet/tree/v1)

### Properties

| Name        | type      | Required | Description                                      | Values             |
| ----------- | --------- | -------- | ------------------------------------------------ | ------------------ |
| readonly    | `boolean` | No       | Fetched from `props` and default value `false`   | `true`or`false`    |
| onChange    | `func`    | Yes      | Updates the `value` of the input.                | ()=>{...}          |
| options     | `object`  | Yes      | Pass information to the widget from the `schema` | {}                 |
| placeholder | `string`  | Yes      | The placeholder of the input                     | Any `string` value |
| id          | `string`  | Yes      | The id is fetched from the `props`               | Any `string` value |
| name        | `string`  | Yes      | Assigned the `id` fetched from `props`           | Any `string` value |
| value       | `string`  | Yes      | Fetched the value of the input from `props`      | Any `string` value |

### Example

- Text Input

```
    <TextInput
      id={this.props.id}
      name={this.props.id}
      placeHolder={this.props.placeholder}
      onDOMChange={this._onChange}
      value={this.props.value || ""}
    />
```

- If the readonly equals `true` then the `<ReadOnlyText/>` will be displayed

| Name   | type     | Required | Description                                                  | Values                                   |
| ------ | -------- | -------- | ------------------------------------------------------------ | ---------------------------------------- |
| value  | `string` | Yes      | The value of the input                                       | Any `string` value                       |
| parent | `string` | Yes      | Pass information to the widget regarding the default message | Any `string` value                       |
| pad    | `string` | No       | Pass information to the widget regarding the padding         | `small` or `medium` or `large` or `none` |

```
    <Box flex={true} pad={props.pad || { horizontal: "medium" }}>
      <Paragraph size="small" margin="none" style={{ color: "#a8a8a8" }}>
        {value ||
          `this field value will be automatically loaded when a valid ${props
            .options.parent || "value from a parent"} will be provided`}
      </Paragraph>
    </Box>
```
