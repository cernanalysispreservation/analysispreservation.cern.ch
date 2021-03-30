# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2020 CERN.
#
# CERN Analysis Preservation Framework is free software; you can redistribute
# it and/or modify it under the terms of the GNU General Public License as
# published by the Free Software Foundation; either version 2 of the
# License, or (at your option) any later version.
#
# CERN Analysis Preservation Framework is distributed in the hope that it will
# be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with CERN Analysis Preservation Framework; if not, write to the
# Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston,
# MA 02111-1307, USA.
#
# In applying this license, CERN does not
# waive the privileges and immunities granted to it by virtue of its status
# as an Intergovernmental Organization or submit itself to any jurisdiction.
"""Config example data."""

from cap.modules.mail.custom import body


EMPTY_CONFIG = {}

EMPTY_CONFIG_ASSERTIONS = {
    "response": 202,
    "outbox": {},
}

DEFAULT_CONFIG = {
    "notifications": {
        "actions": {
            "publish": [
                {
                    "recipients": {
                        "recipients": [
                            {"method": "get_submitter"},
                            {
                                "mails": {
                                    "default": [
                                        "user1@cern0.ch",
                                        "user3@cern0.ch",
                                        "user4@cern0.ch",
                                    ]
                                }
                            },
                        ]
                    }
                }
            ],
            "review": [],
        }
    }
}

DEFAULT_CONFIG_ASSERTIONS = {
    "ctx": {"pid": {"type": "response", "path": "recid"}},
    "response": 202,
    "outbox": {
        0: {
            "subject": [("in", "New published document")],
            "html": [
                ("in", "can check it"),
                (
                    "in",
                    '<a href="https://analysispreservation.cern.ch/published/{pid}">here</a>',
                ),
            ],
            "recipients": {
                "recipients": [
                    ("in", "superuser@cern.ch"),
                    ("in", "user1@cern0.ch"),
                    ("in", "user4@cern0.ch"),
                ]
            },
        }
    },
}

DEFAULT_CONFIG_PLAIN = {
    "notifications": {
        "actions": {
            "publish": [
                {
                    "body": {"plain": True},
                    "recipients": {
                        "recipients": [
                            {"method": "get_submitter"},
                            {
                                "mails": {
                                    "default": [
                                        "user1@cern0.ch",
                                        "user3@cern0.ch",
                                        "user4@cern0.ch",
                                    ]
                                }
                            },
                        ]
                    },
                }
            ],
            "review": [],
        }
    }
}

DEFAULT_CONFIG_PLAIN_ASSERTIONS = {
    "ctx": {"pid": {"type": "response", "path": "recid"}},
    "response": 202,
    "outbox": {
        0: {
            "subject": [("in", "New published document")],
            "body": [("in", "can check it"), ("in", "with id {pid}")],
            "recipients": {
                "recipients": [
                    ("in", "superuser@cern.ch"),
                    ("in", "user1@cern0.ch"),
                    ("in", "user4@cern0.ch"),
                ]
            },
        }
    },
}


DEFAULT_CONFIG_WITH_ERRORS = {
    "notifications": {
        "actions": {
            "publish": [
                {
                    "recipients": {
                        "recipients": [
                            {"method": "submitter"},
                            {
                                "mails": [
                                    "user1@cern0.ch",
                                    "user3@cern0.ch",
                                    "user4@cern0.ch",
                                ]
                            },
                        ]
                    }
                }
            ],
            "review": [],
        }
    }
}

DEFAULT_CONFIG_WITH_ERRORS_ASSERTIONS = {
    "validationError": True,
    "ctx": {"cadi_id": {"type": "deposit", "path": "analysis_context.cadi_id"}},
    "response": 202,
    "outbox": {
        # 0: {
        #     "subject": [( "in", "Questionnaire for {cadi_id} published")],
        #     "html": [( "in", "Message with cadi id: {cadi_id}.")],
        #     "recipients": {
        #         "recipients": [
        #             ("in", "cms_user@cern.ch"),
        #             ("in", "user1@cern0.ch"),
        #             ("in", "user2@cern0.ch"),
        #             ("in", "user4@cern0.ch"),
        #         ]
        #     },
        # }
    },
}

SIMPLE_CONFIG = {
    "notifications": {
        "actions": {
            "publish": [
                {
                    "subject": {
                        "template": "Questionnaire for {{ cadi_id }} published.",
                        "ctx": [
                            {"name": "cadi_id", "path": "analysis_context.cadi_id"}
                        ],
                    },
                    "body": {
                        "template": "Message with cadi id: {{ cadi_id }}.",
                        "ctx": [
                            {"name": "cadi_id", "path": "analysis_context.cadi_id"}
                        ],
                    },
                    "recipients": {"recipients": ["test-recipient@cern0.ch"]},
                }
            ]
        }
    }
}
SIMPLE_CONFIG_ASSERTIONS = {
    "ctx": {"cadi_id": {"type": "deposit", "path": "analysis_context.cadi_id"}},
    "response": 202,
    "outbox": {
        0: {
            "subject": [("in", "Questionnaire for {cadi_id} published")],
            "html": [("in", "Message with cadi id: {cadi_id}.")],
            "recipients": {
                "recipients": [
                    ("in", "test-recipient@cern0.ch"),
                ]
            },
        }
    },
}

