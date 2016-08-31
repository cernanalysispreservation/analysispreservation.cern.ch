window.schemaOptions = {
    "fields": {
      "basic_info": {
        "type": "depositgroup",
        "order": 1,
        "fields": {
          "analysis_name": {
            "label": "Analysis Name",
            "placeholder": "Start typing and select an Analysis Name to import metadata, e.g. CPV in D0 -> KS KS",
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
                    "analysis_number": "ananote"
                  },
                  "internal_discussions": "internal_discussions",
                  "presentations": "presentations",
                  "publications": "publications",
                  "extra_info": {
                    "status": "status",
                    "twiki": "twiki",
                    "egroup": "egroup",
                    "arxiv": "arxiv"
                  },
                }
              }
            }
          },
          "analysis_number": {
            "placeholder": "E.g. ANA-2015-014"
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
                      "year": {
                        "order": 4,
						"placeholder": "E.g. 2015"
                      },
                      "reconstruction_software": {
						"order": 2,
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
						"order": 3,
						"type": "depositgroup-object",
						"fields": {
						  "stripping_software_name": {
                            "placeholder": "E.g. DaVinciStripping"
						  },
						   "stripping_software_version": {
                            "placeholder": "E.g. 17"
						  }
                        }
                      },
                      "location": {
                        "order": 1,
                        "placeholder": "E.g. sim://LHCb/Collision12/Beam4000GeV-VeloClosed-MagDown/RealData/Reco14/Stripping20/90000000 ( Full stream )/BHADR"
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
                      "location": {
                        "order": 1,
                        "placeholder": "E.g. sim://MC/MC11a/Beam3500GeV-2011-MagDown-Nu2-50ns-EmNoCuts/Sim05a/Trig0x40760037Flagged/Reco12a/Stripping17NoPrescalingFlagged/42"
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
                "type": "depositgroup-object-array",
                "toolbarSticky": "true",
                "order": 2,
                "fields": {
                  "item": {
                    "placeholder": "E.g. DaVinci v33r6"
                  }
                }
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
                "order": 1,
                "placeholder": "E.g. x86_64-slc5-gcc46-opt"
              }
            }
          },
          "output_data": {
            "type": "depositgroup-object",
            "fields": {
              "data": {
                "placeholder": "E.g. root://eospublic.cern.ch//eos/mydir/.../myfile-data.root"
              },
              "mc_data": {
                "placeholder": "E.g. root://eospublic.cern.ch//eos/mydir/.../myfile-mcdata.root"
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
                "type": "depositgroup-object",
                "fields": {
                  "lhcb_code": {
                    "type": "depositgroup-object-array",
                    "toolbarSticky": "true",
                    "order": 2,
                    "fields": {
                      "item": {
                        "placeholder": " E.g. DaVinci v33r6"
                      }
                    }
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
                    "order": 1,
                    "placeholder": "E.g. x86_64-slc5-gcc46-opt"
                  }
                }
              },
              "output_data": {
                "type": "depositgroup-object",
                "fields": {
                  "data": {
                    "placeholder": "E.g. root://eospublic.cern.ch//eos/mydir/.../myfile-data.root"
                  },
                  "mc_data": {
                    "placeholder": "E.g. root://eospublic.cern.ch//eos/mydir/.../myfile-mcdata.root"
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
      },
      "extra_info": {
        "type": "depositgroup",
        "order": 2,
        "fields": {
          "arxiv": {
            "placeholder": "E.g. 1508.06087"
          },
          "keywords": {
            "type": "tags",
            "placeholder": "E.g. keyword1, keyword2"
          },
          "egroup": {
            "placeholder": "E.g. lhcb-review-Charm-D0toKsKs"
          },
          "status": {
            "placeholder": "E.g. 9 - PAPER published"
          },
          "twiki": {
            "placeholder": "E.g. https://twiki.cern.ch/twiki/bin/view/LHCbPhysics/D0KSKS"
          }
        }
      }
    }
  };
