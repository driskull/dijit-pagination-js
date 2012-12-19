require([
    "dojo/Evented",
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dojo/i18n!./nls/Pagination.js",
    "dojo/on",
    "dojo/query",
    "dojo/text!./templates/Pagination.html",
    "dijit/_OnDijitClickMixin",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetBase",
    "dojo/number"
],
function (Evented, declare, domConstruct, i18n, on, query, template, _OnDijitClickMixin, _TemplatedMixin, _WidgetBase, number) {
    declare("dijit.Pagination", [Evented, _WidgetBase, _OnDijitClickMixin, _TemplatedMixin], {
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
            this.watch("totalResults", this.paginate);
            this.watch("resultsPerPage", this.paginate);
            this.watch("currentPage", this.paginate);
            this.watch("pagesPerSide", this.paginate);
            this.watch("showPreviousNext", this.paginate);
            this.watch("showFirstLast", this.paginate);
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
            this.paginate();
            // setup connections
            this._createEventHandlers();
            // set widget ready
            this.loaded = true;
            this.emit("load", {});
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

        paginate: function () {
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
            _self._helipText = _self.helip;

            // if pagination is necessary
            if (_self.resultsPerPage && (_self.totalResults > _self.resultsPerPage)) {
                // create pagination list
                _self._html += '<ul>';
                // determine offset links
                if (_self.currentPage) {
                    _self._currentIndex = parseInt(_self.currentPage, 10);
                } else {
                    _self._currentIndex = 1;
                }
                // first link
                _self._firstItem = 1;
                // previous link
                _self._previousItem = _self._currentIndex - 1;
                // next link
                _self._nextItem = _self._currentIndex + 1;
                // last link
                _self._lastItem = Math.ceil(_self.totalResults / _self.resultsPerPage);
                // determine next and previous count
                if (_self.showPreviousNext) {
                    _self._npCount = 2;
                }
                // determine pagination total size
                _self._paginationCount = _self._npCount + _self._totalMiddlePages;
                // if pages matches size of pagination
                if (_self._lastItem === _self._paginationCount) {
                    _self._helipText = '';
                }
                // pagination previous
                if (_self.showPreviousNext) {
                    var firstClass = _self._itemDisabledClass,
                        firstOffset = '';
                    if (_self._currentIndex > 1) {
                        firstClass = _self._itemEnabledClass;
                        firstOffset = 'data-page="' + _self._previousItem + '"';
                    }
                    _self._startHTML += '<li tabindex="0" title="' + _self._i18n.pagination.previous + '" class="' + _self._itemClass + ' ' + _self._itemPreviousClass + ' ' + firstClass + '" ' + firstOffset + '><div><span>' + _self._i18n.pagination.previous + '</span></div></li>';
                }
                // show first and last pages always
                if (_self.showFirstLast) {
                    // pagination first page
                    if(_self._currentIndex > (_self.pagesPerSide + 1)){
                        _self._startHTML += '<li tabindex="0" class="' + _self._itemClass + ' ' + _self._itemFirstClass + ' ' + _self._itemEnabledClass + '" title="' + _self._i18n.pagination.first + '" data-page="' + _self._firstItem + '"><div><span>' + number.format(_self._firstItem) + _self._helipText + '</span></div></li>';
                    }
                    else {
                        _self._middleCount = _self._middleCount - 1;
                    }
                    // pagination last page
                    if(_self._currentIndex < (_self._lastItem - _self.pagesPerSide)){
                        _self._endHTML += '<li tabindex="0" class="' + _self._itemClass + ' ' + _self._itemLastClass + ' ' + _self._itemEnabledClass + '" title="' + _self._i18n.pagination.last + ' (' + number.format(_self._lastItem) + ')" data-page="' + _self._lastItem + '"><div><span>' + _self._helipText + number.format(_self._lastItem) + '</span></div></li>';
                    }
                    else {
                        _self._middleCount = _self._middleCount - 1;
                    }
                }
                // pagination next
                if (_self.showPreviousNext) {
                    var lastClass = _self._itemDisabledClass,
                        lastOffset = '';
                    if (_self._currentIndex < _self._lastItem) {
                        lastClass = _self._itemEnabledClass;
                        lastOffset = 'data-page="' + _self._nextItem + '"';
                    }
                    _self._endHTML += '<li tabindex="0" title="' + _self._i18n.pagination.next + '" class="' + _self._itemClass + ' ' + _self._itemNextClass + ' ' + lastClass + '" ' + lastOffset + '><div><span>' + _self._i18n.pagination.next + '</span></div></li>';
                }
                // create each pagination item
                for (var i = 1; i <= _self._lastItem; i++) {
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
                if (_self._lastMiddle === _self._lastItem) {
                    // get remainderStart start
                    _self._remainderStart = _self._firstMiddle - 1;
                    // while not enough remainders
                    while (_self._middleCount < _self._totalMiddlePages) {
                        // if remainder start is less or equal to first page
                        if (_self._remainderStart <= _self._firstItem) {
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
                else if (_self._firstMiddle === _self._firstItem) {
                    // get remainderStart start
                    _self._remainderStart = _self._lastMiddle + 1;
                    // while not enough remainders
                    while (_self._middleCount < _self._totalMiddlePages) {
                        // if remainder start is greater or equal to last page
                        if (_self._remainderStart >= _self._lastItem) {
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
            this.emit("page", {});
        },

        /* ---------------- */
        /* Private Functions */
        /* ---------------- */

        // default settings
        _setPublicDefaults: function () {
            // Create public defaults here
            this.totalResults = 100;
            this.resultsPerPage = 5;
            this.currentPage = 0;



            this.pagesPerSide = 1;
            this.showPreviousNext = true;
            this.showFirstLast = true;


            this.helip = i18n.pagination.helip
			this.theme = 'dojoPage';
        },

        // set variables that aren't to be modified
        _setPrivateDefaults: function () {

            // Internationalization
            this._i18n = i18n;

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
            var itemClick = on(_self.containerNode, '[data-page]:click', function (event) {
                if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
                    // clicked
                    query(this).addClass(this._newSelectedClass);
                    // get offset number
                    var page = dojo.query(this).attr('data-page')[0];
                    _self.emit("select", {
                        page: page
                    });
                    _self.currentPage = page;
                    _self.paginate();
                }
            });
            this._eventHandlers.push(itemClick);
        },

        _createMiddleItem: function (e) {
            // class
            var listClass = this._itemEnabledClass;
            if (e.index === e.currentIndex) {
                // if selected
                listClass = this._selectedClass;
            }
            // page list item
            return '<li tabindex="0" title="' + this._i18n.pagination.page + ' ' + number.format(e.index) + '" data-page="' + e.index + '" class="' + this._itemClass + ' ' + this._itemMiddleClass + ' ' + listClass + '"><div><span>' + number.format(e.index) + '</span></div></li>';
        }

    });
});