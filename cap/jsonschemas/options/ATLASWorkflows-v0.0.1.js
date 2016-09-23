/* -*- coding: utf-8 -*-
 *
 * This file is part of CERN Analysis Preservation Framework.
 * Copyright (C) 2016 CERN.
 *
 * CERN Analysis Preservation Framework is free software; you can redistribute
 * it and/or modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or (at your option) any later version.
 *
 * CERN Analysis Preservation Framework is distributed in the hope that it will
 * be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with CERN Analysis Preservation Framework; if not, write to the
 * Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston,
 * MA 02111-1307, USA.
 *
 * In applying this license, CERN does not
 * waive the privileges and immunities granted to it by virtue of its status
 * as an Intergovernmental Organization or submit itself to any jurisdiction.
 */


var subschema_option_fields = {};

window.schemaOptions = {
  "fields": {
    "basic_info": {
      "type": "depositgroup",
      "fields": {
      }
    },
    "workflows": {
      "type": "depositgroup-array",
      "fields": {
        "item": {
          "fields": {
            "name": {
              "order": 1
            },
            "workflow": {
              "order": 2,
              // "type": "depositgroup-object",
              "fields": {
                "context": {
                  // "type": "depositgroup-object"
                },
                "stages": {
                  "type": "depositgroup-object-array",
                  "fields": {
                    "item": {
                      "fields": {
                        "name": {
                          "order": 1
                        },
                        "dependencies": {
                          "type": "depositgroup-object-array",
                          "order": 4,
                          "fields": {
                            "items": {
                              "fields": {
                                "placeholder": "Add dependency",
                                "type": "select",
                                "multiple": true,
                                "dataSource": function(callback){
                                  callback(_.values(dependencies));
                                }
                              }
                            }
                          }
                        },
                        "parameters": {
                          "type": "depositgroup-object",
                          "order": 3
                        },
                        "scheduler": {
                          "order": 2,
                          "schemaTypeField": "scheduler_type",
                          "fields": {
                            "scheduler_type": {
                              "hidden": "true"
                            },
                            "step": {
                              "fields": {
                                "schema_type": {
                                  "hidden": "true"
                                },
                                "process": {
                                  "fields": {
                                    "process-type": {
                                      "hidden": "true"
                                    }
                                  }
                                },
                                "publisher": {
                                  "schemaTypeField": "publisher_type",
                                  "fields": {
                                    "publisher_type": {
                                      "hidden": "true"
                                    }
                                  }
                                },
                                "environment": {
                                  "fields": {
                                    "environment_type": {
                                      "hidden": "true"
                                    },
                                    "image": {
                                      "order" : 1
                                    },
                                    "imagetag": {
                                      "order" : 2
                                    },
                                    "resources": {
                                      "order" : 3,
                                      "type": "depositgroup-object-array"
                                    },
                                    "envscript": {
                                      "order" : 4
                                    },
                                    "envvars": {
                                      "order" : 5
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                },
                "processes": {
                },
                "environments": {
                  "type": "depositgroup-array",
                },
                "publishers": {
                  "type": "depositgroup-array",
                }
              }
            }
          }
        }
      }
    }
  },
  "view": "invenio-view"
};

var dependencies = {};
window.schemaPostRender = function(control){
  var root = control.children;
  window.rrrrrrrr = root;
  var observableList = ["ntup", "download_nodes"];

  root = _.reject(root, function(r){
    if (_.indexOf(observableList, r.name) > -1)
      return false;
    else
      return true;
  });

  _.each(root, function(r){
    r.on('change', function(){
      var depsToAdd = {};
      _.each(r.children, function(d){
        var name = d.childrenByPropertyId['name'];
        if (name.data) depsToAdd[d.id] = name.data;
        // console.log("-----:", d.id , " == ", name.data);

      });
      _.extendOwn(dependencies, depsToAdd);
      root.refresh();
    });
  });
};

var dataSource = function(callback) {
    callback([]);
};
