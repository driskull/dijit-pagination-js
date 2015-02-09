# dijit-pagination-js 0.2
A Dijit for pagination

[View it live](http://driskull.github.com/dijit-pagination-js/)

![App](https://raw.github.com/driskull/dijit-pagination-js/master/Pagination.png)

## Description
This Dojo widget renders a pagination list in the DOM element of yoour choosing so you can easily paginate your results.

## Getting Started

Add dojo config to your HTML head
```html
<script>
// host path regular expression
var pathRegex = new RegExp(/\/[^\/]+$/);
var locationPath = location.pathname.replace(pathRegex, '');
// Dojo Config
var dojoConfig = {
    parseOnLoad: true,
    packages: [{
        name: "myApp",
        location: locationPath
    }]
};
</script>
```

Include Dojo and your style for pagination
```html
<script src="//ajax.googleapis.com/ajax/libs/dojo/1.8.2/dojo/dojo.js"></script>
<link charset="utf-8" href="css/Pagination.css" media="screen" rel="stylesheet" type="text/css">
```

Require the widget and set up your pagination
```html
<script>
require(["dojo/ready", "dojo/on", "myApp/Pagination"], function(ready, on, Pagination){
    ready(function(){
        var Pagination1 = new Pagination({
            totalResults: 100
        }, dojo.byId('pagination1'));
        on(Pagination1, "page", function(evt){
            console.log(evt);
        });
        Pagination1.startup();
});
</script>
```

// Add the element to your HTML body
```html
<div id="pagination1"></div>
```

## Constructor
Pagination(options? [Optional Object], srcNode [Required DOM Element])
- **totalResults** (required) [Number] Number of results for whatever you're paginating. Default: 0.
- **resultsPerPage** (optional) [Number] How many results are you showing per page? Default: 10.
- **currentPage** (optional) [Number] Current page you're on. Usually you'll start at 0. Default: 0.
- **pagesPerSide** (optional) [Number] How many pages do you want to show on each side of the current page. This determines the visible pagination widget size Default: 2.
- **showPreviousNext** (optional) [Boolean] Show the previous and next buttons. (true/false). Default: true.
- **showFirstLast** (optional) [Boolean] Always show the first and last page. (true/false). Default: true.
- **theme** (optional) [String] Applies this class name to the containing widget's element for styling. Default: "dojoPage".
- **disabled** (optional) [Boolean] Page click events will not occur if this is set to true. Default: false.

## Properties
- **totalResults** [Number] Number of results for whatever you're paginating.
- **resultsPerPage** [Number] How many results are you showing per page?
- **currentPage** [Number] Current page you're on. Usually you'll start at 0.
- **pagesPerSide** [Number] How many pages do you want to show on each side of the current page. This determines the visible pagination widget size.
- **showPreviousNext** [Boolean] Show the previous and next buttons.
- **showFirstLast** [Boolean] Always show the first and last page.
- **theme** [String] Applies this class name to the containing widget's element for styling.
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
    selectedPage: [Page Number Selected],
    selectedResultStart: [Page Offset],
    selectedResultEnd: [Page Offset + resultsPerPage]
}
```

## Samples

### Sample 1
Simple example that just changes the page after a new page is selected.
[View demo](http://driskull.github.com/dijit-pagination-js/#ex1)
```javascript
var Pagination1 = new Pagination({
    totalResults: 100
}, dojo.byId('pagination1'));
Pagination1.startup();
```

### Sample 2
Show options and previous and next buttons can be disabled.
[View demo](http://driskull.github.com/dijit-pagination-js/#ex2)
```javascript
var Pagination2 = new Pagination({
	totalResults: 900,
	resultsPerPage: 10,
	currentPage: 1,
	pagesPerSide: 1,
	showPreviousNext: false
}, dojo.byId('pagination2'));
```

### Sample 3
Show options and first and last page buttons can be disabled.
[View demo](http://driskull.github.com/dijit-pagination-js/#ex3)
```javascript
var Pagination3 = new Pagination({
	totalResults: 225,
	resultsPerPage: 5,
	currentPage: 7,
	pagesPerSide: 3,
	showFirstLast: false
}, dojo.byId('pagination3'));
```

## License
Free to use

## Questions?
Feel free to contact me:  
via twitter [@driskull](http://twitter.com/#!/driskull "")
