window.Sifrr = window.Sifrr || {};
window.Sifrr.Dom = require('@sifrr/dom');
window.Sifrr.Storage = require('@sifrr/storage');

const Sifrr = window.Sifrr;

const location = window.location.href.split('/');
location.pop();

Sifrr.Dom.setup({
  baseUrl: location.join('/') + '/'
});
Sifrr.Dom.load('sifrr-stater');
Sifrr.Dom.load('sifrr-tabs');
