/* -*- coding: utf-8 -*-
 *
 * This file is part of CERN Analysis Preservation Framework.
 * Copyright (C) 2017 CERN.
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
 
// Setup Records
angular.module('capRecords', [
  'schemaForm',
  'invenioRecords.factories',
  'invenioRecords.services',
  'invenioRecords.controllers',
  'invenioRecords.directives'
]);

// Setup Search
angular.module('capSearch', [
  'invenioSearch.services',
  'invenioSearch.controllers',
  'invenioSearch.directives'
]);


angular.module('cap.services', []);
angular.module('cap.controllers', []);
angular.module('cap.directives', []);
angular.module('cap.factories', []);

// Setup Everyhting
angular.module('cap.app', [
  'matchMedia',
  'capSearch',
  'capRecords',
  'invenioFiles',
  'ui.router',
  'cap.services',
  'cap.controllers',
  'cap.directives',
  'cap.factories',
  'cap.pushmenu',
  'angular-loading-bar',
  'ui.bootstrap',
  'angular.filter',
  'cfp.hotkeys'
]);