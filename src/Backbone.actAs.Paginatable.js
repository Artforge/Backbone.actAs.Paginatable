Backbone.actAs = Backbone.actAs || {};
Backbone.actAs.Paginatable = (function(){
	return {

		actAs_Paginatable_totalItems: false,
		actAs_Paginatable_currentPage: 1,
		actAs_Paginatable_itemsPerPage: 20,

		actAs_Paginatable_currentPage_attr: 'page',
		actAs_Paginatable_itemsPerPage_attr: 'itemsPerPage',

		itemsPerPage: function( itemsPerPage ){
			if( typeof itemsPerPage != 'undefined' ){
				this.actAs_Paginatable_itemsPerPage = itemsPerPage;
			};
			return this.actAs_Paginatable_itemsPerPage;
		},

		currentPage: function( page ){
			if( typeof page != 'undefined' ){
				this.actAs_Paginatable_currentPage = page;
			};
			return this.actAs_Paginatable_currentPage;
		},

		loadPage: function(page){
			if( page ){
				this.currentPage( page );
				return this.fetch();
			}
			var result = $.Deferred();
			result.reject();
			return result;
		},

		nextPage: function(){
			return this.loadPage(this.paginationInfo().nextPage);
		},

		previousPage: function(){
			return this.loadPage(this.paginationInfo().previousPage);
		},

		paginationInfo: function(){
			var result = {
				totalItems: this.actAs_Paginatable_totalItems,
				totalPages: (this.actAs_Paginatable_totalItems)?(Math.ceil(this.actAs_Paginatable_totalItems/this.itemsPerPage())):false,

				itemsPerPage: this.itemsPerPage(),

				currentPage: this.currentPage(),
				previousPage: false,
				nextPage: false
			};

			if( result.currentPage > 1 ){
				result.previousPage = result.currentPage-1;
			}
			if( ( result.currentPage < result.totalPages ) && ( result.totalPages > 1 ) ){
				result.nextPage = result.currentPage+1;
			}

			return result;
		},

		url: function(){
			if( typeof this.urlRoot == 'undefined' ){
				throw Error('urlRoot for collection must be defined before fetching!');
			}
			var params = {};
			params[this.actAs_Paginatable_currentPage_attr] = this.actAs_Paginatable_currentPage;
			params[this.actAs_Paginatable_itemsPerPage_attr] = this.actAs_Paginatable_itemsPerPage;
			return this.urlRoot + ((this.urlRoot.indexOf('?')===-1)?'?':'&') + $.param(params);
		},

		parse: function(resp, result) {
			if( result.getResponseHeader('X-Pagination-Total-Results') ){
				this.actAs_Paginatable_totalItems = result.getResponseHeader('X-Pagination-Total-Results');
			}
			return resp;
		}

	};
})();