SIMPLE_GLOBAL_CTX_CONFIG = {
    "notifications": {
        "actions": {
            "publish": [
                {
                    "ctx": [{"name": "cadi_id", "path": "analysis_context.cadi_id"}],
                    "subject": {
                        "template": "Questionnaire for {{ cadi_id }} published."
                    },
                    "body": {"template": "Message with cadi id: {{ cadi_id }}."},
                    "recipients": {"recipients": ["test-recipient@cern0.ch"]},
                }
            ]
        }
    }
}
SIMPLE_GLOBAL_CTX_CONFIG_ASSERTIONS = {
    "ctx": {"cadi_id": {"type": "deposit", "path": "analysis_context.cadi_id"}},
    "response": 202,
    "outbox": {
        0: {
            "subject": [("in", "Questionnaire for {cadi_id} published")],
            "html": [("in", "Message with cadi id: {cadi_id}.")],
            "recipients": {
                "recipients": [
                    ("in", "test-recipient@cern0.ch"),
                ]
            },
        }
    },
}

SIMPLE_GLOBAL_CTX_2_CONFIG = {
    "notifications": {
        "actions": {
            "publish": [
                {
                    "ctx": [
                        {"name": "cadi_idd", "path": "analysis_context.cadi_id"},
                        {
                            "name": "cadi_id_error",
                            "path": "analysis_context.cadi_id_wrong",
                        },
                    ],
                    "subject": {
                        "template": "Questionnaire for {{ cadi_id }} published."
                    },
                    "body": {"template": "Message with cadi id: {{ cadi_id }}."},
                    "recipients": {"recipients": ["test-recipient@cern0.ch"]},
                }
            ]
        }
    }
}
SIMPLE_GLOBAL_CTX_2_CONFIG_ASSERTIONS = {
    "ctx": {"cadi_id": {"type": "deposit", "path": "analysis_context.cadi_id"}},
    "response": 202,
    "outbox": {
        0: {
            "subject": [("in", "Questionnaire for  published")],
            "html": [("in", "Message with cadi id: .")],
            "recipients": {
                "recipients": [
                    ("in", "test-recipient@cern0.ch"),
                ]
            },
        }
    },
}

NESTED_CONDITION_WITH_ERRORS_CONFIG = {
    "notifications": {
        "actions": {
            "publish": [
                {
                    "recipients": {
                        "recipients": [
                            {
                                "checks": [
                                    {
                                        "path": "analysis_context.cadi_id",
                                        "condition": "exists",
                                    },
                                    {
                                        "checks": [
                                            {
                                                "path": "analysis_context",
                                                "condition": "exists",
                                            },
                                            {
                                                "path": "test1",
                                                "condition": "error_here",
                                            },
                                        ]
                                    },
                                ],
                                "mails": {"default": ["test@cern.ch"]},
                            }
                        ]
                    }
                }
            ]
        }
    }
}
NESTED_CONDITION_WITH_ERRORS_CONFIG_ASSERTIONS = {
    "response": 202,
    "outbox": {},
}


HAS_PERMISSION_CONFIG = {
    "notifications": {
        "actions": {
            "publish": [
                {
                    "recipients": {
                        "recipients": [
                            {
                                "checks": [
                                    {
                                        "path": "analysis_context.cadi_id",
                                        "condition": "exists",
                                    },
                                    {
                                        "condition": "is_egroup_member",
                                        "value": "cms-access",
                                    },
                                ],
                                "mails": {"default": ["test@cern.ch"]},
                            }
                        ]
                    }
                }
            ]
        }
    }
}
HAS_PERMISSION_CONFIG_ASSERTIONS = {
    "response": 202,
    "outbox": {
        0: {
            "recipients": {
                "recipients": [
                    ("in", "test@cern.ch"),
                ]
            },
        }
    },
}


WRONG_TEMPLATE_FILE_CONFIG = {
    "notifications": {
        "actions": {
            "publish": [
                {
                    "body": {
                        "template_file": "wrong/path/template.html",
                        "ctx": [
                            {"name": "cadi_id", "path": "analysis_context.cadi_id"}
                        ],
                    },
                    "recipients": {"recipients": ["test-recipient@cern0.ch"]},
                }
            ]
        }
    }
}

WRONG_TEMPLATE_FILE_CONFIG_ASSERTIONS = {
    "response": 202,
    "outbox": {},
}


