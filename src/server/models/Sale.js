var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Sales Model
 * ==========
 */

var Sale = new keystone.List('Sale');

Sale.add({
    SaleDate: {
        type: Types.Date, 
        require: true,
        initial: true, 
        index:true, 
        yearRange:[1990, 2099], 
        default: Date.now
    },
    Items: {
        type: Types.Relationship, 
        ref: 'StoreItem', 
        many: true, 
        required: true, 
        initial:true
    },
    Quantity:{ 
        type: Number, 
        require:true, 
        initial:true 
    },
    Seller: {
        type: Types.Relationship, 
        ref: 'User', 
        required: true, 
        initial:true, 
        index:true,
        filters: {
            userType:'Seller'
        }

    },
    Total: {
        type: Types.Money, 
        currency:"USD"
    },
    Buyer: {
        type: Types.Relationship, 
        ref: "User", 
        required: true, 
        initial:true, 
        index:true,
        filters: {
            userType:'Buyer'
        }
    }
})

Sale.defaultColumns = "SaleDate, Seller, Total, Buyer";
Sale.register();