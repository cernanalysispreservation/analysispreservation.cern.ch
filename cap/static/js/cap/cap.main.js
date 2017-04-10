/* -*- coding: utf-8 -*-
 *
 * This file is part of CERN Analysis Preservation Framework.
 * Copyright (C) 2016 CERN.
 *
 * CERN Analysis Preservation Framework is free software; you can redistribute
 * it and/or modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or (at your option) any later version.
 *
 * CERN Analysis Preservation Framework is distributed in the hope that it will
 * be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with CERN Analysis Preservation Framework; if not, write to the
 * Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston,
 * MA 02111-1307, USA.
 *
 * In applying this license, CERN does not
 * waive the privileges and immunities granted to it by virtue of its status
 * as an Intergovernmental Organization or submit itself to any jurisdiction.
 */





// Initialize the app
angular.element(document).ready(function() {

  angular.module('capRecords').config(['schemaFormDecoratorsProvider', 'sfBuilderProvider', function(decoratorsProvider, sfBuilderProvider){
    decoratorsProvider.defineAddOn(
      'bootstrapDecorator',
      'file_selector',
      '/static/templates/cap_records_js/decorators/file_selector.html',
      sfBuilderProvider.stdBuilders
    );

    decoratorsProvider.defineAddOn(
      'bootstrapDecorator',
      'cap:formAutofill',
      '/static/templates/cap_records_js/decorators/formAutofill.html',
      sfBuilderProvider.stdBuilders
    );

    decoratorsProvider.defineAddOn(
      'bootstrapDecorator',
      'cap:typeahead',
      '/static/templates/cap_records_js/decorators/typeahead.html',
      sfBuilderProvider.stdBuilders
    );

    decoratorsProvider.defineAddOn(
      'bootstrapDecorator',
      'cap:formAssociateRecords',
      '/static/templates/cap_records_js/decorators/formAssociateRecords.html',
      sfBuilderProvider.stdBuilders
    );
  }]);

  angular.bootstrap(
    document.getElementById("cap-main-container"),
    [
      'capRecords',
      'mgcrea.ngStrap', 'schemaForm',
      'mgcrea.ngStrap.modal', 'pascalprecht.translate', 'ui.select',
      'mgcrea.ngStrap.select', 'invenioFiles',
      'angular-loading-bar',
      'angular.filter',
      'capSearch',
      'cap.app',
      'ng.jsoneditor'
    ]
  );
});