CTX_EXAMPLES_CONFIG = {
    "notifications": {
        "actions": {
            "publish": [
                {
                    "body": {
                        "template": """
                            Published analysis 
                            
                            CADI ID: {{cadi_id}}
                            ==================

                            revision : {{revision}} |
                            draft_revision : {{draft_revision}} |
                            draft_id : {{draft_id}} |
                            published_id : {{published_id}} |
                            draft_url : {{draft_url}} |
                            published_url : {{published_url}} |
                            working_id : {{working_id}} |
                            working_url : {{working_url}} |
                            submitter_email : {{submitter_email}} |
                            creator_email : {{creator_email}} |
                            cms_stats_committee_by_pag : {{cms_stats_committee_by_pag}} |
                            get_cms_stat_recipients : {{get_cms_stat_recipients}} |
                        """,
                        "ctx": [
                            {"name": "cadi_id", "path": "analysis_context.cadi_id"},
                            {"method": "revision"},
                            {"method": "draft_revision"},
                            {"method": "draft_id"},
                            {"method": "published_id"},
                            {"method": "draft_url"},
                            {"method": "published_url"},
                            {"method": "working_id"},
                            {"method": "working_url"},
                            {"method": "submitter_email"},
                            {"method": "creator_email"},
                            {"method": "cms_stats_committee_by_pag"},
                            {"method": "get_cms_stat_recipients"},
                        ],
                        "plain": True,
                    },
                    "recipients": {
                        "recipients": [
                            "test-recipient@cern0.ch",
                            {"method": "get_cms_stat_recipients"},
                        ]
                    },
                }
            ],
            "review": [],
        }
    }
}
CTX_EXAMPLES_CONFIG_ASSERTIONS = {
    "ctx": {"cadi_id": {"type": "deposit", "path": "analysis_context.cadi_id"}},
    "response": 202,
    "outbox": {
        0: {
            "subject": [("in", "New published document | CERN Analysis Preservation")],
            "body": [("in", "CADI ID: {cadi_id}")],
            "recipients": {
                "recipients": [
                    ("in", "test-recipient@cern0.ch"),
                    ("in", "admin-rev-1@cern0.ch"),
                    ("in", "admin-rev-2@cern0.ch"),
                ]
            },
        }
    },
}

WRONG_CTX_CONFIG = {
    "notifications": {
        "actions": {
            "publish": [
                {
                    "body": {
                        "template": """
                            Published analysis 
                            
                            CADI ID: {{cadi_id}}
                            WRONG CADI ID: {{wrong_cadi_id}}
                            WRONG CADI ID 2: {{wrong_cadi_id_2}}
                        """,
                        "ctx": [
                            {"name": "cadi_id", "path": "analysis_context.cadi_id"},
                            {
                                "name": "wrong_cadi_id",
                                "path": "analysis_context.cadi_id.0",
                            },
                            {
                                "name": "wrong_cadi_id_2",
                                "path": "analysis_context.cadi_id.[]",
                            },
                        ],
                        "plain": True,
                    },
                    "recipients": {
                        "recipients": [
                            "test-recipient@cern0.ch",
                            {"method": "get_cms_stat_recipients"},
                            {
                                "mails": {
                                    "formatted": [
                                        {
                                            "template": "{% if cadi_id %}hn-cms-{{ cadi_id }}@cern0.ch{% endif %}",
                                            "ctx": [
                                                {
                                                    "name": "cadi_id",
                                                    "path": "analysis_context.cadi_id",
                                                }
                                            ],
                                        },
                                        {
                                            "template": "{% if cadi_id %}mail-{{ cadi_id }}@cern0.ch{% endif %}",
                                            "ctx": [
                                                {
                                                    "name": "cadi_id",
                                                    "path": "analysis_context.cadi_id",
                                                }
                                            ],
                                        },
                                    ]
                                }
                            },
                        ]
                    },
                }
            ],
            "review": [],
        }
    }
}
WRONG_CTX_CONFIG_ASSERTIONS = {
    "ctx": {"cadi_id": {"type": "deposit", "path": "analysis_context.cadi_id"}},
    "response": 202,
    "outbox": {
        0: {
            "subject": [("in", "New published document | CERN Analysis Preservation")],
            "body": [("in", "CADI ID: {cadi_id}")],
            "recipients": {
                "recipients": [
                    ("in", "test-recipient@cern0.ch"),
                    ("in", "admin-rev-2@cern0.ch"),
                    ("in", "hn-cms-ABC-11-111@cern0.ch"),
                    ("in", "mail-ABC-11-111@cern0.ch"),
                ]
            },
        }
    },
}

