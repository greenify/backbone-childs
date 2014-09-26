var _ = require('underscore');
var viewType = require("backbone-viewj");
var pluginator;

module.exports = pluginator = viewType.extend({
  renderSubviews: function() {
    var oldEl = this.el;
    var el = document.createElement("div");
    this.setElement(el);
    var frag = document.createDocumentFragment();
    if (oldEl.parentNode != null) {
      oldEl.parentNode.replaceChild(this.el, oldEl);
    }
    var views = this._views();
    var viewsSorted = _.sortBy(views, function(el) {
      return el.ordering;
    });
    var view, node;
    for (var i = 0, i <  viewsSorted.length; i++) {
      view = viewsSorted[i];
      view.render();
      node = view.el;
      if (node != null) {
        frag.appendChild(node);
      }
    }
    el.appendChild(frag);
    return el;
  },
  addView: function(key, view) {
    var views = this._views();
    if (view == null) {
      throw "Invalid plugin. ";
    }
    if (view.ordering == null) {
      view.ordering = key;
    }
    return views[key] = view;
  },
  removeViews: function() {
    var el, key;
    var views = this._views();
    for (key in views) {
      el = views[key];
      el.undelegateEvents();
      el.unbind();
      if (el.removeViews != null) {
        el.removeViews();
      }
      el.remove();
    }
    return this.views = {};
  },
  removeView: function(key) {
    var views = this._views();
    views[key].remove();
    return delete views[key];
  },
  getView: function(key) {
    var views = this._views();
    return views[key];
  },
  remove: function() {
    this.removeViews();
    return viewType.prototype.remove.apply(this);
  },
  _views: function() {
    if (this.views == null) {
      this.views = {};
    }
    return this.views;
  }
});
