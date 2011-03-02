/* Show tooltips for citations from speficically formatted HTML */
/* This javascript searches through an HTML document for links of
 * class "footnote" or "citation" and tries to match them up with
 * corresponding footnotes or bib entries, automatically creating
 * a "tooltip" for the referring link.  It assumes that the HTML
 * is in the form:
 *
 * <a class="footnote" href="#footnote_id">anchor text</a>
 *
 * and
 *
 * <dl>
 * <dt id="footnote_id">Footnote name/number/whatever</dt>
 * <dd>Footnote text</dd>
 * ...
 * </dl>
 *
 * And similarly for citations.  The <dd>...</dd> text is shown
 * in the tooltip.  The goal is to provide some nice extra functionality
 * without having to change the actual content of your HTML in the
 * slightest, and with no degredation in information content for
 * those who disable scripting.
 */

/* Copyright (C) 2007, David G. Andersen
 *
 * Redistribution in source and binary forms, with or without
 * modification, is permitted.  Please feel free to use
 * this code in any way you wish.  You can even strip my name off
 * of it, though I'd prefer that you don't.  However, you may not
 * use the name of David G. Andersen to endorse or advertise any
 * product that contains this software without specific prior
 * written permission.
 *
 * THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL DAVID G. ANDERSEN BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF 
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

window.onload = init;
ref = new Array;
var infobox;

function show_citation()
{
    var e = window.event;
    var left_pos = this.offsetLeft;
    var top_pos = this.offsetTop + 30; 
    
    infobox.innerHTML = ref[this.num];
    infobox.style.left = "0px"; /* Temp to get sizing */
    infobox.style.display = 'block';
    tipwidth = infobox.offsetWidth;
    var bodywidth = window.innerWidth;
    if (!bodywidth) { // IE hack.  sigh.
	bodywidth = document.body.clientWidth;
    }
    
    //alert("lp: " + left_pos + "  tw: " + tipwidth + "  bw: " + bodywidth);
    if ((left_pos + tipwidth) > (bodywidth - 50)) {
	left_pos = bodywidth - tipwidth - 50;
    }
    
    infobox.style.left = "" + left_pos + "px";
    infobox.style.top = "" + top_pos + "px";
}

function hide_citation()
{
    infobox.style.display = 'none';
}

function find_citation(id) {
    var dt = document.getElementById(id);
    var dd = dt.nextSibling;
    while (dd && dd.nodeType != 1) {
	dd = dd.nextSibling;
    }
    
    if (!dd) {
	return "citation not found";
    }
    else {
	return dd.innerHTML;
    }
}

function init() {
    infobox = document.createElement('div');
    infobox.setAttribute('id', 'infobox');
    infobox.setAttribute('class', 'citebaloon');
    document.body.appendChild(infobox);

    var nav = document.getElementsByTagName('a');
    var refcount = 0;
    for (var i = 0; i < nav.length; i++) {
	var o = nav[i];
	if (o.className == "citation" || o.className == "footnote") {
	    o.onmouseover = show_citation;
	    o.onmouseout = hide_citation;
	    var parts = o.href.split("#");
	    var target = parts[parts.length-1];
	    ref[refcount] = find_citation(target);
	    o.num = refcount++;
	}
    }
}
