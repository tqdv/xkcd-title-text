// ==UserScript==
// @name           XKCD tooltip
// @namespace      https://github.com/Lorentz83
// @description    This script puts the xkcd tooltip under the picture and adds a link to explainxkcd.com. It does the same work with what-if tooltips. Finally, it adds links to the printed comics sold in the store.
// @include        http*://xkcd.com/*
// @include        http*://www.xkcd.com/*
// @include        http*://what-if.xkcd.com/*
// @include        http*://www.what-if.xkcd.com/*
// @include        http*://store.xkcd.com/collections/everything/products/signed-prints
// @grant          none
// @version        1.6a
// @icon           https://raw.githubusercontent.com/Lorentz83/userscripts/master/XKCDTooltip/icon.png
// @supportURL     https://github.com/Lorentz83/userscripts
// @license        GPLv2; http://www.gnu.org/licenses/
// ==/UserScript==

/**
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var css = [];
var i = 0;
css[i++] = ".tooltip {";
css[i++] = "    padding: 5px;";
css[i++] = "    margin: 15px auto 20px;";
css[i++] = "    font-size: 80%;";
css[i++] = "    width: 60%;";
css[i++] = "    border-style: solid;";
css[i++] = "    border-radius: 12px;";
css[i++] = "}";
css[i++] = ".xkcdtooltip {";
css[i++] = "    border-width: 1px;";
css[i++] = "}";
css[i++] = ".whatiftooltip {";
css[i++] = "    border: 1px solid #005994;";
css[i++] = "    padding: 1.5ex;";
css[i++] = "    margin-top: 0;";
css[i++] = "}";

var addStyle = function(){
  var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css.join('\n');
  document.head.appendChild(style);
}  

var addTitleBox = function(p, elt, cssClass){
  let title = elt.getAttribute('title');
  if (title.length == 0) return;

  let titleBox = document.createElement('div');
  titleBox.textContent = title;
  titleBox.classList.add('tooltip');
  titleBox.classList.add(cssClass);

  p.insertAdjacentElement('afterend', titleBox);
}

var addTitle = function(){
  let c = document.getElementById('comic');
  if (!c) return;
  let elt = c.querySelector('*[title]');
  if (!elt) return;
  addTitleBox(c, elt, 'xkcdtooltip');
}

var addExplainLink = function(){
  let id = document.location.pathname.split('/')[1];
  if (id === undefined) id = "";
  let ct = document.getElementById('ctitle');

  var navs = document.getElementsByClassName('comicNav');
  for (var i = 0 ; i < navs.length ; i++ ) {
    var a = document.createElement('a');
    a.setAttribute('href',
      'http://www.explainxkcd.com/' + id);
    // Or find the permalink and use 
    // 'http://www.explainxkcd.com/wiki/index.php?title=' + id
    a.textContent = 'Explain';
    var li = document.createElement('li');
    li.appendChild(a);
    navs[i].children[2].insertAdjacentElement('afterend', li);
  }
}

// Currently only for 
// https://store.xkcd.com/collections/everything/products/signed-prints
var addComicLinksInStore = function() {
  let opts = document.getElementById('product-select');
  if (!opts) return;
  opts = opts.children;

  let desc = document.getElementsByClassName('description');
  if (desc.length == 0) return;
  desc = desc[0];

  let p = document.createElement('p');
  for (let i = 0; i < opts.length; i++) {
    let name = opts[i].innerHTML;
    // '#<comic number> (<dimensions>) <price>'
    let pos = name.indexOf('(');
    if (pos == -1) pos = name.length;
    let atext = name.slice(0, pos).trim();
    let ttext = ' ' + name.substr(pos).trim();

    let a = document.createElement('a');
    a.innerText = atext;
    a.setAttribute('href', 'https://xkcd.com/' + name.split(' ')[0].substr(1));
    a.classList.add('comic-link');
    let t = document.createTextNode(ttext);

    let span = document.createElement('span');
    span.appendChild(a);
    span.appendChild(t);
    span.appendChild(document.createElement('br'));
    p.appendChild(span);
  }
  desc.appendChild(p);
}

var modifyComic = function(){
  addTitle();
  addExplainLink();
}

var modifyArticle = function(){
  let article = document.getElementsByTagName('article');
  if(article.length == 0) return;

  let imgs = article[0].getElementsByTagName('img');
  for (let i = 0; i < imgs.length; i++) {
    addTitleBox(imgs[i], imgs[i], 'whatiftooltip');
  }
}

var main = function(){
  if (document.location.hostname == 'store.xkcd.com'
      && document.URL.includes('signed-prints'))
    addComicLinksInStore();
  else if (document.location.hostname == 'www.xkcd.com'
           || document.location.hostname == 'xkcd.com')
    modifyComic();
  else if (document.location.hostname == 'what-if.xkcd.com')
    modifyArticle();
  addStyle();
    
}

main();
