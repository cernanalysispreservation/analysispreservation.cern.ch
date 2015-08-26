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
 */

require(['jquery', 'base64', 'utf8'], function($, base64, utf8) {
  'use strict';

  $(function() {
    // color theme
    var H_VALUES = {
        'number': 0.0,
        'string': 0.68,
        'unknown': 0.125,
    };

    /* JSON blob:
     *   // secure string
     *   base64:
     *     // 0x00-0xFF string (UTF-8)
     *     utf-8:
     *       // browser UTF-16 string, other string, ...
     *       stringify:
     *         JSON object
     */
    function blob2json(blob) {
        var str = utf8.decode(base64.decode(blob)).trim();
        if (str) {
            return JSON.parse(str);
        } else {
            return {};
        }
    }

    function extend_array(a, e) {
        for (var i = 0; i < e.length; ++i) {
            a.push(e[i]);
        }
    }

    // http://stackoverflow.com/a/4467559
    function mod(x, n) {
        return ((x % n) + n) % n;
    }

    function sum(list) {
        var sum = 0;
        for (var i = 0; i < list.length; ++i) {
            sum += list[i].w;
        }
        return sum;
    }

    // http://stackoverflow.com/a/7616484
    function hash_string(str) {
        var hash = 0, i, chr, len;
        if (str.length == 0) return hash;
        for (i = 0, len = str.length; i < len; i++) {
            chr   = str.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    function fhash_string(str) {
        var hash = hash_string(str);
        return (hash + 0xffffffff / 2) * 1.0 / 0xffffffff;
    }

    function string2lightness(str) {
        return 0.2 + 0.6 * fhash_string(str);
    }

    function number2saturation(x) {
        return 1 - 1.0 / (1 + x);
    }

    function mixhue(base, shift) {
        return mod(base - 0.08 + 0.16 * shift, 1.0)
    }

    function create_separator(w, shift) {
        return [{
            h: shift,
            s: 0.8,
            l: 0.05,
            w: w
        }];
    }

    function fingerprint(element, shift) {
        if (Array.isArray(element)) {
            return fingerprint_array(element, shift);
        } else if (typeof(element) === 'number') {
            return fingerprint_number(element, shift);
        } else if (typeof(element) === 'string') {
            return fingerprint_string(element, shift);
        } else if (typeof(element) === 'object') {
            return fingerprint_object(element, shift);
        } else {
            return fingerprint_unknown(element, shift);
        }
    }

    function fingerprint_array(element, shift) {
        var inner = [];
        for (var i = 0; i < element.length; ++i) {
            extend_array(inner, normalize(fingerprint(element[i], shift), 1));
        }

        var s = sum(inner);
        var result = create_separator(s / 20.0, shift);
        extend_array(result, inner);
        extend_array(result, create_separator(s / 20.0, shift));
        return result;
    }

    function fingerprint_number(element, shift) {
        var str = JSON.stringify(element);
        return [{
            h: mixhue(H_VALUES['number'], shift),
            s: number2saturation(Math.log(1 + Math.abs(element))),
            l: string2lightness(str),
            w: 1
        }];
    }

    function fingerprint_object(element, shift) {
        var inner = [];
        var keys = Array.sort(Object.keys(element));
        for (var i = 0; i < keys.length; ++i) {
            var k = keys[i];
            var v = element[k];
            var subshift = mod(shift + fhash_string(k), 1.0);
            extend_array(inner, normalize(fingerprint(v, subshift), 1));
        }

        var s = sum(inner);
        var result = create_separator(s / 20.0, shift);
        extend_array(result, inner);
        extend_array(result, create_separator(s / 20.0, shift));
        return result;
    }

    function fingerprint_string(element, shift) {
        return [{
            h: mixhue(H_VALUES['string'], shift),
            s: number2saturation(element.length / 4),
            l: string2lightness(element),
            w: 1
        }];
    }

    function fingerprint_unknown(element, shift) {
        var str = JSON.stringify(element);
        return [{
            h: mixhue(H_VALUES['unknown'], shift),
            s: number2saturation(str.length),
            l: string2lightness(str),
            w: 1
        }];
    }

    function normalize(list, w) {
        var factor = w / sum(list);
        for (var i = 0; i < list.length; ++i) {
            list[i].w *= factor;
        }

        return list;
    }

    $('.jsonfingerprint').each(function() {
        var canvas = this;
        canvas.width = $(canvas).width();
        canvas.height = $(canvas).height();

        var blob_container = document.getElementById($(canvas).data('blob'));
        var json = blob2json($(blob_container).text());
        var ctx = canvas.getContext('2d');

        // offscreen canvas with higher resolution
        var os_canvas = document.createElement('canvas');
        os_canvas.width = 2 * canvas.width;
        os_canvas.height = 2 * canvas.height;
        var os_ctx = os_canvas.getContext('2d');

        // calculate parts fo the fingerprint
        var parts = normalize(fingerprint(json, 0), os_canvas.width);

        // draw to offscreen canvas
        var x = 0;
        for (var i = 0; i < parts.length; ++i) {
            var part = parts[i];
            os_ctx.fillStyle = 'hsl(' + Math.round(360 * part.h) + ',' + Math.round(100 * part.s) + '%,' + Math.round(100 * part.l) + '%)';
            os_ctx.fillRect(x - 0.5, 0, part.w + 1.0, os_canvas.height); // includes anti-aliasing fix
            x += part.w;
        }

        // draw offscreen content to real canvas
        ctx.drawImage(os_canvas, 0, 0, canvas.width, canvas.height);
    });
  });
})
