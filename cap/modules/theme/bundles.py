from __future__ import absolute_import, print_function

from flask_assets import Bundle
from invenio_assets import NpmBundle


# Used when ASSETS_DEBUG is False - like production
almondjs = NpmBundle(
    "node_modules/almond/almond.js",
    "js/settings.js",
    filters="uglifyjs",
    output="gen/almond.%(version)s.js",
    npm={
        "almond": "~0.3.1",
        "hogan.js": "~3.0.2",
        "requirejs-hogan-plugin": "~0.3.1"
    }
)

# require.js is only used when:
#
#  - ASSETS_DEBUG is True
#  - REQUIREJS_RUN_IN_DEBUG is not False
requirejs = NpmBundle(
    "node_modules/requirejs/require.js",
    "js/settings.js",
    output="gen/require.%(version)s.js",
    filters="uglifyjs",
    npm={
        "requirejs": "~2.1.22",
    }
)

css = NpmBundle(
    'scss/cap.scss',
    filters='scss, cleancss',
    output='gen/cap.%(version)s.css',
    npm={
        "almond": "~0.3.1",
        "bootstrap-sass": "~3.3.5",
        "font-awesome": "~4.4.0",
    }
)

js = NpmBundle(
    Bundle(
        'node_modules/almond/almond.js',
        'js/cap-build.js',
        'js/settings.js',
        'js/cap-settings.js',
        filters='uglifyjs',
    ),
    filters='jsmin',
    output="gen/cap.%(version)s.js",
    npm={
        "almond": "~0.3.1",
        "angular": "~1.4.10",
        "bootstrap": "~3.3.5",
    }
)

search_js = NpmBundle(
    'js/search.js',
    filters='requirejs',
    npm={
        "almond": "~0.3.1",
        "angular": "~1.4.9",
        "bootstrap": "~3.3.5",
    },
    output="gen/cap_search.%(version)s.js"
)

front_css = NpmBundle(
    'scss/frontpage.scss',
    filters='scss, cleancss',
    output='gen/cap.front.%(version)s.css',
    npm={
        "almond": "~0.3.1",
        "bootstrap-sass": "~3.3.5",
        "font-awesome": "~4.4.0",
    }
)


front_js = NpmBundle(
    'js/front/main.js',
    filters='requirejs',
    output="gen/cap.front.%(version)s.js",
    npm={
        "almond": "~0.3.1",
        "angular": "~1.4.10",
    }
)

records = NpmBundle(
    'js/records/main.js',
    filters='requirejs',
    output="gen/cap.records.%(version)s.js",
    npm={
        "almond": "~0.3.1",
        "angular": "~1.4.10",
        "angular-filter": "~0.5.1",
    }
)
