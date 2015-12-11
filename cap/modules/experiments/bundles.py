from __future__ import absolute_import, print_function

from flask_assets import Bundle
from invenio_assets import NpmBundle

# css = NpmBundle(
#     'scss/cap.scss',
#     filters='scss, cleancss',
#     output='gen/cap.%(version)s.css',
#     npm={
#         "almond": "~0.3.1",
#         "bootstrap-sass": "~3.3.5",
#         "font-awesome": "~4.4.0",
#     }
# )

cms_js = NpmBundle(
    filters='jsmin',
    output="gen/cap.cms.%(version)s.js",
    npm={
        "almond": "~0.3.1",
        "angular": "~1.4.7",
        "bootstrap": "~3.3.5",
    }
)

lhcb_js = NpmBundle(
    filters='requirejs',
    output="gen/cap.lhcb.%(version)s.js",
    npm={
        "almond": "~0.3.1",
        "angular": "~1.4.7",
    }
)

atlas_js = NpmBundle(
    filters='requirejs',
    output="gen/cap.atlas.%(version)s.js",
    npm={
        "almond": "~0.3.1",
        "angular": "~1.4.7",
    }
)

alice_js = NpmBundle(
    filters='requirejs',
    output="gen/cap.alice.%(version)s.js",
    npm={
        "almond": "~0.3.1",
        "angular": "~1.4.7",
    }
)

experiments_js = NpmBundle(
    "js/experiments/main.js",
    filters='requirejs',
    output="gen/cap.experiments.%(version)s.js",
    npm={
        "almond": "~0.3.1",
        "angular": "~1.4.7"
    }
)

experiments_css = NpmBundle(
    'scss/experiments.scss',
    filters='scss, cleancss',
    output='gen/cap.%(version)s.css',
    npm={
        "almond": "~0.3.1",
        "bootstrap-sass": "~3.3.5",
        "font-awesome": "~4.4.0",
    }
)
