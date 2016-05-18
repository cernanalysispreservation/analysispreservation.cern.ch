var cms_triggers = {};
var datasource_triggerRunPeriod = function(callback){
  $.get("/static/jsonschemas/fields/cms_triggers.json", function(data){
    cms_triggers = data;
    var result = Object.keys(data);
    callback(result);
  });
};

window.schemaOptions = {
    "fields": {
      "basic_info": {
        "order": 1,
        "label": false,
        "type": "depositgroup",
        "fields": {
          "analysis_number": {
            "placeholder": "Please provide CADI analysis number to connect, e.g. CMS-ANA-2012-049"
          }
        }
      },
      "aod_processing": {
        "type": "depositgroup",
        "order": 2,
        "label": false,
        "fields": {
          "primary_datasets": {
            "type": "depositgroup-object-quickfill",
            "order": 1,
            "droplist": "true",
            "actionbar": false,
            "toolbarSticky": false,
            "typeahead": {
              "config": {
                "autoselect": true,
                "highlight": true,
                "hint": true,
                "minLength": 1
              },
              "datasets": {
                "type": "remote",
                "source": "/CMS/das/autocomplete?query=%QUERY"
              }
            },
            "fields": {
              "item": {
                "type": "object-autocomplete-import",
                "typeahead": {
                  "config": {
                    "autoselect": true,
                    "highlight": true,
                    "hint": true,
                    "minLength": 1
                  },
                  "datasets": {
                    "type": "remote",
                    "source": "/CMS/das/autocomplete?query=%QUERY"
                  },
                  "importSource": {
                    "type": "origin",
                    "method": "get",
                    "source": "/CMS/das",
                    "data": "query"
                  },
                  "correlation": {
                    "title": "name",
                    "@type": "",
                    "description": "physics_group_name",
                    "licence": "",
                    "persistent_identifiers": "",
                    "issued": "creation_time",
                    "modified":"modification_time",
                    "available": "",
                    "run_number": "",
                    "dataset_id": "dataset_id",
                    "type": "datatype",
                    "numbers": {
                      "nblocks": "nblocks",
                      "nfiles": "nfiles",
                      "nevents": "nevents",
                      "nlumis": "nlumis"
                    }
                  }
                },
                "queryField": "title",
                "fields": {
                  "title": {
                    "order": 0
                  },
                  "@type": {
                    "order": 2
                  },
                  "description": {
                    "order": 1
                  },
                  "licence": {
                    "order": 9
                  },
                  "persistent_identifiers": {
                    "order": 11
                  },
                  "issued": {
                    "order": 6
                  },
                  "modified": {
                    "order": 7
                  },
                  "available": {
                    "order": 8
                  },
                  "run_number": {
                    "order": 5
                  },
                  "dataset_id": {
                    "order": 3
                  },
                  "type": {
                    "order": 10
                  },
                  "numbers": {
                    "order": 4
                  }
                }
              }
            }
          },
          "mc_dataset": {
            "type": "depositgroup-object-quickfill",
            "description": "Add Monte Carlo datasets",
            "order": 2,
            "droplist": "true",
            "actionbar": false,
            "toolbarSticky": false,
            "typeahead": {
              "config": {
                "autoselect": true,
                "highlight": true,
                "hint": true,
                "minLength": 1
              },
              "datasets": {
                "type": "remote",
                "source": "/CMS/das/autocomplete?query=%QUERY"
              }
            },
            "fields": {
              "item": {
                "type": "object-autocomplete-import",
                "typeahead": {
                  "config": {
                    "autoselect": true,
                    "highlight": true,
                    "hint": true,
                    "minLength": 1
                  },
                  "datasets": {
                    "type": "remote",
                    "source": "/CMS/das/autocomplete?query=%QUERY"
                  },
                  "importSource": {
                    "type": "origin",
                    "method": "get",
                    "source": "/CMS/das",
                    "data": "query"
                  },
                  "correlation": {
                    "title": "name",
                    "@type": "",
                    "description": "physics_group_name",
                    "licence": "",
                    "persistent_identifiers": "",
                    "issued": "creation_time",
                    "modified":"modification_time",
                    "available": "",
                    "run_number": "",
                    "dataset_id": "dataset_id",
                    "type": "datatype",
                    "numbers": {
                      "nblocks": "nblocks",
                      "nfiles": "nfiles",
                      "nevents": "nevents",
                      "nlumis": "nlumis"
                    }
                  }
                },
                "queryField": "title",
                "fields": {
                  "title": {
                    "order": 0
                  },
                  "@type": {
                    "order": 2
                  },
                  "description": {
                    "order": 1
                  },
                  "licence": {
                    "order": 9
                  },
                  "persistent_identifiers": {
                    "order": 11,
                    "type": "depositgroup-object-array"
                  },
                  "issued": {
                    "order": 6
                  },
                  "modified": {
                    "order": 7
                  },
                  "available": {
                    "order": 8
                  },
                  "run_number": {
                    "order": 5
                  },
                  "dataset_id": {
                    "order": 3
                  },
                  "type": {
                    "order": 10
                  },
                  "numbers": {
                    "order": 4
                  }
                }
              }
            }
          },
          "triggers": {
            "order": 3,
            "actionbarStyle": "bottom",
            "toolbarSticky": "true",
            "type": "depositgroup-object-array",
            "fields": {
              "item": {
                "fields": {
                  "trigger": {
                    "order": 3,
                    "noneLabel": "Trigger",
                    "type": "select2",
                    "select2": true
                  },
                  "element": {
                    "order": 2,
                    "noneLabel": "Element",
                    "type": "select2",
                    "select2": true
                  },
                  "run_period": {
                    "order": 1,
                    "type": "select2",
                    "noneLabel": "Year",
                    "select2": true,
                    "dataSource": datasource_triggerRunPeriod
                  }
                },
                "postRender": function(callback){
                  var triggerYear = this.childrenByPropertyId["run_period"];
                  var triggerElement = this.childrenByPropertyId["element"];
                  var triggerTrigger = this.childrenByPropertyId["trigger"];
                  triggerTrigger.subscribe(triggerElement, function(element){
                    var year = triggerYear.getValue();
                    this.schema.enum = this.options.optionLabels = cms_triggers[year][element];
                    this.refresh();
                  });
                  triggerElement.subscribe(triggerYear, function(year){
                    this.schema.enum = this.options.optionLabels = Object.keys(cms_triggers[year]);
                    this.refresh();
                  });
                  callback();
                }
              }
            }
          }
        }
      },
      "physics_information": {
        "order": 4,
        "toolbarSticky": "true",
        "type": "depositgroup-array",
        "fields": {
          "item": {
            "fields": {
              "final_state_particles": {
                "order": 1,
                "minItems": 1,
                "type": "depositgroup-object-array",
                "fields": {
                  "item": {
                    "fields": {
                      "particle": {
                        "placeholder": "Particle",
                        "noneLabel": "Select Particle",
                        "type": "select2",
                        "select2": true,
                        "order": 1
                      },
                      "number": {
                        "placeholder": "Number, e.g. 1",
                        "order": 2
                      },
                      "pt_cut": {
                        "placeholder": "PT Cut, e.g. > 20 Gev",
                        "order": 3
                      },
                      "era_cut": {
                        "placeholder": "ETA Cut, e.g. < 2.1",
                        "order": 4
                      }
                    }
                  }
                }
              },
              // currently not included in json
              /*
              "physics_object": {
                "order": 2,
                "type": "depositgroup-object-array"
              },*/
              "cuts": {
                "order": 3,
                "type": "depositgroup-object-array",
                "minItems": 1,
                "fields": {
                  "item": {
                    "fields": {
                      "eta": {
                        "placeholder": "E.g. ECAL"
                      },
                      "pT": {
                        "placeholder": "E.g. > 20 Gev"
                      }
                    }
				          }
				        }
              },
              "veto": {
                "order": 4,
                "minItems": 1,
                "type": "depositgroup-object-array",
                "fields": {
                  "item": {
                    "fields": {
                      "particle": {
                        "placeholder": "Particle",
                        "noneLabel": "Select Particle",
                        "type": "select2",
                        "select2": true,
                        "order": 1
                      },
                      "number": {
                        "placeholder": "Number, e.g. 1",
                        "order": 2
                      },
                      "pt_cut": {
                        "placeholder": "PT Cut, e.g. > 20 Gev",
                        "order": 3
                      },
                      "era_cut": {
                        "placeholder": "ETA Cut, e.g. < 2.1",
                        "order": 4
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "post_aod_processing": {
        "order": 5,
        "type": "depositgroup-array",
        "toolbarSticky": "true",
        "fields": {
          "item": {
            "fields": {
              "input_data": {
                "type": "depositgroup-object-array",
                "order": 4,
                "fields": {
                  "item": {
                    "fields": {
                      "filename": {
                        "placeholder": "E.g. myfile-data.root"
                      },
                      "url": {
                        "type": "url",
                        "placeholder": "E.g. root://eospublic.cern.ch//eos/mydir/.../"
                      }
                    }
                  }
                }
              },
              "output_data": {
                "type": "depositgroup-object-array",
                "order": 5,
                "fields": {
                  "item": {
                    "fields": {
                      "url": {
                        "type": "url-harvest",
                        "order": 1,
                        "placeholder": "E.g. root://eospublic.cern.ch//eos/mydir/.../myfile-data.root"
                      }
                    }
                  }
                }
              },
              "os": {
                "type": "depositgroup-object-array",
                "order": 1,
                "fields": {
                  "item": {
                    "fields": {
                      "name": {
                        "placeholder": "Name, e.g. SLC"
                      },
                      "version": {
                        "placeholder": "Version, e.g. 6"
                      }
                    }
                  }
                }
              },
              "software": {
                "type": "depositgroup-object-array",
                "order": 2,
                "fields": {
                  "item": {
                    "fields": {
                      "name": {
                        "placeholder": "Name, e.g. CMSSW"
                      },
                      "version": {
                        "placeholder": "Version, e.g. 5_3_x"
                      },
                      "global_tag": {
                        "placeholder": "Tag"
                      }
                    }
                  }
                }
              },
              "user_code": {
                "type": "depositgroup-object-array",
                "order": 3,
                "fields": {
                  "item": {
                    "fields": {
                      "url": {
                        "type": "url-harvest",
                        "placeholder": "E.g. git@github.com:johndoe/myrepo.git",
                        "order": 1
                      },
                      "tag": {
                        "placeholder": "E.g. v2.1",
                        "order": 2
                      }
                    }
                  }
                }
              },
              "run_instructions": {
                "type": "depositgroup-object-array",
                "order": 6,
                "fields": {
                  "item": {
                    "fields": {
                      "type": {
                        "type": "select",
                        "optionLabels": ["README file", "Makefile", "Upload something else"]
                      }
                    }
                  }
                }
              },
              "keywords": {
                "type": "tags",
                "order": 7,
                "placeholder": "E.g. keyword1, keyword2"
              },
              "comments": {
                "order": 8,
                "type": "textarea",
                "rows": 10,
                "placeholder": ""
              }
            }
          }
        }
      },
      "documentations": {
        "order": 6,
        "type": "depositgroup-array",
        "toolbarSticky": "true",
        "fields": {
          "item": {
            "fields": {
              "CADI_ID": {
                "order": 1,
                "placeholder": "E.g. CMS-ANA-2012-049"
              },
                "url": {
                "order": 2,
                "placeholder": "E.g. https://twiki.cern.ch/twiki/..."
              },
              "keyword": {
                "order": 3,
                "placeholder": "E.g. keyword1"
              },
              "comment": {
                "order": 4,
                "placeholder": "E.g. Shows more detail concerning this analysis"
              }
            }
          }
        }
      },
      "internal_discussions": {
        "type": "depositgroup-array",
        "order": 7,
        "fields": {
          "item": {
			"fields": {
			  "url": {
				"placeholder": "E.g. https://indico.cern.ch/event/.../discussion-slides.pdf"
			  }
			}
		  }
        }
      },
      "presentations": {
        "type": "depositgroup-array",
        "order": 8,
        "fields": {
          "item": {
		    "fields": {
			  "url": {
				"placeholder": "E.g. https://indico.cern.ch/event/524974/"
			  }
			}
		  }
        }
      },
      "publications": {
        "order": 9,
        "type": "depositgroup-array",
        "fields": {
          "item": {
            "fields": {
              "journal_title": {
                "order": 1,
                "placeholder": "Please enter the journal title"
              },
              "journal_year": {
                "order": 2,
                "placeholder": "Please enter the journal year"
              },
              "journal_volume": {
                "order": 3,
                "placeholder": "Please enter the journal volume"
              },
              "journal_issue": {
                "order": 4,
                "placeholder": "Please enter the journal issue"
              },
              "journal_page": {
                "order": 5,
                "placeholder": "Please enter the journal page number"
              },
              "persistent_identifiers": {
                "type": "depositgroup-object-array",
                "order": 6,
                "fields": {
				  "item": {
					"fields": {
					  "identifier": {
						"placeholder": "Please enter an issued identifier, e.g. a DUNS number"
					  },
						"scheme": {
						"placeholder": "Please enter an identifier scheme, e.g. DUNS"
					  }
					}
				  }
				}
              }
            }
          }
        }
      },
      "keywords": {
        "type": "tags",
        "format": "textarea",
        "order": 10,
        "placeholder": "E.g. keyword1, keyword2"
      }
    }
  };

// window.schemaPostRender = function(control) {
//   var triggerYear = control.childrenByPropertyId["run_period"];
//   var triggerElement = control.childrenByPropertyId["run_period"];
//   window.bb = control;
// };