WRONG_TEMPLATE_CONFIG = {
    "notifications": {
        "actions": {
            "publish": [
                {
                    "body": {
                        "template": """
                            Published analysis 
                            
                            CADI ID: {{cadi_id}}
                            WRONG CADI ID: {{wrong_cadi_id}}
                            WRONG CADI ID 2: {{wrong_cadi_id_2}}
                        """,
                        "ctx": [
                            {"name": "cadi_id", "path": "analysis_context.cadi_id"},
                            {
                                "name": "wrong_cadi_id",
                                "path": "analysis_context.cadi_id.0",
                            },
                            {
                                "name": "wrong_cadi_id_2",
                                "path": "analysis_context.cadi_id.[]",
                            },
                        ],
                        "plain": True,
                    },
                    "recipients": {
                        "recipients": [
                            "test-recipient@cern0.ch",
                            # 3,
                            [
                                "test-recipient_error@cern0.ch",
                                "test-recipient_error2@cern0.ch",
                            ],
                            {"method": "get_cms_stat_recipients"},
                            {
                                "mails": {
                                    # "default": ['user7@cern0.ch', 4],
                                    "formatted": [
                                        {
                                            "templfate": "{% if cadi_id %}hn-cms-{{ cadi_id }}@cern0.ch{% endif %}",
                                            "ctx": [
                                                {
                                                    "name": "cadi_id",
                                                    "path": "analysis_context.cadi_id",
                                                }
                                            ],
                                        },
                                        {
                                            "template": "{% if cadi_id %}mail-{{ cadi_id }}@cern0.ch{% endif %}",
                                            "ctx": [
                                                {
                                                    "name": "cadi_id",
                                                    "path": "analysis_context.cadi_id",
                                                }
                                            ],
                                        },
                                    ]
                                }
                            },
                        ]
                    },
                }
            ],
            "review": [],
        }
    }
}
WRONG_TEMPLATE_CONFIG_ASSERTIONS = {
    "validationError": True,
    "ctx": {"cadi_id": {"type": "deposit", "path": "analysis_context.cadi_id"}},
    "response": 202,
    "outbox": {
        0: {
            "subject": [("in", "New published document | CERN Analysis Preservation")],
            "body": [("in", "CADI ID: {cadi_id}")],
            "recipients": {
                "recipients": [
                    ("in", "user7@cern0.ch"),
                    ("in", "test-recipient@cern0.ch"),
                    ("in", "admin-rev-2@cern0.ch"),
                    ("in", "mail-ABC-11-111@cern0.ch"),
                ]
            },
        }
    },
}
MUTLIPLE_PUBLISH_CONFIG = {
    "notifications": {
        "actions": {
            "publish": [
                {
                    "subject": {
                        "template": 'Questionnaire for {{ cadi_id if cadi_id else "" }} {{ published_id }} - '
                        '{{ "New Version of Published Analysis" if revision > 0 else "New published document" }} '
                        "| CERN Analysis Preservation",
                        "ctx": [
                            {"name": "cadi_id", "path": "analysis_context.cadi_id"},
                            {"method": "revision"},
                            {"method": "published_id"},
                        ],
                    },
                    "body": {
                        "template_file": "mail/body/experiments/cms/questionnaire_message_published_plain.html",
                        "ctx": [
                            {"name": "cadi_id", "path": "analysis_context.cadi_id"},
                            {"name": "title", "path": "general_title"},
                            {"method": "published_url"},
                            {"method": "submitter_email"},
                        ],
                        # "base_template": "mail/analysis_plain_text.html",
                        "plain": True,
                    },
                    "recipients": {
                        "recipients": [
                            "test-recipient@cern0.ch",
                            {
                                "checks": [
                                    {
                                        "path": "analysis_context.cadi_id",
                                        "condition": "exists",
                                    }
                                ],
                                "mails": {
                                    "formatted": [
                                        {
                                            "template": "{% if cadi_id %}hn-cms-{{ cadi_id }}@cern0.ch{% endif %}",
                                            "ctx": [
                                                {
                                                    "name": "cadi_id",
                                                    "type": "path",
                                                    "path": "analysis_context.cadi_id",
                                                }
                                            ],
                                        }
                                    ]
                                },
                            },
                        ]
                    },
                },
                {
                    "subject": {
                        "template_file": "mail/subject/questionnaire_subject_published.html",
                        "ctx": [
                            {"name": "cadi_id", "path": "analysis_context.cadi_id"},
                            {"method": "revision"},
                            {"method": "published_id"},
                        ],
                    },
                    "body": {
                        "template_file": "mail/body/experiments/cms/questionnaire_message_published.html",
                        "ctx": [
                            {"name": "cadi_id", "path": "analysis_context.cadi_id"},
                            {"name": "title", "path": "general_title"},
                            {"method": "published_url"},
                            {"method": "submitter_email"},
                        ],
                    },
                    "recipients": {
                        "recipients": [
                            {"method": "get_owner"},
                            {"method": "get_submitter"},
                        ],
                        "bcc": [
                            {"method": "get_cms_stat_recipients"},
                            {
                                "op": "and",
                                "checks": [
                                    {"path": "ml_app_use", "condition": "exists"}
                                ],
                                "mails": {
                                    "default": [
                                        "ml-conveners-test@cern0.ch",
                                        "ml-conveners-jira-test@cern0.ch",
                                    ]
                                },
                            },
                        ],
                    },
                },
            ]
        }
    }
}

MUTLIPLE_PUBLISH_CONFIG_ASSERTIONS = {
    "ctx": {
        "cadi_id": {"type": "deposit", "path": "analysis_context.cadi_id"},
        "published_id": {"type": "response", "path": "recid"},
    },
    "response": 202,
    "outbox": {
        0: {
            "subject": [
                ("in", "Questionnaire for {cadi_id} {published_id}"),
                ("in", "New published document"),
            ],
            "body": [
                ("in", "ancode={cadi_id}"),
            ],
            "recipients": {
                "recipients": [
                    ("in", "test-recipient@cern0.ch"),
                ]
            },
        },
        1: {},
    },
}

