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
                        <td> <h4> Physics Information </h4> </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Primary Data Set </td>
                        <td style="padding: 7px;">
                            {% for val in record.get('primary_data_set_path') %}
                                {{ val }}
                                <br />
                            {% endfor %}
                        </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> MC Data Set </td>
                        <td style="padding: 7px;">
                            {% for val in record.get('mc_data_set_path') %}
                                {{ val }}
                                <br />
                            {% endfor %}
                        </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Trigger Selection </td>
                        <td style="padding: 7px;">
                            {% for val in record.get('trigger_selection') %}
                                {{ val }}
                                <br />
                            {% endfor %}
                        </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Physics Objects </td>
                        <td style="padding: 7px;"> {{ record.get('physics_objects') }}</td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Callibration </td>
                        <td style="padding: 7px;"> {{ record.get('callibration') }}</td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Keywords </td>
                        <td style="padding: 7px;"> {{ record.get('data_keywords')|join(', ') }}</td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Comments </td>
                        <td style="padding: 7px;"> {{ record.get('comments') }}</td>
                    </tr>
<!--####################################################-->
                    <tr style="padding: 7px;">
                        <td> <h4> Pre-Selection Step </h4> </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Operating System </td>
                        <td style="padding: 7px;"> {{ record.get('pre_os') }} </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Software </td>
                        <td style="padding: 7px;">
                            {{ record.get('pre_software.sw') }} - {{ record.get('pre_software.version') }}
                        </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> User Code </td>
                        <td style="padding: 7px;">
                            {{ record.get('pre_user_code.url') }} - {{ record.get('pre_user_code.tag') }}
                        </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Input Data Files </td>
                        <td style="padding: 7px;"> {{ record.get('pre_input_data_files') }} </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Output Data Files </td>
                        <td style="padding: 7px;">
                            {% for val in record.get('pre_output_data_files') %}
                                {{ val.url }}
                                <br />
                            {% endfor %}
                        </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> How to reproduce </td>
                        <td style="padding: 7px;"> {{ record.get('pre_reproduce') }} </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Keywords </td>
                        <td style="padding: 7px;"> {{ record.get('pre_keywords')|join(', ') }}</td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> How to reproduce </td>
                        <td style="padding: 7px;"> {{ record.get('pre_comments') }} </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td> <br /> </td>
                    </tr>
<!--####################################################-->
                    <tr style="padding: 7px;">
                        <td> <h4> Custom Analysis Step </h4> </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Operating System </td>
                        <td style="padding: 7px;"> {{ record.get('custom_os') }} </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Software </td>
                        <td style="padding: 7px;">
                            {{ record.get('custom_software.sw') }} - {{ record.get('custom_software.version') }}
                        </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> User Code </td>
                        <td style="padding: 7px;">
                            {{ record.get('custom_user_code.url') }} - {{ record.get('custom_user_code.tag') }}
                        </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Input Data Files </td>
                        <td style="padding: 7px;"> {{ record.get('custom_input_data_files') }} </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Output Data Files </td>
                        <td style="padding: 7px;">
                            {% for val in record.get('custom_output_data_files') %}
                                {{ val.url }}
                                <br />
                            {% endfor %}
                        </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> How to reproduce </td>
                        <td style="padding: 7px;"> {{ record.get('custom_reproduce') }} </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Keywords </td>
                        <td style="padding: 7px;"> {{ record.get('custom_keywords')|join(', ') }}</td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> How to reproduce </td>
                        <td style="padding: 7px;"> {{ record.get('custom_comments') }} </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td> <br /> </td>
                    </tr>
<!--####################################################-->
                    <tr style="padding: 7px;">
                        <td> <h4> End User Analysis </h4> </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Operating System </td>
                        <td style="padding: 7px;"> {{ record.get('end_os') }} </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Software </td>
                        <td style="padding: 7px;">
                            {{ record.get('end_software.sw') }} - {{ record.get('end_software.version') }}
                        </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> User Code </td>
                        <td style="padding: 7px;">
                            {{ record.get('end_user_code.url') }} - {{ record.get('end_user_code.tag') }}
                        </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Input Data Files </td>
                        <td style="padding: 7px;"> {{ record.get('end_input_data_files') }} </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Output Data Files </td>
                        <td style="padding: 7px;">
                            {% for val in record.get('end_output_data_files') %}
                                {{ val.url }}
                                <br />
                            {% endfor %}
                        </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> How to reproduce </td>
                        <td style="padding: 7px;"> {{ record.get('end_reproduce') }} </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Keywords </td>
                        <td style="padding: 7px;"> {{ record.get('end_keywords')|join(', ') }}</td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> How to reproduce </td>
                        <td style="padding: 7px;"> {{ record.get('end_comments') }} </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td> <br /> </td>
                    </tr>
<!--####################################################-->
                    <tr style="padding: 7px;">
                        <td> <h4> Internal Documentation </h4> </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Internal Documents </td>
                        <td style="padding: 7px;">
                            {% for val in record.get('internal_docs') %}
                                {{ val.doc }}
                                <br />
                            {% endfor %}
                        </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Keywords </td>
                        <td style="padding: 7px;"> {{ record.get('internal_docs_keywords')|join(', ') }}</td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Input Data Files </td>
                        <td style="padding: 7px;"> {{ record.get('internal_docs_comments') }} </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td> <br /> </td>
                    </tr>
<!--####################################################-->
                    <tr style="padding: 7px;">
                        <td> <h4> Internal Duscussion </h4> </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Internal Documents </td>
                        <td style="padding: 7px;">
                            {% for val in record.get('egroup') %}
                                {{ val.egroup }}
                                <br />
                            {% endfor %}
                        </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td> <br /> </td>
                    </tr>
<!--####################################################-->
                    <tr style="padding: 7px;">
                        <td> <h4> Presentation </h4> </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td style="padding: 7px; text-align: right; font-weight:bold;"> Public Talks </td>
                        <td style="padding: 7px;">
                            {% for val in record.get('public_talks') %}
                                {{ val.talk }}
                                <br />
                            {% endfor %}
                        </td>
                    </tr>

                    <tr style="padding: 7px;">
                        <td> <br /> </td>
                    </tr>
<!--####################################################-->
