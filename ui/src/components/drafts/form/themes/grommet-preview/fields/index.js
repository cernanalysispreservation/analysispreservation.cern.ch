import importDataField from "./importDataField";
import capFiles from "./capFiles";
import JSONViewField from "./JSONViewField";
import theBeLabField from "./thebeLab/thebeLab";

const fields = {
  ImportDataField: importDataField,
  CapFiles: capFiles,
  jsoneditor: JSONViewField,
  accordion_jsoneditor: importDataField,
  thebelab: theBeLabField
};

export default fields;