NESTED_CONDITIONS_CONFIG = {
    "notifications": {
        "actions": {
            "publish": [
                {
                    "recipients": {
                        "recipients": [
                            {
                                "checks": [
                                    {
                                        "path": "parton_distribution_functions",
                                        "condition": "exists",
                                    }
                                ],
                                "mails": {"default": ["pdf-forum-placeholder@cern.ch"]},
                            },
                            {
                                "op": "or",
                                "checks": [
                                    {
                                        "path": "multivariate_discriminants.mva_use",
                                        "condition": "equals",
                                        "value": "Yes",
                                    },
                                    # {"path": "ml_app_use", "condition": "exists"},
                                    {
                                        "path": "ml_survey.options",
                                        "condition": "equals",
                                        "value": "Yes",
                                    },
                                    {
                                        "op": "and",
                                        "checks": [
                                            {
                                                "path": "multivariate_discriminants.use_of_centralized_cms_apps.options",
                                                "condition": "exists",
                                            },
                                            {
                                                "path": "multivariate_discriminants.use_of_centralized_cms_apps.options",
                                                "condition": "is_not_in",
                                                "value": "No",
                                            },
                                        ],
                                    },
                                ],
                                "mails": {
                                    "default": ["nested-conditions-mail@cern.ch"]
                                },
                            },
                        ]
                    }
                },
                {
                    "recipients": {
                        "recipients": [
                            {
                                "checks": [
                                    {
                                        "path": "parton_distribution_functions",
                                        "condition": "exists",
                                    }
                                ],
                                "mails": {"default": ["wrong-condition@cern.ch"]},
                            },
                            {
                                "checks": [
                                    {
                                        "path": "parton_distribution_funcions",
                                        "condition": "existds",
                                    }
                                ],
                                "mails": {"default": ["wrong-condition@cern.ch"]},
                            },
                        ]
                    }
                },
                {
                    "recipients": {
                        "recipients": [
                            {
                                "checks": [
                                    {
                                        "path": "parton_distribution_functions",
                                        "condition": "exists",
                                    }
                                ],
                                "method": ["get_submitter"],
                                "mails": {
                                    "default": ["condition-with-methods@cern.ch"]
                                },
                            }
                        ]
                    }
                },
            ]
        }
    }
}


NESTED_CONDITIONS_CONFIG_ASSERTIONS = {
    "ctx": {"cadi_id": {"type": "deposit", "path": "analysis_context.cadi_id"}},
    "response": 202,
    "outbox": {
        0: {
            "recipients": {
                "recipients": [
                    ("in", "pdf-forum-placeholder@cern.ch"),
                    ("in", "nested-conditions-mail@cern.ch"),
                ]
            },
        },
        1: {
            "recipients": {"recipients": [("in", "wrong-condition@cern.ch")]},
        },
        2: {
            "recipients": {
                "recipients": [
                    ("in", "condition-with-methods@cern.ch"),
                    ("in", "superuser@cern.ch"),
                ]
            },
        },
    },
}

CONDITION_THAT_DOESNT_EXIST_CONFIG = {
    "notifications": {
        "actions": {
            "publish": [
                {
                    "recipients": {
                        "recipients": [
                            {
                                "checks": [
                                    {
                                        "path": "test",
                                        "condition": "doesnt_exist",
                                    }
                                ],
                                "mails": {"default": ["test@cern.ch"]},
                            }
                        ]
                    }
                }
            ]
        }
    }
}

NO_RECIPIENTS_CONFIG = {
    "notifications": {
        "actions": {
            "publish": [
                {
                    "subject": {
                        "template": "Questionnaire for {{ cadi_id }} published.",
                        "ctx": [
                            {"name": "cadi_id", "path": "analysis_context.cadi_id"}
                        ],
                    },
                    "body": {
                        "template": "Message with cadi id: {{ cadi_id }}.",
                        "ctx": [
                            {"name": "cadi_id", "path": "analysis_context.cadi_id"}
                        ],
                    },
                }
            ]
        }
    }
}

SUBJECT_METHOD_DOESNT_EXIST_CONFIG = {
    "notifications": {
        "actions": {
            "publish": [
                {
                    "subject": {"method": "get_subject_not_here"},
                    "recipients": {"recipients": ["test-recipient@cern0.ch"]},
                }
            ]
        }
    }
}

SUBJECT_MISSING_CONFIG = {
    "notifications": {
        "actions": {
            "publish": [
                {
                    "body": {
                        "template": "Message with cadi id: {{ cadi_id }}.",
                        "ctx": [
                            {"name": "cadi_id", "path": "analysis_context.cadi_id"}
                        ],
                    },
                    "recipients": {"recipients": ["test-recipient@cern0.ch"]},
                }
            ]
        }
    }
}

BODY_MISSING_CONFIG = {
    "notifications": {
        "actions": {
            "publish": [
                {
                    "subject": {
                        "template": "Questionnaire for {{ cadi_id }} published.",
                        "ctx": [
                            {"name": "cadi_id", "path": "analysis_context.cadi_id"}
                        ],
                    },
                    "recipients": {"recipients": ["test-recipient@cern0.ch"]},
                }
            ]
        }
    }
}

MULTIPLE_RECIPIENTS_CONFIG = {
    "notifications": {
        "actions": {
            "publish": [
                {"recipients": {"recipients": ["test-recipient@cern0.ch"]}},
                {"recipients": {"bcc": ["test-recipient-bcc@cern0.ch"]}},
            ]
        }
    }
}

CONDITION_RECIPIENTS_CONFIG = {
    "notifications": {
        "actions": {
            "publish": [
                {
                    "recipients": {
                        "recipients": [
                            {
                                "checks": [
                                    {
                                        "path": "analysis_context.wg",
                                        "condition": "equals",
                                        "value": "ABC",
                                    }
                                ],
                                "mails": {
                                    "default": ["test-recipient@cern0.ch"],
                                },
                            }
                        ]
                    }
                },
                {"recipients": {"bcc": ["test-recipient-bcc@cern0.ch"]}},
            ]
        }
    }
}

