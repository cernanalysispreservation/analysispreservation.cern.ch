import importDataField from "./importDataField";
import CapFiles from "./CapFiles";
import JSONEditorField from "./JSONEditorField/JSONEditorField";
import AccordionJSONEditorField from "./JSONEditorField/AccordionJSONEditorField";
import ServiceIDGetter from "./ServiceIDGetter";
import RepoField from "./RepoField";

const fields = {
  ImportDataField: importDataField,
  CapFiles: CapFiles,
  jsoneditor: JSONEditorField,
  repo: RepoField,
  accordion_jsoneditor: AccordionJSONEditorField,
  idFetcher: ServiceIDGetter
};

export default fields;
