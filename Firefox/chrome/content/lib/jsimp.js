/*
	The MIT License

	Copyright (c) 2011 Ronak Patel

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/

/* 
	This simplified javascript library, based off of jQuery 1.6, was created
	because Firefox's add-on review process denied Movie Ratings due to errors
	within jQuery. Since the add-on was already complete using jQuery I created
	this to mimick jQuery syntax and some of the basic functions.
	
	This is intended to be used with the Movie Ratings add-on which uses 
	an iframe with an isolated local html file. There is no namespacing 
	or complete error checking so if you use this else where it's at your own risk.
*/

// only supports selectors in these formats:
//		#id, <div>
var $ = function(selector, attributes) {
	return new jSimp(selector, attributes);
}

$.parseQuery = function() {
	var url = window.location.href.split("?")[1];
	if (url) {
		var queries = url.split("&");
		if (queries) {
			var params = {};
			for (var i = 0; i < queries.length; i++) {
				var param = queries[i].split("=");
				params[param[0]]=unescape(param[1]);			
			}
			return params;
		} 
	}

	return null;
}

$.ajax = function(parameters) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", parameters.url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            parameters.success(xhr.responseText);
        }
    }
    xhr.send();
}

function jSimp(selector, attributes) {
	if (selector) {		
		if (typeof selector === "string") {	
			if (selector.charAt(0) === "<" &&
				selector.charAt(selector.length-1) === ">" &&
				selector.length >= 3) {				
				this.elem = document.createElement(
					selector.substring(1,selector.length-1)
				);
			}
			if (selector.charAt(0) == "#") {				                
				this.elem = document.getElementById(selector.substring(1));
			}
		}
		
		if (attributes) {
			for (var key in attributes) {
				if (attributes.hasOwnProperty(key)) {
					if (key === "text") {
						this.elem.appendChild(
							document.createTextNode(attributes[key])
						);
					} else {
						this.elem.setAttribute(key,attributes[key]);
					}
				}
			}
		}
	}
	
	return this;
}

jSimp.prototype = {
	type : "jsimp",
	click: function(func) {
		this.elem.onclick = func;
	},
	attr: function(name, value) {
		if (typeof name === "string" &&
			typeof value === "string") {
			this.elem.setAttribute(name, value);			
		}
	},
	removeAttr: function(name) {
		if (typeof name === "string") 
			this.elem.removeAttribute(name);
	},
	text: function(text) { 		
		if (typeof text === "string") {
            if (this.elem.firstChild != null) {
                while (this.elem.firstChild) {
                    this.elem.removeChild(this.elem.firstChild);
                }				
            }
			this.append(document.createTextNode(text));
		}
	},
	show: function() {
		if (this.elem.nodeType === 1) {
			this.elem.style.display = "block";
		}
	},
	hide: function() {
		if (this.elem.nodeType === 1) {
			this.elem.style.display = "none";
		}
	},
	toggle: function() {
		var display = this.elem.style.display;
		this.elem.style.display = display === "block" ? "none" : "block";
	},
	append: function(element) {	
		if (element) {
			if (element.nodeType) {
				this.elem.appendChild(element);
			} else if (element.type === this.type) {
				this.elem.appendChild(element.elem);
			}
		}
	}
};