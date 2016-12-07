/* global instantsearch */

var search = instantsearch({
  appId: '1W6YX64AEN',
  apiKey: 'eededbf691afc9b7f8a565f2b319c65a',
  indexName: 'resource',
  urlSync: {}
});

search.addWidget(
  instantsearch.widgets.searchBox({
    container: '#q'
  })
);

search.addWidget(
  instantsearch.widgets.stats({
    container: '#stats'
  })
);

var hitTemplate =
  '<div class="hit media" style="margin-top: 10px;">' +
    '<div class="media-left">' +
      '<div class="media-object text-center" style="margin-top: 6px;"><a href="{{{link}}}" class="logo"><i class="fa fa-link"></i></a></div>' +
    '</div>' +
    '<div class="media-body" style="margin-top: 10px;">' +
      '<h4 class="media-heading" style="margin-top: 6px;">{{{_highlightResult.name.value}}}</h4>' +
      '<p class="genre"><span class="badge">{{.}}</span> {{{_highlighResult.link.value}}}</p>' +
      '<p>{{{_highlightResult.description.value}}}</p>' +
    '</div>' +
  '</div>';

var noResultsTemplate =
  '<div class="text-center">No results found matching <strong>{{query}}</strong>.</div>';

search.addWidget(
  instantsearch.widgets.hits({
    container: '#hits',
    hitsPerPage: 10,
    templates: {
      empty: noResultsTemplate,
      item: hitTemplate
    }
  })
);

search.addWidget(
  instantsearch.widgets.pagination({
    container: '#pagination',
    cssClasses: {
      root: 'pagination',
      active: 'active'
    }
  })
);

search.addWidget(
  instantsearch.widgets.refinementList({
    container: '#genres',
    attributeName: 'collections.title',
    operator: 'or',
    limit: 10,
    cssClasses: {
      list: 'nav nav-list',
      count: 'badge pull-right',
      active: 'active'
    }
  })
);

search.addWidget(
  instantsearch.widgets.refinementList({
    container: '#tags',
    attributeName: 'tags.title',
    operator: 'and',
    limit: 10,
    cssClasses: {
      list: 'nav nav-list',
      count: 'badge pull-right',
      active: 'active'
    }
  })
);

search.start();
