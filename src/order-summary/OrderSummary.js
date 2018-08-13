/*
* @Author: jas
* @Date:   2018-08-12 19:07:36
* @Last Modified by:   jas
* @Last Modified time: 2018-08-13 13:06:46
*/
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';import './../styles/OrderSummary.css';

class OrderSummary extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			open: false,
		};
	}

	confirmOrder = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = value => {
    this.setState({ open: false });
  };

	render() {
		const {cartProducts, total} = this.props;
		return(
 			<div className="order-summary order-summary-container">
 				<div className="order-summary__wrapper">
				 	<div className="order-summary__heading"><span className="theme-hd">Order Summary</span></div>
				 	<div className="order-summary__products-wrapper">
				 		{cartProducts && cartProducts.length <= 0 && <div>No Items</div>}
				 		{cartProducts && cartProducts.map(function(product, idx) {
				 			return (
				 				<div className="flex cart-products" key={idx}>
				 					<div className="cart-products--label">{idx+1}</div>
				 					<div className="cart-products--label">
				 						{product.item.name} 
				 						<span className={product.item.discountInPercent ? 'strike-text' : ''}>(₹ {product.item.price})</span>&nbsp;
				 						{product.item.discountInPercent && <span>₹ {product.item.price - (product.item.price * product.item.discountInPercent / 100).toFixed()}</span>}
				 					</div>
				 					<div className="cart-products--label"><span>x</span>{product.quantity}</div>
				 					{product.item.discountInPercent ? 
				 						<div className="cart-products--label">{(product.item.price - (product.item.price * product.item.discountInPercent / 100).toFixed()) * product.quantity}</div> :
				 						<div className="cart-products--label">{product.item.price * product.quantity}</div>}
				 				</div>
				 				)
				 		})}
 					</div>
				 	<div className="order-summary__total flex">
				 		<div className="flex-1 align-center theme-hd">
				 			<div>Total</div> 
				 			<div className="label-sm">&nbsp;(Round-off)</div>
				 		</div> 
				 		<div>{total.toFixed()}</div>
				 	</div>
				 </div>
				 	<div className="mt-20">
				 		<Button disabled={cartProducts.length <= 0} onClick={() => this.confirmOrder()} variant="contained" color="primary">
				 			Checkout
				 		</Button>
				 		<Dialog
		          open={this.state.open}
		          onClose={this.handleClose}
		          aria-labelledby="alert-dialog-title"
		          aria-describedby="alert-dialog-description"
		        >
		          <DialogTitle id="alert-dialog-title">{"Order Confirmed"}</DialogTitle>
		          <DialogContent>
		            <DialogContentText id="alert-dialog-description">
		              Your order will be delivered in 5 minutes
		            </DialogContentText>
		          </DialogContent>
		          <DialogActions>
		            <Button onClick={this.handleClose} color="primary" autoFocus>
		              Agree
		            </Button>
		          </DialogActions>
		        </Dialog>
				 	</div>
				 </div>)
	}
};

export default OrderSummary;