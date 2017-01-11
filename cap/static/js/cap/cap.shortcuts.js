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


///////////////////////////////////////////
///////////////////////////////////////////
// CAP app Global Shortcuts

var initCapGlobalShortcuts = function(hotkeys, scope, state) {

  hotkeys.add({
    combo: 'd',
    description: 'Navigate to My Deposits',
    callback: function() {
      state.go('app.deposit');
    }
  });

  hotkeys.add({
    combo: 'r',
    description: 'Navigate to Shared Records',
    callback: function() {
      state.go('app.publications');
    }
  });

  hotkeys.add({
    combo: 'c c',
    description: 'Open \'Create New\' modal',
    callback: function() {
      state.go('app.select_deposit_new');
    }
  });

  // Create shortcuts for each deposit group
  if (scope.currentUser && scope.currentUser.deposit_groups){
    hotkeys.add({
      combo: 'c [1,2,..]',
      description: 'Create New deposition form #[1,2,..]',
      callback: function() {
        // state.go('app.select_deposit_new');
      }
    });

    angular.forEach(scope.currentUser.deposit_groups, function(dg_obj, dg_index){
      var hotkeys_obj = {
        combo: 'c '+ (dg_index+1),
        callback: function() {
          state.go('app.deposit_new', { deposit_group: dg_obj.deposit_group });
        }
      };

      hotkeys.add(hotkeys_obj);
    });
  }

};