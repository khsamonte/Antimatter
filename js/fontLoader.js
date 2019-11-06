/**
* File: fontLoader.js
* Author: Ken
*
* The main file
*
* Copyright (C) November 2019, Ken Samonte
 */

WebFontConfig = {
  google: { families: ["Fresca", "Flamenco", "Indie Flower", 'Anton', 'Varela Round'] }
};
(function () {
  var wf = document.createElement('script');
  wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
    '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
  wf.type = 'text/javascript';
  wf.async = 'true';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(wf, s);
})();