CONDITION_RECIPIENTS_CONFIG_ASSERTIONS = {
    # "ctx": {"cadi_id": {"type": "deposit", "path": "analysis_context.cadi_id"}},
    "response": 202,
    "outbox": {
        0: {
            "recipients": {
                "recipients": [
                    ("in", "test-recipient@cern0.ch"),
                ]
            },
        },
        1: {
            "recipients": {
                "bcc": [
                    ("in", "test-recipient-bcc@cern0.ch"),
                ]
            },
        },
    },
}

WRONG_CONDITION_RECIPIENTS_CONFIG = {
    "notifications": {
        "actions": {
            "publish": [
                {
                    "recipients": {
                        "recipients": [
                            {
                                "checks": [
                                    {
                                        "path": "analysis_context.wg",
                                        "condition": "equals",
                                        "value": "ABdC",
                                    }
                                ],
                                "mails": {
                                    "default": ["test-recipient@cern0.ch"],
                                },
                            }
                        ]
                    }
                },
                {"recipients": {"bcc": ["test-recipient-bcc@cern0.ch"]}},
            ]
        }
    }
}

WRONG_CONDITION_RECIPIENTS_CONFIG_ASSERTIONS = {
    # "ctx": {"cadi_id": {"type": "deposit", "path": "analysis_context.cadi_id"}},
    "response": 202,
    "outbox": {
        # 0: {
        #     "recipients": {
        #         "recipients": [
        #             # ("in", "test-recipient@cern0.ch"),
        #         ]
        #     },
        # },
        0: {
            "recipients": {
                "bcc": [
                    ("in", "test-recipient-bcc@cern0.ch"),
                ]
            },
        }
    },
}

METHOD_AND_WRONG_CONDITION_RECIPIENTS_CONFIG = {
    "notifications": {
        "actions": {
            "publish": [
                {
                    "recipients": {
                        "recipients": [
                            {
                                "checks": [
                                    {
                                        "path": "analysis_context.wg",
                                        "condition": "equals",
                                        "value": "ABC",
                                    }
                                ],
                                "method": ["get_owner", "get_submitter"],
                                "mails": {
                                    "default": ["test-recipient@cern0.ch"],
                                },
                            }
                        ]
                    }
                },
                {"recipients": {"bcc": ["test-recipient-bcc@cern0.ch"]}},
            ]
        }
    }
}

METHOD_AND_WRONG_CONDITION_RECIPIENTS_CONFIG_ASSERTIONS = {
    # "ctx": {"cadi_id": {"type": "deposit", "path": "analysis_context.cadi_id"}},
    "response": 202,
    "outbox": {
        0: {
            "recipients": {
                "recipients": [
                    ("in", "test-recipient@cern0.ch"),
                    ("in", "cms_user@cern.ch"),
                    ("in", "superuser@cern.ch"),
                ]
            },
        },
        1: {
            "recipients": {
                "bcc": [
                    ("in", "test-recipient-bcc@cern0.ch"),
                ]
            },
        },
    },
}


CTX_METHOD_MISSING_CONFIG = {
    "notifications": {
        "actions": {
            "publish": [
                {
                    "body": {
                        "template": "Message with cadi id: {{ cadi_id }} and val {{ new_val }}",
                        "ctx": [
                            {"name": "cadi_id", "path": "analysis_context.cadi_id"},
                            {"method": "new_val"},
                        ],
                    },
                    "recipients": {"recipients": ["test-recipient@cern0.ch"]},
                }
            ]
        }
    }
}

