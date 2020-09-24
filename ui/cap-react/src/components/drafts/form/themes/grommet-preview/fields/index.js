import importDataField from "./importDataField";
import capFiles from "./capFiles";
import JSONViewField from "./JSONViewField";
import ServiceGetter from "./ServiceGetter";

const fields = {
  ImportDataField: importDataField,
  CapFiles: capFiles,
  jsoneditor: JSONViewField,
  idFetcher: ServiceGetter
};

export default fields;
