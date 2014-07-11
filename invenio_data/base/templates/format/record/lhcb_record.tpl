{#
## This file is part of Invenio.
## Copyright (C) 2014 CERN.
##
## Invenio is free software; you can redistribute it and/or
## modify it under the terms of the GNU General Public License as
## published by the Free Software Foundation; either version 2 of the
## License, or (at your option) any later version.
##
## Invenio is distributed in the hope that it will be useful, but
## WITHOUT ANY WARRANTY; without even the implied warranty of
## MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
## General Public License for more details.
##
## You should have received a copy of the GNU General Public License
## along with Invenio; if not, write to the Free Software Foundation, Inc.,
## 59 Temple Place, Suite 330, Boston, MA 02111-1307, USA.
#}

<div>
                <table>
<!--####################################################-->
                    <tr style="padding: 7px;">
                        <td> <h4> Event Samples - Data </h4> </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> DST BK Path </td>
                        <td style="padding: 7px;"> {{ record.get('dst_bk_path') }} </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Data Year </td>
                        <td style="padding: 7px;"> {{ record.get('data_year') }} </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Reconstruction Software </td>
                        <td style="padding: 7px;"> {{ record.get('reconstruction_sw.sw') }} - {{ record.get('reconstruction_sw.version') }}</td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Trigger </td>
                        <td style="padding: 7px;"> {{ record.get('trigger') }} </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Trigger Details </td>
                        <td style="padding: 7px;"> {{ record.get('trigger_details') }} </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Stripping Software </td>
                        <td style="padding: 7px;"> {{ record.get('stripping_sw.sw') }}  {{ record.get('stripping_sw.version') }}</td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Stripping Line </td>
                        <td style="padding: 7px;"> {{ record.get('stripping_line') }} </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Analysis Software </td>
                        <td style="padding: 7px;"> {{ record.get('analysis_software.sw') }} - {{ record.get('analysis_software.version') }} </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td> <br /> </td>
                    </tr>
<!--####################################################-->
                    <tr style="padding: 7px;">
                        <td><h4> Event Samples - MC </h4></td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Monte Carlo </td>
                        <td style="padding: 7px;"> {{ record.get('mc_monte_carlo') }} </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Monte Carlo Samples </td>
                        <td style="padding: 7px;"> {{ record.get('mc_monte_carlo_samples') }} </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> MC BK Path </td>
                        <td style="padding: 7px;"> {{ record.get('mc_bk_path') }} </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Data Year </td>
                        <td style="padding: 7px;"> {{ record.get('mc_data_year') }} </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Reconstruction Software </td>
                        <td style="padding: 7px;"> {{ record.get('mc_reconstruction_sw.sw') }} - {{ record.get('reconstruction_sw.version') }}</td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Trigger </td>
                        <td style="padding: 7px;"> {{ record.get('mc_trigger') }} </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Trigger Details </td>
                        <td style="padding: 7px;"> {{ record.get('mc_trigger_details') }} </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Stripping Software </td>
                        <td style="padding: 7px;"> {{ record.get('mc_stripping_sw.sw') }}  {{ record.get('mc_stripping_sw.version') }}</td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Stripping Line </td>
                        <td style="padding: 7px;"> {{ record.get('mc_stripping_line') }} </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Analysis Software </td>
                        <td style="padding: 7px;"> {{ record.get('mc_analysis_software.sw') }} - {{ record.get('mc_analysis_software.version') }}</td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td> <br /> </td>
                    </tr>
<!--####################################################-->
                    <tr style="padding: 7px;">
                        <td><h4> User Code </h4></td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Platform </td>
                        <td style="padding: 7px;"> {{ record.get('platform') }} </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> User Code </td>
                        <td style="padding: 7px;"> {{ record.get('user_code.url') }} </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Code Type </td>
                        {% if  record.get('code_type') == 'other' %}
                            <td style="padding: 7px;"> {{ record.get('code_type_other') }} </td>
                        {% else %}
                            <td style="padding: 7px;"> {{ record.get('code_type') }} </td>
                        {% endif %}
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Comment </td>
                        <td style="padding: 7px;"> {{ record.get('code_comment') }} </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> To Reproduce </td>
                        <td style="padding: 7px;"> See '{{ record.get('reproduce') }}' </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td> <br /> </td>
                    </tr>
<!--####################################################-->
                    <tr style="padding: 7px;">
                        <td><h4> Final N Tuples </h4></td>
                    </tr>

                    {% for val in record.get('final_n_tuples') %}

                        <tr style="padding: 7px;">
                            <td style="padding: 7px; text-align: right; font-weight:bold;"> {{ val.data_file }} </td>
                            <td style="padding: 7px;"> {{val.description}} </td>
                        </tr>

                    {% endfor %}

                    <tr style="padding: 7px;">
                        <td> <br /> </td>
                    </tr>
<!--####################################################-->
                    <tr style="padding: 7px;">
                        <td><h4> Internal Documentation </h4></td>
                    </tr>

                    {% if record.get('internal_docs') %}
                        {% for val in record.get('internal_docs') %}
                            <tr style="padding: 7px;">
                                <td style="padding: 7px;"> {{ val.doc }} </td>
                            <tr style="padding: 7px;">
                        {% endfor %}
                    {% else %}
                        <tr style="padding: 7px;">
                                <td style="padding: 7px;"> None </td>
                            <tr style="padding: 7px;">
                    {% endif %}

                    <tr style="padding: 7px;">
                        <td> <br /> </td>
                    </tr>
<!--####################################################-->
                    <tr style="padding: 7px;">
                        <td><h4> Internal Discussion </h4></td>
                    </tr>

                    {% if record.get('egroup') %}
                        {% for val in record.get('egroup') %}
                            <tr style="padding: 7px;">
                                <td style="padding: 7px;"> {{ val.egroup }} </td>
                            <tr style="padding: 7px;">
                        {% endfor %}
                    {% else %}
                        <tr style="padding: 7px;">
                                <td style="padding: 7px;"> None </td>
                            <tr style="padding: 7px;">
                    {% endif %}

                    <tr style="padding: 7px;">
                        <td> <br /> </td>
                    </tr>
<!--####################################################-->
                    <tr style="padding: 7px;">
                        <td><h4> Presentation </h4></td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;">Internal Talks </td>

                        <td>
                            <table>
                                <tr style="padding: 7px;">
                                    {% if record.get('internal_talks') %}
                                        {% for val in record.get('internal_talks') %}
                                            <tr style="padding: 7px;">
                                                <td style="padding: 7px;"> {{ val.talk }} </td>
                                            </tr>
                                        {% endfor %}
                                    {% else %}
                                            <td style="padding: 7px;"> None </td>
                                    {% endif %}
                                </tr>
                            </table>
                        </td>

                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;">Public Talks </td>
                        <td>
                            <table>
                                <tr style="padding: 7px;">
                                    {% if record.get('public_talks') %}
                                        {% for val in record.get('public_talks') %}
                                            <tr style="padding: 7px;">
                                                <td style="padding: 7px;"> {{ val.talk }} </td>
                                            </tr>
                                        {% endfor %}
                                    {% else %}
                                            <td style="padding: 7px;"> None </td>
                                    {% endif %}
                                </tr>
                            </table>
                        </td>

                    </tr>

                    <tr style="padding: 7px;">
                        <td> <br /> </td>
                    </tr>
<!--####################################################-->