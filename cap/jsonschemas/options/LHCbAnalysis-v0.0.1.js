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


window.schemaOptions = {
    "fields": {
      "basic_info": {
        "type": "depositgroup",
        "order": 1,
        "fields": {
          "analysis_name": {
            "label": "Analysis Name",
            "placeholder": "Start typing an Analysis Name (e.g. CPV in D0 -> KS KS) to import metadata or insert a new analysis name.",
            "typeahead": {
              "config": {
                "minLength": 1
              },
              "datasets": {
                "type": "prefetch",
                "source": "/static/jsonschemas/fields/lhcb_ana_titles.json"
              },
              "importSource": {
                "type": "origin",
                "method": "get",
                "source": "/LHCb/api/analysis",
                "data": "title"
              },
              "correlation": {
                "#": {
                  "basic_info": {
                    "status": "status",
                    "egroup": "egroup"
                  },
                  "extra_info": {
                    "analysis_number": "ananote",
                    "twiki": "twiki",
                    "arxiv": "arxiv"
                  },
                  "internal_discussions": "internal_discussions",
                  "presentations": "presentations",
                  "publications": "publications"
                }
              }
            }
          },
          "proponents": {
            "order": 2,
            "type": "personalname",
            "placeholder": "E.g. John Doe; Jane Doe"
          },
          "status": {
            "order": 3,
            "placeholder": "Status",
            "noneLabel": "Select Status",
            "type": "select2",
            "select2": true
          },
          "status_notes": {
            "order": 4,
            "placeholder": "E.g. ??",
            "dependencies": {
              "status": ["x - other"]
            }
          },
          "reviewers": {
            "order": 5,
            "type": "personalname",
            "placeholder": "E.g. John Roe; Jane Roe"
          },
          "egroup": {
            "order": 6,
            "placeholder": "E.g. lhcb-review-Charm-D0toKsKs"
          },
          "institutes": {
            "order": 7,
            "placeholder": "E.g. Institute A; Institute B"
          },
          "keywords": {
            "order": 8,
            "type": "tags",
            "placeholder": "E.g. keyword1, keyword2"
          }
        }
      },
      "extra_info": {
        "type": "depositgroup",
        "order": 2,
        "fields": {
          "analysis_number": {
            "placeholder": "E.g. LHCb-ANA-2015-002"
          },
          "public_paper": {
            "placeholder": "E.g. LHCb-PAPER-2015-039"
          },
          "conf_report": {
            "placeholder": "E.g. ??"
          },
          "arxiv": {
            "placeholder": "E.g. 1508.06087"
          },
          "twiki": {
            "placeholder": "E.g. https://twiki.cern.ch/twiki/bin/view/LHCbPhysics/D0KSKS"
          }
        }
      },
      "dst_selection": {
        "type": "depositgroup",
        "order": 3,
        "fields": {
          "input_data": {
            "type": "depositgroup-object",
            "fields": {
              "data": {
                "type": "depositgroup-object-array",
                "toolbarSticky": "true",
                "fields": {
                  "item": {
                    "fields": {
                      "location": {
                        "order": 1,
                        "placeholder": "E.g. sim://LHCb/Collision12/Beam4000GeV-VeloClosed-MagDown/RealData/Reco14/Stripping20/90000000 ( Full stream )/BHADR"
                      },
                      "processing_pass": {
                        "order": 2,
                        "placeholder": "E.g. Reco15a-Stripping22b"
                      },
                      "year": {
                        "order": 5,
                        "placeholder": "E.g. 2015"
                      },
                      "reconstruction_software": {
                        "order": 3,
                        "type": "depositgroup-object",
                        "fields": {
                          "reconstruction_software_name": {
                            "placeholder": "E.g. Brunel Reco"
                          },
                          "reconstruction_software_version": {
                            "placeholder": "E.g. 13"
                          }
                        }
                      },
                      "stripping_software": {
                        "order": 4,
                        "type": "depositgroup-object",
                        "fields": {
                          "stripping_software_name": {
                            "placeholder": "E.g. DaVinciStripping"
                          },
                          "stripping_software_version": {
                            "placeholder": "E.g. 17"
                          }
                        }
                      }
                    }
                  }
                }
              },
              "mc_data": {
                "type": "depositgroup-object-array",
                "toolbarSticky": "true",
                "fields": {
                  "item": {
                    "fields": {
                      "location": {
                        "order": 1,
                        "placeholder": "E.g. sim://MC/MC11a/Beam3500GeV-2011-MagDown-Nu2-50ns-EmNoCuts/Sim05a/Trig0x40760037Flagged/Reco12a/Stripping17NoPrescalingFlagged/42"
                      },
                      "mc_production": {
                        "order": 2,
                        "placeholder": "E.g. MC Prod"
                      },
                      "generator": {
                        "order": 3,
                        "placeholder": "E.g. MC Gen"
                      },
                      "reconstruction_software": {
                        "order": 4,
                        "type": "depositgroup-object",
                        "fields": {
                          "reconstruction_software_name": {
                            "placeholder": "E.g. MC Reco"
                          },
                          "reconstruction_software_version": {
                            "placeholder": "E.g. 11"
                          }
                        }
                      },
                      "stripping_software": {
                        "order": 5,
                        "type": "depositgroup-object",
                        "fields": {
                          "stripping_software_name": {
                            "placeholder": "E.g. MC Strip"
                          },
                          "stripping_software_version": {
                            "placeholder": "E.g. 16"
                          }
                        }
                      },
                      "used_tools": {
                        "order": 6,
                        "placeholder": "E.g. TupleToolIsolation"
                      },
                      "db_tags": {
                        "order": 7,
                        "noneLabel": "Select Status",
                        "type": "select2",
                        "select2": true
                      }
                    }
                  }
                }
              }
            }
          },
          "code": {
            "type": "depositgroup-object",
            "fields": {
              "lhcb_code": {
                "order": 1,
                "placeholder": "E.g. DaVinci v33r6"
              },
              "user_code": {
                "type": "depositgroup-object-array",
                "toolbarSticky": "true",
                "order": 3,
                "fields": {
                  "item": {
                    "fields": {
                      "link": {
                        "order": 1,
                        "placeholder": "E.g. svn@svnweb.cern.ch/cern/wsvn/myrepo"
                      },
                      "description": {
                        "order": 2,
                        "placeholder": "Please enter the user code description, location, etc"
                      },
                      "instructions": {
                        "type": "textarea",
                        "order": 3,
                        "placeholder": "Please enter the instructions for using the code, e.g. Open 'README' file"
                      }
                    }
                  }
                }
              },
              "platform": {
                "order": 2,
                "placeholder": "E.g. x86_64-slc5-gcc46-opt"
              }
            }
          },
          "output_data": {
            "type": "depositgroup-object",
            "fields": {
              "data": {
                "type": "depositgroup-object-array",
                "toolbarSticky": "true",
                "fields": {
                  "item": {
                    "placeholder": "E.g. root://eospublic.cern.ch//eos/mydir/.../myfile-data.root"
                  }
                }
              },
              "mc_data": {
                "type": "depositgroup-object-array",
                "toolbarSticky": "true",
                "fields": {
                  "item": {
                    "placeholder": "E.g. root://eospublic.cern.ch//eos/mydir/.../myfile-mcdata.root"
                  }
                }
              }
            }
          },
          "stripping_line": {
            "type": "depositgroup-object-array",
            "toolbarSticky": "true",
            "fields": {
              "item": {
                "placeholder": "E.g. Stripping Line"
              }
            }
          },
          "trigger": {
            "type": "depositgroup-object-array",
            "toolbarSticky": "true",
            "fields": {
              "item": {
                "placeholder": "E.g. Trigger 1"
              }
            }
          }
        }
      },
      "analysis_steps": {
        "type": "depositgroup-array",
        "order": 4,
        "toolbarSticky": "true",
        "fields": {
          "item": {
            "fields": {
              "input_data": {
                "type": "depositgroup-object",
                "fields": {
                  "data": {
                    "type": "depositgroup-object-array",
                    "toolbarSticky": "true",
                    "fields": {
                      "item": {
                        "placeholder": "E.g. root://eospublic.cern.ch//eos/mydir/.../myfile-data.root"
                      }
                    }
                  },
                  "mc_data": {
                    "type": "depositgroup-object-array",
                    "toolbarSticky": "true",
                    "fields": {
                      "item": {
                        "placeholder": "E.g. root://eospublic.cern.ch//eos/mydir/.../myfile-mcdata.root"
                      }
                    }
                  }
                }
              },
              "code": {
                "toolbarSticky": "true",
                "type": "depositgroup-object-array",
                "fields": {
                  "item": {
                    "fields": {
                      "lhcb_code": {
                        "order": 1,
                        "placeholder": " E.g. DaVinci v33r6"
                      },
                      "user_code": {
                        "type": "depositgroup-object",
                        "toolbarSticky": "true",
                        "order": 3,
                        "fields": {
                          "link": {
                            "order": 1,
                            "placeholder": "E.g. svn@svnweb.cern.ch/cern/wsvn/myrepo"
                          },
                          "description": {
                            "order": 2,
                            "placeholder": "Please enter the user code description, location, etc"
                          },
                          "instructions": {
                            "type": "textarea",
                            "order": 3,
                            "placeholder": "Please enter the instructions for using the code, e.g. Open 'README' file"
                          }
                        }
                      },
                      "platform": {
                        "order": 2,
                        "placeholder": "E.g. x86_64-slc5-gcc46-opt"
                      }
                    }
                  }
                }
              },
              "output_data": {
                "type": "depositgroup-object",
                "fields": {
                  "data": {
                    "type": "depositgroup-object-array",
                    "toolbarSticky": "true",
                    "fields": {
                      "item": {
                        "placeholder": "E.g. root://eospublic.cern.ch//eos/mydir/.../myfile-data.root"
                      }
                    }
                  },
                  "mc_data": {
                    "type": "depositgroup-object-array",
                    "toolbarSticky": "true",
                    "fields": {
                      "item": {
                        "placeholder": "E.g. root://eospublic.cern.ch//eos/mydir/.../myfile-mcdata.root"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "documentations": {
        "order": 8,
        "type": "depositgroup-array",
        "toolbarSticky": "true",
        "fields": {
          "item": {
            "fields": {
              "url": {
                "order": 1,
                "placeholder": "E.g. https://twiki.cern.ch/twiki/..."
              },
              "keyword": {
                "order": 2,
                "placeholder": "E.g. keyword1"
              },
              "comment": {
                "order": 3,
                "placeholder": "E.g. Shows more detail concerning this analysis"
              }
            }
          }
        }
      },
      "internal_discussions": {
        "type": "depositgroup-array",
        "order": 5,
        "fields": {
          "item": {
            "fields": {
              "meeting": {
                "placeholder": "E.g. lhcb-general"
              },
              "url": {
                "placeholder": "E.g. https://indico.cern.ch/event/.../contribution/.../material/slides/discussion-slides.pdf"
              },
              "title": {
                "placeholder": "E.g. Update on D0->KS KS"
              }
            }
          }
        }
      },
      "presentations": {
        "type": "depositgroup-array",
        "order": 6,
        "fields": {
          "item": {
            "fields": {
              "url": {
                "placeholder": "E.g. https://indico.cern.ch/event/473187/"
              },
                "title": {
                "placeholder": "E.g. CP violation searches in the charm sector at LHCb"
              },
                "meeting": {
                "placeholder": "E.g. CERN-LHC Seminar"
              }
            }
          }
        }
      },
      "publications": {
        "order": 7,
        "type": "depositgroup-array",
        "fields": {
          "item": {
            "fields": {
              "url": {
                "placeholder": "E.g. https://cds.cern.ch/record/2030613"
              },
              "reviewegroup": {
                "placeholder": "E.g. lhcb-review-Charm-D0toKsKs"
              },
              "roles": {
                "placeholder": ""
              }
              // currently not included in json
              /*
              "journal_title": {
                "order": 1
              },
              "journal_year": {
                "order": 2
              },
              "journal_volume": {
                "order": 3
              },
              "journal_issue": {
                "order": 4
              },
              "journal_page": {
                "order": 5
              },
              "persistent_identifiers": {
                "type": "depositgroup-object-array",
                "order": 6
              }*/
            }
          }
        }
      }
    }
  };
