define([
    "dojo/_base/declare",
    "dojo/parser",
    "dojo/ready",
    "dojo/Evented",
    "dojo/dom-construct",
    "dojo/i18n!./nls/Pagination.js",
    "dojo/on",
    "dojo/query",
    "dojo/text!./templates/Pagination.html",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetBase",
    "dojo/number"
],
function (declare, parser, ready, Evented, domConstruct, i18n, on, query, template, _TemplatedMixin, _WidgetBase, number) {
    declare("myApp.Pagination", [_WidgetBase, _TemplatedMixin, Evented], {
        // put methods, attributes, etc. here

        // dijit HTML
        templateString: template,

        constructor: function (options, srcRefNode) {
            // set default settings
            this._setPublicDefaults();
            // mix in settings and defaults
            declare.safeMixin(this, options);
            // private variables
            this._setPrivateDefaults();
            // watch updates of public properties and update the widget accordingly
            this.watch("totalResults", this.render);
            this.watch("resultsPerPage", this.render);
            this.watch("currentPage", this.render);
            this.watch("pagesPerSide", this.render);
            this.watch("showPreviousNext", this.render);
            this.watch("showFirstLast", this.render);
            // containing node
            this.domNode = srcRefNode;
        },
        /* ---------------- */
        /* Public Functions */
        /* ---------------- */
        // start widget
        startup: function () {
            if (!this.domNode) {
                console.log('domNode is undefined.');
                this.destroy();
                return;
            }
            // create pagination links
            this.render();
            // set widget ready
            this.loaded = true;
            this.emit("load", {});
        },

        postCreate: function(){
            // setup connections
            this._createEventHandlers();
        },

        destroy: function () {
            var i;
            // if delegations
            if (this._eventHandlers) {
                // disconnect all events
                for (i = 0; i < this._eventHandlers.length; i++) {
                    this._eventHandlers[i].remove();
                }
            }
            // remove html
            domConstruct.empty(this.domNode);
            this.inherited(arguments);
        },

        render: function () {
            var _self = this;
            // variables
            _self._html = '';
            _self._startHTML = '';
            _self._middleHTML = '';
            _self._endHTML = '';
            _self._middleCount = 0;
            _self._lastMiddle = 0;
            _self._firstMiddle = 0;
            _self._npCount = 0;
            _self._helipText = '';
            _self._totalMiddlePages = (2 * _self.pagesPerSide) + 1;
            _self._helipText = _self.helip || "";
            _self.currentResultStart = _self.currentPage * _self.resultsPerPage;
            _self.currentResultEnd = _self.currentResultStart + _self.resultsPerPage;
            // if pagination is necessary
            if (_self.resultsPerPage && (_self.totalResults > _self.resultsPerPage)) {
                // create pagination list
                _self._html += '<ul role="presentation">';
                // determine offset links
                if (_self.currentPage) {
                    _self._currentIndex = parseInt(_self.currentPage, 10);
                } else {
                    _self._currentIndex = 1;
                }
                // first link
                _self._firstPage = 1;
                // previous link
                _self._previousPage = _self._currentIndex - 1;
                // next link
                _self._nextPage = _self._currentIndex + 1;
                // last link
                _self.totalPages = Math.ceil(_self.totalResults / _self.resultsPerPage);
                // determine next and previous count
                if (_self.showPreviousNext) {
                    _self._npCount = 2;
                }
                // determine pagination total size
                _self._paginationCount = _self._npCount + _self._totalMiddlePages;
                // if pages matches size of pagination
                if (_self.totalPages === _self._paginationCount) {
                    _self._helipText = '';
                }
                // pagination previous
                if (_self.showPreviousNext) {
                    var firstClass = _self._itemDisabledClass,
                        firstOffset = '';
                    if (_self._currentIndex > 1) {
                        firstClass = _self._itemEnabledClass;
                        firstOffset = 'data-page="' + _self._previousPage + '"';
                    }
                    _self._startHTML += '<li role="button" tabindex="0" title="' + _self._i18n.pagination.previousTitle + '" class="' + _self._itemClass + ' ' + _self._itemPreviousClass + ' ' + firstClass + '" ' + firstOffset + '><div><span>' + _self._i18n.pagination.previous + '</span></div></li>';
                }
                // always show first and last pages
                if (_self.showFirstLast) {
                    // pagination first page
                    if(_self._currentIndex > (_self.pagesPerSide + 1)){
                        _self._startHTML += '<li role="button" tabindex="0" class="' + _self._itemClass + ' ' + _self._itemFirstClass + ' ' + _self._itemEnabledClass + '" title="' + _self._i18n.pagination.first + '" data-page="' + _self._firstPage + '"><div><span>' + number.format(_self._firstPage) + _self._helipText + '</span></div></li>';
                    }
                    else {
                        _self._middleCount = _self._middleCount - 1;
                    }
                    // pagination last page
                    if(_self._currentIndex < (_self.totalPages - _self.pagesPerSide)){
                        _self._endHTML += '<li role="button" tabindex="0" class="' + _self._itemClass + ' ' + _self._itemLastClass + ' ' + _self._itemEnabledClass + '" title="' + _self._i18n.pagination.last + ' (' + number.format(_self.totalPages) + ')" data-page="' + _self.totalPages + '"><div><span>' + _self._helipText + number.format(_self.totalPages) + '</span></div></li>';
                    }
                    else {
                        _self._middleCount = _self._middleCount - 1;
                    }
                }
                // pagination next
                if (_self.showPreviousNext) {
                    var lastClass = _self._itemDisabledClass,
                        lastOffset = '';
                    if (_self._currentIndex < _self.totalPages) {
                        lastClass = _self._itemEnabledClass;
                        lastOffset = 'data-page="' + _self._nextPage + '"';
                    }
                    _self._endHTML += '<li role="button" tabindex="0" title="' + _self._i18n.pagination.nextTitle + '" class="' + _self._itemClass + ' ' + _self._itemNextClass + ' ' + lastClass + '" ' + lastOffset + '><div><span>' + _self._i18n.pagination.next + '</span></div></li>';
                }
                // create each pagination item
                for (var i = 1; i <= _self.totalPages; i++) {
                    if (i <= (_self._currentIndex + _self.pagesPerSide) && i >= (_self._currentIndex - _self.pagesPerSide)) {
                        if (_self._firstMiddle === 0) {
                            _self._firstMiddle = i;
                        }
                        _self._middleHTML += _self._createMiddleItem({
                            index: i,
                            currentIndex: _self._currentIndex
                        });
                        _self._middleCount++;
                        _self._lastMiddle = i;
                    }
                }
                // if last middle is last page
                if (_self._lastMiddle === _self.totalPages) {
                    // get remainderStart start
                    _self._remainderStart = _self._firstMiddle - 1;
                    // while not enough remainders
                    while (_self._middleCount < _self._totalMiddlePages) {
                        // if remainder start is less or equal to first page
                        if (_self._remainderStart <= _self._firstPage) {
                            // end while
                            break;
                        }
                        // add item to beginning of middle html
                        _self._middleHTML = _self._createMiddleItem({
                            index: _self._remainderStart,
                            currentIndex: _self._currentIndex
                        }) + _self._middleHTML;
                        // increase middle count
                        _self._middleCount++;
                        // decrease remainder start
                        _self._remainderStart--;
                    }
                }
                // if first middle is first page
                else if (_self._firstMiddle === _self._firstPage) {
                    // get remainderStart start
                    _self._remainderStart = _self._lastMiddle + 1;
                    // while not enough remainders
                    while (_self._middleCount < _self._totalMiddlePages) {
                        // if remainder start is greater or equal to last page
                        if (_self._remainderStart >= _self.totalPages) {
                            // end while
                            break;
                        }
                        // add item to end of middle html
                        _self._middleHTML += _self._createMiddleItem({
                            index: _self._remainderStart,
                            currentIndex: _self._currentIndex
                        });
                        // increase middle count
                        _self._middleCount++;
                        // increase remainder start
                        _self._remainderStart++;
                    }
                }
                // add up HTML
                _self._html += _self._startHTML + _self._middleHTML + _self._endHTML;
                // end pagination
                _self._html += '</ul>';
            }
            _self._html += '<div class="' + _self._clearClass + '"></div>';
            // insert into html
            _self.containerNode.innerHTML = _self._html;
            _self.emit("render", {});
        },

        /* ---------------- */
        /* Private Functions */
        /* ---------------- */

        // default settings
        _setPublicDefaults: function () {
            // Create public defaults here
            this.totalResults = 0;
            this.resultsPerPage = 10;
            this.currentPage = 0;
            // options
            this.pagesPerSide = 2;
            this.showPreviousNext = true;
            this.showFirstLast = true;
            this.helip = i18n.pagination.helip
			this.theme = 'dojoPage';
        },

        // set variables that aren't to be modified
        _setPrivateDefaults: function () {
            // Internationalization
            this._i18n = i18n;
            // connections
            this._eventHandlers = [];
            // css classes
            this._selectedClass = 'pagDijitSelected';
            this._newSelectedClass = 'pagDijitNewSelected';
			this._itemClass = 'pagDijitItem';
            this._itemEnabledClass = 'pagDijitItemEnabled';
            this._itemDisabledClass = 'pagDijitItemDisabled';
            this._itemMiddleClass = 'pagDijitItemMiddle';
            this._itemFirstClass = 'pagDijitItemFirst';
            this._itemLastClass = 'pagDijitItemLast';
            this._itemPreviousClass = 'pagDijitItemPrevious';
            this._itemNextClass = 'pagDijitItemNext';
            this._clearClass = 'pagDijitClear';
        },

        _createEventHandlers: function () {
            var _self = this;
            var pageClick = on(_self.containerNode, '[data-page]:click', function (evt) {
                query(this).addClass(this._newSelectedClass);
                // get offset number
                var selectedPage = parseInt(dojo.query(this).attr('data-page')[0], 10);
                var selectedResultStart = selectedPage * _self.resultsPerPage;
                var selectedResultEnd = selectedResultStart + _self.resultsPerPage;
                // event
                _self.emit("page", {
                    bubbles: false,
                    cancelable: false,
                    detail: {
                        selectedPage: selectedPage,
                        selectedResultStart: selectedResultStart,
                        selectedResultEnd: selectedResultEnd
                    }
                });
            });
            this._eventHandlers.push(pageClick);
        },

        _createMiddleItem: function (e) {
            // class
            var listClass = this._itemEnabledClass;
            if (e.index === e.currentIndex) {
                // if selected
                listClass = this._selectedClass;
            }
            // page list item
            return '<li role="button" tabindex="0" title="' + this._i18n.pagination.page + ' ' + number.format(e.index) + '" data-page="' + e.index + '" class="' + this._itemClass + ' ' + this._itemMiddleClass + ' ' + listClass + '"><div><span>' + number.format(e.index) + '</span></div></li>';
        }

    });
    ready(function(){
        // Call the parser manually so it runs after our widget is defined, and page has finished loading
        parser.parse();
    });
});