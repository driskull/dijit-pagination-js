define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/Evented",
  "dojo/dom-attr",
  "dojo/dom-class",
  "dojo/i18n!./nls/Pagination.js",
  "dojo/on",
  "dojo/query",
  "dojo/text!./templates/Pagination.html",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetBase",
  "dojo/number"
],
  function (declare, lang, Evented, domAttr, domClass, i18n, on, query, template, _TemplatedMixin, _WidgetBase, number) {
    var Pagination = declare([_WidgetBase, _TemplatedMixin, Evented], {
      // dijit HTML
      templateString: template,
      declaredClass: "dijit.pagination",
      constructor: function (options, srcRefNode) {
        // css class names
        this.css = {
          containerClass: 'pageDijitContainer',
          selectedClass: 'pageDijitSelected',
          newSelectedClass: 'pageDijitNewSelected',
          listClass: "pageDijitList",
          itemClass: 'pageDijitItem',
          itemEnabledClass: 'pageDijitItemEnabled',
          itemDisabledClass: 'pageDijitItemDisabled',
          itemMiddleClass: 'pageDijitItemMiddle',
          itemFirstClass: 'pageDijitItemFirst',
          itemLastClass: 'pageDijitItemLast',
          itemPreviousClass: 'pageDijitItemPrevious',
          itemNextClass: 'pageDijitItemNext',
          clearClass: 'pageDijitClear'
        };
        // defaults
        this.options = {
          totalResults: 0,
          resultsPerPage: 10,
          currentPage: 0,
          pagesPerSide: 2,
          showPreviousNext: true,
          showFirstLast: true,
          nextCharacter: i18n.pagination.next,
          previousCharacter: i18n.pagination.previous,
          helip: i18n.pagination.helip,
          theme: "dojoPage"
        };
        // mix in settings and defaults
        var defaults = lang.mixin({}, this.options, options);
        // properties
        this.set("theme", defaults.theme);
        this.set("nextCharacter", defaults.nextCharacter);
        this.set("previousCharacter", defaults.previousCharacter);
        this.set("helip", defaults.helip);
        this.set("totalResults", defaults.totalResults);
        this.set("resultsPerPage", defaults.resultsPerPage);
        this.set("currentPage", defaults.currentPage);
        this.set("pagesPerSide", defaults.pagesPerSide);
        this.set("showPreviousNext", defaults.showPreviousNext);
        this.set("showFirstLast", defaults.showFirstLast);
        // containing node
        this.domNode = srcRefNode;
        // Internationalization
        this._i18n = i18n;
      },
      /* ---------------- */
      /* Public Functions */
      /* ---------------- */
      // start widget
      startup: function () {
        // create pagination links
        this.render();
        // set widget ready
        this.set("loaded", true);
        this.emit("load", {});
      },

      postCreate: function () {
        // setup connections
        this.own(on(this.listNode, '[data-page]:click', lang.hitch(this, function (evt) {
          if (!this.disabled) {
            var target = evt.target;
            // disable more clicking for now
            this.set("disabled", true);
            // all selected items
            var items = query('.' + this.css.selectedClass, this.listNode);
            // remove selected class
            for (var i = 0; i < items.length; i++) {
              domClass.remove(items[i], this.css.selectedClass);
            }
            // add selected class
            domClass.add(target, this.css.newSelectedClass);
            // get offset number
            var pg = domAttr.get(target, "data-page");
            var selectedPage = parseInt(pg, 10);
            var selectedResultStart = selectedPage * this.resultsPerPage;
            var selectedResultEnd = selectedResultStart + this.resultsPerPage;
            // set new page
            this.set('currentPage', selectedPage);
            // event
            this.emit("page", {
              selectedPage: selectedPage,
              selectedResultStart: selectedResultStart,
              selectedResultEnd: selectedResultEnd
            });
          }
        })));
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
            var firstClass = this.css.itemDisabledClass,
              firstOffset = '';
            if (this._currentIndex > 1) {
              firstClass = this.css.itemEnabledClass;
              firstOffset = 'data-page="' + this._previousPage + '"';
            }
            this._startHTML += '<li role="button" tabindex="0" title="' + this._i18n.pagination.previousTitle + '" class="' + this.css.itemClass + ' ' + this.css.itemPreviousClass + ' ' + firstClass + '" ' + firstOffset + '>' + this.previousCharacter + '</li>';
          }
          // always show first and last pages
          if (this.showFirstLast) {
            // pagination first page
            if (this._currentIndex > (this.pagesPerSide + 1)) {
              this._startHTML += '<li role="button" tabindex="0" class="' + this.css.itemClass + ' ' + this.css.itemFirstClass + ' ' + this.css.itemEnabledClass + '" title="' + this._i18n.pagination.firstTitle + '" data-page="' + this._firstPage + '">' + number.format(this._firstPage) + this._helipText + '</li>';
            } else {
              this._middleCount = this._middleCount - 1;
            }
            // pagination last page
            if (this._currentIndex < (this.totalPages - this.pagesPerSide)) {
              this._endHTML += '<li role="button" tabindex="0" class="' + this.css.itemClass + ' ' + this.css.itemLastClass + ' ' + this.css.itemEnabledClass + '" title="' + this._i18n.pagination.lastTitle + ' (' + number.format(this.totalPages) + ')" data-page="' + this.totalPages + '">' + this._helipText + number.format(this.totalPages) + '</li>';
            } else {
              this._middleCount = this._middleCount - 1;
            }
          }
          // pagination next
          if (this.showPreviousNext) {
            var lastClass = this.css.itemDisabledClass,
              lastOffset = '';
            if (this._currentIndex < this.totalPages) {
              lastClass = this.css.itemEnabledClass;
              lastOffset = 'data-page="' + this._nextPage + '"';
            }
            this._endHTML += '<li role="button" tabindex="0" title="' + this._i18n.pagination.nextTitle + '" class="' + this.css.itemClass + ' ' + this.css.itemNextClass + ' ' + lastClass + '" ' + lastOffset + '>' + this.nextCharacter + '</li>';
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
        }
        // insert into html
        this.listNode.innerHTML = this._html;
        // not disabled anymore
        this.set("disabled", false);
        // call render event
        this.emit("render", {});
      },

      /* ---------------- */
      /* Private Functions */
      /* ---------------- */

      _createMiddleItem: function (e) {
        // class
        var listClass = this.css.itemEnabledClass;
        var dataPage = 'data-page="' + e.index + '"';
        if (e.index === e.currentIndex) {
          // if selected
          listClass = this.css.selectedClass;
          dataPage = '';
        }
        // page list item
        return '<li role="button" tabindex="0" title="' + this._i18n.pagination.pageTitle + ' ' + number.format(e.index) + '" ' + dataPage + ' class="' + this.css.itemClass + ' ' + this.css.itemMiddleClass + ' ' + listClass + '">' + number.format(e.index) + '</li>';
      },

      _setTotalResultsAttr: function (newVal) {
        this.totalResults = newVal;
        if (this._created) {
          this.render();
        }
      },

      _setResultsPerPageAttr: function (newVal) {
        this.resultsPerPage = newVal;
        if (this._created) {
          this.render();
        }
      },

      _setCurrentPageAttr: function (newVal) {
        this.currentPage = newVal;
        if (this._created) {
          this.render();
        }
      },

      _setPagesPerSideAttr: function (newVal) {
        this.pagesPerSide = newVal;
        if (this._created) {
          this.render();
        }
      },

      _setShowPreviousNextAttr: function (newVal) {
        this.showPreviousNext = newVal;
        if (this._created) {
          this.render();
        }
      },

      _setThemeAttr: function (newVal) {
        if (this._created) {
          domClass.remove(this.domNode, this.theme);
          domClass.add(this.domNode, newVal);
        }
        this.theme = newVal;
      },

      _setHelipAttr: function (newVal) {
        this.helip = newVal;
      },

      _setNextCharacterAttr: function (newVal) {
        this.nextCharacter = newVal;
        if (this._created) {
          this.render();
        }
      },

      _setPreviousCharacterAttr: function (newVal) {
        this.previousCharacter = newVal;
        if (this._created) {
          this.render();
        }
      },

      _setShowFirstLastAttr: function (newVal) {
        this.showFirstLast = newVal;
        if (this._created) {
          this.render();
        }
      }

    });
    return Pagination;
  });