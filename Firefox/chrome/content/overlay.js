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

if (!com) var com = {};
if (!com.ronakpatel) com.ronakpatel = {};
if (!com.ronakpatel.movierating) com.ronakpatel.movierating = {};    

var crm = com.ronakpatel.movierating;

crm = {
    $ : function(id) {
        return document.getElementById(id);
    },

    onLoad: function() {        
        this._initialized = true;
        this._strings = document.getElementById("movierating-strings");        
    },        
    
    onUnload: function() { },

    onPanelHidden: function() {
        var iframe = this.$("movierating-iframe");
        iframe.setAttribute("src","");
    },
    
    onMenuItemCommand: function(e) {                
        var selection = this.getSelection();
        
        var panel = this.$("movierating-panel");    
        var anchor = this.$("addon-bar");
        
        if (anchor == null)
            anchor = this.$("status-bar");                            
        
        if (panel != null) {
            var iframe = this.$("movierating-iframe");            
            var url = "chrome://movierating/content/display.html?movie=";
            if (this.isDefined(selection))
                url += selection;
            iframe.setAttribute("src", url);            
            panel.openPopup(anchor, "before_end", -20, -20, false, false);                
        }
    },
    
    getSelection: function() {        
        var selection = getBrowserSelection();

        if (!this.isDefined(selection)) {
            if (gContextMenu != null) {
                if (gContextMenu.onLink) {                        
                    selection = gContextMenu.target.innerHTML;    
                } else if (gContextMenu.onTextInput) {
                    var textInput = gContextMenu.target;
                                        
                    selection = this.getInputSelectedText(textInput);
                } else {
                    return null;
                }
            } else {
                var lastFocusedElement = document.commandDispatcher.focusedElement;
                
                if (lastFocusedElement != null) {
                    selection = this.getInputSelectedText(lastFocusedElement);
                } else {
                    return null;
                }
            }
        }
        
        return selection;
    },
    
    getInputSelectedText: function(input) {
        if (input.selectionStart != null &&
            input.selectionStart != -1 &&
            input.selectionStart < input.selectionEnd) {    
            var start = input.selectionStart;
            var end = input.selectionEnd;
            
            return input.value.substring(start, end);                    
        }
        
        return null;
    }, 
    
    isDefined: function(element) {
        if (element == undefined ||
            element == null ||
            element == '')
                return false;
        else
            return true;
    }
};

window.addEventListener("load", function () { crm.onLoad(); }, false);
window.addEventListener("unload", function() { crm.onUnload(); }, false);
