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

EMPTY_CONFIG = {}

SIMPLE_CONFIG = {
    "notifications": {
        "actions": {
            "publish": [{
                "subject": {
                    "template": 'Questionnaire for {{ cadi_id }} published.',
                    "ctx": [{
                        "name": "cadi_id",
                        "path": "analysis_context.cadi_id"
                    }]
                },
                "body": {
                    "template": 'Message with cadi id: {{ cadi_id }}.',
                    "ctx": [{
                        "name": "cadi_id",
                        "path": "analysis_context.cadi_id"
                    }]
                },
                "recipients": {'recipients': ['test-recipient@cern0.ch']}
            }]
        }
    }
}

NESTED_CONDITION_WITH_ERRORS_CONFIG = {
    "notifications": {
        "actions": {
            "publish": [{
                "recipients": {
                    "recipients": [{
                        "checks": [{
                            "path": "analysis_context.cadi_id",
                            "condition": "exists",
                        }, {
                            "checks": [{
                                "path": "analysis_context",
                                "condition": "exists"
                            }, {
                                "path": "test1",
                                "condition": "error_here",
                            }]
                        }],
                        "mails": {"default": ["test@cern.ch"]}
                    }]
                }
            }]
        }
    }
}

CONDITION_THAT_DOESNT_EXIST_CONFIG = {
    "notifications": {
        "actions": {
            "publish": [{
                "recipients": {
                    "recipients": [{
                        "checks": [{
                            "path": "test",
                            "condition": "doesnt_exist",
                        }],
                        "mails": {"default": ["test@cern.ch"]}
                    }]
                }
            }]
        }
    }
}

NO_RECIPIENTS_CONFIG = {
    "notifications": {
        "actions": {
            "publish": [{
                "subject": {
                    "template": 'Questionnaire for {{ cadi_id }} published.',
                    "ctx": [{
                        "name": "cadi_id",
                        "path": "analysis_context.cadi_id"
                    }]
                },
                "body": {
                    "template": 'Message with cadi id: {{ cadi_id }}.',
                    "ctx": [{
                        "name": "cadi_id",
                        "path": "analysis_context.cadi_id"
                    }]
                }
            }]
        }
    }
}

SUBJECT_METHOD_DOESNT_EXIST_CONFIG = {
    "notifications": {
        "actions": {
            "publish": [{
                "subject": {
                    "method": "get_subject_not_here"
                },
                "recipients": {'recipients': ['test-recipient@cern0.ch']}
            }]
        }
    }
}

SUBJECT_MISSING_CONFIG = {
    "notifications": {
        "actions": {
            "publish": [{
                "body": {
                    "template": 'Message with cadi id: {{ cadi_id }}.',
                    "ctx": [{
                        "name": "cadi_id",
                        "path": "analysis_context.cadi_id"
                    }]
                },
                "recipients": {'recipients': ['test-recipient@cern0.ch']}
            }]
        }
    }
}

BODY_MISSING_CONFIG = {
    "notifications": {
        "actions": {
            "publish": [{
                "subject": {
                    "template": 'Questionnaire for {{ cadi_id }} published.',
                    "ctx": [{
                        "name": "cadi_id",
                        "path": "analysis_context.cadi_id"
                    }]
                },
                "recipients": {'recipients': ['test-recipient@cern0.ch']}
            }]
        }
    }
}

MULTIPLE_RECIPIENTS_CONFIG = {
    "notifications": {
        "actions": {
            "publish": [{
                "recipients": {'recipients': ['test-recipient@cern0.ch']}
            }, {
                "recipients": {'bcc': ['test-recipient-bcc@cern0.ch']}
            }]
        }
    }
}

CTX_METHOD_MISSING_CONFIG = {
    "notifications": {
        "actions": {
            "publish": [{
                "body": {
                    "template": 'Message with cadi id: {{ cadi_id }} and val {{ new_val }}',
                    "ctx": [{
                        "name": "cadi_id",
                        "path": "analysis_context.cadi_id"
                    }, {
                        "method": "new_val"
                    }]
                },
                "recipients": {'recipients': ['test-recipient@cern0.ch']}
            }]
        }
    }
}
