import React from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';

const Cart = ({ items, onClose, onRemoveItem }) => {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
      {/* Cart Panel */}
      <div className="w-full max-w-md bg-white h-full shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-[#800020] text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Your Cart</h2>
            <span className="bg-white text-[#800020] px-2 py-1 rounded-full text-sm font-bold">
              {items.length}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-sm">Add some delicious items to get started!</p>
            </div>
          ) : (
            items.map((item, index) => (
              <div 
                key={index}
                className="flex gap-4 bg-white rounded-lg p-4 shadow-sm border border-gray-100"
              >
                {/* Food Image */}
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg" 
                />
                
                {/* Details */}
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <button 
                      onClick={() => onRemoveItem(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <p className="text-[#800020] font-bold mt-1">
                    KSh. {item.price.toLocaleString()}
                  </p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button className="p-1 rounded-full hover:bg-gray-100">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-medium">1</span>
                    <button className="p-1 rounded-full hover:bg-gray-100">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 bg-gray-50">
            <div className="flex justify-between mb-4">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">KSh. {total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-semibold">KSh. 150</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-[#800020]">KSh. {(total + 150).toLocaleString()}</span>
            </div>
            
            <button className="w-full mt-4 bg-[#800020] text-white py-3 rounded-lg font-semibold
                             hover:bg-[#600018] transition-colors">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;