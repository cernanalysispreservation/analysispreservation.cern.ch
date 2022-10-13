import click
import yaml
from jinja2 import Template


@click.command()
@click.argument('file_path_src', type=click.File('r'))
@click.argument('file_path_dest', type=click.File('w'))
@click.argument(
    'host_url',
    default='https://analysispreservation.cern.ch/api',
    type=click.STRING,
)
@click.option('--headers', '-h', 'headers', type=click.STRING)
def populate_services_yaml(file_path_src, file_path_dest, host_url, headers):
    """Return Statping compatible yml.

    Example: python statping.py app/template-services.yml app/services.yml
             https://nginx/api -h 'Host=nginx'
    param: file_path_src: File containing services metadata
    param: file_path_dest: File with updated base url and headers
    param: host_url: Host name of the instance
           [default:https://analysispreservation.cern.ch/api]
    param: headers: Comma delimited list of HTTP Headers 'KEY=VALUE,KEY=VALUE'
    """
    template = Template(file_path_src.read())
    rendered_template = template.render(host_url=host_url, headers=headers)

    yaml_content = yaml.safe_load(rendered_template)
    yaml.dump(yaml_content, file_path_dest)

    return


if __name__ == '__main__':
    populate_services_yaml()
