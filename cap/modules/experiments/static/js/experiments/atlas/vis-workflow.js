/**
 * Created by eamonnmaguire on 05/04/2016.
 */

var analysis_workflow_vis = (function () {

    var svg;
    var options = {show_zip: true};

    function process_data(data) {

        var graphs = [];

        data.workflows.forEach(function (workflow) {
            var dependency_map = {};
            var groups = {};
            var graph = {'nodes': [], 'links': [], 'groups': []};

            var node_count = 0;
            workflow.stages.forEach(function (stage) {

                // push main process
                graph.nodes.push({'id': node_count, 'type': 'process', 'name': stage.name, 'info': stage});
                dependency_map[stage.name] = {'id': node_count, 'outputs': {}};
                groups[stage.name] = {"leaves": []};

                groups[stage.name].leaves.push(node_count);

                node_count += 1;

                var scheduler = stage.scheduler;
                var step = scheduler.step;

                // push outputs and link them to the process.
                for (var output_key in step.publisher.outputmap) {

                    var value = step.publisher.outputmap[output_key];
                    graph.nodes.push({
                        'id': node_count,
                        'type': 'output',
                        'name': value === 'output' ? output_key : value,
                        'value': output_key
                    });

                    graph.links.push({'source': dependency_map[stage.name].id, 'target': node_count});
                    dependency_map[stage.name].outputs[output_key] = {
                        'id': node_count,
                        'name': step.publisher.outputmap[output_key]
                    };

                    groups[stage.name].leaves.push(node_count);

                    node_count += 1;
                }

                if ('outputs' in stage.scheduler) {
                    stage.dependencies.forEach(function (dependency) {
                        if (dependency in dependency_map) {
                            var output_node = dependency_map[dependency].outputs[stage.scheduler.outputs];
                            graph.links.push({'source': output_node.id, 'target': dependency_map[stage.name].id})
                        }
                    });
                }

                if (scheduler.scheduler_type == 'zip-from-dep') {
                    if ('zip' in stage.scheduler) {
                        for (var zip_directive_idx in stage.scheduler.zip) {
                            var zip_directive = stage.scheduler.zip[zip_directive_idx];

                            if (options.show_zip) {
                                graph.nodes.push({
                                    'id': node_count,
                                    'type': 'zip',
                                    'name': 'Zip',
                                    'value': output_key,
                                    'info': zip_directive
                                });
                            }

                            var output_nodes = zip_directive.outputs.split("|");

                            zip_directive.from_stages.forEach(function (dependency) {
                                output_nodes.forEach(function (output_item) {
                                    if (dependency in dependency_map) {
                                        var output_node = dependency_map[dependency].outputs[output_item];
                                        if (output_node) {
                                            if (options.show_zip) {
                                                graph.links.push({'source': output_node.id, 'target': node_count});
                                                groups[stage.name].leaves.push(node_count);
                                                graph.links.push({
                                                    'source': node_count,
                                                    'target': dependency_map[stage.name].id
                                                })
                                            } else {
                                                graph.links.push({
                                                    'source': output_node.id,
                                                    'target': dependency_map[stage.name].id
                                                })
                                            }
                                        }
                                    }
                                });

                            });
                            if (options.show_zip) {
                                node_count += 1;
                            }
                        }
                    }
                }


            });

            for (var group_key in groups) {
                graph.groups.push(groups[group_key]);
            }

            graphs.push(graph);
        });
        return graphs;
    }

    function getTextWidth(text, fontSize, fontFace) {
        var a = document.createElement('canvas');
        var b = a.getContext('2d');
        b.font = fontSize + 'px ' + fontFace;
        return b.measureText(text).width;
    }

    return {
        render: function (placement, data, options) {

            var tip = d3.tip().attr('class', 'd3-tip')
                .html(function (d) {
                    if (d.type === 'output') {
                        return d.name
                    }

                    var html;
                    if (d.type === 'zip') {
                        html = '<p>From stages</p><ul>';
                        d.info.from_stages.forEach(function (d) {
                            html += '<li>' + d + '</li>';
                        });
                        html += '</ul>';

                    } else {

                        var cmd = d.info.scheduler.step.process.cmd;
                        for(var parameter_type in d.info.parameters) {
                            cmd = cmd.replace('{' + parameter_type+ '}', d.info.parameters[parameter_type]);
                        }

                        html = '<span>' + d.name + '</span><br/>';
                    }
                    return html;
                });

            var zoom = d3.behavior.zoom().scaleExtent([.3, 5]);

            svg = d3.select(placement)
                .append('svg')
                .attr({
                    'width': options.width,
                    'height': options.height
                });

            svg.call(tip);

            svg.append('rect')
                .attr('id', 'zoom-region')
                .attr('width', options.width)
                .attr('height', options.height)
                .attr('fill', 'white')
                .call(zoom.on("zoom", function () {
                    vis.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
                }))
            ;

            var vis = svg.append('g');


            var cola_d3 = cola.d3adaptor()
                .linkDistance(60)

                .symmetricDiffLinkLengths(15)
                .avoidOverlaps(true)
                .size([options.width, options.height]);

            var graphs = process_data(data);
            var graph = graphs[0];

            graph.nodes.forEach(function (v) {
                v.width = (v.type === 'output' ? 90 : v.type === 'zip' ? 70 : 150);
                v.height = (v.type === 'output' ? 70 : v.type === 'zip' ? 70 : 80);
            });

            graph.groups.forEach(function (g) {
                g.padding = 0.01;
            });

            cola_d3
                .nodes(graph.nodes)
                .links(graph.links)
                .flowLayout("y", 40)
                .constraints([{"axis":"x", "left":1, "right":1, "gap":50}])
                .start(50, 25, 50);


            var link = vis.selectAll(".link")
                .data(graph.links)
                .enter().append("line")
                .attr("class", "link")
                .attr("marker-end", function (d) {
                    return "url(#" + d.rel + ")";
                });


            var pad = 10;
            var node = vis.selectAll(".node")
                .data(graph.nodes)
                .enter().append("g").attr('class', function (d) {
                    return 'node ' + d.type;
                })
                .attr('transform', 'translate(0,0)');

            node.call(cola_d3.drag);

            node.on('mouseover', tip.show)
                .on('mouseout', tip.hide);


            node.append("rect")
                .attr("class", function (d) {
                    return d.type;
                })
                .attr('rx', function (d) {
                    return d.type == 'process' ? 15 : d.type == 'zip' ? 30 : 2;
                })
                .attr("width", function (d) {

                    return d.width - (2 * pad);
                })
                .attr("height", function (d) {
                    return d.height - (2 * pad);
                });

            node.append("line").attr('class', 'output_header').attr({
                'x1': 0,
                'y1': 15,
                'y2': 15
            }).attr('x2', function (d) {
                return d.width - (2 * pad);
            });

            node.append('text').attr('class', 'node-type').text(function (d) {
                return d.type == 'output' ? "Output" : "";
            }).attr('text-anchor', 'middle')
                .attr('x', function (d) {
                    return (d.width - (2 * pad)) / 2;
                }).attr('y', 10);


            node.append("text")
                .attr("class", function (d) {
                    return "label " + d.type;
                })
                .attr('x', function (d) {
                    return (d.width - (2 * pad)) / 2;
                })
                // and shrink it.
                .attr('textLength', function (d) {
                    var text_width = getTextWidth(d.name, 12, 'Montserrat');
                    return text_width > d.width - (2 * pad) ? (d.width - (2 * pad) - 10) : text_width;
                })
                .attr('lengthAdjust', function (d) {
                    return null;
                })
                .attr('y', function (d) {
                    return (d.height) / 2 - (d.type != 'output' ? 7 : 0);
                })
                .attr('text-anchor', 'middle')
                .text(function (d) {
                    return d.name;
                });

            node.append("title")
                .text(function (d) {
                    return d.name;
                });

            cola_d3.on("tick", function () {
                link.attr("x1", function (d) {
                        return d.source.x;
                    })
                    .attr("y1", function (d) {
                        return d.source.y;
                    })
                    .attr("x2", function (d) {
                        return d.target.x;
                    })
                    .attr("y2", function (d) {
                        return d.target.y;
                    });

                node
                    .attr('transform', function (d) {
                        return 'translate(' + (d.x - d.width / 2 + pad) + ',' + (d.y - d.height / 2 + pad) + ')'
                    });


            });
        }
    }
})();