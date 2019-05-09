import importDataField from "./importDataField";
import CapFiles from "./CapFiles";
import JSONEditorField from "./JSONEditorField/JSONEditorField";
import AccordionJSONEditorField from "./JSONEditorField/AccordionJSONEditorField";
import ServiceIDGetter from "./ServiceIDGetter";

const fields = {
  ImportDataField: importDataField,
  CapFiles: CapFiles,
  jsoneditor: JSONEditorField,
  accordion_jsoneditor: AccordionJSONEditorField,
  idFetcher: ServiceIDGetter
};

export default fields;
