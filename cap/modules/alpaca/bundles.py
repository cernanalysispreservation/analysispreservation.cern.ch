from __future__ import absolute_import, print_function

from flask_assets import Bundle
from invenio_assets import NpmBundle

display_js = NpmBundle(
    Bundle(
        filters="uglifyjs",
    ),
    Bundle(
        'js/jsondisplay.js',
        filters="requirejs",
    ),
    filters="requirejs",
    output="gen/invenio.alpaca.display.%(version)s.js",
    npm={
        "jquery": "~2.1.4",
        "select2": "~4.0.1",
        "underscore": "~1.8.3",
        "typeahead.js": "~0.10.5",
        "handlebars": "~3.0.3",
        "moment": "~2.10.6",
        "json-schema-ref-parser": "~1.4.0",
        "alpaca": "1.5.11",
        "gulp": "3.9.0",
    }
)

create_js = NpmBundle(
    Bundle(
        filters="uglifyjs",
    ),
    Bundle(
        'js/jsonwidget-create.js',
        'js/records/main.js',
        filters="requirejs",
    ),
    output="gen/invenio.alpaca.edit.%(version)s.js",
    npm={
        "jquery": "~2.1.4",
        "select2": "~4.0.1",
        "underscore": "~1.8.3",
        "typeahead.js": "~0.10.5",
        "bootstrap-tagsinput": "~0.7.1",
        "handlebars": "~3.0.3",
        "moment": "~2.10.6",
        "json-schema-ref-parser": "~1.4.0",
        "alpaca": "1.5.11",
        "gulp": "3.9.0",
        "fast-json-patch": "~0.5.4",
        "jsoneditor": "~5.1.5",
    }
)

edit_js = NpmBundle(
    Bundle(
        filters="uglifyjs",
    ),
    Bundle(
        'js/jsonwidget-edit.js',
        'js/records/main.js',
        filters="requirejs",
    ),
    output="gen/invenio.alpaca.edit.%(version)s.js",
    npm={
        "jquery": "~2.1.4",
        "select2": "~4.0.1",
        "underscore": "~1.8.3",
        "typeahead.js": "~0.10.5",
        "bootstrap-tagsinput": "~0.7.1",
        "handlebars": "~3.0.3",
        "moment": "~2.10.6",
        "json-schema-ref-parser": "~1.4.0",
        "alpaca": "1.5.11",
        "gulp": "3.9.0",
        "fast-json-patch": "~0.5.4",
    }
)

display_css = NpmBundle(
    'scss/invenio-alpaca-display.scss',
    filters="scss, cleancss",
    output="gen/invenio.alpaca.display.%(version)s.css",
    npm={
        "almond": "~0.3.1",
        "bootstrap-sass": "~3.3.5",
        "font-awesome": "~4.4.0",
    }
)
edit_css = NpmBundle(
    Bundle(
        'node_modules/select2/dist/css/select2.css',
        'node_modules/bootstrap-tagsinput/dist/bootstrap-tagsinput-typeahead.css',
        'scss/invenio-alpaca-edit.scss',
        filters="scss, cleancss",
    ),
    output="gen/invenio.alpaca.edit.%(version)s.css",
    npm={
        "almond": "~0.3.1",
        "bootstrap-sass": "~3.3.5",
        "font-awesome": "~4.4.0",
    }
)