CMS_STATS_QUESTIONNAIRE = {
    "notifications": {
        "actions": {
            "publish": [
                {
                    "subject": {
                        "template": 'Questionnaire for {{ cadi_id if cadi_id else "" }} {{ published_id }} - {{ "New Version of Published Analysis" if revision > 0 else "New published document" }} | CERN Analysis Preservation',
                        "ctx": [
                            {"name": "cadi_id", "path": "analysis_context.cadi_id"},
                            {"method": "revision"},
                            {"method": "published_id"},
                        ],
                    },
                    "body": {
                        "template_file": "mail/body/experiments/cms/questionnaire_message_published.html",
                        "ctx": [
                            {"name": "cadi_id", "path": "analysis_context.cadi_id"},
                            {"name": "title", "path": "general_title"},
                            {"method": "published_url"},
                            {"method": "cms_stats_committee_by_pag"},
                            {"method": "submitter_email"},
                        ],
                    },
                    "recipients": {
                        "bcc": [
                            {"method": "get_cms_stat_recipients"},
                            {"method": "get_owner"},
                            {"method": "get_submitter"},
                            {
                                "checks": [
                                    {
                                        "path": "parton_distribution_functions",
                                        "condition": "exists",
                                    }
                                ],
                                "mails": {"default": ["pdf-forum-placeholder@cern.ch"]},
                            },
                            {
                                "op": "or",
                                "checks": [
                                    {
                                        "path": "multivariate_discriminants.mva_use",
                                        "condition": "equals",
                                        "value": "Yes",
                                    },
                                    {"path": "ml_app_use", "condition": "exists"},
                                    {
                                        "path": "ml_survey.options",
                                        "condition": "equals",
                                        "value": "Yes",
                                    },
                                    {
                                        "op": "and",
                                        "checks": [
                                            {
                                                "path": "multivariate_discriminants.use_of_centralized_cms_apps.options",
                                                "condition": "exists",
                                            },
                                            {
                                                "path": "multivariate_discriminants.use_of_centralized_cms_apps.options",
                                                "condition": "is_not_in",
                                                "value": "No",
                                            },
                                        ],
                                    },
                                ],
                                "mails": {
                                    "default": ["cms-conveners-placeholder@cern.ch"]
                                },
                            },
                        ]
                    },
                },
                {
                    "subject": {
                        "template": 'Questionnaire for {{ cadi_id if cadi_id else "" }} {{ published_id }} - {{ "New Version of Published Analysis" if revision > 0 else "New published document" }} | CERN Analysis Preservation',
                        "ctx": [
                            {"name": "cadi_id", "path": "analysis_context.cadi_id"},
                            {"method": "revision"},
                            {"method": "published_id"},
                        ],
                    },
                    "body": {
                        "template_file": "mail/body/experiments/cms/questionnaire_message_published_plain.html",
                        "ctx": [
                            {"name": "cadi_id", "path": "analysis_context.cadi_id"},
                            {"name": "title", "path": "general_title"},
                            {"method": "published_url"},
                            {"method": "cms_stats_committee_by_pag"},
                            {"method": "submitter_email"},
                        ],
                        "base_template": "mail/body/analysis_plain_text.html",
                        "plain": True,
                    },
                    "recipients": {
                        "bcc": [
                            {
                                "checks": [
                                    {
                                        "path": "analysis_context.cadi_id",
                                        "condition": "exists",
                                    }
                                ],
                                "mails": {
                                    "formatted": [
                                        {
                                            "template": "{% if cadi_id %}hn-cms-{{ cadi_id }}@cern0.ch{% endif %}",
                                            "ctx": [
                                                {
                                                    "name": "cadi_id",
                                                    "path": "analysis_context.cadi_id",
                                                }
                                            ],
                                        }
                                    ]
                                },
                            }
                        ]
                    },
                },
                # {
                #     "subject": {
                #         "template": 'Questionnaire for {{ cadi_id if cadi_id else "" }} {{ published_id }} - {{ "New Version of Published Analysis" if revision > 0 else "New published document" }} | CERN Analysis Preservation',
                #     },
                #     "body": {
                #         "template_file": "mail/body/experiments/cms/questionnaire_message_published.html",
                #         "ctx": [
                #             {"name": "cadi_id", "path": "analysis_context.cadi_id"},
                #             {"name": "title", "path": "general_title"},
                #             {"method": "published_url"},
                #             {"method": "cms_stats_committee_by_pag"},
                #             {"method": "submitter_email"},
                #         ],
                #         "base_template": "mail/analysis_plain_text.html",
                #         "plain": true,
                #     },
                #     "recipients": {
                #         "bcc": [
                #             {
                #                 "op": "or",
                #                 "checks": [
                #                     {
                #                         "path": "multivariate_discriminants.mva_use",
                #                         "condition": "equals",
                #                         "value": "Yes",
                #                     },
                #                     {"path": "ml_app_use", "condition": "exists"},
                #                     {
                #                         "path": "ml_survey.options",
                #                         "condition": "equals",
                #                         "value": "Yes",
                #                     },
                #                     {
                #                         "op": "and",
                #                         "checks": [
                #                             {
                #                                 "path": "multivariate_discriminants.use_of_centralized_cms_apps.options",
                #                                 "condition": "exists",
                #                             },
                #                             {
                #                                 "path": "multivariate_discriminants.use_of_centralized_cms_apps.options",
                #                                 "condition": "is_not_in",
                #                                 "value": "No",
                #                             },
                #                         ],
                #                     },
                #                 ],
                #                 "mails": {
                #                     "default": [
                #                         "cms-conveners-jira-placeholder@cern.ch"
                #                     ]
                #                 },
                #             }
                #         ]
                #     },
                # },
            ],
            # "review": [
            #     {
            #         "subject": {
            #             "template": "Questionnaire for {{ cadi_id }} - New Review on Analysis | CERN Analysis Preservation",
            #             "ctx": [
            #                 {"name": "cadi_id", "path": "analysis_context.cadi_id"}
            #             ],
            #         },
            #         "body": {
            #             "template_file": "mail/body/experiments/cms/questionnaire_message_review.html",
            #             "ctx": [
            #                 {"name": "cadi_id", "path": "analysis_context.cadi_id"},
            #                 {"name": "title", "path": "general_title"},
            #                 {"method": "working_url"},
            #                 {"method": "creator_email"},
            #                 {"method": "submitter_email"},
            #             ],
            #         },
            #         "recipients": {
            #             "bcc": [{"method": "get_owner"}, {"method": "get_submitter"}]
            #         },
            #     },
            #     {
            #         "subject": {
            #             "template": "Questionnaire for {{ cadi_id }} - New Review on Analysis | CERN Analysis Preservation",
            #             "ctx": [
            #                 {"name": "cadi_id", "path": "analysis_context.cadi_id"}
            #             ],
            #         },
            #         "body": {
            #             "template_file": "mail/body/experiments/cms/questionnaire_message_review_plain.html",
            #             "ctx": [
            #                 {"name": "cadi_id", "path": "analysis_context.cadi_id"},
            #                 {"name": "title", "path": "general_title"},
            #                 {"method": "working_url"},
            #                 {"method": "creator_email"},
            #                 {"method": "submitter_email"},
            #             ],
            #             "base_template": "mail/analysis_plain_text.html",
            #             "plain": true,
            #         },
            #         "recipients": {
            #             "bcc": [
            #                 {
            #                     "checks": [
            #                         {
            #                             "path": "analysis_context.cadi_id",
            #                             "condition": "exists",
            #                         },
            #                         {
            #                             "path": "parton_distribution_functions",
            #                             "condition": "is_egroup_member",
            #                             "value": "comittee-mail",
            #                         },
            #                     ],
            #                     "mails": {
            #                         "formatted": [
            #                             {
            #                                 "template": "{% if cadi_id %}hn-cms-{{ cadi_id }}@cern.ch{% endif %}",
            #                                 "ctx": [
            #                                     {
            #                                         "name": "cadi_id",
            #                                         "path": "analysis_context.cadi_id",
            #                                     }
            #                                 ],
            #                             }
            #                         ]
            #                     },
            #                 }
            #             ]
            #         },
            #     },
            # ],
        }
    }
}

