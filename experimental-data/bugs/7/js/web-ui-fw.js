(function (a, b) {
    function c() {
        var b = a('script[data-framework-version][data-framework-root][data-framework-theme]');
        return b.attr('data-framework-root') + '/' + b.attr('data-framework-version') + '/themes/' + b.attr('data-framework-theme') + '/proto-html';
    }
    a.widget('todons.widgetex', a.mobile.widget, {
        _createWidget: function () {
            a.todons.widgetex.loadPrototype.call(this, this.namespace + '.' + this.widgetName), a.mobile.widget.prototype._createWidget.apply(this, arguments);
        },
        _init: function () {
            var b = this.element.closest('.ui-page'), c = this, d = {};
            b.is(':visible') ? this._realize() : b.bind('pageshow', function () {
                c._realize();
            }), a.extend(d, this.options), this.options = {}, this._setOptions(d);
        },
        _getCreateOptions: function () {
            if (this.element.is('input') && this._value !== b) {
                var c = this.element.attr('type') === 'checkbox' || this.element.attr('type') === 'radio' ? this.element.is(':checked') : this.element.is('[value]') ? this.element.attr('value') : b;
                c != b && this.element.attr(this._value.attr, c);
            }
            return a.mobile.widget.prototype._getCreateOptions.apply(this, arguments);
        },
        _setOption: function (c, d) {
            var e = '_set' + c.replace(/^[a-z]/, function (a) {
                return a.toUpperCase();
            });
            this[e] !== b ? this[e](d) : a.mobile.widget.prototype._setOption.apply(this, arguments);
        },
        _setDisabled: function (b) {
            a.Widget.prototype._setOption.call(this, 'disabled', b), this.element.is('input') && this.element.attr('disabled', b);
        },
        _setValue: function (b) {
            a.todons.widgetex.setValue(this, b);
        },
        _realize: function () {
        }
    }), a.todons.widgetex.setValue = function (a, c) {
        if (a._value !== b) {
            var d = a._value.makeString ? a._value.makeString(c) : c;
            a.element.attr(a._value.attr, d), a._value.signal !== b && a.element.triggerHandler(a._value.signal, c);
            if (a.element.is('input')) {
                var e = a.element.attr('type');
                e === 'checkbox' || e === 'radio' ? c ? a.element.attr('checked', !0) : a.element.removeAttr('checked') : a.element.attr('value', d), a.element.trigger('change');
            }
        }
    }, a.todons.widgetex.assignElements = function (b, c) {
        var d = {};
        for (var e in c)
            typeof c[e] == 'string' ? (d[e] = b.find(c[e]), c[e].match(/^#/) && d[e].removeAttr('id')) : typeof c[e] == 'object' && (d[e] = a.todons.widgetex.assignElements(b, c[e]));
        return d;
    }, a.todons.widgetex.loadPrototype = function (d, e) {
        var f = d.split('.');
        if (f.length == 2) {
            var g = f[0], h = f[1], i = a('<div></div>').text('Failed to load proto for widget ' + g + '.' + h + '!').css({
                    background: 'red',
                    color: 'blue',
                    border: '1px solid black'
                }).jqmData('todons.widgetex.ajax.fail', !0);
            a[g][h].prototype._htmlProto !== b && (a[g][h].prototype._htmlProto.source === b && (a[g][h].prototype._htmlProto.source = h), typeof a[g][h].prototype._htmlProto.source == 'string' ? (d = a[g][h].prototype._htmlProto.source, protoPath = c(), a.ajax({
                url: protoPath + '/' + d + '.prototype.html',
                async: !1,
                dataType: 'html'
            }).success(function (b, c, d) {
                i = a('<div></div>').html(b).jqmData('todons.widgetex.ajax.fail', !1);
            }), a[g][h].prototype._htmlProto.source = i) : (a[g][h].prototype._htmlProto.source.jqmData('todons.widgetex.ajax.fail', !1), i = a[g][h].prototype._htmlProto.source), a[g][h].prototype._htmlProto.ui !== b && a.extend(this, { _ui: a.todons.widgetex.assignElements(i.clone(), a[g][h].prototype._htmlProto.ui) }));
        }
    };
}(jQuery));
(function (a, b) {
    a.widget('todons.colorwidget', a.todons.widgetex, {
        options: { color: '#ff0972' },
        _value: {
            attr: 'data-' + (a.mobile.ns || '') + 'color',
            signal: 'colorchanged'
        },
        _getElementColor: function (a, b) {
            return a.jqmData('clr');
        },
        _setElementColor: function (b, c, d) {
            var e = a.todons.colorwidget.clrlib, f = e.RGBToHTML(e.HSLToRGB(c)), g = e.RGBToHTML(e.HSLToGray(c));
            return b.jqmData('clr', f), b.jqmData('dclr', g), b.jqmData('cssProp', d), b.attr('data-' + (a.mobile.ns || '') + 'has-dclr', !0), b.css(d, this.options.disabled ? g : f), {
                clr: f,
                dclr: g
            };
        },
        _displayDisabledState: function (b) {
            var c = this, d = ':jqmData(has-dclr=\'true\')', e = b.is(d) ? b : a([]);
            e.add(b.find(d)).each(function () {
                el = a(this), el.css(el.jqmData('cssProp'), el.jqmData(c.options.disabled ? 'dclr' : 'clr'));
            });
        },
        _setColor: function (b) {
            var c = this.options.color + '';
            return b += '', b = b.match(/#[0-9A-Fa-f]{6}/) ? b : c.match(/#[0-9A-Fa-f]{6}/) ? c : a.todons.colorwidget.prototype.options.color, this.options.color !== b ? (this.options.color = b, this._setValue(b), !0) : !1;
        }
    }), a.todons.colorwidget.clrlib = {
        nearestInt: function (a) {
            var b = Math.floor(a);
            return a - b > 0.5 ? b + 1 : b;
        },
        HTMLToRGB: function (a) {
            return a = '#' == a.charAt(0) ? a.substring(1) : a, [
                parseInt(a.substring(0, 2), 16) / 255,
                parseInt(a.substring(2, 4), 16) / 255,
                parseInt(a.substring(4, 6), 16) / 255
            ];
        },
        RGBToHTML: function (a) {
            var b = '#', c, d;
            for (var e in a)
                c = a[e] * 255, d = Math.floor(c), c = c - d > 0.5 ? d + 1 : d, b += (c < 16 ? '0' : '') + (c & 255).toString(16);
            return b;
        },
        HSLToRGB: function (a) {
            var b = a[0] / 360, c = a[1], d = a[2];
            if (0 === c)
                return [
                    d,
                    d,
                    d
                ];
            var e = d < 0.5 ? d * (1 + c) : d + c - d * c, f = 2 * d - e, g = {
                    r: b + 1 / 3,
                    g: b,
                    b: b - 1 / 3
                };
            return g.r = g.r < 0 ? g.r + 1 : g.r > 1 ? g.r - 1 : g.r, g.g = g.g < 0 ? g.g + 1 : g.g > 1 ? g.g - 1 : g.g, g.b = g.b < 0 ? g.b + 1 : g.b > 1 ? g.b - 1 : g.b, ret = [
                6 * g.r < 1 ? f + (e - f) * 6 * g.r : 2 * g.r < 1 ? e : 3 * g.r < 2 ? f + (e - f) * (2 / 3 - g.r) * 6 : f,
                6 * g.g < 1 ? f + (e - f) * 6 * g.g : 2 * g.g < 1 ? e : 3 * g.g < 2 ? f + (e - f) * (2 / 3 - g.g) * 6 : f,
                6 * g.b < 1 ? f + (e - f) * 6 * g.b : 2 * g.b < 1 ? e : 3 * g.b < 2 ? f + (e - f) * (2 / 3 - g.b) * 6 : f
            ], ret;
        },
        HSVToRGB: function (b) {
            return a.todons.colorwidget.clrlib.HSLToRGB(a.todons.colorwidget.clrlib.HSVToHSL(b));
        },
        RGBToHSV: function (a) {
            var b, c, d, e, f, g, h = a[0], i = a[1], j = a[2];
            return b = Math.min(h, Math.min(i, j)), c = Math.max(h, Math.max(i, j)), d = c - b, e = 0, f = 0, g = c, d > 0.00001 && (f = d / c, h === c ? e = (i - j) / d : i === c ? e = 2 + (j - h) / d : e = 4 + (h - i) / d, e *= 60, e < 0 && (e += 360)), [
                e,
                f,
                g
            ];
        },
        HSVToHSL: function (a) {
            var b = a[2], c = a[1] * b, d = b - c, e = b + d, f = e / 2, g = f < 0.5 ? e : 2 - b - d;
            return [
                a[0],
                0 == g ? 0 : c / g,
                f
            ];
        },
        RGBToHSL: function (b) {
            return a.todons.colorwidget.clrlib.HSVToHSL(a.todons.colorwidget.clrlib.RGBToHSV(b));
        },
        HSLToGray: function (a) {
            var b = [
                    0.211764706,
                    0.929411765,
                    0.71372549,
                    0.788235294,
                    0.070588235,
                    0.28627451,
                    0.211764706
                ], c = Math.floor(a[0] / 60), d, e, f;
            d = b[c], e = b[c + 1];
            if (a[2] < 0.5) {
                var g = a[2] * 2;
                d *= g, e *= g;
            } else {
                var h = (a[2] - 0.5) * 2;
                d += (1 - d) * h, e += (1 - e) * h;
            }
            return f = d + (e - d) * (a[0] - c * 60) / 60, f += (a[2] - f) * (1 - a[1]), [
                f,
                f,
                f
            ];
        }
    };
}(jQuery));
(function (a, b) {
    a.widget('todons.huegradient', a.todons.widgetex, {
        _create: function () {
            this.element.addClass('todons-huegradient');
        },
        _IEGradient: function (b, c) {
            var d = c ? [
                '#363636',
                '#ededed',
                '#b6b6b6',
                '#c9c9c9',
                '#121212',
                '#494949',
                '#363636'
            ] : [
                '#ff0000',
                '#ffff00',
                '#00ff00',
                '#00ffff',
                '#0000ff',
                '#ff00ff',
                '#ff0000'
            ];
            for (var e = 0; e < 6; e++)
                a('<div></div>').css({
                    position: 'absolute',
                    width: 100 / 6 + '%',
                    height: '100%',
                    left: e * 100 / 6 + '%',
                    top: '0px',
                    filter: 'progid:DXImageTransform.Microsoft.gradient (startColorstr=\'' + d[e] + '\', endColorstr=\'' + d[e + 1] + '\', GradientType = 1)'
                }).appendTo(b);
        },
        _setDisabled: function (b) {
            a.Widget.prototype._setOption.call(this, 'disabled', b), a.mobile.browser.ie && this._IEGradient(this.element.empty(), b);
        }
    });
}(jQuery));
(function (a, b) {
    var c = function (b) {
        var c = a(this);
        b = b || {};
        var d = c.data('listview'), e = b.type || c.jqmData('autodividers') || 'alpha', f = b.selector || c.jqmData('autodividers-selector') || 'a', g = function (a) {
                var b = a.find(f).text() || a.text() || null;
                return b ? (e === 'alpha' && (b = b.slice(0, 1).toUpperCase()), b) : null;
            }, h = function () {
                var b = !1;
                c.find('li.ui-li-divider').each(function () {
                    var c = a(this), d = c.text(), e = '.ui-li-divider:not(:contains(' + d + '))', f = c.nextUntil(e);
                    f = f.filter('.ui-li-divider:contains(' + d + ')'), f.length > 0 && (f.remove(), b = !0);
                }), b && c.trigger('updatelayout');
            }, i = function (a) {
                return a.is('li') && a.jqmData('role') !== 'list-divider';
            }, j = function (b) {
                var c = g(b);
                if (!c) {
                    d.refresh();
                    return;
                }
                var e = b.prevAll('.ui-li-divider:first:contains(' + c + ')');
                if (e.length === 0) {
                    var f = a('<li>' + c + '</li>');
                    f.attr('data-' + a.mobile.ns + 'role', 'list-divider'), b.before(f), d.refresh(), h();
                } else
                    d.refresh();
            }, k = function (a) {
                var b = g(a);
                if (!b) {
                    d.refresh();
                    return;
                }
                var c = a.prevUntil('.ui-li-divider:contains(' + b + ')'), e = a.nextUntil('.ui-li-divider');
                c.length === 0 && e.length === 0 ? (a.prevAll('.ui-li-divider:contains(' + b + '):first').remove(), d.refresh(), h()) : d.refresh();
            };
        c.find('li').each(function () {
            var b = a(this);
            b.jqmData('role') === 'list-divider' ? b.remove() : j(b);
        }), c.bind('DOMNodeInserted', function (b) {
            var c = a(b.target);
            if (!i(c))
                return;
            j(c);
        }), c.bind('DOMNodeRemoved', function (b) {
            var c = a(b.target);
            if (!i(c))
                return;
            k(c);
        });
    };
    a.fn.autodividers = c, a(':jqmData(role=listview)').live('listviewcreate', function () {
        var b = a(this);
        b.is(':jqmData(autodividers)') && b.autodividers();
    });
}(jQuery));
(function (a, b) {
    a.widget('todons.calendarpicker', a.todons.widgetex, {
        options: {
            daysOfWeekShort: [
                'Sun',
                'Mon',
                'Tue',
                'Wed',
                'Thu',
                'Fri',
                'Sat'
            ],
            monthsOfYear: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ],
            calShowDays: !0,
            calShowOnlyMonth: !0,
            dateFormat: 'YYYY-MM-DD',
            calWeekMode: !1,
            calWeekModeFirstDay: 1,
            calStartDay: 1,
            notToday: !1,
            afterToday: !1,
            beforeToday: !1,
            maxDays: !1,
            minDays: !1,
            highDays: [
                'Sun',
                'firstdaybutton',
                'Sat',
                'lastdaybutton'
            ],
            calHighToday: 'e',
            highDates: !1,
            highDatesTheme: 'e',
            blackDays: !1,
            blackDates: !1,
            disabledDayColor: '#888',
            show: !1
        },
        _zeroPad: function (a) {
            return (a < 10 ? '0' : '') + String(a);
        },
        _makeOrd: function (a) {
            var b = a % 10;
            return a > 9 && a < 21 ? 'th' : b > 3 ? 'th' : [
                'th',
                'st',
                'nd',
                'rd'
            ][b];
        },
        _dstAdjust: function (a) {
            return a ? (a.setHours(a.getHours() > 12 ? a.getHours() + 2 : 0), a) : null;
        },
        _getFirstDay: function (a) {
            return new Date(a.getFullYear(), a.getMonth(), 1).getDay();
        },
        _getLastDate: function (a) {
            return 32 - this._dstAdjust(new Date(a.getFullYear(), a.getMonth(), 32)).getDate();
        },
        _getLastDateBefore: function (a) {
            return 32 - this._dstAdjust(new Date(a.getFullYear(), a.getMonth() - 1, 32)).getDate();
        },
        _formatter: function (a, b) {
            return a = a.replace('SS', this._makeOrd(b.getDate())), a = a.replace('YYYY', b.getFullYear()), a = a.replace('MM', this._zeroPad(b.getMonth() + 1)), a = a.replace('mm', b.getMonth() + 1), a = a.replace('DD', this._zeroPad(b.getDate())), a = a.replace('dd', b.getDate()), a;
        },
        _formatDate: function (a) {
            return this._formatter(this.options.dateFormat, a);
        },
        _isoDate: function (a, b, c) {
            return String(a) + '-' + (b < 10 ? '0' : '') + String(b) + '-' + (c < 10 ? '0' : '') + String(c);
        },
        _checker: function (a) {
            return parseInt(String(a.getFullYear()) + this._zeroPad(a.getMonth() + 1) + this._zeroPad(a.getDate()), 10);
        },
        _offset: function (a, b, c) {
            var d = this, e = this.options;
            typeof c == 'undefined' && (c = !0);
            switch (a) {
            case 'y':
                d.theDate.setYear(d.theDate.getFullYear() + b);
                break;
            case 'm':
                d.theDate.setMonth(d.theDate.getMonth() + b);
                break;
            case 'd':
                d.theDate.setDate(d.theDate.getDate() + b);
            }
            c === !0 && d._update();
        },
        _update: function () {
            var b = this, c = b.options, d = null, e, f, g, h, i, j, k, l, m, n, o = {
                    d: 86400,
                    h: 3600,
                    i: 60,
                    s: 1
                }, p = {};
            b._ui.cpMonthGrid.text(c.monthsOfYear[b.theDate.getMonth()] + ' ' + b.theDate.getFullYear()), b._ui.cpweekDayGrid.html(''), p = {
                today: -1,
                highlightDay: -1,
                presetDay: -1,
                nexttoday: 1,
                thisDate: new Date(),
                maxDate: new Date(),
                minDate: new Date(),
                currentMonth: !1,
                weekMode: 0,
                weekDays: null,
                thisTheme: c.pickPageButtoTheme
            }, p.start = b._getFirstDay(b.theDate), p.end = b._getLastDate(b.theDate), p.lastend = b._getLastDateBefore(b.theDate), c.calStartDay > 0 && (p.start = p.start - c.calStartDay, p.start < 0 && (p.start = p.start + 7)), p.prevtoday = p.lastend - (p.start - 1), p.checkDates = c.afterToday !== !1 || c.beforeToday !== !1 || c.notToday !== !1 || c.maxDays !== !1 || c.minDays !== !1 || c.blackDates !== !1 || c.blackDays !== !1, p.thisDate.getMonth() === b.theDate.getMonth() && p.thisDate.getFullYear() === b.theDate.getFullYear() && (p.currentMonth = !0, p.highlightDay = p.thisDate.getDate()), b.calNoPrev = !1, b.calNoNext = !1, c.afterToday === !0 && (p.currentMonth === !0 || p.thisDate.getMonth() >= b.theDate.getMonth() && b.theDate.getFullYear() === p.thisDate.getFullYear()) && (b.calNoPrev = !0), c.beforeToday === !0 && (p.currentMonth === !0 || p.thisDate.getMonth() <= b.theDate.getMonth() && b.theDate.getFullYear() === p.thisDate.getFullYear()) && (b.calNoNext = !0), c.minDays !== !1 && (p.minDate.setDate(p.minDate.getDate() - c.minDays), b.theDate.getFullYear() === p.minDate.getFullYear() && b.theDate.getMonth() <= p.minDate.getMonth() && (b.calNoPrev = !0)), c.maxDays !== !1 && (p.maxDate.setDate(p.maxDate.getDate() + c.maxDays), b.theDate.getFullYear() === p.maxDate.getFullYear() && b.theDate.getMonth() >= p.maxDate.getMonth() && (b.calNoNext = !0));
            if (c.calShowDays) {
                c.daysOfWeekShort.length < 8 && (c.daysOfWeekShort = c.daysOfWeekShort.concat(c.daysOfWeekShort)), p.weekDays = a('<div>', { 'class': 'ui-cp-row' }).appendTo(b._ui.cpweekDayGrid);
                for (e = 0; e <= 6; e++)
                    a('<div>' + c.daysOfWeekShort[e + c.calStartDay] + '</div>').addClass('ui-cp-date ui-cp-date-disabled ui-cp-month').appendTo(p.weekDays);
            }
            for (f = 0; f <= 5; f++)
                if (f === 0 || f > 0 && p.today > 0 && p.today <= p.end) {
                    i = a('<div>', { 'class': 'ui-cp-row' }).appendTo(b._ui.cpweekDayGrid);
                    for (g = 0; g <= 6; g++) {
                        g === 0 && (p.weekMode = p.today < 1 ? p.prevtoday - p.lastend + c.calWeekModeFirstDay : p.today + c.calWeekModeFirstDay), g === p.start && f === 0 && (p.today = 1), p.today > p.end && (p.today = -1);
                        if (p.today < 1)
                            c.calShowOnlyMonth ? a('<div>', { 'class': 'ui-cp-date ui-cp-date-disabled' }).appendTo(i) : (c.blackDays !== !1 && a.inArray(g, c.blackDays) > -1 || c.blackDates !== !1 && a.inArray(b._isoDate(b.theDate.getFullYear(), b.theDate.getMonth(), p.prevtoday), c.blackDates) > -1 || c.blackDates !== !1 && a.inArray(b._isoDate(b.theDate.getFullYear(), b.theDate.getMonth() + 2, p.nexttoday), c.blackDates) > -1 ? h = !0 : h = !1, f === 0 ? (a('<div>' + String(p.prevtoday) + '</div>').addClass('ui-cp-date ui-cp-date-disabled').appendTo(i).attr('data-date', c.calWeekMode ? p.weekMode + p.lastend : p.prevtoday), p.prevtoday++) : (a('<div>' + String(p.nexttoday) + '</div>').addClass('ui-cp-date ui-cp-date-disabled').appendTo(i).attr('data-date', c.calWeekMode ? p.weekMode : p.nexttoday), p.nexttoday++));
                        else {
                            h = !1, p.checkDates && (c.afterToday && b._checker(p.thisDate) > b._checker(b.theDate) + p.today - b.theDate.getDate() && (h = !0), !h && c.beforeToday && b._checker(p.thisDate) < b._checker(b.theDate) + p.today - b.theDate.getDate() && (h = !0), !h && c.notToday && p.today === p.highlightDay && (h = !0), !h && c.maxDays !== !1 && b._checker(p.maxDate) < b._checker(b.theDate) + p.today - b.theDate.getDate() && (h = !0), !h && c.minDays !== !1 && b._checker(p.minDate) > b._checker(b.theDate) + p.today - b.theDate.getDate() && (h = !0), !h && (c.blackDays !== !1 || c.blackDates !== !1) && (a.inArray(g, c.blackDays) > -1 || a.inArray(b._isoDate(b.theDate.getFullYear(), b.theDate.getMonth() + 1, p.today), c.blackDates) > -1) && (h = !0));
                            if (c.calHighToday !== null && p.today === p.highlightDay)
                                p.thisTheme = c.calHighToday;
                            else if (a.isArray(c.highDates) && a.inArray(b._isoDate(b.theDate.getFullYear(), b.theDate.getMonth() + 1, p.today), c.highDates) > -1)
                                p.thisTheme = c.highDatesTheme;
                            else if (a.isArray(c.highDays) && a.inArray(c.daysOfWeekShort[g + c.calStartDay], c.highDays) > -1) {
                                var q = a.inArray(c.daysOfWeekShort[g + c.calStartDay], c.highDays), r = 'calendarbutton';
                                q = q == c.highDays.length - 1 ? -1 : q;
                                if (q > -1) {
                                    var s = c.highDays[q + 1];
                                    isNaN(s) && (r = s);
                                }
                                p.thisTheme = c.highDays[q + 1];
                            } else
                                p.thisTheme = 'calendarbutton';
                            a('<div>' + String(p.today) + '</div>').addClass('ui-cp-date ui-calendarbtncommon').attr('data-date', c.calWeekMode ? p.weekMode : p.today).attr('data-theme', p.thisTheme).appendTo(i).addClass('ui-btn-up-' + p.thisTheme).unbind().bind(h ? 'error' : 'vclick', function (c) {
                                var d = b._formatDate(b.theDate);
                                c.preventDefault(), b.theDate.setDate(a(this).attr('data-date')), b.element.trigger('selectedDate', [d]), b.element.is('input') && b.element.attr('value', d).trigger('change'), b.close();
                            }).css(h ? 'color' : 'nocolor', c.disabledDayColor), p.today++;
                        }
                    }
                }
        },
        _create: function () {
            var b = this, c = a.extend(this.options, this.element.data('options')), d = this.element, e = new Date();
            a.extend(b, {
                input: d,
                theDate: e
            }), a(this.element).buttonMarkup().bind('vclick', function () {
                b.open();
            }), b._buildPage();
        },
        _htmlProto: {
            source: a('<div><div class=\'ui-cp-container\'>  <div class=\'ui-cp-headercontainer\'>      <div class=\'ui-cp-previous ui-calendarbtncommon\'><a href=\'#\'></a></div>      <div class=\'ui-cp-next ui-calendarbtncommon\'><a href=\'#\'></a></div>      <div class=\'ui-cp-month\'><h4>Uninitialized</h4></div>  </div>  <div class=\'ui-cp-weekday\'></div></div></div>'),
            ui: {
                cpContainer: '.ui-cp-container',
                cpHeader: '.ui-cp-headercontainer',
                cpweekDayGrid: '.ui-cp-weekday',
                cpMonthGrid: '.ui-cp-month',
                previousButton: '.ui-cp-previous',
                nextButton: '.ui-cp-next'
            }
        },
        _buildPage: function () {
            var b = this, c = b.options, d = !1, e = {
                    inline: !0,
                    corners: !0,
                    icon: 'arrow-l',
                    iconpos: 'notext'
                }, f = {
                    inline: !0,
                    corners: !0,
                    icon: 'arrow-r',
                    iconpos: 'notext'
                };
            this._ui.previousButton.buttonMarkup(e), this._ui.nextButton.buttonMarkup(f), this._ui.nextButton.bind('vclick', function (a) {
                a.preventDefault(), b.calNoNext || (b.theDate.getDate() > 28 && b.theDate.setDate(1), b._offset('m', 1));
            }), this._ui.previousButton.bind('vclick', function (a) {
                a.preventDefault(), b.calNoPrev || (b.theDate.getDate() > 28 && b.theDate.setDate(1), b._offset('m', -1));
            }), a.extend(b, { isopen: d }), this._ui.cpContainer.appendTo(b.element).popupwindow({
                transition: 'slideup',
                overlayTheme: 'c'
            }).bind('closed', function (a) {
                b.isopen = !1;
            }), c.show && b.open();
        },
        refresh: function () {
            this._update();
        },
        visible: function () {
            return this.isopen;
        },
        _setDisabled: function (b) {
            a.todons.widgetex.prototype._setDisabled.call(this, b), this.isopen && b && this.close(), this.element[b ? 'addClass' : 'removeClass']('ui-disabled');
        },
        open: function () {
            if (this.isopen === !0)
                return !1;
            this.isopen = !0, this._update(), this._ui.cpContainer.popupwindow('open', 0, window.innerHeight);
        },
        close: function () {
            this._ui.cpContainer.popupwindow('close');
        }
    }), a(document).bind('pagecreate', function (b) {
        a(':jqmData(role=\'calendarpicker\')', b.target).calendarpicker();
    });
}(jQuery));
(function (a, b) {
    a.widget('todons.colorpalette', a.todons.colorwidget, {
        options: {
            showPreview: !1,
            initSelector: ':jqmData(role=\'colorpalette\')'
        },
        _htmlProto: {
            source: a('<div><div id=\'colorpalette\' class=\'ui-colorpalette jquery-mobile-ui-widget\' data-n-choices=\'10\'>    <div class=\'colorpalette-preview-container\' id=\'colorpalette-preview-container\'>        <div id=\'colorpalette-preview\' class=\'colorpalette-preview ui-corner-all\'></div>    </div>    <div class=\'colorpalette-table\'>        <div class=\'colorpalette-normal-row\'>            <div class=\'colorpalette-choice-container-left\'>                <div data-colorpalette-choice=\'0\' class=\'colorpalette-choice ui-corner-all\'></div>            </div>            <div class=\'colorpalette-choice-container-rest\'>                <div data-colorpalette-choice=\'1\' class=\'colorpalette-choice ui-corner-all\'></div>            </div>            <div class=\'colorpalette-choice-container-rest\'>                <div data-colorpalette-choice=\'2\' class=\'colorpalette-choice ui-corner-all\'></div>            </div>            <div class=\'colorpalette-choice-container-rest\'>                <div data-colorpalette-choice=\'3\' class=\'colorpalette-choice ui-corner-all\'></div>            </div>            <div class=\'colorpalette-choice-container-rest\'>                <div data-colorpalette-choice=\'4\' class=\'colorpalette-choice ui-corner-all\'></div>            </div>        </div>        <div class=\'colorpalette-bottom-row\'>            <div class=\'colorpalette-choice-container-left\'>                <div data-colorpalette-choice=\'5\' class=\'colorpalette-choice ui-corner-all\'></div>            </div>            <div class=\'colorpalette-choice-container-rest\'>                <div data-colorpalette-choice=\'6\' class=\'colorpalette-choice ui-corner-all\'></div>            </div>            <div class=\'colorpalette-choice-container-rest\'>                <div data-colorpalette-choice=\'7\' class=\'colorpalette-choice ui-corner-all\'></div>            </div>            <div class=\'colorpalette-choice-container-rest\'>                <div data-colorpalette-choice=\'8\' class=\'colorpalette-choice ui-corner-all\'></div>            </div>            <div class=\'colorpalette-choice-container-rest\'>                <div data-colorpalette-choice=\'9\' class=\'colorpalette-choice ui-corner-all\'></div>            </div>        </div>    </div></div></div>'),
            ui: {
                clrpalette: '#colorpalette',
                preview: '#colorpalette-preview',
                previewContainer: '#colorpalette-preview-container'
            }
        },
        _create: function () {
            var b = this;
            this.element.css('display', 'none').after(this._ui.clrpalette), this._ui.clrpalette.find('[data-colorpalette-choice]').bind('vclick', function (c) {
                var d = a.todons.colorwidget.prototype._getElementColor.call(this, a(c.target)), e, f = b._ui.clrpalette.attr('data-' + (a.mobile.ns || '') + 'n-choices'), g, h;
                h = d.match(/rgb\(([0-9]*), *([0-9]*), *([0-9]*)\)/), h && h.length > 3 && (d = a.todons.colorwidget.clrlib.RGBToHTML([
                    parseInt(h[1]) / 255,
                    parseInt(h[2]) / 255,
                    parseInt(h[3]) / 255
                ]));
                for (e = 0; e < f; e++)
                    b._ui.clrpalette.find('[data-colorpalette-choice=' + e + ']').removeClass('colorpalette-choice-active');
                a(c.target).addClass('colorpalette-choice-active'), a.todons.colorwidget.prototype._setColor.call(b, d), a.todons.colorwidget.prototype._setElementColor.call(b, b._ui.preview, a.todons.colorwidget.clrlib.RGBToHSL(a.todons.colorwidget.clrlib.HTMLToRGB(d)), 'background');
            });
        },
        _setShowPreview: function (b) {
            b ? this._ui.previewContainer.removeAttr('style') : this._ui.previewContainer.css('display', 'none'), this.element.attr('data-' + (a.mobile.ns || '') + 'show-preview', b), this.options.showPreview = b;
        },
        widget: function (a) {
            return this._ui.clrpalette;
        },
        _setDisabled: function (b) {
            a.todons.widgetex.prototype._setDisabled.call(this, b), this._ui.clrpalette[b ? 'addClass' : 'removeClass']('ui-disabled'), a.todons.colorwidget.prototype._displayDisabledState.call(this, this._ui.clrpalette);
        },
        _setColor: function (b) {
            if (a.todons.colorwidget.prototype._setColor.call(this, b)) {
                b = this.options.color;
                var c, d = -1, e = this._ui.clrpalette.attr('data-' + (a.mobile.ns || '') + 'n-choices'), f = a.todons.colorwidget.clrlib.RGBToHSL(a.todons.colorwidget.clrlib.HTMLToRGB(b)), g = f[0], h = f[0] / 36, i = Math.floor(h), j;
                a.todons.colorwidget.prototype._setElementColor.call(this, this._ui.preview, a.todons.colorwidget.clrlib.RGBToHSL(a.todons.colorwidget.clrlib.HTMLToRGB(b)), 'background'), h = h - i < 0.5 ? h - i : h - (i + 1), h *= 36;
                for (c = 0; c < e; c++)
                    f[0] = c * 36 + h, f[0] = f[0] < 0 ? f[0] + 360 : f[0] > 360 ? f[0] - 360 : f[0], f[0] === g && (d = c), j = a.todons.colorwidget.clrlib.RGBToHTML(a.todons.colorwidget.clrlib.HSLToRGB(f)), a.todons.colorwidget.prototype._setElementColor.call(this, this._ui.clrpalette.find('[data-colorpalette-choice=' + c + ']'), a.todons.colorwidget.clrlib.RGBToHSL(a.todons.colorwidget.clrlib.HTMLToRGB(j)), 'background');
                if (d != -1) {
                    var k = parseInt(this._ui.clrpalette.find('.colorpalette-choice-active').attr('data-' + (a.mobile.ns || '') + 'colorpalette-choice'));
                    k != d && (this._ui.clrpalette.find('[data-colorpalette-choice=' + k + ']').removeClass('colorpalette-choice-active'), this._ui.clrpalette.find('[data-colorpalette-choice=' + d + ']').addClass('colorpalette-choice-active'));
                }
            }
        }
    }), a(document).bind('pagecreate create', function (b) {
        a(a.todons.colorpalette.prototype.options.initSelector, b.target).not(':jqmData(role=\'none\'), :jqmData(role=\'nojs\')').colorpalette();
    });
}(jQuery));
(function (a, b) {
    a.widget('todons.colorpicker', a.todons.colorwidget, {
        options: { initSelector: ':jqmData(role=\'colorpicker\')' },
        _htmlProto: {
            source: a('<div><div id=\'colorpicker\' class=\'ui-colorpicker\'>    <div class=\'colorpicker-hs-container\'>        <div id=\'colorpicker-hs-hue-gradient\' class=\'colorpicker-hs-mask\'></div>        <div id=\'colorpicker-hs-sat-gradient\' class=\'colorpicker-hs-mask sat-gradient\'></div>        <div id=\'colorpicker-hs-val-mask\' class=\'colorpicker-hs-mask\' data-event-source=\'hs\'></div>        <div id=\'colorpicker-hs-selector\' class=\'colorpicker-hs-selector ui-corner-all\'></div>    </div>    <div class=\'colorpicker-l-container\'>        <div id=\'colorpicker-l-gradient\' class=\'colorpicker-l-mask l-gradient\' data-event-source=\'l\'></div>        <div id=\'colorpicker-l-selector\' class=\'colorpicker-l-selector ui-corner-all\'></div>    </div>    <div style=\'clear: both;\'></div></div></div>'),
            ui: {
                clrpicker: '#colorpicker',
                hs: {
                    hueGradient: '#colorpicker-hs-hue-gradient',
                    gradient: '#colorpicker-hs-sat-gradient',
                    eventSource: '[data-event-source=\'hs\']',
                    valMask: '#colorpicker-hs-val-mask',
                    selector: '#colorpicker-hs-selector'
                },
                l: {
                    gradient: '#colorpicker-l-gradient',
                    eventSource: '[data-event-source=\'l\']',
                    selector: '#colorpicker-l-selector'
                }
            }
        },
        _create: function () {
            var c = this;
            this.element.css('display', 'none').after(this._ui.clrpicker), this._ui.hs.hueGradient.huegradient(), a.extend(c, {
                dragging: !1,
                draggingHS: !1,
                selectorDraggingOffset: {
                    x: -1,
                    y: -1
                },
                dragging_hsl: b
            }), a(document).bind('vmousemove', function (a) {
                c.dragging && (a.stopPropagation(), a.preventDefault());
            }).bind('vmouseup', function (a) {
                c.dragging && (c.dragging = !1);
            }), this._bindElements('hs'), this._bindElements('l');
        },
        _bindElements: function (a) {
            var b = this, c = function (a) {
                    b.dragging = !1, a.stopPropagation(), a.preventDefault();
                };
            this._ui[a].eventSource.bind('vmousedown mousedown', function (c) {
                b._handleMouseDown(c, a, !1);
            }).bind('vmousemove', function (c) {
                b._handleMouseMove(c, a, !1);
            }).bind('vmouseup', c), this._ui[a].selector.bind('vmousedown mousedown', function (c) {
                b._handleMouseDown(c, a, !0);
            }).bind('touchmove vmousemove', function (c) {
                b._handleMouseMove(c, a, !0);
            }).bind('vmouseup', c);
        },
        _handleMouseDown: function (b, c, d) {
            var e = a.mobile.todons.targetRelativeCoordsFromEvent(b), f = d ? 'selector' : 'eventSource';
            if (e.x >= 0 && e.x <= this._ui[c][f].width() && e.y >= 0 && e.y <= this._ui[c][f].height() || d)
                this.dragging = !0, this.draggingHS = 'hs' === c, d && (this.selectorDraggingOffset.x = e.x, this.selectorDraggingOffset.y = e.y), this._handleMouseMove(b, c, d, e);
        },
        _handleMouseMove: function (b, c, d, e) {
            if (this.dragging && !(this.draggingHS && c === 'l' || !this.draggingHS && c === 'hs')) {
                e = e || a.mobile.todons.targetRelativeCoordsFromEvent(b);
                if (this.draggingHS) {
                    var f = d ? this.dragging_hsl[0] / 360 + (e.x - this.selectorDraggingOffset.x) / this._ui[c].eventSource.width() : e.x / this._ui[c].eventSource.width(), g = d ? this.dragging_hsl[1] + (e.y - this.selectorDraggingOffset.y) / this._ui[c].eventSource.height() : e.y / this._ui[c].eventSource.height();
                    this.dragging_hsl[0] = Math.min(1, Math.max(0, f)) * 360, this.dragging_hsl[1] = Math.min(1, Math.max(0, g));
                } else {
                    var h = d ? this.dragging_hsl[2] + (e.y - this.selectorDraggingOffset.y) / this._ui[c].eventSource.height() : e.y / this._ui[c].eventSource.height();
                    this.dragging_hsl[2] = Math.min(1, Math.max(0, h));
                }
                d || (this.selectorDraggingOffset.x = Math.ceil(this._ui[c].selector.outerWidth() / 2), this.selectorDraggingOffset.y = Math.ceil(this._ui[c].selector.outerHeight() / 2)), this._updateSelectors(this.dragging_hsl), b.stopPropagation(), b.preventDefault();
            }
        },
        _updateSelectors: function (b) {
            var c = a.todons.colorwidget.prototype._setElementColor.call(this, this._ui.hs.selector, [
                    b[0],
                    1 - b[1],
                    b[2]
                ], 'background').clr, d = a.todons.colorwidget.clrlib.RGBToHTML([
                    b[2],
                    b[2],
                    b[2]
                ]);
            this._ui.hs.valMask.css(b[2] < 0.5 ? {
                background: '#000000',
                opacity: 1 - b[2] * 2
            } : {
                background: '#ffffff',
                opacity: (b[2] - 0.5) * 2
            }), this._ui.hs.selector.css({
                left: b[0] / 360 * this._ui.hs.eventSource.width(),
                top: b[1] * this._ui.hs.eventSource.height()
            }), this._ui.l.selector.css({
                top: b[2] * this._ui.l.eventSource.height(),
                background: d
            }), a.todons.colorwidget.prototype._setColor.call(this, c);
        },
        widget: function () {
            return this._ui.clrpicker;
        },
        _setDisabled: function (b) {
            a.todons.widgetex.prototype._setDisabled.call(this, b), this._ui.hs.hueGradient.huegradient('option', 'disabled', b), this._ui.clrpicker[b ? 'addClass' : 'removeClass']('ui-disabled'), a.todons.colorwidget.prototype._displayDisabledState.call(this, this._ui.clrpicker);
        },
        _setColor: function (b) {
            a.todons.colorwidget.prototype._setColor.call(this, b) && (this.dragging_hsl = a.todons.colorwidget.clrlib.RGBToHSL(a.todons.colorwidget.clrlib.HTMLToRGB(this.options.color)), this.dragging_hsl[1] = 1 - this.dragging_hsl[1], this._updateSelectors(this.dragging_hsl));
        }
    }), a(document).bind('pagecreate create', function (b) {
        a(a.todons.colorpicker.prototype.options.initSelector, b.target).not(':jqmData(role=\'none\'), :jqmData(role=\'nojs\')').colorpicker();
    });
}(jQuery));
(function (a, b) {
    a.widget('todons.colorpickerbutton', a.todons.colorwidget, {
        options: {
            buttonMarkup: {
                theme: null,
                inline: !0,
                corners: !0,
                shadow: !0
            },
            hideInput: !0,
            closeText: 'Close',
            initSelector: 'input[type=\'color\'], :jqmData(type=\'color\'), :jqmData(role=\'colorpickerbutton\')'
        },
        _htmlProto: {
            source: a('<div><div id=\'colorpickerbutton\'>    <a id=\'colorpickerbutton-button\' href=\'#\' data-role=\'button\' aria-haspopup=\'true\'>        <span id=\'colorpickerbutton-button-contents\'>&#x2587;&#x2587;&#x2587;</span>    </a>    <div id=\'colorpickerbutton-popup-container\' style=\'display: table;\'>        <div id=\'colorpickerbutton-popup-hsvpicker\' data-role=\'hsvpicker\'></div>        <a id=\'colorpickerbutton-popup-close-button\' href=\'#\' data-role=\'button\'>            <span id=\'colorpickerbutton-popup-close-button-text\'></span>        </a>    </div></div></div>'),
            ui: {
                button: '#colorpickerbutton-button',
                buttonContents: '#colorpickerbutton-button-contents',
                popup: '#colorpickerbutton-popup-container',
                hsvpicker: '#colorpickerbutton-popup-hsvpicker',
                closeButton: '#colorpickerbutton-popup-close-button',
                closeButtonText: '#colorpickerbutton-popup-close-button-text'
            }
        },
        _create: function () {
            var b = this;
            this.element.css('display', 'none').after(this._ui.button), this._ui.popup.insertBefore(this.element).popupwindow(), this._ui.hsvpicker.hsvpicker(), a.todons.popupwindow.bindPopupToButton(this._ui.button, this._ui.popup), this._ui.closeButton.bind('vclick', function (a) {
                b._setColor(b._ui.hsvpicker.hsvpicker('option', 'color')), b.close();
            }), this.element.bind('change keyup blur', function () {
                b._setColor(b.element.val());
            });
        },
        _setHideInput: function (b) {
            this.element[b ? 'addClass' : 'removeClass']('ui-colorpickerbutton-input-hidden'), this.element[b ? 'removeClass' : 'addClass']('ui-colorpickerbutton-input'), this.element.attr('data-' + (a.mobile.ns || '') + 'hide-input', b);
        },
        _setColor: function (b) {
            if (a.todons.colorwidget.prototype._setColor.call(this, b)) {
                var c = a.todons.colorwidget.clrlib;
                this._ui.hsvpicker.hsvpicker('option', 'color', this.options.color), a.todons.colorwidget.prototype._setElementColor.call(this, this._ui.buttonContents, c.RGBToHSL(c.HTMLToRGB(this.options.color)), 'color');
            }
        },
        _setButtonMarkup: function (a) {
            this._ui.button.buttonMarkup(a), this.options.buttonMarkup = a, a.inline = !1, this._ui.closeButton.buttonMarkup(a);
        },
        _setCloseText: function (b) {
            this._ui.closeButtonText.text(b), this.options.closeText = b, this.element.attr('data-' + (a.mobile.ns || '') + 'close-text', b);
        },
        _setDisabled: function (b) {
            a.todons.widgetex.prototype._setDisabled.call(this, b), this._ui.popup.popupwindow('option', 'disabled', b), this._ui.button[b ? 'addClass' : 'removeClass']('ui-disabled'), a.todons.colorwidget.prototype._displayDisabledState.call(this, this._ui.button);
        },
        open: function () {
            this._ui.popup.popupwindow('open', this._ui.button.offset().left + this._ui.button.outerWidth() / 2, this._ui.button.offset().top + this._ui.button.outerHeight() / 2);
        },
        _focusButton: function () {
            var a = this;
            setTimeout(function () {
                a._ui.button.focus();
            }, 40);
        },
        close: function () {
            this._focusButton(), this._ui.popup.popupwindow('close');
        }
    }), a(document).bind('pagecreate create', function (b) {
        a(a.todons.colorpickerbutton.prototype.options.initSelector, b.target).not(':jqmData(role=\'none\'), :jqmData(role=\'nojs\')').colorpickerbutton();
    });
}(jQuery));
(function (a, b) {
    a.widget('todons.colortitle', a.todons.colorwidget, {
        options: { initSelector: ':jqmData(role=\'colortitle\')' },
        _htmlProto: {
            source: a('<div><div id=\'colortitle\' class=\'ui-colortitle jquery-mobile-ui-widget\'>    <h1 id=\'colortitle-string\'></h1></div></div>'),
            ui: {
                clrtitle: '#colortitle',
                header: '#colortitle-string'
            }
        },
        _create: function () {
            this.element.css('display', 'none').after(this._ui.clrtitle);
        },
        widget: function () {
            return this._ui.clrtitle;
        },
        _setDisabled: function (b) {
            a.todons.widgetex.prototype._setDisabled.call(this, b), this._ui.clrtitle[b ? 'addClass' : 'removeClass']('ui-disabled');
        },
        _setColor: function (b) {
            a.todons.colorwidget.prototype._setColor.call(this, b) && this._ui.header.text(this.options.color);
        }
    }), a(document).bind('pagecreate create', function (b) {
        a(a.todons.colortitle.prototype.options.initSelector, b.target).not(':jqmData(role=\'none\'), :jqmData(role=\'nojs\')').colortitle();
    });
}(jQuery));
function ensureNS(ns) {
    var nsAr = ns.split('.'), nsSoFar = '';
    for (var Nix in nsAr)
        nsSoFar = nsSoFar + (Nix > 0 ? '.' : '') + nsAr[Nix], eval(nsSoFar + ' = ' + nsSoFar + ' || {};');
}
;
jQuery.easing.jswing = jQuery.easing.swing, jQuery.extend(jQuery.easing, {
    def: 'easeOutQuad',
    swing: function (a, b, c, d, e) {
        return jQuery.easing[jQuery.easing.def](a, b, c, d, e);
    },
    easeInQuad: function (a, b, c, d, e) {
        return d * (b /= e) * b + c;
    },
    easeOutQuad: function (a, b, c, d, e) {
        return -d * (b /= e) * (b - 2) + c;
    },
    easeInOutQuad: function (a, b, c, d, e) {
        return (b /= e / 2) < 1 ? d / 2 * b * b + c : -d / 2 * (--b * (b - 2) - 1) + c;
    },
    easeInCubic: function (a, b, c, d, e) {
        return d * (b /= e) * b * b + c;
    },
    easeOutCubic: function (a, b, c, d, e) {
        return d * ((b = b / e - 1) * b * b + 1) + c;
    },
    easeInOutCubic: function (a, b, c, d, e) {
        return (b /= e / 2) < 1 ? d / 2 * b * b * b + c : d / 2 * ((b -= 2) * b * b + 2) + c;
    },
    easeInQuart: function (a, b, c, d, e) {
        return d * (b /= e) * b * b * b + c;
    },
    easeOutQuart: function (a, b, c, d, e) {
        return -d * ((b = b / e - 1) * b * b * b - 1) + c;
    },
    easeInOutQuart: function (a, b, c, d, e) {
        return (b /= e / 2) < 1 ? d / 2 * b * b * b * b + c : -d / 2 * ((b -= 2) * b * b * b - 2) + c;
    },
    easeInQuint: function (a, b, c, d, e) {
        return d * (b /= e) * b * b * b * b + c;
    },
    easeOutQuint: function (a, b, c, d, e) {
        return d * ((b = b / e - 1) * b * b * b * b + 1) + c;
    },
    easeInOutQuint: function (a, b, c, d, e) {
        return (b /= e / 2) < 1 ? d / 2 * b * b * b * b * b + c : d / 2 * ((b -= 2) * b * b * b * b + 2) + c;
    },
    easeInSine: function (a, b, c, d, e) {
        return -d * Math.cos(b / e * (Math.PI / 2)) + d + c;
    },
    easeOutSine: function (a, b, c, d, e) {
        return d * Math.sin(b / e * (Math.PI / 2)) + c;
    },
    easeInOutSine: function (a, b, c, d, e) {
        return -d / 2 * (Math.cos(Math.PI * b / e) - 1) + c;
    },
    easeInExpo: function (a, b, c, d, e) {
        return b == 0 ? c : d * Math.pow(2, 10 * (b / e - 1)) + c;
    },
    easeOutExpo: function (a, b, c, d, e) {
        return b == e ? c + d : d * (-Math.pow(2, -10 * b / e) + 1) + c;
    },
    easeInOutExpo: function (a, b, c, d, e) {
        return b == 0 ? c : b == e ? c + d : (b /= e / 2) < 1 ? d / 2 * Math.pow(2, 10 * (b - 1)) + c : d / 2 * (-Math.pow(2, -10 * --b) + 2) + c;
    },
    easeInCirc: function (a, b, c, d, e) {
        return -d * (Math.sqrt(1 - (b /= e) * b) - 1) + c;
    },
    easeOutCirc: function (a, b, c, d, e) {
        return d * Math.sqrt(1 - (b = b / e - 1) * b) + c;
    },
    easeInOutCirc: function (a, b, c, d, e) {
        return (b /= e / 2) < 1 ? -d / 2 * (Math.sqrt(1 - b * b) - 1) + c : d / 2 * (Math.sqrt(1 - (b -= 2) * b) + 1) + c;
    },
    easeInElastic: function (a, b, c, d, e) {
        var f = 1.70158, g = 0, h = d;
        if (b == 0)
            return c;
        if ((b /= e) == 1)
            return c + d;
        g || (g = e * 0.3);
        if (h < Math.abs(d)) {
            h = d;
            var f = g / 4;
        } else
            var f = g / (2 * Math.PI) * Math.asin(d / h);
        return -(h * Math.pow(2, 10 * (b -= 1)) * Math.sin((b * e - f) * 2 * Math.PI / g)) + c;
    },
    easeOutElastic: function (a, b, c, d, e) {
        var f = 1.70158, g = 0, h = d;
        if (b == 0)
            return c;
        if ((b /= e) == 1)
            return c + d;
        g || (g = e * 0.3);
        if (h < Math.abs(d)) {
            h = d;
            var f = g / 4;
        } else
            var f = g / (2 * Math.PI) * Math.asin(d / h);
        return h * Math.pow(2, -10 * b) * Math.sin((b * e - f) * 2 * Math.PI / g) + d + c;
    },
    easeInOutElastic: function (a, b, c, d, e) {
        var f = 1.70158, g = 0, h = d;
        if (b == 0)
            return c;
        if ((b /= e / 2) == 2)
            return c + d;
        g || (g = e * 0.3 * 1.5);
        if (h < Math.abs(d)) {
            h = d;
            var f = g / 4;
        } else
            var f = g / (2 * Math.PI) * Math.asin(d / h);
        return b < 1 ? -0.5 * h * Math.pow(2, 10 * (b -= 1)) * Math.sin((b * e - f) * 2 * Math.PI / g) + c : h * Math.pow(2, -10 * (b -= 1)) * Math.sin((b * e - f) * 2 * Math.PI / g) * 0.5 + d + c;
    },
    easeInBack: function (a, b, c, d, e, f) {
        return f == undefined && (f = 1.70158), d * (b /= e) * b * ((f + 1) * b - f) + c;
    },
    easeOutBack: function (a, b, c, d, e, f) {
        return f == undefined && (f = 1.70158), d * ((b = b / e - 1) * b * ((f + 1) * b + f) + 1) + c;
    },
    easeInOutBack: function (a, b, c, d, e, f) {
        return f == undefined && (f = 1.70158), (b /= e / 2) < 1 ? d / 2 * b * b * (((f *= 1.525) + 1) * b - f) + c : d / 2 * ((b -= 2) * b * (((f *= 1.525) + 1) * b + f) + 2) + c;
    },
    easeInBounce: function (a, b, c, d, e) {
        return d - jQuery.easing.easeOutBounce(a, e - b, 0, d, e) + c;
    },
    easeOutBounce: function (a, b, c, d, e) {
        return (b /= e) < 1 / 2.75 ? d * 7.5625 * b * b + c : b < 2 / 2.75 ? d * (7.5625 * (b -= 1.5 / 2.75) * b + 0.75) + c : b < 2.5 / 2.75 ? d * (7.5625 * (b -= 2.25 / 2.75) * b + 0.9375) + c : d * (7.5625 * (b -= 2.625 / 2.75) * b + 0.984375) + c;
    },
    easeInOutBounce: function (a, b, c, d, e) {
        return b < e / 2 ? jQuery.easing.easeInBounce(a, b * 2, 0, d, e) * 0.5 + c : jQuery.easing.easeOutBounce(a, b * 2 - e, 0, d, e) * 0.5 + d * 0.5 + c;
    }
}), function (a, b) {
    a(document).bind('pagecreate create', function (b) {
        a(':jqmData(role=\'label\')', b.target).not(':jqmData(role=\'none\'), :jqmData(role=\'nojs\')').each(function () {
            a(this).addClass('jquery-mobile-ui-label').html(a('<span>', { 'class': 'jquery-mobile-ui-label-text' }).text(a(this).text()));
        });
    });
}(jQuery), function (a, b) {
    var c = ':jqmData(role=\'page\'):jqmData(fit-page-to-window=\'true\'):visible';
    a(document).bind('pageshow', function (b) {
        a(b.target).is(c) && a.mobile.todons.fillPageWithContentArea(a(b.target));
    }), a(window).resize(function () {
        a(c)[0] !== b && a.mobile.todons.fillPageWithContentArea(a(c));
    });
}(jQuery), function (a, b, c, d) {
    function e(a, b, c) {
        var d = 'translate3d(' + b + ',' + c + ', 0px)';
        a.css({
            '-moz-transform': d,
            '-webkit-transform': d,
            transform: d
        });
    }
    function f(b) {
        this.options = a.extend({}, b), this.easing = 'easeOutQuad', this.reset();
    }
    function h() {
        return new Date().getTime();
    }
    jQuery.widget('mobile.scrollview', jQuery.mobile.widget, {
        options: {
            fps: 60,
            direction: null,
            scrollDuration: 2000,
            overshootDuration: 250,
            snapbackDuration: 500,
            moveThreshold: 10,
            moveIntervalThreshold: 150,
            scrollMethod: 'translate',
            startEventName: 'scrollstart',
            updateEventName: 'scrollupdate',
            stopEventName: 'scrollstop',
            eventType: a.support.touch ? 'touch' : 'mouse',
            showScrollBars: !0,
            pagingEnabled: !1,
            delayedClickSelector: 'a,input,textarea,select,button,.ui-btn',
            delayedClickEnabled: !1
        },
        _makePositioned: function (a) {
            a.css('position') == 'static' && a.css('position', 'relative');
        },
        _create: function () {
            this._$clip = a(this.element).addClass('ui-scrollview-clip');
            var b = this._$clip.children();
            b.length > 1 && (b = this._$clip.wrapInner('<div></div>').children()), this._$view = b.addClass('ui-scrollview-view'), this._$clip.css('overflow', this.options.scrollMethod === 'scroll' ? 'scroll' : 'hidden'), this._makePositioned(this._$clip), this._$view.css('overflow', 'hidden'), this.options.showScrollBars = this.options.scrollMethod === 'scroll' ? !1 : this.options.showScrollBars, this._makePositioned(this._$view), this._$view.css({
                left: 0,
                top: 0
            }), this._sx = 0, this._sy = 0;
            var c = this.options.direction;
            this._hTracker = c !== 'y' ? new f(this.options) : null, this._vTracker = c !== 'x' ? new f(this.options) : null, this._timerInterval = 1000 / this.options.fps, this._timerID = 0;
            var d = this;
            this._timerCB = function () {
                d._handleMomentumScroll();
            }, this._addBehaviors();
        },
        _startMScroll: function (a, b) {
            this._stopMScroll(), this._showScrollBars();
            var c = !1, d = this.options.scrollDuration;
            this._$clip.trigger(this.options.startEventName);
            var e = this._hTracker;
            if (e) {
                var f = this._$clip.width(), g = this._$view.width();
                e.start(this._sx, a, d, g > f ? -(g - f) : 0, 0), c = !e.done();
            }
            var h = this._vTracker;
            if (h) {
                var f = this._$clip.height(), g = this._$view.height();
                h.start(this._sy, b, d, g > f ? -(g - f) : 0, 0), c = c || !h.done();
            }
            c ? this._timerID = setTimeout(this._timerCB, this._timerInterval) : this._stopMScroll();
        },
        _stopMScroll: function () {
            this._timerID && (this._$clip.trigger(this.options.stopEventName), clearTimeout(this._timerID)), this._timerID = 0, this._vTracker && this._vTracker.reset(), this._hTracker && this._hTracker.reset(), this._hideScrollBars();
        },
        _handleMomentumScroll: function () {
            var a = !1, b = this._$view, c = 0, d = 0, e = this._vTracker;
            e && (e.update(), d = e.getPosition(), a = !e.done());
            var f = this._hTracker;
            f && (f.update(), c = f.getPosition(), a = a || !f.done()), this._setScrollPosition(c, d), this._$clip.trigger(this.options.updateEventName, [{
                    x: c,
                    y: d
                }]), a ? this._timerID = setTimeout(this._timerCB, this._timerInterval) : this._stopMScroll();
        },
        _setScrollPosition: function (a, b) {
            this._sx = a, this._sy = b;
            var c = this._$view, d = this.options.scrollMethod;
            switch (d) {
            case 'translate':
                e(c, a + 'px', b + 'px');
                break;
            case 'position':
                c.css({
                    left: a + 'px',
                    top: b + 'px'
                });
                break;
            case 'scroll':
                var f = this._$clip[0];
                f.scrollLeft = -a, f.scrollTop = -b;
            }
            var g = this._$vScrollBar, h = this._$hScrollBar;
            if (g) {
                var i = g.find('.ui-scrollbar-thumb');
                d === 'translate' ? e(i, '0px', -b / c.height() * i.parent().height() + 'px') : i.css('top', -b / c.height() * 100 + '%');
            }
            if (h) {
                var i = h.find('.ui-scrollbar-thumb');
                d === 'translate' ? e(i, -a / c.width() * i.parent().width() + 'px', '0px') : i.css('left', -a / c.width() * 100 + '%');
            }
        },
        scrollTo: function (b, c, d) {
            this._stopMScroll();
            if (!d)
                return this._setScrollPosition(b, c);
            b = -b, c = -c;
            var e = this, f = h(), g = a.easing.easeOutQuad, i = this._sx, j = this._sy, k = b - i, l = c - j, m = function () {
                    var a = h() - f;
                    if (a >= d)
                        e._timerID = 0, e._setScrollPosition(b, c);
                    else {
                        var n = g(a / d, a, 0, 1, d);
                        e._setScrollPosition(i + k * n, j + l * n), e._timerID = setTimeout(m, e._timerInterval);
                    }
                };
            this._timerID = setTimeout(m, this._timerInterval);
        },
        getScrollPosition: function () {
            return {
                x: -this._sx,
                y: -this._sy
            };
        },
        _getScrollHierarchy: function () {
            var b = [];
            return this._$clip.parents('.ui-scrollview-clip').each(function () {
                var c = a(this).jqmData('scrollview');
                c && b.unshift(c);
            }), b;
        },
        _getAncestorByDirection: function (a) {
            var b = this._getScrollHierarchy(), c = b.length;
            while (0 < c--) {
                var d = b[c], e = d.options.direction;
                if (!e || e == a)
                    return d;
            }
            return null;
        },
        _handleDragStart: function (b, c, d) {
            a.each(this._getScrollHierarchy(), function (a, b) {
                b._stopMScroll();
            }), this._stopMScroll();
            var e = this._$clip, f = this._$view;
            this.options.delayedClickEnabled && (this._$clickEle = a(b.target).closest(this.options.delayedClickSelector)), this._lastX = c, this._lastY = d, this._doSnapBackX = !1, this._doSnapBackY = !1, this._speedX = 0, this._speedY = 0, this._directionLock = '', this._didDrag = !1;
            if (this._hTracker) {
                var g = parseInt(e.css('width'), 10), h = parseInt(f.css('width'), 10);
                this._maxX = g - h, this._maxX > 0 && (this._maxX = 0), this._$hScrollBar && this._$hScrollBar.find('.ui-scrollbar-thumb').css('width', g >= h ? '100%' : Math.floor(g / h * 100) + '%');
            }
            if (this._vTracker) {
                var i = parseInt(e.css('height'), 10), j = parseInt(f.css('height'), 10);
                this._maxY = i - j, this._maxY > 0 && (this._maxY = 0), this._$vScrollBar && this._$vScrollBar.find('.ui-scrollbar-thumb').css('height', i >= j ? '100%' : Math.floor(i / j * 100) + '%');
            }
            var k = this.options.direction;
            this._pageDelta = 0, this._pageSize = 0, this._pagePos = 0, this.options.pagingEnabled && (k === 'x' || k === 'y') && (this._pageSize = k === 'x' ? g : i, this._pagePos = k === 'x' ? this._sx : this._sy, this._pagePos -= this._pagePos % this._pageSize), this._lastMove = 0, this._enableTracking();
            if (this.options.eventType == 'mouse' || this.options.delayedClickEnabled) {
                var l = a(b.target).is('a, :input'), m = a(b.target).parents('a, :input').length > 0, n = !l && !m;
                n && b.preventDefault();
            }
            b.stopPropagation();
        },
        _propagateDragMove: function (a, b, c, d, e) {
            this._hideScrollBars(), this._disableTracking(), a._handleDragStart(b, c, d), a._directionLock = e, a._didDrag = this._didDrag;
        },
        _handleDragMove: function (a, b, c) {
            this._lastMove = h();
            var d = this._$view, e = b - this._lastX, f = c - this._lastY, g = this.options.direction;
            if (!this._directionLock) {
                var i = Math.abs(e), j = Math.abs(f), k = this.options.moveThreshold;
                if (i < k && j < k)
                    return !1;
                var l = null, m = 0;
                i < j && i / j < 0.5 ? l = 'y' : i > j && j / i < 0.5 && (l = 'x');
                if (g && l && g != l) {
                    var n = this._getAncestorByDirection(l);
                    if (n)
                        return this._propagateDragMove(n, a, b, c, l), !1;
                }
                this._directionLock = g ? g : l ? l : 'none';
            }
            var o = this._sx, p = this._sy;
            if (this._directionLock !== 'y' && this._hTracker) {
                var i = this._sx;
                this._speedX = e, o = i + e, this._doSnapBackX = !1;
                if (o > 0 || o < this._maxX) {
                    if (this._directionLock === 'x') {
                        var n = this._getAncestorByDirection('x');
                        if (n)
                            return this._setScrollPosition(o > 0 ? 0 : this._maxX, p), this._propagateDragMove(n, a, b, c, l), !1;
                    }
                    o = i + e / 2, this._doSnapBackX = !0;
                }
            }
            if (this._directionLock !== 'x' && this._vTracker) {
                var j = this._sy;
                this._speedY = f, p = j + f, this._doSnapBackY = !1;
                if (p > 0 || p < this._maxY) {
                    if (this._directionLock === 'y') {
                        var n = this._getAncestorByDirection('y');
                        if (n)
                            return this._setScrollPosition(o, p > 0 ? 0 : this._maxY), this._propagateDragMove(n, a, b, c, l), !1;
                    }
                    p = j + f / 2, this._doSnapBackY = !0;
                }
            }
            if (this.options.pagingEnabled && (g === 'x' || g === 'y'))
                if (this._doSnapBackX || this._doSnapBackY)
                    this._pageDelta = 0;
                else {
                    var q = this._pagePos, r = g === 'x' ? o : p, s = g === 'x' ? e : f;
                    this._pageDelta = q > r && s < 0 ? this._pageSize : q < r && s > 0 ? -this._pageSize : 0;
                }
            return this._didDrag = !0, this._lastX = b, this._lastY = c, this._setScrollPosition(o, p), this._showScrollBars(), !1;
        },
        _handleDragStop: function (a) {
            var b = this._lastMove, c = h(), e = b && c - b <= this.options.moveIntervalThreshold, f = this._hTracker && this._speedX && e ? this._speedX : this._doSnapBackX ? 1 : 0, g = this._vTracker && this._speedY && e ? this._speedY : this._doSnapBackY ? 1 : 0, i = this.options.direction;
            if (this.options.pagingEnabled && (i === 'x' || i === 'y') && !this._doSnapBackX && !this._doSnapBackY) {
                var j = this._sx, k = this._sy;
                i === 'x' ? j = -this._pagePos + this._pageDelta : k = -this._pagePos + this._pageDelta, this.scrollTo(j, k, this.options.snapbackDuration);
            } else
                f || g ? this._startMScroll(f, g) : this._hideScrollBars();
            return this._disableTracking(), !this._didDrag && this.options.delayedClickEnabled && this._$clickEle.length && this._$clickEle.trigger('mousedown').trigger('mouseup').trigger('click'), this._didDrag ? !1 : d;
        },
        _enableTracking: function () {
            a(c).bind(this._dragMoveEvt, this._dragMoveCB), a(c).bind(this._dragStopEvt, this._dragStopCB);
        },
        _disableTracking: function () {
            a(c).unbind(this._dragMoveEvt, this._dragMoveCB), a(c).unbind(this._dragStopEvt, this._dragStopCB);
        },
        _showScrollBars: function () {
            var a = 'ui-scrollbar-visible';
            this._$vScrollBar && this._$vScrollBar.addClass(a), this._$hScrollBar && this._$hScrollBar.addClass(a);
        },
        _hideScrollBars: function () {
            var a = 'ui-scrollbar-visible';
            this._$vScrollBar && this._$vScrollBar.removeClass(a), this._$hScrollBar && this._$hScrollBar.removeClass(a);
        },
        _addBehaviors: function () {
            var a = this;
            this.options.eventType === 'mouse' ? (this._dragStartEvt = 'mousedown', this._dragStartCB = function (b) {
                return a._handleDragStart(b, b.clientX, b.clientY);
            }, this._dragMoveEvt = 'mousemove', this._dragMoveCB = function (b) {
                return a._handleDragMove(b, b.clientX, b.clientY);
            }, this._dragStopEvt = 'mouseup', this._dragStopCB = function (b) {
                return a._handleDragStop(b);
            }) : (this._dragStartEvt = 'touchstart', this._dragStartCB = function (b) {
                var c = b.originalEvent.targetTouches[0];
                return a._handleDragStart(b, c.pageX, c.pageY);
            }, this._dragMoveEvt = 'touchmove', this._dragMoveCB = function (b) {
                var c = b.originalEvent.targetTouches[0];
                return a._handleDragMove(b, c.pageX, c.pageY);
            }, this._dragStopEvt = 'touchend', this._dragStopCB = function (b) {
                return a._handleDragStop(b);
            }), this._$view.bind(this._dragStartEvt, this._dragStartCB);
            if (this.options.showScrollBars) {
                var b = this._$clip, c = '<div class="ui-scrollbar ui-scrollbar-', d = '"><div class="ui-scrollbar-track"><div class="ui-scrollbar-thumb"></div></div></div>';
                this._vTracker && (b.append(c + 'y' + d), this._$vScrollBar = b.children('.ui-scrollbar-y')), this._hTracker && (b.append(c + 'x' + d), this._$hScrollBar = b.children('.ui-scrollbar-x'));
            }
        }
    });
    var g = {
        scrolling: 0,
        overshot: 1,
        snapback: 2,
        done: 3
    };
    a.extend(f.prototype, {
        start: function (a, b, c, d, e) {
            this.state = b != 0 ? a < d || a > e ? g.snapback : g.scrolling : g.done, this.pos = a, this.speed = b, this.duration = this.state == g.snapback ? this.options.snapbackDuration : c, this.minPos = d, this.maxPos = e, this.fromPos = this.state == g.snapback ? this.pos : 0, this.toPos = this.state == g.snapback ? this.pos < this.minPos ? this.minPos : this.maxPos : 0, this.startTime = h();
        },
        reset: function () {
            this.state = g.done, this.pos = 0, this.speed = 0, this.minPos = 0, this.maxPos = 0, this.duration = 0;
        },
        update: function () {
            var b = this.state;
            if (b == g.done)
                return this.pos;
            var c = this.duration, d = h() - this.startTime;
            d = d > c ? c : d;
            if (b == g.scrolling || b == g.overshot) {
                var e = this.speed * (1 - a.easing[this.easing](d / c, d, 0, 1, c)), f = this.pos + e, i = b == g.scrolling && (f < this.minPos || f > this.maxPos);
                i && (f = f < this.minPos ? this.minPos : this.maxPos), this.pos = f, b == g.overshot ? d >= c && (this.state = g.snapback, this.fromPos = this.pos, this.toPos = f < this.minPos ? this.minPos : this.maxPos, this.duration = this.options.snapbackDuration, this.startTime = h(), d = 0) : b == g.scrolling && (i ? (this.state = g.overshot, this.speed = e / 2, this.duration = this.options.overshootDuration, this.startTime = h()) : d >= c && (this.state = g.done));
            } else
                b == g.snapback && (d >= c ? (this.pos = this.toPos, this.state = g.done) : this.pos = this.fromPos + (this.toPos - this.fromPos) * a.easing[this.easing](d / c, d, 0, 1, c));
            return this.pos;
        },
        done: function () {
            return this.state == g.done;
        },
        getPosition: function () {
            return this.pos;
        }
    }), jQuery.widget('mobile.scrolllistview', jQuery.mobile.scrollview, {
        options: { direction: 'y' },
        _create: function () {
            a.mobile.scrollview.prototype._create.call(this), this._$dividers = this._$view.find(':jqmData(role=\'list-divider\')'), this._lastDivider = null;
        },
        _setScrollPosition: function (b, c) {
            a.mobile.scrollview.prototype._setScrollPosition.call(this, b, c), c = -c;
            var d = this._$dividers, f = d.length, g = null, h = 0, i = null;
            for (var j = 0; j < f; j++) {
                i = d.get(j);
                var k = i.offsetTop;
                if (c >= k)
                    g = i, h = k;
                else if (g)
                    break;
            }
            if (g) {
                var l = g.offsetHeight, m = g != i ? i.offsetTop : this._$view.get(0).offsetHeight;
                c + l >= m ? c = m - l - h : c -= h;
                var n = this._lastDivider;
                n && g != n && e(a(n), 0, 0), e(a(g), 0, c + 'px'), this._lastDivider = g;
            }
        }
    }), a(c).bind('pagecreate create', function (b) {
        $page = a(b.target), $page.find(':jqmData(scroll):not(.ui-scrollview-clip)').each(function () {
            var b = a(this);
            if (b.hasClass('ui-scrolllistview'))
                b.scrolllistview();
            else {
                var c = b.jqmData('scroll') + '', d = c && c.search(/^[xy]p$/) != -1, e = c && c.search(/^[xy]/) != -1 ? c.charAt(0) : null, f = {};
                e && (f.direction = e), d && (f.pagingEnabled = !0);
                var g = b.jqmData('scroll-method');
                g && (f.scrollMethod = g), b.scrollview(f);
            }
        });
    });
}(jQuery, window, document), ensureNS('jQuery.mobile.todons'), function () {
    jQuery.extend(jQuery.mobile.todons, {
        Point: function (a, b) {
            var c = isNaN(a) ? 0 : a, d = isNaN(b) ? 0 : b;
            this.add = function (a) {
                return this.setX(c + a.x()), this.setY(d + a.y()), this;
            }, this.subtract = function (a) {
                return this.setX(c - a.x()), this.setY(d - a.y()), this;
            }, this.multiply = function (a) {
                return this.setX(Math.round(c * a.x())), this.setY(Math.round(d * a.y())), this;
            }, this.divide = function (a) {
                return this.setX(Math.round(c / a.x())), this.setY(Math.round(d / a.y())), this;
            }, this.isNull = function () {
                return c === 0 && d === 0;
            }, this.x = function () {
                return c;
            }, this.setX = function (a) {
                isNaN(a) ? c = 0 : c = a;
            }, this.y = function () {
                return d;
            }, this.setY = function (a) {
                isNaN(a) ? d = 0 : d = a;
            }, this.setNewPoint = function (a) {
                this.setX(a.x()), this.setY(a.y());
            }, this.isEqualTo = function (a) {
                return c === a.x() && d === a.y();
            };
        },
        Rect: function (a, b, c, d) {
            var e = a, f = b, g = e + c, h = f + d;
            this.setRect = function (a, b, c, d) {
                this.setLeft(a), this.setRight(b), this.setTop(c), this.setBottom(d);
            }, this.right = function () {
                return g;
            }, this.setRight = function (a) {
                g = a;
            }, this.top = function () {
                return f;
            }, this.setTop = function (a) {
                f = a;
            }, this.bottom = function () {
                return h;
            }, this.setBottom = function (a) {
                h = a;
            }, this.left = function () {
                return e;
            }, this.setLeft = function (a) {
                e = a;
            }, this.moveTop = function (a) {
                var b = this.height();
                f = a, h = f + b;
            }, this.isNull = function () {
                return g === e && h === f;
            }, this.isValid = function () {
                return e <= g && f <= h;
            }, this.isEmpty = function () {
                return e > g || f > h;
            }, this.contains = function (a, b) {
                return this.containsX(a) && this.containsY(b) ? !0 : !1;
            }, this.width = function () {
                return g - e;
            }, this.height = function () {
                return h - f;
            }, this.containsX = function (a) {
                var b = e, c = g;
                return g < e && (b = g, c = e), b > a || c < a ? !1 : !0;
            }, this.containsY = function (a) {
                var b = f, c = h;
                return h < f && (b = h, c = f), b > a || c < a ? !1 : !0;
            };
        },
        disableSelection: function (a) {
            return $(a).each(function () {
                jQuery(a).css('-webkit-user-select', 'none');
            });
        },
        enableSelection: function (a, b) {
            return $(a).each(function () {
                val = b == 'text' ? val = 'text' : val = 'auto', jQuery(a).css('-webkit-user-select', val);
            });
        },
        fillPageWithContentArea: function (a) {
            var b = $(a), c = b.children('.ui-content:first'), d = b.children('.ui-header').outerHeight();
            d = d ? d : 0;
            var e = b.children('.ui-footer').outerHeight();
            e = e ? e : 0;
            var f = parseFloat(c.css('padding-top')), g = parseFloat(c.css('padding-bottom')), h = window.innerHeight, i = h - (d + e) - (f + g);
            c.height(i);
        },
        documentRelativeCoordsFromEvent: function (a) {
            var b = a ? a : window.event, c = {
                    x: b.clientX,
                    y: b.clientY
                }, d = {
                    x: b.pageX,
                    y: b.pageY
                }, e = 0, f = 0;
            b.type.match(/^touch/) && (d = {
                x: b.originalEvent.targetTouches[0].pageX,
                y: b.originalEvent.targetTouches[0].pageY
            }, c = {
                x: b.originalEvent.targetTouches[0].clientX,
                y: b.originalEvent.targetTouches[0].clientY
            });
            if (d.x || d.y)
                e = d.x, f = d.y;
            else if (c.x || c.y)
                e = c.x + document.body.scrollLeft + document.documentElement.scrollLeft, f = c.y + document.body.scrollTop + document.documentElement.scrollTop;
            return {
                x: e,
                y: f
            };
        },
        targetRelativeCoordsFromEvent: function (a) {
            var b = {
                x: a.offsetX,
                y: a.offsetY
            };
            if (b.x === undefined || isNaN(b.x) || b.y === undefined || isNaN(b.y)) {
                var c = $(a.target).offset();
                b = $.mobile.todons.documentRelativeCoordsFromEvent(a), b.x -= c.left, b.y -= c.top;
            }
            return b;
        }
    });
}(), function (a, b) {
    a.widget('todons.jlayoutadaptor', a.mobile.widget, {
        options: {
            hgap: null,
            vgap: null,
            scrollable: !0,
            showScrollBars: !0,
            direction: null
        },
        _create: function () {
            var b = this, c = this.element.data('layout-options'), d = a(this.element).closest(':jqmData(role="page")');
            a.extend(this.options, c), d && !d.is(':visible') ? (this.element.hide(), d.bind('pageshow', function () {
                b.refresh();
            })) : this.refresh();
        },
        refresh: function () {
            var b, c = a.extend(this.options, this.fixed);
            c.scrollable ? (this.element.children().is('.ui-scrollview-view') ? c.showScrollBars ? this.element.find('.ui-scrollbar').show() : this.element.find('.ui-scrollbar').hide() : this.element.scrollview({
                direction: c.direction,
                showScrollBars: c.showScrollBars
            }), b = this.element.find('.ui-scrollview-view')) : b = this.element, b.layout(c), this.element.show();
            if (c.scrollable) {
                var d = b.children().last(), e, f = this.element.find('.ui-scrollview-view');
                c.direction === 'x' ? (e = d.position().left + d.outerWidth(!0), f.width(e), this.element.height(f.height())) : c.direction === 'y' && (e = d.position().top + d.outerHeight(!0), f.height(e), this.element.width(f.width()));
            }
        }
    });
}(jQuery);
function range(a, b, c) {
    var d = [], e, f, g, h = c || 1, i = !1;
    !isNaN(a) && !isNaN(b) ? (e = a, f = b) : isNaN(a) && isNaN(b) ? (i = !0, e = a.charCodeAt(0), f = b.charCodeAt(0)) : (e = isNaN(a) ? 0 : a, f = isNaN(b) ? 0 : b), g = e > f ? !1 : !0;
    if (g)
        while (e <= f)
            d.push(i ? String.fromCharCode(e) : e), e += h;
    else
        while (e >= f)
            d.push(i ? String.fromCharCode(e) : e), e -= h;
    return d;
}
(function (a, b, c) {
    a.widget('todons.datetimepicker', a.todons.widgetex, {
        options: {
            showDate: !0,
            showTime: !0,
            header: 'Set time',
            timeSeparator: ':',
            months: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ],
            am: 'AM',
            pm: 'PM',
            twentyfourHours: !1,
            date: null,
            animationDuration: 500,
            initSelector: 'input[type=\'date\'], :jqmData(type=\'date\'), :jqmData(role=\'datetimepicker\')'
        },
        _initDateTime: function (a) {
            var b = Date.parse(a), c = isNaN(b) ? new Date() : new Date(b);
            this.data.year = c.getFullYear(), this.data.month = c.getMonth(), this.data.day = c.getDate(), this.data.hours = c.getHours(), this.data.minutes = c.getMinutes(), this.data.pm = this.data.hours > 11, this.data.hours == 0 && this.options.twentyfourHours == 0 && (this.data.hours = 12);
        },
        _initDate: function (a) {
            if (!this.options.showDate)
                a.date.main.remove();
            else {
                var b = {
                    0: [
                        'year',
                        this.data.year
                    ],
                    1: [
                        'month',
                        this.options.months[this.data.month]
                    ],
                    2: [
                        'day',
                        this.data.day
                    ]
                };
                for (var c in b)
                    a.date[b[c][0]].text(b[c][1]);
            }
        },
        _initTime: function (a) {
            var b = {
                0: [
                    'hours',
                    this._makeTwoDigitValue(this._clampHours(this.data.hours))
                ],
                1: [
                    'separator',
                    this.options.timeSeparator
                ],
                2: [
                    'minutes',
                    this._makeTwoDigitValue(this.data.minutes)
                ]
            };
            for (var c in b)
                a.time[b[c][0]].text(b[c][1]);
        },
        _initDateTimeDivs: function (a) {
            !this.options.showDate && !this.options.showTime && (this.options.showDate = !0), this.options.showDate && this.options.showTime && (a.main.attr('class', 'ui-grid-a'), this.options.twentyfourHours || a.main.attr('class', 'ui-grid-b')), this._initDate(a), this._initTime(a), a.ampm.text(this._parseAmPmValue(this.data.pm)), a.ampmContainer[this.options.twentyfourHours ? 'hide' : 'show']();
        },
        _makeTwoDigitValue: function (a) {
            return (a < 10 ? '0' : '') + a.toString(10);
        },
        _parseDayHoursMinutes: function (a) {
            return parseInt(a.substring(0, 1) === '0' ? a.substring(1) : a);
        },
        _parseAmPmValue: function (a) {
            return a ? this.options.pm : this.options.am;
        },
        _clampHours: function (a) {
            return this.options.twentyfourHours ? a : (a + 11) % 12 + 1;
        },
        _showDataSelector: function (b, d, e) {
            var f = this, g = d.attr('class'), h = c;
            if (g.search('year') > 0) {
                var i = range(1900, 2100);
                h = f._populateSelector(b, d, 'year', i, parseInt, null, f.data, 'year', e);
            } else if (g.search('month') > 0)
                h = f._populateSelector(b, d, 'month', f.options.months, function (a) {
                    var b = 0;
                    for (; f.options.months[b] != a; b++);
                    return b;
                }, function (a) {
                    return f.options.months[a];
                }, f.data, 'month', e);
            else if (g.search('day') > 0) {
                var j = new Date(f.data.year, f.data.month + 1, 0).getDate();
                h = f._populateSelector(b, d, 'day', range(1, j), this._parseDayHoursMinutes, null, f.data, 'day', e);
            } else if (g.search('hours') > 0) {
                var i = range(this.options.twentyfourHours ? 0 : 1, this.options.twentyfourHours ? 24 : 12);
                for (var k in i)
                    i[k] = this._makeTwoDigitValue(i[k]);
                h = f._populateSelector(b, d, 'hours', i, this._parseDayHoursMinutes, function (a) {
                    return f._makeTwoDigitValue(f._clampHours(a));
                }, f.data, 'hours', e);
            } else if (!(g.search('separator') > 0))
                if (g.search('minutes') > 0) {
                    var i = range(0, 59);
                    for (var k in i)
                        i[k] = this._makeTwoDigitValue(i[k]);
                    h = f._populateSelector(b, d, 'minutes', i, this._parseDayHoursMinutes, this._makeTwoDigitValue, f.data, 'minutes', e);
                } else if (g.search('ampm') > 0) {
                    var i = [
                        this.options.am,
                        this.options.pm
                    ];
                    h = f._populateSelector(b, d, 'ampm', i, function (a) {
                        return a !== f.options.am;
                    }, function (a) {
                        return f.options[a ? 'pm' : 'am'];
                    }, f.data, 'pm', e);
                }
            if (h !== c) {
                var l = 0, m = 0, n = 0;
                b.slideDown(f.options.animationDuration), f.state.selectorOut = !0, e.triangle.triangle('option', 'offset', d.offset().left + d.width() / 2 - e.triangle.offset().left), selectorWidth = b.find('.container').outerWidth(), b.find('.item').each(function (b) {
                    var c = a(this).outerWidth(!0);
                    l += c, b < h.currentIndex && (m += c);
                });
                if (l < selectorWidth) {
                    var o = (selectorWidth - l) / 2;
                    b.find('.item:first').before(a('<div/>').css('float', 'left').width(o).height(1)), b.find('.item:last').after(a('<div/>').css('float', 'left').width(o).height(1)), l = selectorWidth;
                } else
                    n = (selectorWidth - a(b.find('.item')[h.currentIndex]).outerWidth(!0)) / 2 - m, n = Math.min(0, Math.max(selectorWidth - l, n));
                b.find('.view').width(l), h.scrollable.container.scrollview('scrollTo', n, 0);
            }
        },
        _hideDataSelector: function (a) {
            var b = this;
            this.state.selectorOut && (a.slideUp(this.options.animationDuration, function () {
                b._ui.scrollview !== c && (b._ui.scrollview.remove(), b._ui.scrollview = c);
            }), this.state.selectorOut = !1);
        },
        _createScrollableView: function (a) {
            var b = a.clone(), c = this, d = b.find('#datetimepicker-selector-view').removeAttr('id');
            return b.scrollview({ direction: 'x' }).bind('vclick', function (a) {
                c.panning && (a.preventDefault(), a.stopPropagation());
            }).bind('scrollstart', function (a) {
                c.panning = !0;
            }).bind('scrollstop', function (a) {
                c.panning = !1;
            }), {
                container: b,
                view: d
            };
        },
        _createSelectorItem: function (b, c) {
            var d = b.attr('data-' + (a.mobile.ns || '') + 'selector');
            return b.removeAttr('data-' + (a.mobile.ns || '') + 'selector').removeAttr('id').addClass(c), {
                container: b,
                link: b.find('a'),
                selector: d
            };
        },
        _updateDate: function (a, b, c, d) {
            if (b === 'month') {
                var e = [
                        31,
                        new Date(this.data.year, 1, 29).getDate() === 29 ? 29 : 28,
                        31,
                        30,
                        31,
                        30,
                        31,
                        31,
                        30,
                        31,
                        30,
                        31
                    ], f = Math.min(this.data.day, e[c]);
                f != this.data.day && (this.data.day = f, this._ui.date.day.text(f));
            } else
                b === 'hours' && this.options.twentyfourHours && (this.data.pm = c > 11, this._ui.ampm.text(this._parseAmPmValue(this.data.pm)));
            this.data[b] = c, a.text(d);
        },
        _setTwentyfourHours: function (b) {
            this.options.twentyfourHours = b, this.element.attr('data-' + (a.mobile.ns || '') + 'twentyfour-hours', b), this._setDate(this.options.date);
        },
        _setDate: function (a) {
            this._initDateTime(a), this._initDateTimeDivs(this._ui), this.options.date = this.getValue(), this._setValue(this.options.date);
        },
        _populateSelector: function (b, d, e, f, g, h, i, j, k) {
            var l = this, m = this, n = m._createScrollableView(k.selectorProto), o = 0, p = h !== null ? h(i[j]) : i[j], q = 0;
            for (; q < f.length; q++) {
                var r = m._createSelectorItem(k.itemProto.clone(), e);
                r.link.bind('vclick', function (c) {
                    if (!l.panning) {
                        var e = a(this).text();
                        l._updateDate(d, j, g(e), e), n.view.find(r.selector).removeClass('current'), a(this).toggleClass('current'), m._hideDataSelector(b), m.options.date = m.getValue(), l._setValue(m.options.date);
                    }
                }).text(f[q]), f[q] === p && (r.link.addClass('current'), o = q), n.view.append(r.container);
            }
            return this._ui.scrollview !== c && this._ui.scrollview.remove(), b.append(n.container), this._ui.scrollview = n.container, {
                scrollable: n,
                currentIndex: o
            };
        },
        _htmlProto: {
            source: a('<div><div id=\'datetimepicker\' class=\'ui-datetimepicker\'>    <div class=\'jquery-mobile-ui-widget datetimepicker-inner-container\'>        <div id=\'datetimepicker-header\' class=\'datetimepicker-header\'></div>        <div id=\'datetimepicker-main\' class=\'datetimepicker-main\'>            <div id=\'datetimepicker-date\' class=\'date ui-grid-b\'>                <span id=\'datetimepicker-date-year\' class=\'data year\'></span>                <span id=\'datetimepicker-date-month\' class=\'data month\'></span>                <span id=\'datetimepicker-date-day\' class=\'data day\'></span>            </div>            <div id=\'datetimepicker-time\' class=\'time ui-grid-b\'>                <span id=\'datetimepicker-time-hours\' class=\'data hours\'></span>                <span id=\'datetimepicker-time-separator\' class=\'data separator\'></span>                <span id=\'datetimepicker-time-minutes\' class=\'data minutes\'></span>            </div>            <div id=\'datetimepicker-ampm\' class=\'ampm\'>                <span id=\'datetimepicker-ampm-span\' class=\'data ampm\'></span>            </div>        </div>        <div id=\'datetimepicker-selector\' class=\'selector\'>            <div id=\'datetimepicker-selector-triangle\' class=\'selector-triangle\'></div>            <div id=\'datetimepicker-selector-container\' class=\'container container-years\' data-scroll=\'x\'>                <div id=\'datetimepicker-selector-view\' class=\'view\'>                    <div id=\'datetimepicker-item\' class=\'item\' data-selector=\'.item a\'>                        <a href=\'#\'></a>                    </div>                </div>            </div>        </div>    </div></div></div>'),
            ui: {
                container: '#datetimepicker',
                selector: '#datetimepicker-selector',
                triangle: '#datetimepicker-selector-triangle',
                selectorProto: '#datetimepicker-selector-container',
                itemProto: '#datetimepicker-item',
                header: '#datetimepicker-header',
                main: '#datetimepicker-main',
                date: {
                    main: '#datetimepicker-date',
                    year: '#datetimepicker-date-year',
                    month: '#datetimepicker-date-month',
                    day: '#datetimepicker-date-day'
                },
                time: {
                    main: '#datetimepicker-time',
                    hours: '#datetimepicker-time-hours',
                    separator: '#datetimepicker-time-separator',
                    minutes: '#datetimepicker-time-minutes'
                },
                ampmContainer: '#datetimepicker-ampm',
                ampm: '#datetimepicker-ampm-span'
            }
        },
        _value: {
            attr: 'data-' + (a.mobile.ns || '') + 'date',
            signal: 'date-changed',
            makeString: function (a) {
                return a.toString();
            }
        },
        _setHeader: function (b) {
            this._ui.header.text(b), this.options.header = b, this.element.attr('data-' + (a.mobile.ns || '') + 'header', b);
        },
        _create: function () {
            var b = this;
            this._ui.selectorProto.remove(), this._ui.itemProto.remove(), a.extend(this, {
                panning: !1,
                data: {
                    parentInput: 0,
                    year: 0,
                    month: 0,
                    day: 0,
                    hours: 0,
                    minutes: 0,
                    pm: !1
                },
                state: { selectorOut: !1 }
            });
            var c = this, d = this.element;
            a(d).css('display', 'none').after(this._ui.container), this._ui.triangle.triangle({ extraClass: 'selector-triangle-color' }), this.data.parentInput = d, this._ui.container.bind('vclick', function () {
                c._hideDataSelector(b._ui.selector);
            }), this._ui.main.find('.data').each(function () {
                a(this).bind('vclick', function (d) {
                    c._showDataSelector(b._ui.selector, a(this), b._ui), d.stopPropagation();
                });
            });
        },
        widget: function () {
            return this._ui.container;
        },
        _setDisabled: function (b) {
            a.todons.widgetex.prototype._setDisabled.call(this, b), this._hideDataSelector(this._ui.selector), this._ui.container[b ? 'addClass' : 'removeClass']('ui-disabled');
        },
        getValue: function () {
            var a = this._clampHours(this.data.hours);
            return a === 12 && !this.data.pm ? a = 0 : a < 12 && this.data.pm && (a += 12), new Date(this.data.year, this.data.month, this.data.day, a, this.data.minutes);
        }
    }), a(document).bind('pagecreate create', function (b) {
        a(a.todons.datetimepicker.prototype.options.initSelector, b.target).not(':jqmData(role=\'none\'), :jqmData(role=\'nojs\')').datetimepicker();
    });
}(jQuery, this));
(function (a, b, c) {
    a.widget('todons.dayselector', a.mobile.widget, {
        options: {
            initSelector: 'fieldset:jqmData(role="dayselector")',
            theme: null,
            type: 'horizontal',
            days: [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday'
            ]
        },
        defaultTheme: 'c',
        _create: function () {
            this.element.addClass('ui-dayselector'), this.options.type = this.element.jqmData('type') || this.options.type, this.options.theme = this.element.jqmData('theme') || this.options.theme || this.element.closest(':jqmData(theme)').jqmData('theme') || this.defaultTheme;
            var b = this.options.days;
            this.element.attr('data-' + a.mobile.ns + 'type', this.options.type);
            var c = this.element.attr('id') || 'dayselector' + new Date().getTime();
            for (var d = 0; d < b.length; d++) {
                var e = b[d], f = e.slice(0, 1), g = c + '_' + d, h = 'ui-dayselector-label-' + d, i = a('<input type="checkbox"/>').attr('id', g).attr('value', d), j = a('<label>' + f + '</label>').attr('for', g).addClass(h);
                this.element.append(i), this.element.append(j);
            }
            this.checkboxes = this.element.find(':checkbox').checkboxradio({ theme: this.options.theme }), this.element.controlgroup({ excludeInvisible: !1 });
        },
        _setOption: function (a, b) {
            a === 'disabled' && this._setDisabled(b);
        },
        _setDisabled: function (b) {
            a.Widget.prototype._setOption.call(this, 'disabled', b), this.element[b ? 'addClass' : 'removeClass']('ui-disabled');
        },
        value: function () {
            var a = this.checkboxes.filter(':checked').map(function () {
                return this.value;
            }).get();
            return a;
        },
        selectAll: function () {
            this.checkboxes.attr('checked', 'checked').checkboxradio('refresh');
        }
    }), a(document).bind('pagebeforecreate', function (b) {
        var c = a(a.todons.dayselector.prototype.options.initSelector, b.target);
        c.not(':jqmData(role=\'none\'), :jqmData(role=\'nojs\')').dayselector();
    });
}(jQuery, this));
(function (a, b) {
    a.widget('todons.expandable', a.mobile.widget, {
        options: {
            initSelector: ':jqmData(expandable)',
            contentSelector: ':jqmData(role="expandable-content")'
        },
        _toggleIcon: function (a) {
            a.hasClass('ui-icon-arrow-d') ? a.removeClass('ui-icon-arrow-d').addClass('ui-icon-arrow-u') : a.hasClass('ui-icon-arrow-u') && a.removeClass('ui-icon-arrow-u').addClass('ui-icon-arrow-d');
        },
        _create: function () {
            var a = this.element, b = this, c = a.find('span.ui-icon'), d = a.next(b.options.contentSelector);
            c.removeClass('ui-icon-arrow-r').addClass('ui-icon-arrow-d'), d.hide(), a.bind('vclick', function () {
                d.toggle('fast', 'swing'), b._toggleIcon(c);
            });
        }
    }), a(document).bind('pagecreate create', function (b) {
        a(a.todons.expandable.prototype.options.initSelector, b.target).not(':jqmData(role=\'none\'), :jqmData(role=\'nojs\')').expandable();
    });
}(jQuery));
(function (a, b) {
    a.widget('todons.hsvpicker', a.todons.colorwidget, {
        options: { initSelector: ':jqmData(role=\'hsvpicker\')' },
        _htmlProto: {
            source: a('<div><div id=\'hsvpicker\' class=\'ui-hsvpicker\'>    <div class=\'hsvpicker-clrchannel-container jquery-mobile-ui-widget\'>        <div class=\'hsvpicker-arrow-btn-container\'>            <a href=\'#\' class=\'hsvpicker-arrow-btn\' data-target=\'hue\' data-location=\'left\' data-inline=\'true\' data-iconpos=\'notext\' data-icon=\'arrow-l\'></a>        </div>        <div class=\'hsvpicker-clrchannel-masks-container\'>            <div class=\'hsvpicker-clrchannel-mask hsvpicker-clrchannel-mask-white\'></div>            <div id=\'hsvpicker-hue-hue\' class=\'hsvpicker-clrchannel-mask jquery-todons-colorwidget-clrlib-hue-gradient\'></div>            <div id=\'hsvpicker-hue-mask-val\' class=\'hsvpicker-clrchannel-mask hsvpicker-clrchannel-mask-black\' data-event-source=\'hue\'></div>            <div id=\'hsvpicker-hue-selector\' class=\'hsvpicker-clrchannel-selector ui-corner-all\'></div>        </div>        <div class=\'hsvpicker-arrow-btn-container\'>            <a href=\'#\' class=\'hsvpicker-arrow-btn\' data-target=\'hue\' data-location=\'right\' data-inline=\'true\' data-iconpos=\'notext\' data-icon=\'arrow-r\'></a>        </div>    </div>    <div class=\'hsvpicker-clrchannel-container jquery-mobile-ui-widget\'>        <div class=\'hsvpicker-arrow-btn-container\'>            <a href=\'#\' class=\'hsvpicker-arrow-btn\' data-target=\'sat\' data-location=\'left\' data-inline=\'true\' data-iconpos=\'notext\' data-icon=\'arrow-l\'></a>        </div>        <div class=\'hsvpicker-clrchannel-masks-container\'>            <div id=\'hsvpicker-sat-hue\' class=\'hsvpicker-clrchannel-mask\'></div>            <div id=\'hsvpicker-sat-gradient\' class=\'hsvpicker-clrchannel-mask  sat-gradient\'></div>            <div id=\'hsvpicker-sat-mask-val\' class=\'hsvpicker-clrchannel-mask hsvpicker-clrchannel-mask-black\' data-event-source=\'sat\'></div>            <div id=\'hsvpicker-sat-selector\' class=\'hsvpicker-clrchannel-selector ui-corner-all\'></div>        </div>        <div class=\'hsvpicker-arrow-btn-container\'>            <a href=\'#\' class=\'hsvpicker-arrow-btn\' data-target=\'sat\' data-location=\'right\' data-inline=\'true\' data-iconpos=\'notext\' data-icon=\'arrow-r\'></a>        </div>    </div>    <div class=\'hsvpicker-clrchannel-container jquery-mobile-ui-widget\'>        <div class=\'hsvpicker-arrow-btn-container\'>            <a href=\'#\' class=\'hsvpicker-arrow-btn\' data-target=\'val\' data-location=\'left\' data-inline=\'true\' data-iconpos=\'notext\' data-icon=\'arrow-l\'></a>        </div>        <div class=\'hsvpicker-clrchannel-masks-container\'>            <div class=\'hsvpicker-clrchannel-mask hsvpicker-clrchannel-mask-white\'></div>            <div id=\'hsvpicker-val-hue\' class=\'hsvpicker-clrchannel-mask\'></div>            <div id=\'hsvpicker-val-gradient\' class=\'hsvpicker-clrchannel-mask val-gradient\' data-event-source=\'val\'></div>            <div id=\'hsvpicker-val-selector\' class=\'hsvpicker-clrchannel-selector ui-corner-all\'></div>        </div>        <div class=\'hsvpicker-arrow-btn-container\'>            <a href=\'#\' class=\'hsvpicker-arrow-btn\' data-target=\'val\' data-location=\'right\' data-inline=\'true\' data-iconpos=\'notext\' data-icon=\'arrow-r\'></a>        </div>    </div></div></div>'),
            ui: {
                container: '#hsvpicker',
                hue: {
                    eventSource: '[data-event-source=\'hue\']',
                    selector: '#hsvpicker-hue-selector',
                    hue: '#hsvpicker-hue-hue',
                    valMask: '#hsvpicker-hue-mask-val'
                },
                sat: {
                    gradient: '#hsvpicker-sat-gradient',
                    eventSource: '[data-event-source=\'sat\']',
                    selector: '#hsvpicker-sat-selector',
                    hue: '#hsvpicker-sat-hue',
                    valMask: '#hsvpicker-sat-mask-val'
                },
                val: {
                    gradient: '#hsvpicker-val-gradient',
                    eventSource: '[data-event-source=\'val\']',
                    selector: '#hsvpicker-val-selector',
                    hue: '#hsvpicker-val-hue'
                }
            }
        },
        _create: function () {
            var b = this;
            this.element.css('display', 'none').after(this._ui.container), this._ui.hue.hue.huegradient(), a.extend(this, {
                dragging_hsv: [
                    0,
                    0,
                    0
                ],
                selectorDraggingOffset: {
                    x: -1,
                    y: -1
                },
                dragging: -1
            }), this._ui.container.find('.hsvpicker-arrow-btn').buttonMarkup().bind('vclick', function (c) {
                var d = a(this).attr('data-' + (a.mobile.ns || '') + 'target'), e = 'hue' === d ? 0 : 'sat' === d ? 1 : 2, f = 0 == e ? 360 : 1, g = 0.05 * f;
                b.dragging_hsv[e] = b.dragging_hsv[e] + g * ('left' === a(this).attr('data-' + (a.mobile.ns || '') + 'location') ? -1 : 1), b.dragging_hsv[e] = Math.min(f, Math.max(0, b.dragging_hsv[e])), b._updateSelectors(b.dragging_hsv);
            }), a(document).bind('vmousemove', function (a) {
                b.dragging != -1 && (a.stopPropagation(), a.preventDefault());
            }).bind('vmouseup', function (a) {
                b.dragging = -1;
            }), this._bindElements('hue', 0), this._bindElements('sat', 1), this._bindElements('val', 2);
        },
        _bindElements: function (a, b) {
            var c = this;
            this._ui[a].selector.bind('mousedown vmousedown', function (d) {
                c._handleMouseDown(a, b, d, !0);
            }).bind('vmousemove touchmove', function (d) {
                c._handleMouseMove(a, b, d, !0);
            }).bind('vmouseup', function (a) {
                c.dragging = -1;
            }), this._ui[a].eventSource.bind('mousedown vmousedown', function (d) {
                c._handleMouseDown(a, b, d, !1);
            }).bind('vmousemove touchmove', function (d) {
                c._handleMouseMove(a, b, d, !1);
            }).bind('vmouseup', function (a) {
                c.dragging = -1;
            });
        },
        _handleMouseDown: function (b, c, d, e) {
            var f = a.mobile.todons.targetRelativeCoordsFromEvent(d), g = e ? 'selector' : 'eventSource';
            f.x >= 0 && f.x <= this._ui[b][g].outerWidth() && f.y >= 0 && f.y <= this._ui[b][g].outerHeight() && (this.dragging = c, e && (this.selectorDraggingOffset.x = f.x, this.selectorDraggingOffset.y = f.y), this._handleMouseMove(b, c, d, e, f));
        },
        _handleMouseMove: function (b, c, d, e, f) {
            if (this.dragging === c) {
                f = f || a.mobile.todons.targetRelativeCoordsFromEvent(d);
                var g = 0 === c ? 360 : 1, h = e ? this.dragging_hsv[c] / g + (f.x - this.selectorDraggingOffset.x) / this._ui[b].eventSource.width() : f.x / this._ui[b].eventSource.width();
                this.dragging_hsv[c] = Math.min(1, Math.max(0, h)) * g, e || (this.selectorDraggingOffset.x = Math.ceil(this._ui[b].selector.outerWidth() / 2), this.selectorDraggingOffset.y = Math.ceil(this._ui[b].selector.outerHeight() / 2)), this._updateSelectors(this.dragging_hsv), d.stopPropagation(), d.preventDefault();
            }
        },
        _updateSelectors: function (b) {
            var c = a.todons.colorwidget.clrlib, d = a.todons.colorwidget.prototype, e = c.HSVToHSL(b), f = c.HSVToHSL([
                    b[0],
                    1,
                    1
                ]), g = c.HSVToHSL([
                    b[0],
                    b[1],
                    1
                ]);
            this._ui.hue.selector.css({ left: this._ui.hue.eventSource.width() * b[0] / 360 }), d._setElementColor.call(this, this._ui.hue.selector, e, 'background'), a.mobile.browser.ie ? this._ui.hue.hue.find('*').css('opacity', b[1]) : this._ui.hue.hue.css('opacity', b[1]), this._ui.hue.valMask.css('opacity', 1 - b[2]), this._ui.sat.selector.css({ left: this._ui.sat.eventSource.width() * b[1] }), d._setElementColor.call(this, this._ui.sat.selector, e, 'background'), d._setElementColor.call(this, this._ui.sat.hue, f, 'background'), this._ui.sat.valMask.css('opacity', 1 - b[2]), this._ui.val.selector.css({ left: this._ui.val.eventSource.width() * b[2] }), d._setElementColor.call(this, this._ui.val.selector, e, 'background'), d._setElementColor.call(this, this._ui.val.hue, g, 'background'), d._setColor.call(this, c.RGBToHTML(c.HSLToRGB(e)));
        },
        _setDisabled: function (b) {
            a.todons.widgetex.prototype._setDisabled.call(this, b), this._ui.container[b ? 'addClass' : 'removeClass']('ui-disabled'), this._ui.hue.hue.huegradient('option', 'disabled', b), a.todons.colorwidget.prototype._displayDisabledState.call(this, this._ui.container);
        },
        _setColor: function (b) {
            a.todons.colorwidget.prototype._setColor.call(this, b) && (this.dragging_hsv = a.todons.colorwidget.clrlib.RGBToHSV(a.todons.colorwidget.clrlib.HTMLToRGB(this.options.color)), this._updateSelectors(this.dragging_hsv));
        }
    }), a(document).bind('pagecreate create', function (b) {
        a(a.todons.hsvpicker.prototype.options.initSelector, b.target).not(':jqmData(role=\'none\'), :jqmData(role=\'nojs\')').hsvpicker();
    });
}(jQuery));
(function (a, b) {
    a.widget('todons.layouthbox', a.todons.jlayoutadaptor, {
        fixed: {
            type: 'flexGrid',
            rows: 1,
            direction: 'x',
            initSelector: ':jqmData(layout="hbox")'
        },
        _create: function () {
            this.options.hgap || (this.options.hgap = 0), a.todons.jlayoutadaptor.prototype._create.apply(this, arguments);
        }
    }), a(document).bind('pagecreate', function (b) {
        a(a.todons.layouthbox.prototype.fixed.initSelector, b.target).not(':jqmData(role=\'none\'), :jqmData(role=\'nojs\')').layouthbox();
    }), a.widget('todons.layoutvbox', a.todons.jlayoutadaptor, {
        fixed: {
            type: 'flexGrid',
            columns: 1,
            direction: 'y',
            initSelector: ':jqmData(layout="vbox")'
        },
        _create: function () {
            this.options.vgap || (this.options.vgap = 0), a.todons.jlayoutadaptor.prototype._create.apply(this, arguments);
        }
    }), a(document).bind('pagecreate', function (b) {
        a(a.todons.layoutvbox.prototype.fixed.initSelector, b.target).not(':jqmData(role=\'none\'), :jqmData(role=\'nojs\')').layoutvbox();
    });
}(jQuery));
(function (a) {
    a.widget('todons.listviewcontrols', a.mobile.widget, {
        _defaults: {
            controlPanelSelector: null,
            modesAvailable: [
                'edit',
                'view'
            ],
            mode: 'view',
            controlPanelShowIn: null
        },
        _listviewCssClass: 'ui-listviewcontrols-listview',
        _controlsCssClass: 'ui-listviewcontrols-panel',
        _create: function () {
            var b = this, c = this.options, d = !0, e = this.element.closest('.ui-page'), f = 'data-' + a.mobile.ns + 'listviewcontrols', g = this.element.attr(f), h = this.element.jqmData('listviewcontrols-options'), i;
            c.controlPanelSelector = c.controlPanelSelector || g, c = a.extend({}, this._defaults, h, c), d = this._validOption('modesAvailable', c.modesAvailable, c) && this._validOption('controlPanelSelector', c.controlPanelSelector, c) && this._validOption('mode', c.mode, c);
            if (!d)
                return !1;
            this.controlPanel = a(document).find(c.controlPanelSelector).first();
            if (this.controlPanel.length === 0)
                return !1;
            i = this.controlPanel.jqmData('listviewcontrols-show-in'), i ? c.controlPanelShowIn = i : c.controlPanelShowIn || (c.controlPanelShowIn = c.modesAvailable[0]);
            if (!this._validOption('controlPanelShowIn', c.controlPanelShowIn, c))
                return;
            this.options = c, this.element.removeClass(this._listviewCssClass).addClass(this._listviewCssClass), this.controlPanel.removeClass(this._controlsCssClass).addClass(this._controlsCssClass), e && !e.is(':visible') ? e.bind('pageshow', function () {
                b.refresh();
            }) : this.refresh();
        },
        _validOption: function (b, c, d) {
            var e = !1;
            if (b === 'mode')
                e = a.inArray(c, d.modesAvailable) >= 0;
            else if (b === 'controlPanelSelector')
                e = a.type(c) === 'string';
            else if (b === 'modesAvailable') {
                e = a.isArray(c) && c.length > 1;
                if (e)
                    for (var f = 0; f < c.length; f++)
                        if (c[f] === '' || a.type(c[f]) !== 'string')
                            e = !1;
            } else
                b === 'controlPanelShowIn' && (e = a.inArray(c, d.modesAvailable) >= 0);
            return e;
        },
        _setOption: function (a, b) {
            var c = this.options[a];
            c !== b && this._validOption(a, b, this.options) && (this.options[a] = b, this.refresh());
        },
        visibleListItems: function () {
            return this.element.find('li:not(:jqmData(role=list-divider)):visible');
        },
        refresh: function () {
            var b = this, c = !1, d = null, e, f;
            d = this.controlPanel.is(':visible'), this.options.mode === this.options.controlPanelShowIn ? this.controlPanel.show() : this.controlPanel.hide(), this.controlPanel.is(':visible') !== d && (c = !0), f = this.element.find('li:not(:jqmData(role=list-divider))').find(':jqmData(listviewcontrols-show-in)'), f.each(function () {
                e = a(this).jqmData('listviewcontrols-show-in'), d = a(this).is(':visible'), e === b.options.mode ? a(this).show() : a(this).hide(), a(this).is(':visible') !== d && (c = !0);
            }), c && this.element.trigger('updatelayout');
        }
    }), a('ul').live('listviewcreate', function () {
        var b = a(this);
        b.is(':jqmData(listviewcontrols)') && b.listviewcontrols();
    });
}(jQuery));
(function (a, b) {
    a.widget('todons.optionheader', a.todons.widgetex, {
        options: {
            initSelector: ':jqmData(role=\'optionheader\')',
            showIndicator: !0,
            theme: 'b',
            startCollapsed: !1,
            expandable: !0,
            duration: 0.25
        },
        collapsedHeight: '5px',
        _create: function () {
            var b, c = this, d, e = this.element.jqmData('options');
            a.extend(this.options, e), this.isCollapsed = !1, this.expandedHeight = null, b = this.element.jqmData('theme') || this.options.theme, this.options.theme = b, this.clickHandler = function () {
                c.toggle();
            }, this.refresh();
        },
        _realize: function () {
            this.expandedHeight || (this.expandedHeight = this.element.height()), this.options.startCollapsed && this.collapse({ duration: 0 });
        },
        refresh: function () {
            var b = this.element, c = a('<div></div>'), d = 'ui-option-header', e = this, f = '.ui-grid-a,.ui-grid-b,.ui-grid-c,.ui-grid-d,.ui-grid-e', g = this.options.theme, h, i, j;
            h = b.find(f).length, h = Math.max(1, h), i = 'ui-option-header-' + h + '-row', j = 'ui-body-' + this.options.theme, b.removeClass(i).addClass(i), b.removeClass(j).addClass(j), b.removeClass(d).addClass(d), b.prev('.ui-triangle-container').remove(), this.options.showIndicator && (b.before(c), c.triangle({
                color: b.css('background-color'),
                offset: '50%'
            })), this.options.expandable ? (b.unbind('vclick', this.clickHandler).bind('vclick', this.clickHandler), c.unbind('vclick', this.clickHandler).bind('vclick', this.clickHandler)) : (b.unbind('vclick', this.clickHandler), c.unbind('vclick', this.clickHandler)), b.find(f).each(function (b) {
                var c = 'ui-option-header-row-' + (b + 1);
                a(this).removeClass(c).addClass(c);
            }), b.find('.ui-btn').each(function () {
                a(this).attr('data-' + a.mobile.ns + 'theme', g);
                var b = a(this).attr('class');
                b = b.replace(/ui-btn-up-\w{1}\s*/, ''), b = b + ' ui-btn-up-' + g, a(this).attr('class', b);
            });
        },
        _setHeight: function (b, c, d) {
            var e = this, f, g, h;
            d = d || {}, f = d.duration, typeof f == 'undefined' && (f = this.options.duration), g = function () {
                e.isCollapsed = c, c ? e.element.trigger('collapse') : e.element.trigger('expand');
            }, d.callback ? h = function () {
                d.callback(), g();
            } : h = function () {
                g();
            };
            if (f > 0 && a.support.cssTransitions) {
                var i = this.element.get(0), j = {
                        handleEvent: function (a) {
                            i.removeEventListener('webkitTransitionEnd', this), e.element.css('-webkit-transition', null), h();
                        }
                    };
                i.addEventListener('webkitTransitionEnd', j, !1), this.element.css('-webkit-transition', 'height ' + f + 's ease-out'), this.element.css('height', b);
            } else
                this.element.css('height', b), h();
        },
        toggle: function (a) {
            this.isCollapsed ? this.expand(a) : this.collapse(a);
        },
        _setDisabled: function (b) {
            a.Widget.prototype._setOption.call(this, 'disabled', b), this.element.add(this.element.prev('.ui-triangle-container'))[b ? 'addClass' : 'removeClass']('ui-disabled');
        },
        collapse: function (a) {
            this.isCollapsed || this._setHeight(this.collapsedHeight, !0, a);
        },
        expand: function (a) {
            this.isCollapsed && this._setHeight(this.expandedHeight, !1, a);
        }
    }), a(document).bind('pagecreate', function (b) {
        a(a.todons.optionheader.prototype.options.initSelector, b.target).not(':jqmData(role=\'none\'), :jqmData(role=\'nojs\')').optionheader();
    });
}(jQuery));
(function (a, b) {
    ensureNS('jQuery.mobile.todons'), a.widget('todons.pagelist', a.todons.widgetex, {
        _htmlProto: {
            source: a('<div><div id=\'pagelist\' class=\'ui-pagelist\' data-role=\'popupwindow\' data-shadow=\'false\' data-overlayTheme=\'\'>    <a id=\'pagelist-button\' data-role=\'button\' data-inline=\'true\'></a>    <br id=\'pagelist-rowbreak\'></br></div></div>'),
            ui: {
                pageList: '#pagelist',
                button: '#pagelist-button',
                rowBreak: '#pagelist-rowbreak'
            }
        },
        _create: function () {
            var c = this, d = !1, e = 0;
            this._ui.button.remove(), this._ui.rowBreak.remove(), this._ui.pageList.appendTo(a('body')).popupwindow().bind('vclick', function (b) {
                a(this).popupwindow('close');
            }), this.element.find('a[href]').each(function (b, d) {
                e > 0 && !(e % 10) && c._ui.pageList.append(c._ui.rowBreak.clone()), c._ui.button.clone().attr('href', a(d).attr('href')).text(++e).appendTo(c._ui.pageList).buttonMarkup().bind('vclick', function () {
                    c._ui.pageList.popupwindow('close');
                }).find('.ui-btn-inner').css({ padding: 2 });
            }), a(document).bind('keydown', function (b) {
                d = b.keyCode === a.mobile.keyCode.CONTROL;
            }), a(document).bind('keyup', function (e) {
                if (e.keyCode === a.mobile.keyCode.CONTROL && d) {
                    var f = {
                        cx: 0,
                        cy: 0
                    };
                    c._ui.pageList.popupwindow('open', b, 0), c._ui.pageList.find('a').each(function () {
                        var b = a(this), c = {
                                cx: b.outerWidth(!0),
                                cy: b.outerHeight(!0)
                            };
                        c.cx % 2 && b.css('padding-left', parseInt(b.css('padding-left')) + 1), c.cy % 2 && b.css('padding-bottom', parseInt(b.css('padding-bottom')) + 1), f.cx = Math.max(f.cx, c.cx), f.cy = Math.max(f.cy, c.cy);
                    }).each(function () {
                        var b = {
                                h: Math.max(0, (f.cx - a(this).outerWidth(!0)) / 2),
                                v: Math.max(0, (f.cy - a(this).outerHeight(!0)) / 2)
                            }, c = a(this), d = c.find('.ui-btn-inner');
                        d.css({
                            'padding-left': parseInt(d.css('padding-left')) + b.h,
                            'padding-top': parseInt(d.css('padding-top')) + b.v,
                            'padding-right': parseInt(d.css('padding-right')) + b.h,
                            'padding-bottom': parseInt(d.css('padding-bottom')) + b.v
                        }), c[c.attr('href') === '#' + a.mobile.activePage.attr('id') ? 'addClass' : 'removeClass']('ui-btn-active');
                    }), e.stopPropagation(), e.preventDefault();
                }
                d = !1;
            });
        }
    }), a(document).bind('pagecreate create', function (c) {
        a(':jqmData(pagelist=\'true\')', c.target).not(':jqmData(role=\'none\'), :jqmData(role=\'nojs\')').each(function () {
            return a.mobile.todons.pagelist === b && a.extend(a.mobile.todons, { pagelist: a(this).pagelist() }), !1;
        });
    });
}(jQuery));
(function (a, b, c) {
    a.widget('todons.personpicker', a.todons.widgetex, {
        options: {
            addressBook: null,
            successCallback: null,
            errorCallback: null,
            filter: null,
            multipleSelection: !0,
            theme: 'b'
        },
        _data: { checked: new Array() },
        _personArraySuccessCallback: function (b) {
            var c = this, d = c._ui.ui.list, e = c._ui.row.li, f = c._ui.ui.personpicker.find('.ui-personpicker-container');
            f.find('.loader').remove(), f.find('.ui-listview-filter').show(), d.find('li').remove(), b.forEach(function (b) {
                currentListItem = e.clone(), currentCheckbox = currentListItem.find('.switch'), currentName = currentListItem.find('.name'), currentAvatar = currentListItem.find('.avatar'), currentName.text(b.id()), currentAvatar.find('img').attr({
                    src: b.avatar(),
                    alt: b.id()
                }), d.append(currentListItem), currentCheckbox.toggleswitch({
                    checked: !1,
                    theme: c.options.theme
                }).data('Person', b).bind('changed', function (b, d) {
                    var e = a(this).data('Person');
                    d ? (c.options.multipleSelection || (c._data.checked.forEach(function (a) {
                        a.toggleswitch('option', 'checked', !1);
                    }), c._data.checked.length = 0), a.inArray(e, c._data.checked) == -1 && c._data.checked.push(a(this))) : c._data.checked = a.grep(c._data.checked, function (b) {
                        return b != a(this);
                    });
                });
            }), f.scrollview({ direction: 'y' }), c._ui.ui.list.shortcutscroll(), c._ui.ui.list.autodividers({ selector: '.content > h3' }), c._ui.ui.search.bind('keyup change', function () {
                f.scrollview('scrollTo', 0, 0);
            }), c._ui.ui.search.textinput('enable');
        },
        _htmlProto: {
            source: a('<div><div class=\'ui-personpicker\'>    <div class=\'ui-personpicker-container\'>        <div class=\'loader\' data-role=\'processingcircle\'></div>        <ul data-role=\'listview\' data-filter=\'true\'>        </ul>    </div></div><li class=\'ui-personpicker-row\'>    <div class=\'content\'>        <div class=\'switch\'></div>        <h3 class=\'name\'></h3>        <div class=\'avatar\'>            <img src=\'\' alt=\'\' />        </div>    </div></li></div>'),
            ui: {
                ui: {
                    personpicker: '.ui-personpicker',
                    list: '.ui-personpicker ul'
                },
                row: {
                    li: 'li.ui-personpicker-row',
                    container: 'div.ui-personpicker-row-container',
                    checkbox: 'div.switch',
                    name: 'h3.name',
                    avatar: 'div.avatar'
                }
            }
        },
        _create: function () {
            var b = this;
            this.element.append(b._ui.ui.personpicker), b._ui.ui.list.listview({ theme: b.options.theme }), b._ui.ui.search = a(this.element).find(':jqmData(type="search")'), b._ui.ui.search.textinput('disable'), this.refresh();
        },
        getPersons: function () {
            var a = new Array();
            return this._data.checked.forEach(function (b) {
                a.push(b.data('Person'));
            }), a;
        },
        refresh: function () {
            var a = this;
            this.options.addressBook !== null && this.options.addressBook.findPersons(function (b) {
                a._personArraySuccessCallback(b);
            }, this.options.errorCallback, this.options.filter, null, null);
        },
        resizeScrollview: function (a) {
            this._ui.ui.personpicker.find('.ui-personpicker-container').height(a);
        }
    }), a(document).bind('pagecreate', function (b) {
        a(b.target).find(':jqmData(role=\'personpicker\')').personpicker();
    });
}(jQuery, this));
(function (a, b, c) {
    a.widget('todons.personpicker_page', a.mobile.dialog, {
        options: {
            title: '',
            addressBook: null,
            successCallback: null,
            errorCallback: null,
            filter: null,
            multipleSelection: !0,
            theme: 'b'
        },
        _htmlProto: {
            source: a('<div><div class=\'ui-personpicker-page-container\'>    <div data-role=\'header\'>        <h1><!-- Title goes here --></h1>        <div class=\'ui-optionheader-anchor\' data-role=\'optionheader\'>            <div class=\'ui-grid-a\'>                <div class=\'ui-block-a\'><a data-role=\'button\' class=\'cancel-btn\' data-rel=\'back\'>Cancel</a></div>                <div class=\'ui-block-b\'><a data-role=\'button\' class=\'done-btn\'>Done</a></div>            </div>        </div>    </div>    <div data-role=\'content\' class=\'ui-personpicker-anchor\'></div></div></div>'),
            ui: {
                container: '.ui-personpicker-page-container',
                title: '.ui-personpicker-page-container h1',
                optionheader: '.ui-personpicker-page-container .ui-optionheader-anchor',
                cancel: '.ui-personpicker-page-container .ui-optionheader-anchor .cancel-btn',
                done: '.ui-personpicker-page-container .ui-optionheader-anchor .done-btn',
                personpicker: '.ui-personpicker-page-container > .ui-personpicker-anchor'
            }
        },
        _resizePersonpicker: function () {
            var c = this._ui.container.find(':jqmData(role=header)'), d = a(b).height(), e = c.outerHeight(!0), f = d - e - 2;
            this._ui.personpicker.personpicker('resizeScrollview', f), this.element.trigger('updatelayout');
        },
        _create: function () {
            var c = this;
            a.todons.widgetex.loadPrototype.call(this, 'todons.personpicker_page'), c._ui.title.text(c.options.title), c._ui.cancel.buttonMarkup({
                shadow: !0,
                inline: !0,
                icon: 'delete',
                theme: c.options.theme
            }), c._ui.done.buttonMarkup({
                shadow: !0,
                inline: !0,
                theme: c.options.theme
            }).bind('vclick', function (a) {
                c.options.successCallback(c._ui.personpicker.personpicker('getPersons'));
            }), this.element.append(c._ui.container), c._ui.optionheader.optionheader({ theme: c.options.theme }), a.mobile.page.prototype._create.call(this), a.mobile.dialog.prototype._create.call(this), c._ui.personpicker.personpicker({
                addressBook: c.options.addressBook,
                successCallback: c.options.successCallback,
                errorCallback: c.options.errorCallback,
                filter: c.options.filter,
                multipleSelection: c.options.multipleSelection,
                theme: c.options.theme
            }), c._ui.container.find(':jqmData(role=header) > a:first-child').remove(), a(b).bind('resize', function () {
                c._resizePersonpicker();
            }), c._ui.optionheader.bind('collapse expand', function () {
                c._resizePersonpicker();
            }), this.element.closest('.ui-page').is(':visible') ? c._resizePersonpicker() : this.element.closest('.ui-page').bind('pageshow', function () {
                c._ui.optionheader.optionheader('expand', { duration: 0 }), c._ui.optionheader.optionheader('refresh'), c._resizePersonpicker();
            });
        }
    }), a(document).bind('pagecreate', function (b) {
        a(b.target).find(':jqmData(role=\'personpicker-page\')').personpicker_page();
    });
}(jQuery, this));
(function (a, b) {
    a.widget('todons.popupwindow', a.todons.widgetex, {
        options: {
            theme: null,
            overlayTheme: null,
            shadow: !0,
            corners: !0,
            fade: !0,
            transition: a.mobile.defaultDialogTransition,
            showArrow: !1,
            initSelector: ':jqmData(role=\'popupwindow\')'
        },
        _htmlProto: {
            source: a('<div><div>    <div id=\'popupwindow-screen\' class=\'ui-selectmenu-screen ui-screen-hidden ui-popupwindow-screen\'></div>    <div id=\'popupwindow-container\' class=\'ui-popupwindow ui-selectmenu-hidden ui-overlay-shadow ui-corner-all\'>        <div id=\'popupwindow-container-inner\' class=\'ui-popupwindow-container-inner\'></div>        <div id=\'popupwindow-arrow\' class=\'ui-triangle-container\'></div>    </div></div></div>'),
            ui: {
                screen: '#popupwindow-screen',
                container: '#popupwindow-container',
                inner: '#popupwindow-container-inner',
                arrow: '#popupwindow-arrow'
            }
        },
        _create: function () {
            var c = this, d = this.element.closest('.ui-page');
            d[0] === b && (d = a('body')), this._ui.placeholder = a('<div><!-- placeholder' + (this.element.attr('id') === b ? '' : ' for ' + this.element.attr('id')) + ' --></div>').css('display', 'none').insertBefore(this.element), d.append(this._ui.screen), this._ui.container.insertAfter(this._ui.screen), this._ui.inner.append(this.element), this._ui.arrow.remove(), a.extend(c, { _isOpen: !1 }), this._ui.screen.bind('vclick', function (a) {
                c.close();
            });
        },
        _realSetTheme: function (a, b) {
            var c = (a.attr('class') || '').split(' '), d = !0, e = null, f;
            while (c.length > 0) {
                e = c.pop(), f = e.match(/^ui-body-([a-z])$/);
                if (f && f.length > 1) {
                    e = f[1];
                    break;
                }
                e = null;
            }
            a.removeClass('ui-body-' + e), (b || '').match(/[a-z]/) && a.addClass('ui-body-' + b);
        },
        _setTheme: function (b) {
            this._realSetTheme(this.element, b), this.options.theme = b, this.element.attr('data-' + (a.mobile.ns || '') + 'theme', b);
        },
        _setOverlayTheme: function (b) {
            this._realSetTheme(this._ui.container, b), this.options.overlayTheme = b, this.element.attr('data-' + (a.mobile.ns || '') + 'overlay-theme', b);
        },
        _setShadow: function (b) {
            this.options.shadow = b, this.element.attr('data-' + (a.mobile.ns || '') + 'shadow', b), this._ui.container[b ? 'addClass' : 'removeClass']('ui-overlay-shadow');
        },
        _setCorners: function (b) {
            this.options.corners = b, this.element.attr('data-' + (a.mobile.ns || '') + 'corners', b), this._ui.container[b ? 'addClass' : 'removeClass']('ui-corner-all');
        },
        _setFade: function (b) {
            this.options.fade = b, this.element.attr('data-' + (a.mobile.ns || '') + 'fade', b);
        },
        _setTransition: function (b) {
            this._ui.container.removeClass(this.options.transition || '').addClass(b), this.options.transition = b, this.element.attr('data-' + (a.mobile.ns || '') + 'transition', b);
        },
        _setShowArrow: function (b) {
            this.options.showArrow = b, this.element.attr('data-' + (a.mobile.ns || '') + 'show-arrow', b);
        },
        _setDisabled: function (b) {
            a.Widget.prototype._setOption.call(this, 'disabled', b), b && this.close();
        },
        _placementCoords: function (b, c) {
            var d, e = this._ui.container.outerHeight(!0), f = this._ui.container.outerWidth(!0), g = a(window).scrollTop(), h = a(window).height(), i = a(window).width(), j = e / 2, k = parseFloat(this._ui.container.css('max-width')), l = function (a) {
                    var b = a.y - g, c = g + h - a.y, d, l;
                    return b > e / 2 && c > e / 2 ? d = a.y - j : d = b > c ? g + h - e - 30 : g + 30, f < k ? l = (i - f) / 2 : (l = a.x - f / 2, l < 30 ? l = 30 : l + f > i && (l = i - f - 30)), {
                        x: l,
                        y: d
                    };
                };
            if (this.options.showArrow) {
                this._ui.arrow.appendTo(this._ui.container);
                var m = {}, n, o, p, q, r = this._ui.arrow.height();
                this._ui.arrow.remove(), o = {
                    x: b,
                    y: c - j - r
                }, n = l(o), m.above = {
                    coords: n,
                    diff: {
                        x: Math.abs(o.x - (n.x + f / 2)),
                        y: Math.abs(o.y - (n.y + j))
                    }
                }, p = m.above.diff, q = 'above', o = {
                    x: b,
                    y: c + j + r
                }, n = l(o), m.below = {
                    coords: n,
                    diff: {
                        x: Math.abs(o.x - (n.x + f / 2)),
                        y: Math.abs(o.y - (n.y + j))
                    }
                };
                for (var s in m) {
                    m[s].diff.x + m[s].diff.y < p.x + p.y && (p = m[s].diff, q = s);
                    if (0 === p.x + p.y)
                        break;
                }
                d = m[q].coords, d.arrowLocation = 'above' === q ? 'bottom' : 'top';
            } else
                d = l({
                    x: b,
                    y: c
                });
            return d;
        },
        destroy: function () {
            this.element.insertBefore(this._ui.placeholder), this._ui.placeholder.remove(), this._ui.container.remove(), this._ui.screen.remove(), this.element.triggerHandler('destroyed'), a.Widget.prototype.destroy.call(this);
        },
        open: function (c, d) {
            if (!this._isOpen && !this.options.disabled) {
                var e = this, f = b === c ? window.innerWidth / 2 : c, g = b === d ? window.innerHeight / 2 : d, h = this._placementCoords(f, g), i = 0;
                a(document).find('*').each(function () {
                    var b = a(this), c = parseInt(b.css('z-index'));
                    b.is(e._ui.container) || b.is(e._ui.screen) || isNaN(c) || (i = Math.max(i, c));
                }), this._ui.screen.css('z-index', i + 1), this._ui.container.css('z-index', i * 10), this.options.showArrow && (this._ui.currentArrow = this._ui.arrow.clone()['bottom' === h.arrowLocation ? 'appendTo' : 'prependTo'](this._ui.container).triangle({
                    location: h.arrowLocation,
                    offset: '50%',
                    color: this._ui.container.css('background-color')
                })), this._ui.screen.height(a(document).height()).removeClass('ui-screen-hidden'), this.options.fade ? this._ui.screen.animate({ opacity: 0.5 }, 'fast') : this._ui.screen.css({ opacity: 0 }), this._ui.container.removeClass('ui-selectmenu-hidden').css({
                    left: h.x,
                    top: h.y
                }).addClass('in').animationComplete(function () {
                    e._ui.screen.height(a(document).height());
                }), this._isOpen = !0;
            }
        },
        close: function () {
            if (this._isOpen) {
                var a = this, c = function () {
                        a._ui.screen.addClass('ui-screen-hidden'), a._isOpen = !1, a.element.trigger('closed');
                    };
                this._ui.container.removeClass('in').addClass('reverse out').animationComplete(function () {
                    a._ui.container.removeClass('reverse out').addClass('ui-selectmenu-hidden').removeAttr('style'), a._ui.currentArrow != b && (a._ui.currentArrow.remove(), a._ui.currentArrow = b);
                }), this.options.fade ? this._ui.screen.animate({ opacity: 0 }, 'fast', c) : c();
            }
        }
    }), a.todons.popupwindow.bindPopupToButton = function (a, b) {
        if (a.length === 0 || b.length === 0)
            return;
        var c = function () {
            b.jqmData('overlay-theme-set') || b.popupwindow('option', 'overlayTheme', a.jqmData('theme')), b.popupwindow('open', a.offset().left + a.outerWidth() / 2, a.offset().top + a.outerHeight() / 2);
        };
        (b.popupwindow('option', 'overlayTheme') || '').match(/[a-z]/) && b.jqmData('overlay-theme-set', !0), a.attr({
            'aria-haspopup': !0,
            'aria-owns': a.attr('href')
        }).removeAttr('href').bind('vclick', c), b.bind('destroyed', function () {
            a.unbind('vclick', c);
        });
    }, a(document).bind('pagecreate create', function (b) {
        a(a.todons.popupwindow.prototype.options.initSelector, b.target).not(':jqmData(role=\'none\'), :jqmData(role=\'nojs\')').popupwindow(), a('a[href^=\'#\']:jqmData(rel=\'popupwindow\')', b.target).each(function () {
            a.todons.popupwindow.bindPopupToButton(a(this), a(a(this).attr('href')));
        });
    });
}(jQuery));
(function (a, b) {
    a.widget('todons.processingbar', a.mobile.widget, {
        options: {
            initSelector: ':jqmData(role=\'processingbar\')',
            animationMsPerPixel: 15,
            theme: 'b'
        },
        _isRunning: !1,
        _create: function () {
            var b = this, c = this.element.closest('.ui-page'), d, e = this.element.jqmData('theme') || this.options.theme;
            this.html = a('<div class="ui-processingbar-container"><div class="ui-processingbar-clip"><div class="ui-processingbar-bar" /></div></div><span class="ui-processingbar-swatch"></span>'), this.element.find('.ui-processingbar-container').remove(), this.element.append(this.html), this.bar = this.element.find('.ui-processingbar-bar');
            var f = this.element.find('.ui-processingbar-swatch');
            f.addClass('ui-bar-' + e);
            var g = f.css('background-color');
            f.remove();
            if (g) {
                var h = '-webkit-gradient(linear, left top, right bottom, color-stop(0%,  rgba(255,255,255,1.0)),color-stop(25%, rgba(255,255,255,1.0)),color-stop(25%, processingbarBarBgColor),color-stop(50%, processingbarBarBgColor),color-stop(50%, rgba(255,255,255,1.0)),color-stop(75%, rgba(255,255,255,1.0)),color-stop(75%, processingbarBarBgColor))';
                h = h.replace(/processingbarBarBgColor/g, g), this.bar.css('background-image', h);
                var i = this.bar.height() / 8, j = '-moz-repeating-linear-gradient(top left -45deg, rgba(255,255,255,1.0),rgba(255,255,255,1.0) ' + i + 'px,' + 'processingbarBarBgColor ' + i + 'px,' + 'processingbarBarBgColor ' + i * 3 + 'px,' + 'rgba(255,255,255,1.0) ' + i * 3 + 'px,' + 'rgba(255,255,255,1.0) ' + i * 4 + 'px)';
                j = j.replace(/processingbarBarBgColor/g, g), this.bar.css('background', j);
            }
            d = function () {
                b.refresh();
            }, c && !c.is(':visible') ? c.unbind('pageshow', d).bind('pageshow', d) : this.refresh();
        },
        refresh: function () {
            this.stop();
            var a = this.bar.height() / 2, b = a * this.options.animationMsPerPixel, c = this.bar, d = function () {
                    c.animate({ top: '-=' + a }, b, 'linear', function () {
                        c.css('top', 0);
                    });
                };
            this.interval = setInterval(d, b), this._isRunning = !0;
        },
        stop: function () {
            if (!this._isRunning)
                return;
            clearInterval(this.interval), this.bar.stop(), this.bar.clearQueue(), this.element.trigger('stop'), this._isRunning = !1;
        },
        isRunning: function () {
            return this._isRunning;
        },
        destroy: function () {
            this.stop(), this.html.detach();
        }
    }), a(document).bind('pagecreate create', function (b) {
        a(a.todons.processingbar.prototype.options.initSelector, b.target).not(':jqmData(role=\'none\'), :jqmData(role=\'nojs\')').processingbar();
    });
}(jQuery));
(function (a) {
    a.widget('todons.processingcircle', a.mobile.widget, {
        options: {
            initSelector: ':jqmData(role=\'processingcircle\')',
            theme: 'b'
        },
        _isRunning: !1,
        _create: function () {
            var b = this.element.closest('.ui-page'), c = this, d;
            d = this.element.jqmData('theme') || this.options.theme, this.html = a('<div class="ui-processingcircle-container ui-body-' + d + '">' + '<div class="ui-processingcircle">' + '<div class="ui-processingcircle-hand ui-bar-' + d + '" />' + '</div>' + '</div>'), this.element.find('.ui-processingcircle-container').remove(), this.element.append(this.html), this.circle = this.element.find('.ui-processingcircle'), b && !b.is(':visible') ? b.bind('pageshow', function () {
                c.refresh();
            }) : this.refresh();
        },
        refresh: function () {
            this._isRunning || (this.circle.addClass('ui-processingcircle-spin'), this._isRunning = !0);
        },
        stop: function () {
            this._isRunning && (this.circle.removeClass('ui-processingcircle-spin'), this.element.trigger('stop'), this._isRunning = !1);
        },
        isRunning: function () {
            return this._isRunning;
        },
        destroy: function () {
            this.stop(), this.html.detach();
        }
    }), a(document).bind('pagecreate', function (b) {
        a(a.todons.processingcircle.prototype.options.initSelector, b.target).not(':jqmData(role=\'none\'), :jqmData(role=\'nojs\')').processingcircle();
    });
}(jQuery));
(function (a, b, c) {
    a.widget('todons.progressbar', a.mobile.widget, {
        options: {
            value: 0,
            max: 100,
            theme: 'b'
        },
        bar: null,
        box: null,
        oldValue: 0,
        currentValue: 0,
        delta: 0,
        value: function (a) {
            if (a === c)
                return this.currentValue;
            if (typeof a != 'number' || parseInt(a) < 0)
                a = 0;
            a = a > this.options.max ? this.options.max : a, this.currentValue = a, this.oldValue !== this.currentValue && (this.delta = this.currentValue - this.oldValue, this.delta = Math.min(this.delta, 0), this.delta = Math.max(this.delta, this.options.max), this.oldValue = this.currentValue, this._startProgress());
        },
        _startProgress: function () {
            var a = 100 * this.currentValue / this.options.max, b = a + '%';
            this.bar.width(b);
        },
        _create: function () {
            var b, c, d = a('<div class="ui-progressbar"><div class="ui-boxImg " ></div><div class="ui-barImg " ></div></div>');
            a(this.element).append(d), c = a(this.element).find('.ui-progressbar'), this.box = c.find('div.ui-boxImg'), this.bar = c.find('div.ui-barImg');
            var e = this.element.jqmData('options');
            a.extend(this.options, e), this._setOption('theme', this.options.theme), b = this.options.value ? this.options.value : 0, this.value(b);
        },
        _setOption: function (a, b) {
            a == 'theme' && this._setTheme(b);
        },
        _setTheme: function (a) {
            a = a || this.element.data('theme') || this.element.closest(':jqmData(theme)').attr('data-theme') || 'b', this.bar.addClass('ui-bar-' + a);
        },
        destroy: function () {
            this.html.detach();
        }
    }), a(document).bind('pagecreate', function (b) {
        a(b.target).find(':jqmData(role=\'progressbar\')').progressbar();
    });
}(jQuery, this));
(function (a, b, c) {
    a.widget('todons.progressbar_dialog', a.todons.widgetex, {
        options: {
            value: 0,
            max: 100
        },
        _htmlProto: {
            source: a('<div><div class=\'ui-progressbar-dialog\'>\t<div class=\'ui-upper-progressbar-container\'>\t\t<div class=\'ui-text1\'>TextText...</div>\t\t<div class=\'ui-progressbar_dialog\' data-role=\'progressbar\'></div>\t\t<span class=\'ui-text2\'>Text </span>\t\t<span class=\'ui-text3\'>TextTextText</span>\t\t</div>\t<div class=\'ui-cancel-container\'>\t\t<a href=\'#\' class=\'ui-cancel-button ui-corner-all\' data-role=\'button\' data-inline=\'true\' data-rel=\'back\'>\t\t\tCancel\t\t</a>\t</div></div></div>'),
            ui: {
                dialogContainer: 'div.ui-progressbar-dialog',
                progressBar_in_dialog: 'div.ui-progressbar_dialog'
            }
        },
        _create: function () {
            this._ui.dialogContainer.insertBefore(this.element), this._ui.progressBar_in_dialog.progressbar();
        },
        value: function (a) {
            this._ui.progressBar_in_dialog.progressbar('value', a);
        },
        getValue: function () {
            return this._ui.progressBar_in_dialog.progressbar('value');
        }
    }), a(document).bind('pagecreate', function (b) {
        a(b.target).find(':jqmData(role=\'progressbar_dialog\')').progressbar_dialog();
    });
}(jQuery, this));
(function (a, b) {
    a.widget('todons.shortcutscroll', a.mobile.widget, {
        options: { initSelector: ':jqmData(shortcutscroll)' },
        _create: function () {
            var b = this.element, c = this, d, e = b.closest(':jqmData(role="page")');
            this.scrollview = b.closest('.ui-scrollview-clip'), this.shortcutsContainer = a('<div class="ui-shortcutscroll"/>'), this.shortcutsList = a('<ul></ul>'), this.shortcutsContainer.append(a('<div class="ui-shortcutscroll-popup"></div>')), d = this.shortcutsContainer.find('.ui-shortcutscroll-popup'), this.shortcutsContainer.append(this.shortcutsList), this.scrollview.append(this.shortcutsContainer), this.lastListItem = b.children().last(), this.scrollview.find('.ui-scrollbar').hide();
            var f = function (b) {
                var e = a(b).position().top, f = c.lastListItem.outerHeight(!0) + c.lastListItem.position().top, g = c.scrollview.height(), h = f - g;
                e = e > h ? h : e, e = Math.max(e, 0), c.scrollview.scrollview('scrollTo', 0, -e);
                var i = c.scrollview.offset();
                d.text(a(b).text()).offset({
                    left: i.left + (c.scrollview.width() - d.width()) / 2,
                    top: i.top + (c.scrollview.height() - d.height()) / 2
                }).show();
            };
            this.shortcutsList.bind('touchstart mousedown vmousedown touchmove vmousemove vmouseover', function (b) {
                var d = a.mobile.todons.targetRelativeCoordsFromEvent(b), e = c.shortcutsList.offset();
                b.target.tagName.toLowerCase() === 'li' && (d.x += a(b.target).offset().left - e.left, d.y += a(b.target).offset().top - e.top), c.shortcutsList.find('li').each(function () {
                    var b = a(this), c = b.offset().left - e.left, g = b.offset().top - e.top, h = c + Math.abs(b.outerWidth(!0)), i = g + Math.abs(b.outerHeight(!0));
                    return d.x >= c && d.x <= h && d.y >= g && d.y <= i ? (f(a(b.data('divider'))), !1) : !0;
                }), b.preventDefault(), b.stopPropagation();
            }).bind('touchend mouseup vmouseup vmouseout', function () {
                d.hide();
            }), e && !e.is(':visible') ? e.bind('pageshow', function () {
                c.refresh();
            }) : this.refresh(), b.bind('updatelayout', function () {
                c.refresh();
            });
        },
        refresh: function () {
            var b = this, c, d;
            this.shortcutsList.find('li').remove();
            var e = this.element.find('.ui-li-divider'), f = this.element.find('li:not(.ui-li-divider))');
            e = e.filter(':visible'), f = f.filter(':visible');
            if (e.length < 2) {
                this.shortcutsList.hide();
                return;
            }
            this.shortcutsList.show(), this.lastListItem = f.last(), e.each(function (c, d) {
                b.shortcutsList.append(a('<li>' + a(d).text() + '</li>').data('divider', d));
            }), c = e.first().position().top, this.shortcutsContainer.css('top', c), d = c + this.shortcutsContainer.outerHeight() + 'px', this.scrollview.css('min-height', d);
        }
    }), a(document).bind('pagecreate create', function (b) {
        a(a.todons.shortcutscroll.prototype.options.initSelector, b.target).not(':jqmData(role=\'none\'), :jqmData(role=\'nojs\')').shortcutscroll();
    });
}(jQuery));
(function (a, b) {
    a.widget('mobile.simple', a.mobile.widget, {
        options: {
            initSelector: ':jqmData(role=\'simple\')',
            theme: null,
            updateInterval: 1000
        },
        _constants: {
            status_stopped: 0,
            status_running: 1,
            startstop_class: 'startstopbtn'
        },
        _data: {
            timer: 0,
            status: 0
        },
        _setButtonText: function (a, b) {
            $span = a.element.find('a.' + a._constants.startstop_class + ' span.ui-btn-text'), $span.text(b);
        },
        _reset: function (a) {
            $number = a.element.find('.number'), $number.text(0);
        },
        _increaseNumber: function (a) {
            return $number = a.element.find('.number'), value = parseInt($number.text()), $number.text(value + 1), !0;
        },
        _start: function (a) {
            a._data.timer = setInterval(function () {
                return a._increaseNumber(a);
            }, a.options.updateInterval), a._data.status = a._constants.status_running, a._setButtonText(a, 'Stop counter');
        },
        _stop: function (a) {
            clearTimeout(a._data.timer), a._data.status = a._constants.status_stopped, a._setButtonText(a, 'Start counter');
        },
        _create: function () {
            var b = this, c = b.element.closest('.ui-page');
            b.element.append('<p>This is the Simple Widget. It can be used as a starting point or learning aid for building new JQM widgets.</p>'), $number = a('<span class="number">'), $number.css({
                'text-align': 'center',
                'font-size': '2em',
                'font-weight': 'bold',
                display: 'block',
                'line-height': '2em'
            }), b.element.append($number), $button = a('<a href="#">Start counter</a>'), $button.buttonMarkup({ theme: b.options.theme }), $button.addClass(b._constants.startstop_class), $button.attr('data-' + (a.mobile.ns || '') + 'role', 'button'), b.element.append($button), $button.bind('vclick', function (a) {
                b._data.status == 0 ? b._start(b) : b._stop(b), a.stopPropagation();
            }), c && (c.bind('pagebeforehide', function () {
                b._stop(b);
            }), c.bind('pagehide', function () {
                b._reset(b);
            }), c.bind('pageshow', function () {
                b._reset(b);
            }));
        },
        _destroy: function () {
            this.html.remove();
        },
        _setOption: function (a, b) {
            if (b !== this.options[a]) {
                switch (a) {
                case 'updateInterval':
                    this.options.updateInterval = b;
                    break;
                case 'disabled':
                    console.log(b), this.element[b ? 'addClass' : 'removeClass']('ui-disabled'), this.options.disabled = b;
                }
                this.refresh();
            }
        },
        refresh: function () {
            this._data.status == this._constants.status_running && (this._stop(this), this._start(this));
        }
    }), a(document).bind('pagecreate create', function (b) {
        a(a.mobile.simple.prototype.options.initSelector, b.target).simple();
    });
}(jQuery));
(function (a, b) {
    a.widget('todons.singleimagedisplay', a.mobile.widget, {
        options: {
            initSelector: 'img:jqmData(role=singleimagedisplay)',
            noContent: null,
            source: null
        },
        image: null,
        imageParent: null,
        cover: null,
        usingNoContents: !1,
        _setImgSrc: function () {
            if (this.usingNoContents)
                this._showNoContents();
            else {
                var a = this;
                this.image.attr('src', this.options.source), this.image.error(function () {
                    a._imageErrorHandler();
                }), this.cover.hide(), this.imageParent.append(this.image), this.image.show();
            }
        },
        _imageErrorHandler: function () {
            this.usingNoContents = !0, this._showNoContents(), this.element.trigger('init');
        },
        _showNoContents: function () {
            var a = this.options.noContent == null;
            a ? (this.resize(this.cover), this.image.detach(), this.cover.show()) : (this.image.unbind('error'), this.image.attr('src', this.options.noContent), this.cover.hide(), this.imageParent.append(this.image), this.resize(this.image), this.image.show());
        },
        _create: function () {
            var b = this;
            this.image = this.element.clone().removeAttr('data-role').removeAttr('id').addClass('ui-singleimagedisplay').css('float', 'left'), this.imageParent = this.element.parent(), this.element.css('float', 'left'), this.cover = a('<div class="ui-singleimagedisplay-nocontent"/>'), this.cover.hide(), this.imageParent.append(this.cover), this.options.source = this.element.jqmData('src'), this.image.load(function () {
                b.usingNoContents = !1, b.resize(b.image), b.image.show(), b.element.trigger('init');
            }), this.image.error(function () {
                b._imageErrorHandler(), b.element.trigger('init');
            }), this._setImgSrc(), b.image.is(':visible') && (b.resize(b.image), this.element.trigger('init'));
            var c = this.element.closest('.ui-page');
            c && c.bind('pageshow', function () {
                b.usingNoContents ? b.resize(b.cover) : b.resize(b.image), b.element.trigger('init');
            }), a(window).resize(function () {
                b.usingNoContents ? b.resize(b.cover) : b.resize(b.image), b.element.trigger('init');
            });
        },
        resize: function (b) {
            var c = 0, d = 0, e = a('<img/>').css('width', '0px').css('height', '0px').css('opacity', '0').css('width', 'inherit').css('height', 'inherit').insertAfter(b), f = b[0].nodeName === 'IMG', g = f ? b[0].naturalWidth : b.width(), h = f ? b[0].naturalHeight : b.height(), i = g * h, j = i == 0 ? 1 : g / h, k = window.innerWidth, l = window.innerHeight, m = e.width(), n = e.height();
            e.remove();
            var o = m > 0 || n > 0;
            o ? (c = m, d = n) : (c = k, d = l), c / d > j ? c = d * j : d = c / j, b.width(c), b.height(d);
        },
        _setOption: function (a, b) {
            if (b == this.options[a])
                return;
            switch (a) {
            case 'noContent':
                this.options.noContent = b, this._setImgSrc();
                break;
            case 'source':
                this.options.source = b, this.usingNoContents = !1, this._setImgSrc(), this.resize(this.image);
                break;
            default:
            }
        }
    }), a(document).bind('pagecreate', function (b) {
        a(a.todons.singleimagedisplay.prototype.options.initSelector, b.target).singleimagedisplay();
    });
}(jQuery));
(function (a, b, c) {
    a.widget('todons.todonsslider', a.mobile.widget, {
        options: {
            theme: 'c',
            popupEnabled: !0,
            initDeselector: 'select, .useJqmSlider'
        },
        popup: null,
        handle: null,
        handleText: null,
        _create: function () {
            this.currentValue = null, this.popupVisible = !1;
            var b = this, d = a(this.element), e, f, g, h, i, j;
            d.slider(), d.hide(), this.options.theme = this.element.data('theme') || this.options.theme, e = 'ui-body-' + this.options.theme, b.popup = a('<div class="' + e + ' ui-slider-popup ui-shadow"></div>');
            var k = d.attr('data-popupenabled');
            k !== c && (b.options.popupEnabled = k === 'true'), f = d.next('.ui-slider'), b.handle = f.find('.ui-slider-handle'), f.removeClass('ui-btn-corner-all'), f.find('*').removeClass('ui-btn-corner-all'), f.before(b.popup), b.popup.hide(), b.handleText = f.find('.ui-btn-text'), b.updateSlider(), this.element.bind('change', function () {
                b.updateSlider();
            }), b.handle.bind('vmousedown', function () {
                b.showPopup();
            }), f.add(document).bind('vmouseup', function () {
                b.hidePopup();
            });
        },
        positionPopup: function () {
            var a = this.handle.offset();
            this.popup.offset({
                left: a.left + (this.handle.width() - this.popup.width()) / 2,
                top: a.top - this.popup.outerHeight() - 5
            });
        },
        updateSlider: function () {
            this.positionPopup(), this.handle.removeAttr('title');
            var a = this.element.val();
            a !== this.currentValue && (this.currentValue = a, this.handleText.html(a), this.popup.html(a), this.element.trigger('update', a));
        },
        showPopup: function () {
            var a = this.options.popupEnabled && !this.popupVisible;
            a && (this.handleText.hide(), this.popup.show(), this.popupVisible = !0);
        },
        hidePopup: function () {
            var a = this.options.popupEnabled && this.popupVisible;
            a && (this.handleText.show(), this.popup.hide(), this.popupVisible = !1);
        },
        _setOption: function (a, b) {
            var c = b !== this.options[a];
            switch (a) {
            case 'popupEnabled':
                c && (this.options.popupEnabled = b, this.options.popupEnabled ? this.updateSlider() : this.hidePopup());
            }
        }
    }), a(document).bind('pagebeforecreate', function (d) {
        a.data(b, 'jqmSliderInitSelector') === c && (a.data(b, 'jqmSliderInitSelector', a.mobile.slider.prototype.options.initSelector), a.mobile.slider.prototype.options.initSelector = null);
    }), a(document).bind('pagecreate', function (c) {
        var d = a.data(b, 'jqmSliderInitSelector');
        a(c.target).find(d).not(a.todons.todonsslider.prototype.options.initDeselector).todonsslider(), a(c.target).find(d).filter('select').slider();
    });
}(jQuery, this));
(function (a) {
    a.widget('todons.swipelist', a.mobile.widget, {
        options: { theme: null },
        _create: function () {
            var a = this.element.jqmData('theme') || this.options.theme || this.element.parent().jqmData('theme') || 'c';
            this.options.theme = a, this.refresh();
        },
        refresh: function () {
            this._cleanupDom();
            var b = this, c, d;
            c = 'ui-body-' + this.options.theme, this.element.hasClass('ui-listview') || this.element.listview(), this.element.addClass('ui-swipelist'), d = this.element.find(':jqmData(role="swipelist-item-cover")'), d.each(function () {
                var d = a(this), e = c, f = d.closest('li');
                f.addClass('ui-swipelist-item'), d.addClass('ui-swipelist-item-cover');
                var g = f.attr('class').match(/ui\-body\-[a-z]|ui\-bar\-[a-z]/);
                g && (e = g[0]), d.addClass(e), d.has('.ui-swipelist-item-cover-inner').length === 0 && d.wrapInner(a('<span/>').addClass('ui-swipelist-item-cover-inner'));
                if (!d.data('animateRight') || !d.data('animateLeft'))
                    d.data('animateRight', function () {
                        b._animateCover(d, 100);
                    }), d.data('animateLeft', function () {
                        b._animateCover(d, 0);
                    });
                f.bind('swipeleft', d.data('animateLeft')), d.bind('swiperight', d.data('animateRight')), f.find('.ui-btn').bind('click', d.data('animateLeft'));
            });
        },
        _cleanupDom: function () {
            var b = this, c, d;
            c = 'ui-body-' + this.options.theme, this.element.removeClass('ui-swipelist'), d = this.element.find(':jqmData(role="swipelist-item-cover")'), d.each(function () {
                var b = a(this), d = c, e, f, g = b.closest('li');
                g.removeClass('ui-swipelist-item'), b.removeClass('ui-swipelist-item-cover');
                var h = g.attr('class'), i = h && h.match(/ui\-body\-[a-z]|ui\-bar\-[a-z]/);
                i && (d = i[0]), b.removeClass(d), f = b.find('.ui-swipelist-item-cover-inner'), f.children().unwrap(), e = f.text(), e && (b.append(e), f.remove()), b.data('animateRight') && b.data('animateLeft') && (b.unbind('swiperight', b.data('animateRight')), g.unbind('swipeleft', b.data('animateLeft')), g.find('.ui-btn').unbind('click', b.data('animateLeft')), b.data('animateRight', null), b.data('animateLeft', null));
            });
        },
        _animateCover: function (a, b) {
            var c = {
                easing: 'linear',
                duration: 'fast',
                queue: !0,
                complete: function () {
                    a.trigger('animationComplete');
                }
            };
            a.stop(), a.clearQueue(), a.animate({ left: '' + b + '%' }, c);
        },
        destroy: function () {
            this._cleanupDom();
        }
    }), a(document).bind('pagecreate', function (b) {
        a(b.target).find(':jqmData(role=\'swipelist\')').swipelist();
    });
}(jQuery));
(function (a, b) {
    a.widget('todons.toggleswitch', a.todons.widgetex, {
        options: {
            checked: !0,
            initSelector: ':jqmData(role=\'toggleswitch\')'
        },
        _htmlProto: {
            source: a('<div><div id=\'toggleswitch\' class=\'ui-toggleswitch\'>    <div id=\'toggleswitch-inner-active\' class=\'toggleswitch-inner-active ui-btn ui-btn-corner-all ui-shadow ui-btn-down-c ui-btn-active\'>        <a id=\'toggleswitch-button-t-active\' class=\'toggleswitch-button-inside\'></a>    </div>    <div id=\'toggleswitch-inner-normal\' class=\'ui-btn ui-btn-corner-all ui-shadow ui-btn-down-c\'>        <a id=\'toggleswitch-button-t\' class=\'toggleswitch-button-inside toggleswitch-button-transparent\'></a>        <a id=\'toggleswitch-button-f\' class=\'toggleswitch-button-inside\'></a>    </div>    <a id=\'toggleswitch-button-outside-ref\' class=\'toggleswitch-button-outside toggleswitch-button-transparent\'></a>    <a id=\'toggleswitch-button-outside-real\' class=\'toggleswitch-button-outside toggleswitch-button-transparent\'></a></div></div>'),
            ui: {
                outer: '#toggleswitch',
                normalBackground: '#toggleswitch-inner-normal',
                activeBackground: '#toggleswitch-inner-active',
                initButtons: '#toggleswitch-button-t-active',
                tButton: '#toggleswitch-button-t',
                fButton: '#toggleswitch-button-f',
                realButton: '#toggleswitch-button-outside-real',
                refButton: '#toggleswitch-button-outside-ref'
            }
        },
        _value: {
            attr: 'data-' + (a.mobile.ns || '') + 'checked',
            signal: 'changed'
        },
        _create: function () {
            var b = this;
            this.element.css('display', 'none').after(this._ui.outer), this._ui.outer.find('a').buttonMarkup(), a.mobile.browser.ie && (this._ui.outer.find('*').removeClass('toggleswitch-button-transparent'), this._ui.normalBackground.find('*').css('opacity', 0), this._ui.activeBackground.find('*').css('opacity', 0), this._ui.refButton.add(this._ui.refButton.find('*')).css('opacity', 0), this._ui.realButton.add(this._ui.realButton.find('*')).css('opacity', 0), this._ui.initButtons.add(this._ui.initButtons.find('*')).add(this._ui.fButton.find('*')).add(this._ui.fButton).css('opacity', 1)), a.extend(this, { _initial: !0 }), this._ui.realButton.add(this._ui.normalBackground).bind('vclick', function (a) {
                b._setChecked(!b.options.checked), a.stopPropagation();
            });
        },
        _makeTransparent: function (b, c) {
            a.mobile.browser.ie ? b.add(b.find('*')).css('opacity', c ? 0 : 1) : b[c ? 'addClass' : 'removeClass']('toggleswitch-button-transparent');
        },
        _setDisabled: function (b) {
            a.todons.widgetex.prototype._setDisabled.call(this, b), this._ui.outer[b ? 'addClass' : 'removeClass']('ui-disabled');
        },
        _setChecked: function (c) {
            this.options.checked != c && (this.options.checked === b ? this._makeTransparent(this._ui[(c ? 'normal' : 'active') + 'Background'], !0) : (this._ui.refButton.offset(this._ui[(c ? 't' : 'f') + 'Button'].offset()), this._ui.realButton.offset(this._ui[(c ? 'f' : 't') + 'Button'].offset()), this._initial && (this._makeTransparent(this._ui.outer.find('a'), !0), this._makeTransparent(this._ui.realButton, !1), this._initial = !1), this._ui.realButton.animate({ top: this._ui.refButton.position().top }), this._ui.normalBackground.animate({ opacity: c ? 0 : 1 }), this._ui.activeBackground.animate({ opacity: c ? 1 : 0 })), this.options.checked = c, this.element.attr('data-' + (a.mobile.ns || '') + 'checked', c), this._setValue(c));
        }
    }), a(document).bind('pagecreate create', function (b) {
        a(a.todons.toggleswitch.prototype.options.initSelector, b.target).not(':jqmData(role=\'none\'), :jqmData(role=\'nojs\')').toggleswitch();
    });
}(jQuery));
(function (a, b) {
    a.widget('todons.triangle', a.todons.widgetex, {
        options: {
            extraClass: '',
            offset: null,
            color: b,
            location: 'top',
            initSelector: ':jqmData(role=\'triangle\')'
        },
        _create: function () {
            var b = a('<div></div>', { 'class': 'ui-triangle' });
            a.extend(this, { _triangle: b }), this.element.addClass('ui-triangle-container').append(b);
        },
        _setOffset: function (b) {
            null !== b && (this._triangle.css('left', b), this.options.offset = b, this.element.attr('data-' + (a.mobile.ns || '') + 'offset', b));
        },
        _setExtraClass: function (b) {
            this._triangle.addClass(b), this.options.extraClass = b, this.element.attr('data-' + (a.mobile.ns || '') + 'extra-class', b);
        },
        _setColor: function (b) {
            this._triangle.css('border-bottom-color', b), this._triangle.css('border-top-color', b), this.options.color = b, this.element.attr('data-' + (a.mobile.ns || '') + 'color', b);
        },
        _setLocation: function (b) {
            this.element.removeClass('ui-triangle-container-' + this.options.location).addClass('ui-triangle-container-' + b), this._triangle.removeClass('ui-triangle-' + this.options.location).addClass('ui-triangle-' + b), this.options.location = b, this.element.attr('data-' + (a.mobile.ns || '') + 'location', b);
        }
    }), a(document).bind('pagecreate create', function (b) {
        a(a.todons.triangle.prototype.options.initSelector, b.target).not(':jqmData(role=\'none\'), :jqmData(role=\'nojs\')').triangle();
    });
}(jQuery));
(function (a, b) {
    a.widget('todons.volumecontrol', a.todons.widgetex, {
        options: {
            volume: 0,
            basicTone: !1,
            title: 'Volume',
            initSelector: ':jqmData(role=\'volumecontrol\')'
        },
        _htmlProto: {
            source: a('<div><div class=\'ui-volumecontrol ui-volumecontrol-background ui-corner-all\' id=\'volumecontrol\'>    <h1 id=\'volumecontrol-title\'></h1>    <div class=\'ui-volumecontrol-icon\'></div>    <div id=\'volumecontrol-indicator\' class=\'ui-volumecontrol-indicator\'>        <div id=\'volumecontrol-bar\' class=\'ui-volumecontrol-level\'></div>    </div></div></div>'),
            ui: {
                container: '#volumecontrol',
                volumeImage: '#volumecontrol-indicator',
                bar: '#volumecontrol-bar'
            }
        },
        _value: {
            attr: 'data-' + (a.mobile.ns || '') + 'volume',
            signal: 'volumechanged'
        },
        _create: function () {
            var b = this, c = function (b, c) {
                    var d = a(c.target), e = a.mobile.todons.targetRelativeCoordsFromEvent(c);
                    return d.hasClass('ui-volumecontrol-level') && (e.y += d.offset().top - b.offset().top), e.y;
                };
            a.mobile.browser.ie && this._ui.container.css('background', 'none'), this._ui.bar.remove(), this._ui.container.insertBefore(this.element).popupwindow({
                overlayTheme: '',
                fade: !1,
                shadow: !1
            }), this.element.css('display', 'none'), a.extend(b, {
                _isOpen: !1,
                _dragging: !1,
                _volumeElemStack: []
            }), this._ui.container.bind('closed', function (a) {
                b._isOpen = !1;
            }), this._ui.volumeImage.bind('vmousedown', function (d) {
                b._dragging = !0, b._setVolume((1 - c(b._ui.volumeImage, d) / a(this).outerHeight()) * b._maxVolume()), d.preventDefault();
            }), this._ui.volumeImage.bind('vmousemove', function (d) {
                b._dragging && (b._setVolume((1 - c(b._ui.volumeImage, d) / a(this).outerHeight()) * b._maxVolume()), d.preventDefault());
            }), a(document).bind('vmouseup', function (a) {
                b._dragging && (b._dragging = !1);
            }), a(document).bind('keydown', function (c) {
                if (b._isOpen) {
                    var d = b._maxVolume(), e = -1;
                    switch (c.keyCode) {
                    case a.mobile.keyCode.UP:
                    case a.mobile.keyCode.DOWN:
                    case a.mobile.keyCode.HOME:
                    case a.mobile.keyCode.END:
                        c.preventDefault();
                    }
                    switch (c.keyCode) {
                    case a.mobile.keyCode.UP:
                        e = Math.min(b.options.volume + 1, d);
                        break;
                    case a.mobile.keyCode.DOWN:
                        e = Math.max(b.options.volume - 1, 0);
                        break;
                    case a.mobile.keyCode.HOME:
                        e = 0;
                        break;
                    case a.mobile.keyCode.END:
                        e = d;
                    }
                    e != -1 && b._setVolume(e);
                }
            });
        },
        _setBasicTone: function (b) {
            while (this._volumeElemStack.length > 0)
                this._volumeElemStack.pop().remove();
            this.options.basicTone = b, this.element.attr('data-' + (a.mobile.ns || '') + 'basic-tone', b), this._setVolume(this.options.volume);
        },
        _setTitle: function (b) {
            this.options.title = b, this.element.attr('data-' + (a.mobile.ns || '') + 'title', b), this._ui.container.find('#volumecontrol-title').text(b);
        },
        _setVolume: function (b) {
            var c = Math.max(0, Math.min(b, this._maxVolume())), d = Math.floor(c), e;
            c = d + (c - d > 0.5 ? 1 : 0), this.options.volume = c, this.element.attr('data-' + (a.mobile.ns || '') + 'volume', c), this._setVolumeIcon(), this._setValue(c);
        },
        _maxVolume: function () {
            return this.options.basicTone ? 7 : 15;
        },
        _setVolumeIcon: function () {
            if (this._volumeElemStack.length === 0) {
                var a = 63, b = this._ui.volumeImage.width(), c = this._ui.volumeImage.height(), d = (b - a) / this._maxVolume(), e = 2 * this._maxVolume() + 1, f = c / e, g = c - 2 * f, h = this._ui.volumeImage.offset(), i;
                for (var j = this._volumeElemStack.length; j < this._maxVolume(); j++)
                    i = this._ui.bar.clone().css({
                        width: a + j * d,
                        height: f
                    }).appendTo(this._ui.volumeImage).offset({
                        left: h.left + (b - (a + j * d)) / 2,
                        top: h.top + g - j * 2 * f
                    }), this._volumeElemStack.push(i);
            }
            for (var j = 0; j < this._maxVolume(); j++)
                j < this.options.volume ? this._volumeElemStack[j].addClass('ui-volumecontrol-level-set') : this._volumeElemStack[j].removeClass('ui-volumecontrol-level-set');
        },
        open: function () {
            this._isOpen || (this._setBasicTone(this.options.basicTone), this._ui.container.popupwindow('open', window.innerWidth / 2, window.innerHeight / 2), this._isOpen = !0);
        },
        close: function () {
            this._isOpen && (this._ui.container.popupwindow('close'), this._isOpen = !1);
        }
    }), a(document).bind('pagecreate create', function (b) {
        a(a.todons.volumecontrol.prototype.options.initSelector, b.target).not(':jqmData(role=\'none\'), :jqmData(role=\'nojs\')').volumecontrol();
    });
}(jQuery));