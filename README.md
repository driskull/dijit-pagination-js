# dijit-pagination-js
A Dijit for pagination

## Description
This Dojo widget renders a pagination list in the DOM element of yoour choosing so you can easily paginate your results.

## Constructor
myApp.Pagination(options? [Optional Object], srcNode [Required DOM Element])
- **totalResults** (required) [Number] Number of results for whatever you're paginating. Default: 0.
- **resultsPerPage** (optional) [Number] How many results are you showing per page? Default: 10.
- **currentPage** (optional) [Number] Current page you're on. Usually you'll start at 0. Default: 0.
- **pagesPerSide** (optional) [Number] How many pages do you want to show on each side of the current page. This determines the visible pagination widget size Default: 2.
- **showPreviousNext** (optional) [Boolean] Show the previous and next buttons. (true/false). Default: true.
- **showFirstLast** (optional) [Boolean] Always show the first and last page. (true/false). Default: true.
- **theme** (optional) [String] Applies this class name to the containing widget's element for styling. Default: "dojoPage".
- **disabled** (optional) [Boolean] Page click events will not occur if this is set to true. Default: false.
- **helip** (optional) [String] Applies this text before the last page number and after the first page number if showFirstLast is true. Default: "..." (&helip;).

## Properties
- **totalResults** [Number] Number of results for whatever you're paginating.
- **resultsPerPage** [Number] How many results are you showing per page?
- **currentPage** [Number] Current page you're on. Usually you'll start at 0.
- **pagesPerSide** [Number] How many pages do you want to show on each side of the current page. This determines the visible pagination widget size.
- **showPreviousNext** [Boolean] Show the previous and next buttons.
- **showFirstLast** [Boolean] Always show the first and last page.
- **theme** [String] Applies this class name to the containing widget's element for styling.
- **helip** [String] Applies this text before the last page number and after the first page number if showFirstLast is true.
- **currentResultStart** [Number] Starting offset number of results.
- **currentResultEnd** [Number] Ending offset number of results.
- **loaded**  [Boolean] Loaded state of the widget.

## Methods
- **startup()** void.
- **render()** void. Renders the pagination with the current assigned properties. The properties are watched for changes and will automatically be re-rendered.
- **destroy()** void. Destroys the widget's connections and DOM.

## Events
- **load** void. Occurs when the widget is loaded.
- **render** void. Occurs when the render method has been called.
- **page** Event Object. Event fires when a new page has been selected.

```javascript
{
    bubbles: false,
    cancelable: false,
    detail: {
        selectedPage: [Page Number Selected],
        selectedResultStart: [Page Offset],
        selectedResultEnd: [Page Offset + resultsPerPage]
    }
}
```
    
## CSS Classes
- pagDijitContainer
- pagDijitLoading
- pagDijitSelected
- pagDijitNewSelected
- pagDijitItem
- pagDijitItemEnabled
- pagDijitItemDisabled
- pagDijitItemMiddle
- pagDijitItemFirst
- pagDijitItemLast
- pagDijitItemPrevious
- pagDijitItemNext
- pagDijitClear

## Samples

### Sample 1
```javascript
var Pagination = new myApp.Pagination({
    totalResults: 100
}, dojo.byId('pagination'));
on(Pagination, "page", function(evt){
    // set selected page
    this.set('currentPage', evt.detail.selectedPage);
});
Pagination.startup();
```

### Sample 2
```javascript
var Pagination2 = new myApp.Pagination({
	totalResults: 900,
	resultsPerPage: 10,
	currentPage: 1,
	pagesPerSide: 1,
	showPreviousNext: false
}, dojo.byId('pagination2'));
on(Pagination2, "page", function(evt){
	this.set('currentPage', evt.detail.selectedPage);
});
```

### Sample 3
```javascript
var Pagination3 = new myApp.Pagination({
	totalResults: 225,
	resultsPerPage: 5,
	currentPage: 7,
	pagesPerSide: 3,
	showFirstLast: false
}, dojo.byId('pagination3'));
on(Pagination3, "page", function(evt){
	this.set('currentPage', evt.detail.selectedPage);
});
```

### Sample 4
```javascript
var Pagination4 = new myApp.Pagination({
    totalResults: 500,
    resultsPerPage: 25
}, dojo.byId('pagination4'));
on(Pagination4, "page", function(evt){
    var selectedPage = evt.detail.selectedPage;
    // change page after a second
    setTimeout(function(){
        Pagination4.set('currentPage', selectedPage);
    }, 1000);
});
Pagination4.startup();
```

## License
Free to use

## Questions?
Feel free to contact me:  
via twitter [@driskull](http://twitter.com/#!/driskull "")