CMS_STATS_QUESTIONNAIRE_ASSERTIONS = {
    "ctx": {
        "cadi_id": {"type": "deposit", "path": "analysis_context.cadi_id"},
        "published_id": {"type": "response", "path": "recid"},
    },
    "response": 202,
    "outbox": {
        0: {
            "subject": [
                ("in", "Questionnaire for {cadi_id} {published_id}"),
                ("in", "New published document"),
            ],
            "html": [
                ("in", "ancode={cadi_id}"),
                ("in", "Admin Rev 1 (primary)"),
                ("in", "Admin Rev 2 (secondary)"),
            ],
            "recipients": {
                "bcc": [
                    ("in", "admin-rev-1@cern0.ch"),
                    ("in", "admin-rev-2@cern0.ch"),
                    ("in", "cms_user@cern.ch"),
                    ("in", "superuser@cern.ch"),
                ]
            },
        },
        # 1: {
        #     "subject": [
        #         ("in", "Questionnaire for {cadi_id} {published_id}"),
        #         ("in", "New published document"),
        #     ],
        #     "body": [
        #         ("in", "ancode={cadi_id}"),
        #         ("in", "Admin Rev 1 (primary)"),
        #         ("in", "Admin Rev 2 (secondary)"),
        #     ],
        #     "recipients": {
        #         "bcc": [
        #             ("in", "hn-cms-ABC-11-111@cern0.ch")
        #         ]
        #     },
        # },
    },
}

WRONG_BASE_TEMPLATE_CONFIG = {
    "notifications": {
        "actions": {
            "publish": [
                {
                    "body": {
                        "template_file": "mail/body/experiments/cms/questionnaire_message_published_plain.html",
                        "ctx": [
                            {"name": "cadi_id", "path": "analysis_context.cadi_id"},
                            {"name": "title", "path": "general_title"},
                            {"method": "published_url"},
                            {"method": "submitter_email"},
                        ],
                        "base_template": "mail/wrong_template.html",
                        "plain": True,
                    },
                    "recipients": {
                        "recipients": [ "test-recipient@cern0.ch" ]
                    },
                },
                {
                    "subject": {
                        "template_file": "mail/subject/questionnaire_subject_published.html",
                        "ctx": [
                            {"name": "cadi_id", "path": "analysis_context.cadi_id"},
                            {"method": "revision"},
                            {"method": "published_id"},
                        ],
                    },
                    "body": {
                        "template_file": "mail/body/experiments/cms/questionnaire_message_published.html",
                        "ctx": [
                            {"name": "cadi_id", "path": "analysis_context.cadi_id"},
                            {"name": "title", "path": "general_title"},
                            {"method": "published_url"},
                            {"method": "submitter_email"},
                        ],
                    },
                    "recipients": {
                        "recipients": [
                            {"method": "get_owner"},
                            {"method": "get_submitter"},
                        ],
                        "bcc": [
                            {"method": "get_cms_stat_recipients"},
                            {
                                "op": "and",
                                "checks": [
                                    {"path": "ml_app_use", "condition": "exists"}
                                ],
                                "mails": {
                                    "default": [
                                        "ml-conveners-test@cern0.ch",
                                        "ml-conveners-jira-test@cern0.ch",
                                    ]
                                },
                            },
                        ],
                    },
                },
            ]
        }
    }
}

WRONG_BASE_TEMPLATE_CONFIG_ASSERTIONS = {
    "ctx": {
        "cadi_id": {"type": "deposit", "path": "analysis_context.cadi_id"},
        "published_id": {"type": "response", "path": "recid"},
    },
    "response": 202,
    "outbox_length": 1,
    "outbox": {
        0: {
            "recipients": {
                "recipients": [
                    ("in", "cms_user@cern.ch"),
                    ("in", "superuser@cern.ch"),
                ],
                "bcc": [
                    ("in", "ml-conveners-test@cern0.ch"),
                    ("in", "ml-conveners-jira-test@cern0.ch"),
                ]
            },
        }
    }
}