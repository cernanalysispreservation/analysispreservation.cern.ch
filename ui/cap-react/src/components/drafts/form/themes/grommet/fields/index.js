import importDataField from "./importDataField";
import CapFiles from "./CapFiles";
import JSONEditorField from "./JSONEditorField/JSONEditorField";
import AccordionJSONEditorField from "./JSONEditorField/AccordionJSONEditorField";
import ServiceIDGetter from "./ServiceIdGetter";
import RepoField from "./RepoField";
import CernUsersField from "./CernUsersField";

const fields = {
  ImportDataField: importDataField,
  CapFiles: CapFiles,
  jsoneditor: JSONEditorField,
  repo: RepoField,
  accordion_jsoneditor: AccordionJSONEditorField,
  idFetcher: ServiceIDGetter,
  cernUsers: CernUsersField
};

export default fields;
