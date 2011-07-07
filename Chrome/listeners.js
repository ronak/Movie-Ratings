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

/* From Douglas Crockford - http://javascript.crockford.com/remedial.html */
function trim(s) {
    return s.replace(/^\s*(\S*(?:\s+\S+)*)\s*$/, "$1");
}

function displayBox(movie) {
    var box = document.getElementById("rpnet_mrBox");
    
    if (box == null) {
        box = createBox();
        document.body.appendChild(box);
        box.appendChild(createIFrame(chrome.extension.getURL("display.html?movie="+movie)));
    } else {        
        var iframe = document.getElementById("rpnet_mrBox_iFrame");
        if (iframe) {
            iframe.setAttribute("src",chrome.extension.getURL("display.html?movie="+movie));
        }
        box.style.display = "block";
    }
}

function createBox() {
    var box = document.createElement("div");
    box.id = "rpnet_mrBox";
    box.style.zIndex = 100000;
    box.style.height = "200px";
    box.style.position = "fixed";
    box.style.top = "10px";
    box.style.right = "10px";
    box.style.display = "display";
    box.style.border = "2px solid black";
    box.style.width = "300px";
        
    document.body.addEventListener("click", function(e) {
        if(e.target.id !== "rpnet_mrBox") {    
            var box = document.getElementById("rpnet_mrBox");
            if (box) {
                box.style.display = "none";
                var iframe = document.getElementById("rpnet_mrBox_iFrame");
                iframe.removeAttribute("src");
            }
        }        
    }, false);
    
    return box;
}

function createIFrame(src) {
    var iframe = document.createElement("iframe");
    iframe.id = "rpnet_mrBox_iFrame";
    iframe.setAttribute("src",src);        
    iframe.style.height = "200px";
    iframe.style.margin = "0px";
    iframe.style.border = "0px";
    return iframe;
}

chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        if (request.selection) {
            displayBox(request.selection);
        } else if (request.url) {
            var anchors = document.getElementsByTagName("a");
            
            for (var i = 0; i < anchors.length; i++) {
                var a = anchors[i];
                if (a.href === request.url) {
                    movie = trim(a.textContent);
                    
                    if (movie != "") {
                        displayBox(movie);
                        return;
                    }                                    
                }
            }            
        } else {
            displayBox(undefined);
        }
    }
);