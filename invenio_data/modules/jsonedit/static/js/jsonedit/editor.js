/**
 * This file is part of CERN Analysis Preservation Framework.
 * Copyright (C) 2015 CERN.
 *
 * CERN Analysis Preservation Framework is free software; you can
 * redistribute it and/or modify it under the terms of the GNU General
 * Public License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * CERN Analysis Preservation Framework is distributed in the hope that
 * it will be useful, but WITHOUT ANY WARRANTY; without even the
 * implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
 * PURPOSE.  See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this software; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307,
 * USA.
 *
 */

/*eslint-env amd, browser */
/*eslint camelcase: 0, comma-dangle: [2, "always-multiline"], no-underscore-dangle: 0, quotes: [2, "single"] */

require(['jquery', 'base64', 'utf8', 'fuse', 'tv4', 'sortable', 'jsonpatch'], function($, base64, utf8, Fuse, tv4, Sortable, jsonpatch) {
  'use strict';

  $(function() {

    // general utils, not app specific
    var utils = {
        blob2json: function(blob) {
            /* JSON blob:
             *   // secure string
             *   base64:
             *     // 0x00-0xFF string (UTF-8)
             *     utf-8:
             *       // browser UTF-16 string, other string, ...
             *       stringify:
             *         JSON object
             */
            var str = utf8.decode(base64.decode(blob)).trim();
            if (str) {
                return JSON.parse(str);
            } else {
                return {};
            }
        },
    };

    // shim and compatility functions
    // might contain some black magic to make things work across browser
    // boundaries
    var shim = {
        prependChild: function(element, child) {
            if (element.firstChild) {
                element.insertBefore(child, element.firstChild);
            } else {
                element.appendChild(child);
            }
        },

        textContentGet: function(element, single) {
            if (element.nodeType === 3) {
                // textnode
                return element.textContent;
            } else if (element.tagName === 'BR') {
                // special line breaking tags
                // ignore them, if there are the only ones
                // in the context
                if (single) {
                    return '';
                } else {
                    return '\n';
                }
            } else {
                var parts = [];

                // DIV introduces a linebreak if mixed with other
                // elements
                if (element.tagName === 'DIV' && !single) {
                    parts.push('\n');
                }

                // process child nodes
                var subsingle = element.childNodes.length < 2;
                for (var i = 0, ii = element.childNodes.length; i < ii; ++i) {
                    parts.push(shim.textContentGet(element.childNodes[i], subsingle));
                }

                return parts.join('');
            }
        },

        textContentSet: function(element, s) {
            // empty element
            // http://stackoverflow.com/a/3955238
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }

            // add one child per newline
            var parts = String(s).split('\n');
            for (var i = 0, ii = parts.length; i < ii; ++i) {
                if (i > 0) {
                    var br = document.createElement('br');
                    element.appendChild(br);
                }

                var node = document.createTextNode(parts[i]);
                element.appendChild(node);
            }
        },

        remove: function(element) {
            var p = element.parentNode;
            if (p) {
                p.removeChild(element);
            }
        },

        replace: function(next, element) {
            var p = element.parentNode;
            if (p) {
                p.replaceChild(next, element);
            }
        },

        keycodes: {
            0x09: 'TAB',
            0x0D: 'ENTER',
            0x1B: 'ESCAPE',
            0x20: 'SPACE',
            0x25: 'ARROWLEFT',
            0x26: 'ARROWUP',
            0x27: 'ARROWRIGHT',
            0x28: 'ARROWDOWN',
            0x31: 'DIGIT1',
            0x32: 'DIGIT2',
            0x33: 'DIGIT3',
            0x34: 'DIGIT4',
            0x35: 'DIGIT5',
            0x36: 'DIGIT6',
            0x37: 'DIGIT7',
            0x38: 'DIGIT8',
            0x39: 'DIGIT9',
            0x30: 'DIGIT0',
            0xBE: 'PERIOD',
        },
    };

    var style = {
        icons: {
            iAdd: 'fa fa-fw fa-plus-circle',
            iArray: 'fa fa-fw fa-list',
            iBoolean: 'fa fa-fw fa-adjust',
            iNull: 'fa fa-fw fa-circle-thin',
            iNumber: 'fa fa-fw fa-bar-chart-o',
            iObject: 'fa fa-fw fa-cube',
            iRemove: 'fa fa-fw fa-minus-circle',
            iString: 'fa fa-fw fa-font',
            iUnknown: 'fa fa-fw fa-question',
        },
    };

    // high performance event dispatcher
    var eventDispatcher = {
        _registry: {},

        register: function(type, key, func) {
            if (!(type in eventDispatcher._registry)) {
                window.addEventListener(type, eventDispatcher._callback.bind(type));
                eventDispatcher._registry[type] = {};
            }

            var regType = eventDispatcher._registry[type];
            regType[key] = func;
        },

        bindToElement: function(element, key) {
            if (!element.jsoneditor_events) {
                element.jsoneditor_events = [];
            }
            if (element.jsoneditor_events.indexOf(key) === -1) {
                element.jsoneditor_events.push(key);
            }
        },

        dispatch: function(evt, target) {
            if (evt.type in eventDispatcher._registry) {
                return eventDispatcher._callback.apply(evt.type, [evt, target]);
            } else {
                return true;
            }
        },

        _callback: function(evt, target) {
            var element = target || evt.target;
            var regType = eventDispatcher._registry[this];

            // search for elements upward the hirarchy
            do {
                if (element.jsoneditor_events) {
                    // go through events that are registered for this element
                    for (var i = 0, ii = element.jsoneditor_events.length; i < ii; ++i) {
                        var key = element.jsoneditor_events[i];
                        if (key in regType) {
                            evt.jsoneditor_target = element;
                            var code = regType[key].apply(this, [evt, element, key]);
                            if (!code) {
                                evt.stopPropagation();
                                evt.preventDefault();
                                return false;
                            }
                        }
                    }
                }
            } while (element = element.parentNode);

            return true;
        },
    };

    function convertKeyEvents(evt) {
        var name = '';

        if (evt.ctrlKey) {
            name += 'CTRL-';
        }

        name += shim.keycodes[evt.keyCode] || 'UNKNOWN';

        var evt2 = new Event(name, {
            bubbles: true,
        });
        return eventDispatcher.dispatch(evt2, evt.target);
    }


    // helpers to build up the form
    var formHelpers = {
        bindToAnchor: function(element, target) {
            // Make the anchor a proxy of the target.
            // This is requires to change to target (e.g. on type change),
            // but with the requirement to still have valid references.
            target.appendChild(element);
            target.jsoneditor_value = element.jsoneditor_value;
            target.jsoneditor_show = element.jsoneditor_show;
            target.jsoneditor_hide = element.jsoneditor_hide;
            target.jsoneditor_match = element.jsoneditor_match;
            target.jsoneditor_validate = element.jsoneditor_validate;
            target.jsoneditor_navprev = element.jsoneditor_navprev;
            target.jsoneditor_navnext = element.jsoneditor_navnext;
            target.jsoneditor_navin = element.jsoneditor_navin;
            target.jsoneditor_navout = element.jsoneditor_navout;
            target.jsoneditor_focus = element.jsoneditor_focus;
            target.jsoneditor_schema = element.jsoneditor_schema;
            target.jsoneditor_input = element.jsoneditor_input;
            target.jsoneditor_element = element;

            element.jsoneditor_parent = target.jsoneditor_parent;
            element.jsoneditor_anchor = target;
        },

        create_ab: function(a, b, container) {
            var container_a = document.createElement('div');
            container_a.className = 'jsoneditor-a';

            var container_b = document.createElement('div');
            container_b.className = 'jsoneditor-b';

            container_a.appendChild(a);
            container_b.appendChild(b);

            container.appendChild(container_a);
            container.appendChild(container_b);
        },

        show: function() {
            this.jsoneditor_target.style.display = '';
            this.className = 'fa fa-fw pull-right fa-chevron-down' + ' jsoneditor-button';
            this.jsoneditor_statehidden = false;
        },

        hide: function() {
            this.jsoneditor_target.style.display = 'none';
            this.className = 'fa fa-fw pull-right fa-chevron-right' + ' jsoneditor-button';
            this.jsoneditor_statehidden = true;
        },

        show_hide_toggle: function(evt, element) {
            var toggle = element.jsoneditor_toggle;
            if (toggle.jsoneditor_statehidden) {
                formHelpers.show.apply(toggle);
            } else {
                formHelpers.hide.apply(toggle);
            }

            return false;
        },

        callbackEat: function() {
            return false;
        },

        focus: function() {
            this.focus();

            // align viewport at top+50px
            var rect = this.getBoundingClientRect();
            window.scrollBy(0, rect.top - 50);

            // start edit
            var evt2 = new Event('click', {
                bubbles: true,
            });
            eventDispatcher.dispatch(evt2, this);
        },

        callbackNavnext: function(evt, element) {
            element.jsoneditor_navnext();
            return false;
        },

        callbackNavprev: function(evt, element) {
            element.jsoneditor_navprev();
            return false;
        },

        callbackNavin: function(evt, element) {
            element.jsoneditor_navin();
            return false;
        },

        callbackNavout: function(evt, element) {
            element.jsoneditor_navout();
            return false;
        },

        callbackLinkfollow: function(evt, element) {
            var win = window.open(element.href, '_blank');
            win.focus();
            return false;
        },

        callbackStartedit: function(evt, element) {
            var range, selection;

            if (this.select) {
                this.select();
            } else if (this.setSelectionRange) {
                this.setSelectionRange(0, this.value.length);
            } else if (document.selection) {
                range = document.body.createTextRange();
                range.moveToElementText(this);
                range.select();
            } else {
                range = document.createRange();
                selection = window.getSelection();
                range.selectNodeContents(element);
                selection.removeAllRanges();
                selection.addRange(range);
            }

            return false;
        },
    };


    // cover to catch key events, lost focus clicks
    var cover = {
        create: function(target) {
            // element to cover page, for click handling
            var element = document.createElement('div');
            element.id = 'jsoneditor-cover';
            element.className = 'jsoneditor-cover';

            element.jsoneditor_target = target;
            element.jsoneditor_remove = cover.remove.bind(element);
            target.jsoneditor_cover = element;

            eventDispatcher.bindToElement(element, 'coverClose');
            eventDispatcher.bindToElement(document, 'coverClose');
            eventDispatcher.bindToElement(element, 'eatScroll');

            eventDispatcher.bindToElement(target, 'eatScroll');

            document.body.appendChild(element);
        },

        remove: function() {
            shim.remove(this.jsoneditor_target);
            shim.remove(this);
        },

        callbackClose: function() {
            var element = document.getElementById('jsoneditor-cover');
            if (element) {
                element.jsoneditor_remove();
                return false;
            } else {
                return true;
            }
        },
    };

    var searchBar = {
        create: function(element) {
            eventDispatcher.bindToElement(document, 'searchShow');
        },

        addToHistory: function(entry) {
            var h = JSON.parse(localStorage.getItem('searchHist')) || [];

            // test if element already exists
            // if so, remove it
            var idx = h.indexOf(entry);
            if (idx > -1) {
                h.splice(idx, 1);
            }

            // add element to the end
            h.push(entry);

            // limit history length to 50
            while (h.length > 50) {
                h.shift();
            }

            localStorage.setItem('searchHist', JSON.stringify(h));
            return h.length;
        },

        getFromHistory: function(pos) {
            var h = JSON.parse(localStorage.getItem('searchHist')) || [];
            if (h.length === 0 || pos <= 0) {
                return '';
            }
            pos = Math.min(h.length, pos);
            var idx = h.length - pos;
            return {
                entry: h[idx],
                pos: pos,
            };
        },

        searchViaString: function(query, anchor, show) {
            var tokens = query.split('.');
            var match = anchor.jsoneditor_match(tokens);
            var expanded = '';
            var lastElement = null;
            for (var i = 0, ii = match.length; i < ii; ++i) {
                if (match[i]) {
                    if (match[i].expanded) {
                        if (i > 0) {
                            expanded += '.';
                        }
                        expanded += match[i].expanded;
                    }

                    if (match[i].element) {
                        if (show && match[i].element.jsoneditor_show) {
                            match[i].element.jsoneditor_show();
                        }
                        lastElement = match[i].element;
                    }
                }
            }
            return {
                expanded: expanded,
                element: lastElement,
            };
        },

        callbackSearchShow: function() {
            // create if not exist
            var container = document.getElementById('jsoneditor-searchcontainer');
            if (!container) {
                // construct searchbar
                container = document.createElement('div');
                container.id = 'jsoneditor-searchcontainer';
                container.className = 'jsoneditor-searchcontainer';
                container.jsoneditor_target = document.getElementById('jsoneditor-main');

                cover.create(container);

                var i = document.createElement('i');
                i.className = 'fa fa-fw fa-search';

                var input = document.createElement('input');
                input.className = 'jsoneditor-searchinput';
                container.jsoneditor_input = input;
                container.jsoneditor_historypos = 0;
                input.jsoneditor_container = container;
                eventDispatcher.bindToElement(input, 'historyUp');
                eventDispatcher.bindToElement(input, 'historyDown');

                eventDispatcher.bindToElement(container, 'searchSubmit');

                formHelpers.create_ab(i, input, container);
                document.body.appendChild(container);
            }

            container.jsoneditor_input.focus();
            return false;
        },

        callbackSearchSubmit: function(evt, element) {
            var container = element;
            var query = container.jsoneditor_input.value.trim();
            if (query.length > 0) {
                searchBar.addToHistory(query);
                container.jsoneditor_historypos = 0;

                var result = searchBar.searchViaString(query, container.jsoneditor_target, true);
                container.jsoneditor_input.value = result.expanded;
                container.jsoneditor_input.select();
                if (result.element) {
                    result.element.jsoneditor_focus();
                }
            }

            return false;
        },

        callbackHistoryUp: function(evt, element) {
            var container = element.jsoneditor_container;

            // save current state
            var current = container.jsoneditor_input.value.trim();
            if (container.jsoneditor_historypos === 0 && current.length > 0) {
                container.jsoneditor_statesaved = current;
            }

            var hdata = searchBar.getFromHistory(Math.min(50, container.jsoneditor_historypos + 1));
            container.jsoneditor_input.value = hdata.entry;
            container.jsoneditor_historypos = hdata.pos;
            container.jsoneditor_input.select();

            return false;
        },

        callbackHistoryDown: function(evt, element) {
            var container = element.jsoneditor_container;

            if (container.jsoneditor_historypos > 0) {
                container.jsoneditor_historypos = Math.max(0, container.jsoneditor_historypos - 1);
                if (container.jsoneditor_historypos > 0) {
                    var hdata = searchBar.getFromHistory(container.jsoneditor_historypos);
                    container.jsoneditor_input.value = hdata.entry;
                    container.jsoneditor_historypos = hdata.pos;
                } else {
                    container.jsoneditor_input.value = container.jsoneditor_statesaved || '';
                }
                container.jsoneditor_input.select();
            }

            return false;
        },
    };

    var ringMenu = {
        create: function(button, target) {
            button.jsoneditor_target = target;
            target.jsoneditor_rmbutton = button;
            eventDispatcher.bindToElement(button, 'ringShowByButton');
            eventDispatcher.bindToElement(target, 'ringShowByKey');
        },

        show: function(evt, buttonOrTarget) {
            var button, x, y;
            if (buttonOrTarget.jsoneditor_target) {
                button = buttonOrTarget;
                x = evt.clientX;
                y = evt.clientY;
            } else {
                button = buttonOrTarget.jsoneditor_rmbutton;
                var rect = button.getBoundingClientRect();
                x = (rect.left + rect.right) / 2;
                y = (rect.top + rect.bottom) / 2;
            }

            // ring menu
            var container = document.createElement('div');
            container.className = 'jsoneditor-ringcontainer';
            container.setAttribute('tabindex', 0); // enables .focus()
            container.jsoneditor_target = button.jsoneditor_target;

            // center container at mouse coords
            container.style.left = String(Math.max(x - 50, 0)) + 'px';
            container.style.top = String(Math.max(y - 50, 0)) + 'px';

            // element to cover page, for click handling
            cover.create(container);

            // icons
            var value = button.jsoneditor_target.jsoneditor_value();
            container.jsoneditor_icons = [];
            ringMenu.addIcon(container, 0, style.icons.iNull, null);
            ringMenu.addIcon(container, 60, style.icons.iArray, Array(value));
            ringMenu.addIcon(container, 2 * 60, style.icons.iString, String(JSON.stringify(value)));
            ringMenu.addIcon(container, 3 * 60, style.icons.iObject, {});
            ringMenu.addIcon(container, 4 * 60, style.icons.iNumber, Number(value));
            ringMenu.addIcon(container, 5 * 60, style.icons.iBoolean, false);

            document.body.appendChild(container);
            container.focus();

            return false;
        },

        addIcon: function(container, angle, className, data) {
            var rad = angle / 360 * Math.PI * 2;
            var i = document.createElement('i');
            i.className = className + ' jsoneditor-ringicon jsoneditor-button';
            i.style.position = 'absolute';
            i.jsoneditor_container = container;
            i.jsoneditor_data = data;

            // polar coords, substract half of the icon dimensions
            i.style.left = String(50 + 30 * Math.sin(rad) - 10) + 'px';
            i.style.top = String(50 + 30 * Math.cos(rad) - 10) + 'px';

            eventDispatcher.bindToElement(i, 'clickRingIcon');
            eventDispatcher.bindToElement(container, 'select:' + container.jsoneditor_icons.length);
            container.jsoneditor_icons.push(i);
            container.appendChild(i);

        },

        callbackIcon: function(evt, icon) {
            var anchor = icon.jsoneditor_container.jsoneditor_target.jsoneditor_anchor;
            shim.remove(icon.jsoneditor_container.jsoneditor_target);
            gen(icon.jsoneditor_data, anchor);

            icon.jsoneditor_container.jsoneditor_cover.jsoneditor_remove();

            var clickTarget = anchor.jsoneditor_input || anchor.jsoneditor_element;
            var evt2 = new Event('click', {
                bubbles: true,
            });
            eventDispatcher.dispatch(evt2, clickTarget);

            return false;
        },

        callbackKey: function(evt, container, k) {
            var i = Number(k.split(':')[1]);
            if (i < container.jsoneditor_icons.length) {
                var evt2 = new Event('click', {
                    bubbles: true,
                });
                eventDispatcher.dispatch(evt2, container.jsoneditor_icons[i]);
            }
            return false;
        },
    };

    var mixinElementSimple = {
        create: function(anchor, containerClassName, iconClassName, input, valueFunction) {
            var container = document.createElement('div');
            container.className = containerClassName;
            container.jsoneditor_input = input;

            var i = document.createElement('i');
            ringMenu.create(i, container);
            i.className = iconClassName + ' jsoneditor-button';

            formHelpers.create_ab(i, input, container);
            container.jsoneditor_value = valueFunction.bind(input);
            container.jsoneditor_focus = formHelpers.focus.bind(input);
            container.jsoneditor_match = mixinElementSimple.match.bind(container);
            container.jsoneditor_validate = mixinElementSimple.validate.bind(container);

            // navigation events usually arrow keys, which are eaten by the input
            // element. therefore we need to bind it to the input element as well
            container.jsoneditor_navnext = mixinElementSimple.navnext.bind(container);
            container.jsoneditor_navprev = mixinElementSimple.navprev.bind(container);
            container.jsoneditor_navin = mixinElementSimple.navin.bind(container);
            container.jsoneditor_navout = mixinElementSimple.navout.bind(container);

            input.jsoneditor_navnext = mixinElementSimple.navnext.bind(container);
            input.jsoneditor_navprev = mixinElementSimple.navprev.bind(container);
            input.jsoneditor_navin = mixinElementSimple.navin.bind(container);
            input.jsoneditor_navout = mixinElementSimple.navout.bind(container);

            eventDispatcher.bindToElement(container, 'navnext');
            eventDispatcher.bindToElement(container, 'navprev');
            eventDispatcher.bindToElement(container, 'navin');
            eventDispatcher.bindToElement(container, 'navout');

            eventDispatcher.bindToElement(input, 'navnext');
            eventDispatcher.bindToElement(input, 'navprev');
            eventDispatcher.bindToElement(input, 'navin');
            eventDispatcher.bindToElement(input, 'navout');
            eventDispatcher.bindToElement(input, 'startedit');

            formHelpers.bindToAnchor(container, anchor);
        },

        match: function(tokens) {
            if (tokens.length === 0) {
                return [];
            } else {
                var head = tokens[0];
                var value = String(this.jsoneditor_value()).toLowerCase();
                var f = new Fuse([value], {
                    includeScore: true,
                });
                var m = f.search(String(head).trim().toLowerCase());
                if (m.length > 0) {
                    return [{
                        token: head,
                        expanded: value,
                        element: this,
                        score: 1.0 - m[0].score,
                    }];
                } else {
                    return [{
                        token: head,
                        expanded: value,
                        element: this,
                        score: 0,
                    }];
                }
            }
        },

        validate: function() {
            /* noop */
        },

        navnext: function() {
            if (this.jsoneditor_parent) {
                this.jsoneditor_parent.jsoneditor_navnext(this);
            }
        },

        navprev: function() {
            if (this.jsoneditor_parent) {
                this.jsoneditor_parent.jsoneditor_navprev(this);
            }
        },

        navin: function() {
            this.jsoneditor_focus();
        },

        navout: function() {
            if (this.jsoneditor_parent) {
                this.jsoneditor_parent.jsoneditor_focus();
            }
        },
    };

    var elementArray = {
        gen: function(data, target) {
            // container for the array form
            var container = document.createElement('div');
            container.className = 'jsoneditor-array';
            container.setAttribute('tabindex', 0); // enables .focus()
            container.jsoneditor_subs = [];
            container.jsoneditor_value = elementArray.value.bind(container);
            container.jsoneditor_match = elementArray.match.bind(container);
            container.jsoneditor_validate = elementArray.validate.bind(container);
            container.jsoneditor_navnext = elementArray.navnext.bind(container);
            container.jsoneditor_navprev = elementArray.navprev.bind(container);
            container.jsoneditor_navin = elementArray.navin.bind(container);
            container.jsoneditor_navout = elementArray.navout.bind(container);

            eventDispatcher.bindToElement(container, 'navnext');
            eventDispatcher.bindToElement(container, 'navprev');
            eventDispatcher.bindToElement(container, 'navin');
            eventDispatcher.bindToElement(container, 'navout');

            // head for metadata and buttons
            var head = document.createElement('div');
            head.className = 'jsoneditor-arrayhead';

            // body for array content
            var body = document.createElement('ol');
            body.className = 'jsoneditor-arraybody';
            container.jsoneditor_body = body;

            // scrollhelper that wraps the body
            var scrollhelper = document.createElement('div');
            scrollhelper.className = 'jsoneditor-scrollhelper';

            // type indicator
            var i = document.createElement('i');
            i.className = style.icons.iArray + ' jsoneditor-button';
            ringMenu.create(i, container);
            head.appendChild(i);

            // add button
            var plus = document.createElement('i');
            plus.className = style.icons.iAdd + ' jsoneditor-button';
            plus.jsoneditor_container = container;
            eventDispatcher.bindToElement(plus, 'arrayModifyAdd');
            head.appendChild(plus);

            // delete button
            var minus = document.createElement('i');
            minus.className = style.icons.iRemove + ' jsoneditor-button';
            minus.jsoneditor_container = container;
            eventDispatcher.bindToElement(minus, 'arrayModifyDelete');
            head.appendChild(minus);

            // counter
            var counter = document.createElement('span');
            container.jsoneditor_counter = counter;
            shim.textContentSet(counter, data.length);
            head.appendChild(counter);

            // show-hide toggle
            var toggle = document.createElement('i');
            toggle.jsoneditor_target = scrollhelper;
            head.jsoneditor_toggle = toggle;
            eventDispatcher.bindToElement(head, 'showHideToggle');
            head.appendChild(toggle);
            container.jsoneditor_show = formHelpers.show.bind(toggle);
            container.jsoneditor_hide = formHelpers.hide.bind(toggle);

            // array data
            for (var i2 = 0, ii = data.length; i2 < ii; ++i2) {
                elementArray.genSub(data[i2], container);
            }

            // initial state?
            if (container.jsoneditor_subs.length > 5) {
                formHelpers.hide.bind(toggle)();
            } else {
                formHelpers.show.bind(toggle)();
            }

            // make it sortable
            Sortable.create(body);

            container.jsoneditor_focus = formHelpers.focus.bind(body);

            // assemble
            var margin = document.createElement('div');
            margin.className = 'jsoneditor-marginhelper';
            scrollhelper.appendChild(body);
            margin.appendChild(head);
            margin.appendChild(scrollhelper);
            container.appendChild(margin);

            formHelpers.bindToAnchor(container, target);
        },

        value: function() {
            // get bind context
            var element = this;

            var result = [];
            for (var i = 0, ii = element.jsoneditor_subs.length; i < ii; ++i) {
                var sub = element.jsoneditor_subs[i];
                result.push(sub.jsoneditor_value());
            }
            return result;
        },

        genSub: function(data, container) {
            var subcontainer = document.createElement('li');
            subcontainer.className = 'jsoneditor-arrayrow';
            subcontainer.jsoneditor_parent = container;
            gen(data, subcontainer);

            container.jsoneditor_body.appendChild(subcontainer);
            container.jsoneditor_subs.push(subcontainer);
        },

        modifyAdd: function(evt, element) {
            var container = element.jsoneditor_container;

            // try to copy the last element
            var data = null;
            if (container.jsoneditor_subs.length > 0) {
                data = container.jsoneditor_subs[container.jsoneditor_subs.length - 1].jsoneditor_value();
            }

            elementArray.genSub(data, container);
            shim.textContentSet(container.jsoneditor_counter, container.jsoneditor_subs.length);

            return false;
        },

        modifyDelete: function(evt, element) {
            var container = element.jsoneditor_container;

            if (container.jsoneditor_subs.length > 0) {
                container.jsoneditor_subs.pop();
                container.jsoneditor_body.removeChild(container.jsoneditor_body.lastChild);
                shim.textContentSet(container.jsoneditor_counter, container.jsoneditor_subs.length);
            }

            return false;
        },

        match: function(tokens) {
            var container = this;

            if (tokens.length === 0) {
                return [];
            } else {
                var head = tokens[0];
                var query = String(head).trim();

                // wildcard or index?
                if (query === '*') {
                    // find best matching element
                    var bestElement = null;
                    var bestSub = [];
                    var bestScore = 0;
                    var bestIdx = null;
                    for (var i = 0, ii = container.jsoneditor_subs.length; i < ii; ++i) {
                        var element = container.jsoneditor_subs[i];
                        var sub = element.jsoneditor_match(tokens.slice(1));
                        if (sub[0]) {
                            var score = sub[0].score;
                            if (score > bestScore) {
                                bestScore = score;
                                bestElement = element;
                                bestSub = sub;
                                bestIdx = String(i);
                            }
                        }
                    }

                    var result = [{
                        token: head,
                        expanded: bestIdx,
                        element: bestElement,
                        score: bestScore,
                    }];
                    result = result.concat(bestSub);
                } else {
                    var index = parseInt(query) - 1;
                    var element = null;
                    var expanded = null;
                    var score = 0;
                    if (!isNaN(index) && index >= 0 && index < container.jsoneditor_subs.length) {
                        element = container.jsoneditor_subs[index];
                        expanded = String(index + 1);
                        // that seems to be a nice function to me
                        // normalized to [0,1] and depending on something like the entropy
                        score = 1.0 - 1.0 / (1.0 + Math.log(1.0 + container.jsoneditor_subs.length));
                    }

                    var result = [{
                        token: head,
                        expanded: expanded,
                        element: element,
                        score: score,
                    }];

                    if (element && element.jsoneditor_match) {
                        var sub = element.jsoneditor_match(tokens.slice(1));
                        if (sub[0]) {
                            result[0].score *= sub[0].score;
                        }
                        result = result.concat(sub);
                    }
                }

                return result;
            }
        },

        validate: function() {
            for (var i = 0, ii = this.jsoneditor_subs.length; i < ii; ++i) {
                this.jsoneditor_subs[i].jsoneditor_validate();
            }
        },

        navnext: function(last) {
            var idx;

            if (last) {
                last = last.jsoneditor_anchor || last;
                idx = this.jsoneditor_subs.indexOf(last) + 1; // (-1 + 1)=0 when not found
            } else {
                idx = 0;
            }

            if (idx < this.jsoneditor_subs.length) {
                this.jsoneditor_subs[idx].jsoneditor_focus();
            } else if (this.jsoneditor_parent) {
                this.jsoneditor_parent.jsoneditor_navnext(this);
            }
        },

        navprev: function(last) {
            var idx;

            if (last) {
                last = last.jsoneditor_anchor || last;
                idx = this.jsoneditor_subs.indexOf(last) - 1; // (-1 - 1)=-2 when not found
            } else {
                idx = this.jsoneditor_subs.length - 1;
            }

            if (idx >= 0) {
                this.jsoneditor_subs[idx].jsoneditor_focus();
            } else if (this.jsoneditor_parent) {
                this.jsoneditor_parent.jsoneditor_navprev(this);
            }
        },

        navin: function() {
            if (this.jsoneditor_subs.length > 0) {
                this.jsoneditor_subs[0].jsoneditor_focus();
            }
        },

        navout: function() {
            if (this.jsoneditor_parent) {
                this.jsoneditor_parent.jsoneditor_focus();
            }
        },
    };

    var elementBoolean = {
        gen: function(data, anchor) {
            var input = document.createElement('input');
            input.setAttribute('type', 'checkbox');
            input.checked = data;

            mixinElementSimple.create(anchor, 'jsoneditor-boolean', style.icons.iBoolean, input, elementBoolean.value);
        },

        value: function() {
            // get bind context
            var element = this;

            return element.checked;
        },
    };

    var elementNull = {
        gen: function(data, anchor) {
            var p = document.createElement('p');
            p.className = 'jsoneditor-null';
            p.innerHTML = 'null';
            p.setAttribute('tabindex', 0); // enables .focus()

            mixinElementSimple.create(anchor, 'jsoneditor-null', style.icons.iNull, p, elementNull.value);
        },

        value: function() {
            return null;
        },
    };

    var elementNumber = {
        gen: function(data, anchor) {
            var input = document.createElement('input');
            input.setAttribute('type', 'number');
            input.value = data;

            mixinElementSimple.create(anchor, 'jsoneditor-number', style.icons.iNumber, input, elementNumber.value);
        },

        value: function() {
            // get bind context
            var element = this;

            return Number(element.value);
        },
    };

    var elementObject = {
        gen: function(data, target) {
            var keys = Object.keys(data).sort();

            // object container
            var container = document.createElement('div');
            container.className = 'jsoneditor-object';
            container.setAttribute('tabindex', 0); // enables .focus()
            container.jsoneditor_subs = [];
            container.jsoneditor_value = elementObject.value.bind(container);
            container.jsoneditor_match = elementObject.match.bind(container);
            container.jsoneditor_validate = elementObject.validate.bind(container);
            container.jsoneditor_navnext = elementObject.navnext.bind(container);
            container.jsoneditor_navprev = elementObject.navprev.bind(container);
            container.jsoneditor_navin = elementObject.navin.bind(container);
            container.jsoneditor_navout = elementObject.navout.bind(container);

            eventDispatcher.bindToElement(container, 'navnext');
            eventDispatcher.bindToElement(container, 'navprev');
            eventDispatcher.bindToElement(container, 'navin');
            eventDispatcher.bindToElement(container, 'navout');

            // head for metadata and buttons
            var head = document.createElement('div');
            head.className = 'jsoneditor-objecthead';

            // body for object content
            var body = document.createElement('div');
            body.className = 'jsoneditor-objectbody';
            container.jsoneditor_body = body;

            // type indicator
            var i = document.createElement('i');
            i.className = style.icons.iObject + ' jsoneditor-button';
            ringMenu.create(i, container);
            head.appendChild(i);

            // add button
            var plus = document.createElement('i');
            plus.className = style.icons.iAdd + ' jsoneditor-button';
            plus.jsoneditor_container = container;
            eventDispatcher.bindToElement(plus, 'objectModifyAdd');
            head.appendChild(plus);

            // delete button
            var minus = document.createElement('i');
            minus.className = style.icons.iRemove + ' jsoneditor-button';
            minus.jsoneditor_container = container;
            eventDispatcher.bindToElement(minus, 'objectModifyDelete');
            head.appendChild(minus);

            // counter
            var counter = document.createElement('span');
            container.jsoneditor_counter = counter;
            shim.textContentSet(counter, keys.length);
            head.appendChild(counter);

            // show-hide toggle
            var toggle = document.createElement('i');
            head.jsoneditor_toggle = toggle;
            toggle.jsoneditor_target = body;
            eventDispatcher.bindToElement(head, 'showHideToggle');
            head.appendChild(toggle);
            container.jsoneditor_show = formHelpers.show.bind(toggle);
            container.jsoneditor_hide = formHelpers.hide.bind(toggle);

            // add content
            for (var i = 0, ii = keys.length; i < ii; ++i) {
                var k = keys[i];
                var v = data[k];
                elementObject.genSub(k, v, container);
            }

            // initial state?
            if (container.jsoneditor_subs.length > 10) {
                formHelpers.hide.bind(toggle)();
            } else {
                formHelpers.show.bind(toggle)();
            }

            // make it sortable
            Sortable.create(body);

            container.jsoneditor_focus = formHelpers.focus.bind(container);

            // assemble object
            var margin = document.createElement('div');
            margin.className = 'jsoneditor-marginhelper';
            margin.appendChild(head);
            margin.appendChild(body);
            container.appendChild(margin);

            // bind
            formHelpers.bindToAnchor(container, target);
        },

        value: function() {
            // get bind context
            var element = this;

            var result = {};
            for (var i = 0, ii = element.jsoneditor_subs.length; i < ii; ++i) {
                var sub = element.jsoneditor_subs[i];
                result[sub.jsoneditor_key()] = sub.jsoneditor_value();
            }
            return result;
        },

        valueLabel: function() {
            // get text content without newline
            return shim.textContentGet(this).replace(/\n/g, '');
        },

        valueInput: function() {
            return this.jsoneditor_value();
        },

        genSub: function(k, v, container) {
            var subcontainer = document.createElement('div');
            subcontainer.className = 'jsoneditor-objectrow';

            // use a <p> element instead of <label>, because
            // on Firefox label+contentEditable behaves strangely
            // when selecting text or positioning the cursor
            var label = document.createElement('p');
            label.className = 'jsoneditor-label';
            label.setAttribute('contentEditable', true);
            label.setAttribute('spellcheck', false);
            label.jsoneditor_parent = container;
            label.jsoneditor_focus = formHelpers.focus.bind(label);
            label.jsoneditor_validate = mixinElementSimple.validate.bind(label);
            label.jsoneditor_navnext = mixinElementSimple.navnext.bind(label);
            label.jsoneditor_navprev = mixinElementSimple.navprev.bind(label);
            label.jsoneditor_navin = elementObject.navinLabel.bind(label);
            label.jsoneditor_navout = mixinElementSimple.navout.bind(label);

            eventDispatcher.bindToElement(label, 'navnext');
            eventDispatcher.bindToElement(label, 'navprev');
            eventDispatcher.bindToElement(label, 'navin');
            eventDispatcher.bindToElement(label, 'navout');
            eventDispatcher.bindToElement(label, 'startedit');

            shim.textContentSet(label, k);

            var input = document.createElement('div');
            input.className = 'jsoneditor-sub';
            input.jsoneditor_parent = container;
            label.jsoneditor_input = input;
            gen(v, input);

            subcontainer.appendChild(label);
            subcontainer.jsoneditor_key = elementObject.valueLabel.bind(label);
            subcontainer.jsoneditor_label = label;

            subcontainer.appendChild(input);
            subcontainer.jsoneditor_value = elementObject.valueInput.bind(input);
            subcontainer.jsoneditor_input = input;

            container.jsoneditor_body.appendChild(subcontainer);
            container.jsoneditor_subs.push(subcontainer);
        },

        modifyAdd: function(evt, element) {
            var container = element.jsoneditor_container;

            // try to copy the last element
            var k = 'new';
            var v = null;
            if (container.jsoneditor_subs.length > 0) {
                k = container.jsoneditor_subs[container.jsoneditor_subs.length - 1].jsoneditor_key();
                v = container.jsoneditor_subs[container.jsoneditor_subs.length - 1].jsoneditor_value();
            }

            elementObject.genSub(k, v, container);
            shim.textContentSet(container.jsoneditor_counter, container.jsoneditor_subs.length);

            evt.stopPropagation();
        },

        modifyDelete: function(evt, element) {
            var container = element.jsoneditor_container;

            if (container.jsoneditor_subs.length > 0) {
                container.jsoneditor_subs.pop();
                container.jsoneditor_body.removeChild(container.jsoneditor_body.lastChild);
                shim.textContentSet(container.jsoneditor_counter, container.jsoneditor_subs.length);
            }

            evt.stopPropagation();
        },

        match: function(tokens) {
            var container = this;

            if (tokens.length === 0) {
                return [];
            } else {
                var head = tokens[0];
                var bestK = null;
                var bestV = null;
                var score = 0;

                var keys = [];
                for (var i = 0, ii = container.jsoneditor_subs.length; i < ii; ++i) {
                    keys.push(container.jsoneditor_subs[i].jsoneditor_key().toLowerCase());
                }
                var f = new Fuse(keys, {
                    includeScore: true,
                });
                var m = f.search(String(head).trim().toLowerCase());
                if (m) {
                    // get lowest score
                    // FIXME do not sort the entire list
                    m.sort(function(a, b) {
                        return a.score - b.score;
                    });
                    var idx = m[0].item;
                    bestK = container.jsoneditor_subs[idx].jsoneditor_key();
                    bestV = container.jsoneditor_subs[idx].jsoneditor_input;
                    score = 1.0 - m[0].score;
                }

                var result = [{
                    token: head,
                    expanded: bestK,
                    element: bestV,
                    score: score,
                }];

                if (bestV && bestV.jsoneditor_match) {
                    if (bestV && bestV.jsoneditor_match) {
                        var sub = bestV.jsoneditor_match(tokens.slice(1));
                        if (sub[0]) {
                            result[0].score *= sub[0].score;
                        }
                        result = result.concat(sub);
                    }
                }

                return result;
            }
        },

        validate: function() {
            var i, ii, knownKeys;

            knownKeys = {};
            for (i = 0, ii = this.jsoneditor_subs.length; i < ii; ++i) {
                this.jsoneditor_subs[i].jsoneditor_label.jsoneditor_validate();
                this.jsoneditor_subs[i].jsoneditor_input.jsoneditor_validate();
                var k = this.jsoneditor_subs[i].jsoneditor_key();
                if (k in knownKeys) {
                    ++knownKeys[k];
                } else {
                    knownKeys[k] = 1;
                }
            }

            for (i = 0, ii = this.jsoneditor_subs.length; i < ii; ++i) {
                var k = this.jsoneditor_subs[i].jsoneditor_key();
                if (knownKeys[k] > 1) {
                    annotations.add('errorstate', 'Duplicate key', this.jsoneditor_subs[i].jsoneditor_label);
                }
            }
        },

        indexOfLabel: function(subs, label) {
            var idx = -1;
            for (var i = 0, ii = subs.length; i < ii; ++i) {
                if (subs[i].jsoneditor_label === label) {
                    idx = i;
                    break;
                }
            }
            return idx;
        },

        indexOfInput: function(subs, input) {
            var idx = -1;
            for (var i = 0, ii = subs.length; i < ii; ++i) {
                if (subs[i].jsoneditor_input === input) {
                    idx = i;
                    break;
                }
            }
            return idx;
        },

        navnext: function(last) {
            var idx;
            var isInput = false;

            if (last) {
                last = last.jsoneditor_anchor || last;
                idx = elementObject.indexOfInput(this.jsoneditor_subs, last) + 1; // (-1 + 1)=0 when not found
                if (idx > 0) {
                    isInput = true;
                } else {
                    idx = elementObject.indexOfLabel(this.jsoneditor_subs, last) + 1; // (-1 + 1)=0 when not found
                }
            } else {
                idx = 0;
            }

            if (idx < this.jsoneditor_subs.length) {
                if (isInput) {
                    this.jsoneditor_subs[idx].jsoneditor_input.jsoneditor_focus();
                } else {
                    this.jsoneditor_subs[idx].jsoneditor_label.jsoneditor_focus();
                }
            } else if (this.jsoneditor_parent) {
                this.jsoneditor_parent.jsoneditor_navnext(this);
            }
        },

        navprev: function(last) {
            var idx;
            var isInput = false;

            if (last) {
                last = last.jsoneditor_anchor || last;
                idx = elementObject.indexOfInput(this.jsoneditor_subs, last) - 1; // (-1 - 1)=-2 when not found
                if (idx > -2) {
                    isInput = true;
                } else {
                    idx = elementObject.indexOfLabel(this.jsoneditor_subs, last) - 1; // (-1 - 1)=-2 when not found
                }
            } else {
                idx = this.jsoneditor_subs.length - 1;
            }

            if (idx >= 0) {
                if (isInput) {
                    this.jsoneditor_subs[idx].jsoneditor_input.jsoneditor_focus();
                } else {
                    this.jsoneditor_subs[idx].jsoneditor_label.jsoneditor_focus();
                }
            } else if (this.jsoneditor_parent) {
                this.jsoneditor_parent.jsoneditor_navprev(this);
            }
        },

        navin: function() {
            if (this.jsoneditor_subs.length > 0) {
                this.jsoneditor_subs[0].jsoneditor_label.jsoneditor_focus();
            }
        },

        navout: function() {
            if (this.jsoneditor_parent) {
                this.jsoneditor_parent.jsoneditor_focus();
            }
        },

        navinLabel: function() {
            this.jsoneditor_input.jsoneditor_focus();
        },
    };

    var elementString = {
        gen: function(data, anchor) {
            var input = document.createElement('p');
            input.setAttribute('contentEditable', true);
            input.setAttribute('spellcheck', true);
            shim.textContentSet(input, data);

            mixinElementSimple.create(anchor, 'jsoneditor-string', style.icons.iString, input, elementString.value);
        },

        value: function() {
            // get bind context
            var element = this;

            return shim.textContentGet(element);
        },
    };

    var elementUnknown = {
        gen: function(data, anchor) {
            var input = document.createElement('input');
            input.className = 'jsoneditor-unkown';
            input.value = data;

            mixinElementSimple.create(anchor, 'jsoneditor-unknown', style.icons.iUnknown, input, elementUnknown.value);
        },

        value: function() {
            return this.value;
        },
    };

    function gen(data, target) {
        if (data === null) {
            return elementNull.gen(data, target);
        } else if (Array.isArray(data)) {
            return elementArray.gen(data, target);
        } else if (typeof(data) === 'boolean') {
            return elementBoolean.gen(data, target);
        } else if (typeof(data) === 'number') {
            return elementNumber.gen(data, target);
        } else if (typeof(data) === 'string') {
            return elementString.gen(data, target);
        } else if (typeof(data) === 'object') {
            return elementObject.gen(data, target);
        } else {
            return elementUnknown.gen(data, target);
        }
    }

    var annotations = {
        clear: function(type) {
            // HTMLColleciton to Array, because we remove elements from the collection
            var oldErrors = [].slice.call(document.getElementsByClassName('jsoneditor-annotation-' + type));
            for (var i = 0, ii = oldErrors.length; i < ii; ++i) {
                oldErrors[i].jsoneditor_target.classList.remove('jsoneditor-status-error');
                shim.remove(oldErrors[i]);
            }
        },

        add: function(type, msg, target, ref, reftext) {
            var anchor = document.createElement('div');
            anchor.className = 'jsoneditor-annotation-' + type;
            anchor.jsoneditor_target = target;

            var container = document.createElement('div');
            container.jsoneditor_target = target;

            var i = document.createElement('i');
            i.className = 'fa fa-fw fa-exclamation-triangle';

            var p = document.createElement('p');
            shim.textContentSet(p, msg);

            if (ref) {
                if (!reftext) {
                    reftext = ref;
                }
                var a = document.createElement('a');
                shim.textContentSet(a, reftext);
                a.href = ref;

                eventDispatcher.bindToElement(a, 'linkFollow');

                p.appendChild(a);
            }

            formHelpers.create_ab(i, p, container);
            eventDispatcher.bindToElement(container, 'annotationClick');

            anchor.appendChild(container);
            shim.prependChild(target, anchor);
            target.classList.add('jsoneditor-status-error');
        },

        callbackClick: function(evt, element) {
            element.jsoneditor_target.jsoneditor_focus();
            return false;
        },
    };

    function fullValidation(element, data, schema, callback) {
        // FIXME think about .validateMultiple
        var result = tv4.validateResult(data, schema);

        // external schema missing?
        if (result.missing.length > 0) {
            var url = result.missing[0];
            // FIXME implement host whitelist
            $.getJSON(url, function(subschema) {
                tv4.addSchema(url, subschema);

                // try again
                fullValidation(element, data, schema, callback);
            });
        } else {
            // clean up
            annotations.clear('errorschema');

            if (!result.valid) {
                // try to find affected element
                var target = document.getElementById('jsoneditor-main').jsoneditor_element;
                if (result.error.dataPath.length > 0) {
                    var query = result.error.dataPath.replace(/\//g, '.').slice(1);
                    var sresult = searchBar.searchViaString(query, target, true);
                    if (sresult.element) {
                        target = sresult.element.jsoneditor_element || sresult.element;
                    }
                }

                // add annotations to obj tree
                var origin = schema + '#' + result.error.schemaPath;
                annotations.add(
                    'errorschema',
                    result.error.message,
                    target,
                    '//' + window.location.host + '/jsonschemas#' + origin,
                    origin
                );
            }

            if (callback) {
                callback.apply(this, [result]);
            }
        }
    }

    function validationDelay() {
        window.setTimeout(validationLoop, 1000);
    }

    function validationLoop() {
        var element = document.getElementById('jsoneditor-main');

        // clean up
        annotations.clear('errorstate');

        // internal validation
        // this state might change even if the resulting .jsoneditor_value()
        // stays the same
        element.jsoneditor_validate();

        var value = element.jsoneditor_value();
        var schema = value.$schema || element.jsoneditor_schema;
        var valueOld = element.jsoneditor_cachedvalue;
        element.jsoneditor_cachedvalue = JSON.stringify(value);
        if (schema && (element.jsoneditor_cachedvalue !== valueOld)) {
            fullValidation(element, value, schema, validationDelay);
        } else {
            validationDelay();
        }
    }


    // event dispatcher table
    eventDispatcher.register('keydown', 'keyConvert', convertKeyEvents);
    eventDispatcher.register('click', 'showHideToggle', formHelpers.show_hide_toggle);
    eventDispatcher.register('click', 'ringShowByButton', ringMenu.show);
    eventDispatcher.register('click', 'clickRingIcon', ringMenu.callbackIcon);
    eventDispatcher.register('click', 'coverClose', cover.callbackClose);
    eventDispatcher.register('click', 'arrayModifyAdd', elementArray.modifyAdd);
    eventDispatcher.register('click', 'arrayModifyDelete', elementArray.modifyDelete);
    eventDispatcher.register('click', 'objectModifyAdd', elementObject.modifyAdd);
    eventDispatcher.register('click', 'objectModifyDelete', elementObject.modifyDelete);
    eventDispatcher.register('click', 'annotationClick', annotations.callbackClick);
    eventDispatcher.register('click', 'linkFollow', formHelpers.callbackLinkfollow);
    eventDispatcher.register('click', 'startedit', formHelpers.callbackStartedit);
    eventDispatcher.register('wheel', 'eatScroll', formHelpers.callbackEat);
    eventDispatcher.register('ESCAPE', 'coverClose', cover.callbackClose);
    eventDispatcher.register('ENTER', 'coverClose', cover.callbackClose);
    eventDispatcher.register('CTRL-SPACE', 'searchShow', searchBar.callbackSearchShow);
    eventDispatcher.register('ENTER', 'searchSubmit', searchBar.callbackSearchSubmit);
    eventDispatcher.register('ARROWUP', 'historyUp', searchBar.callbackHistoryUp);
    eventDispatcher.register('ARROWDOWN', 'historyDown', searchBar.callbackHistoryDown);
    eventDispatcher.register('CTRL-ARROWUP', 'navprev', formHelpers.callbackNavprev);
    eventDispatcher.register('CTRL-ARROWDOWN', 'navnext', formHelpers.callbackNavnext);
    eventDispatcher.register('CTRL-ARROWRIGHT', 'navin', formHelpers.callbackNavin);
    eventDispatcher.register('CTRL-ARROWLEFT', 'navout', formHelpers.callbackNavout);
    eventDispatcher.register('CTRL-PERIOD', 'ringShowByKey', ringMenu.show);
    eventDispatcher.register('DIGIT1', 'select:0', ringMenu.callbackKey);
    eventDispatcher.register('DIGIT2', 'select:1', ringMenu.callbackKey);
    eventDispatcher.register('DIGIT3', 'select:2', ringMenu.callbackKey);
    eventDispatcher.register('DIGIT4', 'select:3', ringMenu.callbackKey);
    eventDispatcher.register('DIGIT5', 'select:4', ringMenu.callbackKey);
    eventDispatcher.register('DIGIT6', 'select:5', ringMenu.callbackKey);
    eventDispatcher.register('DIGIT7', 'select:6', ringMenu.callbackKey);
    eventDispatcher.register('DIGIT8', 'select:7', ringMenu.callbackKey);
    eventDispatcher.register('DIGIT9', 'select:8', ringMenu.callbackKey);
    eventDispatcher.register('DIGIT0', 'select:9', ringMenu.callbackKey);

    eventDispatcher.bindToElement(document, 'keyConvert');

    $('.jsoneditor').each(function() {
        var element = this;
        var loading = $('.jsoneditor-loading', element)[0];
        var blob_container = $('.jsoneditor-blob', element)[0];
        var patch_container = $('.jsoneditor-patch', element)[0];
        var json = JSON.parse($(blob_container).text()); //utils.blob2json($(blob_container).text()); // FIXME
        var schema = json.$schema;
        var target = $('.jsoneditor-rendered', element)[0];

        // create document fragment to avoid reflows
        var fragment = document.createDocumentFragment();
        var fragment_div = document.createElement('div');
        fragment_div.id = 'jsoneditor-main';
        fragment_div.className = 'jsoneditor-main';
        fragment.appendChild(fragment_div);

        gen(json, fragment_div);

        // show outer element
        if (fragment_div.jsoneditor_show) {
            fragment_div.jsoneditor_show();
        }

        // add schema
        // FIXME set schema during generation, so it can influence the form
        fragment_div.jsoneditor_schema = schema;

        // initialize search
        searchBar.create(fragment_div);

        // add clearfix
        var clearfix = document.createElement('div');
        clearfix.className = 'clearfix jsoneditor-end';
        fragment.appendChild(clearfix);

        // register submit event
        $('.jsoneditor-submit', element).on('click', function() {
            $(element).submit();
        });
        $(element).submit(function() {
            var json_new = fragment_div.jsoneditor_value();
            var patch = jsonpatch.compare(json, json_new);
            $(patch_container).text(JSON.stringify(patch));

            json = json_new;
            $(blob_container).text(JSON.stringify(json));
        });

        // finally add rendered form
        target.appendChild(fragment);
        $(loading).remove();

        // start validation loop
        validationLoop();
    });
  });
});
