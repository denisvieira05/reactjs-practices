var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter	= require('events').EventEmitter;
var FluxCartConstants = require('../constants/FluxCartConstants');
var _ = require('underscore');


// Define initial data points 
var _products = {}
	,	_cartVisible = false;


// Add product to cart 
function add (sku, update){
	update.quantity = sku in _products ? _products[sku].quantity = 1 : 1;
	_products[sku] = _extend({}, _products[sku].update)
}

// Set Cart Visibility
function setCartVisibility(cartVisible){
	_cartVisible = cartVisible;
}

// Remove item from cart
function removeItem(sku){
	delete _products[sku];
}

var CartStore = _.extend({}, EventEmitter.prototype, {

	// Return Cart Items
	getCartItems: function(){
		return _products;
	},

	// Return # of items of cart 
	getCartCount: function(){
		return Object.keys(_products).length;
	},

	// Return cart cost total
	getCartTotal: function(){
		var total = 0;
		for (product in _products){
			if(_products.hasOwnProperty(product)){
				total += _products[product].price * _products[product].quantity;
			}
		}
		return total.toFixed(2);
	},

	// Return cart visibility state
	getCartVisible: function(){
		return _cartVisible;
	},

	// Emit Change event 
	emitChange: function(){
		this.emit('change');
	},

	  // Add change listener
  addChangeListener: function(callback) {
    this.on('change', callback);
  },

	// Add change listener
	removeChangeListener: function(callback){
		this.removeListener('change',callback);
	}

});


// Register Callback with App dispatcher

AppDispatcher.register(function(payload){
	var action = payload.action;
	var text;

	switch(action.type){

		// Respond to CART_ADD action
		case FluxCartConstants.CART_ADD:
			add(action.sku,action.update);
			break;

		// Respond to CART_VISIBLE action
		case FluxCartConstants.CART_VISIBLE:
			setCartVisibility(action.cartVisible);
			break;

		// Response to CART_REMOVE action
		case FluxCartConstants.CART_REMOVE:
			removeItem(action.sku);
			break;

		default:
			return true;

	}	

	// If action was responded to, emit change event
	CartStore.emitChange();

	return true;


});


module.exports = CartStore;
