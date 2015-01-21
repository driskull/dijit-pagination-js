define([
  "dojo/_base/declare",
  "dojo/_base/lang",
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
  function (declare, lang, Evented, domConstruct, i18n, on, query, template, _TemplatedMixin, _WidgetBase, number) {
    var Pagination = declare([_WidgetBase, _TemplatedMixin, Evented], {
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
          console.log('Pagination:: Error - domNode is undefined.');
          return;
        }
        // create pagination links
        this.render();
        // set widget ready
        this.loaded = true;
        this.emit("load", {});
      },

      postCreate: function () {
        // setup connections
        this._createEventHandlers();
      },

      render: function () {
        // variables
        this._html = '';
        this._startHTML = '';
        this._middleHTML = '';
        this._endHTML = '';
        this._middleCount = 0;
        this._lastMiddle = 0;
        this._firstMiddle = 0;
        this._npCount = 0;
        this._helipText = '';
        this._totalMiddlePages = (2 * this.pagesPerSide) + 1;
        this._helipText = this.helip || "";
        this.currentResultStart = this.currentPage * this.resultsPerPage;
        this.currentResultEnd = this.currentResultStart + this.resultsPerPage;
        // if pagination is necessary
        if (this.resultsPerPage && (this.totalResults > this.resultsPerPage)) {
          // create pagination list
          this._html += '<ul role="presentation">';
          // determine offset links
          if (this.currentPage) {
            this._currentIndex = parseInt(this.currentPage, 10);
          } else {
            this._currentIndex = 1;
          }
          // first link
          this._firstPage = 1;
          // previous link
          this._previousPage = this._currentIndex - 1;
          // next link
          this._nextPage = this._currentIndex + 1;
          // last link
          this.totalPages = Math.ceil(this.totalResults / this.resultsPerPage);
          // determine next and previous count
          if (this.showPreviousNext) {
            this._npCount = 2;
          }
          // determine pagination total size
          this._paginationCount = this._npCount + this._totalMiddlePages;
          // if pages matches size of pagination
          if (this.totalPages === this._paginationCount) {
            this._helipText = '';
          }
          // pagination previous
          if (this.showPreviousNext) {
            var firstClass = this._itemDisabledClass,
              firstOffset = '';
            if (this._currentIndex > 1) {
              firstClass = this._itemEnabledClass;
              firstOffset = 'data-page="' + this._previousPage + '"';
            }
            this._startHTML += '<li role="button" tabindex="0" title="' + this._i18n.pagination.previousTitle + '" class="' + this._itemClass + ' ' + this._itemPreviousClass + ' ' + firstClass + '" ' + firstOffset + '><div><span>' + this._i18n.pagination.previous + '</span></div></li>';
          }
          // always show first and last pages
          if (this.showFirstLast) {
            // pagination first page
            if (this._currentIndex > (this.pagesPerSide + 1)) {
              this._startHTML += '<li role="button" tabindex="0" class="' + this._itemClass + ' ' + this._itemFirstClass + ' ' + this._itemEnabledClass + '" title="' + this._i18n.pagination.firstTitle + '" data-page="' + this._firstPage + '"><div><span>' + number.format(this._firstPage) + this._helipText + '</span></div></li>';
            } else {
              this._middleCount = this._middleCount - 1;
            }
            // pagination last page
            if (this._currentIndex < (this.totalPages - this.pagesPerSide)) {
              this._endHTML += '<li role="button" tabindex="0" class="' + this._itemClass + ' ' + this._itemLastClass + ' ' + this._itemEnabledClass + '" title="' + this._i18n.pagination.lastTitle + ' (' + number.format(this.totalPages) + ')" data-page="' + this.totalPages + '"><div><span>' + this._helipText + number.format(this.totalPages) + '</span></div></li>';
            } else {
              this._middleCount = this._middleCount - 1;
            }
          }
          // pagination next
          if (this.showPreviousNext) {
            var lastClass = this._itemDisabledClass,
              lastOffset = '';
            if (this._currentIndex < this.totalPages) {
              lastClass = this._itemEnabledClass;
              lastOffset = 'data-page="' + this._nextPage + '"';
            }
            this._endHTML += '<li role="button" tabindex="0" title="' + this._i18n.pagination.nextTitle + '" class="' + this._itemClass + ' ' + this._itemNextClass + ' ' + lastClass + '" ' + lastOffset + '><div><span>' + this._i18n.pagination.next + '</span></div></li>';
          }
          // create each pagination item
          for (var i = 1; i <= this.totalPages; i++) {
            if (i <= (this._currentIndex + this.pagesPerSide) && i >= (this._currentIndex - this.pagesPerSide)) {
              if (this._firstMiddle === 0) {
                this._firstMiddle = i;
              }
              this._middleHTML += this._createMiddleItem({
                index: i,
                currentIndex: this._currentIndex
              });
              this._middleCount++;
              this._lastMiddle = i;
            }
          }
          // if last middle is last page
          if (this._lastMiddle === this.totalPages) {
            // get remainderStart start
            this._remainderStart = this._firstMiddle - 1;
            // while not enough remainders
            while (this._middleCount < this._totalMiddlePages) {
              // if remainder start is less or equal to first page
              if (this._remainderStart <= this._firstPage) {
                // end while
                break;
              }
              // add item to beginning of middle html
              this._middleHTML = this._createMiddleItem({
                index: this._remainderStart,
                currentIndex: this._currentIndex
              }) + this._middleHTML;
              // increase middle count
              this._middleCount++;
              // decrease remainder start
              this._remainderStart--;
            }
          }
          // if first middle is first page
          else if (this._firstMiddle === this._firstPage) {
            // get remainderStart start
            this._remainderStart = this._lastMiddle + 1;
            // while not enough remainders
            while (this._middleCount < this._totalMiddlePages) {
              // if remainder start is greater or equal to last page
              if (this._remainderStart >= this.totalPages) {
                // end while
                break;
              }
              // add item to end of middle html
              this._middleHTML += this._createMiddleItem({
                index: this._remainderStart,
                currentIndex: this._currentIndex
              });
              // increase middle count
              this._middleCount++;
              // increase remainder start
              this._remainderStart++;
            }
          }
          // add up HTML
          this._html += this._startHTML + this._middleHTML + this._endHTML;
          // end pagination
          this._html += '</ul>';
        }
        this._html += '<div class="' + this._clearClass + '"></div>';
        // insert into html
        this.containerNode.innerHTML = this._html;
        // remove loading class
        query(this.containerNode).removeClass(this._loadingClass);
        // not disabled anymore
        this.disabled = false;
        // call render event
        this.emit("render", {});
      },

      /* ---------------- */
      /* Private Functions */
      /* ---------------- */

      _createMiddleItem: function (e) {
        // class
        var listClass = this._itemEnabledClass;
        var dataPage = 'data-page="' + e.index + '"';
        if (e.index === e.currentIndex) {
          // if selected
          listClass = this._selectedClass;
          dataPage = '';
        }
        // page list item
        return '<li role="button" tabindex="0" title="' + this._i18n.pagination.pageTitle + ' ' + number.format(e.index) + '" ' + dataPage + ' class="' + this._itemClass + ' ' + this._itemMiddleClass + ' ' + listClass + '"><div><span>' + number.format(e.index) + '</span></div></li>';
      },

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
        this.helip = i18n.pagination.helip;
        this.theme = 'dojoPage';
      },

      // set variables that aren't to be modified
      _setPrivateDefaults: function () {
        // Internationalization
        this._i18n = i18n;
        // css classes
        this._containerClass = 'pagDijitContainer';
        this._loadingClass = 'pagDijitLoading';
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
        this.own(on(this.containerNode, '[data-page]:click', lang.hitch(this, function (evt) {
          if (!this.disabled) {
            // disable more clicking for now
            this.disabled = true;
            // remove selected class
            query('.pagDijitItem', this.containerNode).removeClass(this._selectedClass);
            // add selected class
            query(evt.target).addClass(this._newSelectedClass);
            // add loading class to container
            query(this.containerNode).addClass(this._loadingClass);
            // get offset number
            var selectedPage = parseInt(query(evt.target).attr('data-page')[0], 10);
            var selectedResultStart = selectedPage * this.resultsPerPage;
            var selectedResultEnd = selectedResultStart + this.resultsPerPage;
            // event
            this.emit("page", {
              bubbles: false,
              cancelable: false,
              detail: {
                selectedPage: selectedPage,
                selectedResultStart: selectedResultStart,
                selectedResultEnd: selectedResultEnd
              }
            });
          }
        })));
      }

    });
    return Pagination;
  });