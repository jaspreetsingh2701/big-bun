/*
* @Author: jas
* @Date:   2018-08-12 19:07:13
* @Last Modified by:   JASPREET
* @Last Modified time: 2018-08-13 15:29:20
*/
import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import Remove from '@material-ui/icons/Remove';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import './../styles/ProductsListingStyle.css';
import OrderSummary from "./../order-summary/OrderSummary";

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 700,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
});

let id = 0;
function createData(name, calories, fat, carbs, protein) {
  id += 1;
  return { id, name, calories, fat, carbs, protein };
}

const data = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

class ProductsListing extends Component {

  constructor(props) {
    super(props);
    this.state = {
      products: null,
      productTypes: null,
      selectedOption: "Veg Burgers",
      cartProducts: [],
      total: 0
    };
  }

  componentDidMount() {
    this.fetchProductTypes();
    this.fetchProducts();
  }

  fetchProductTypes() {
    fetch("http://demo0447284.mockable.io/productTypes", {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
     })
      .then(res => res.json())
      .then(
        (json) => {
          this.setState({
            productTypes: json
          });
        },
        (error) => {
          this.setState({
            error
          });
        }
      )
  }

  fetchProducts() {
    fetch("http://demo0447284.mockable.io/items", {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
     })
      .then(res => res.json())
      .then(
        (json) => {
          this.setState({
            products: json
          });
          this.fetchProductsByType(this.state.selectedOption);
        },
        (error) => {
          this.setState({
            error
          });
        }
      )
  }

  fetchProductsByType = event => {
    let {products} = this.state;
    let value = typeof event === 'string' ? event : [event.target.value][0];
    this.setState({
      renderedProducts: products[value],
      selectedOption: value
    });
  };


  addProduct = (item, id) => {
    let {cartProducts, total} = this.state;
    let sum = 0.0;
    var el = cartProducts.filter(function(el) {
      return el.item.id === id;
    });

    if (el.length) {
      if(el[0].item.discountInPercent) {
        sum = total + (el[0].item.price - (el[0].item.price * el[0].item.discountInPercent / 100));
      }
      else {
        sum = total + el[0].item.price;
      }
      total = sum;
      el[0].quantity++;
    } else {
      if(item.discountInPercent) {
        sum += total + (item.price - (item.price * item.discountInPercent / 100));
      }
      else {
        sum += total + item.price;
      }
      total = sum;
      cartProducts.push({
        item,
        quantity: 1
       });
    }
    this.setState({cartProducts, total});
  };

  removeProduct = (item, id, idx) => {
    let {cartProducts, total} = this.state;
    let sum = 0.0;
    var el = cartProducts.filter(function(el) {
      return el.item.id === id;
    });

    if(el.length) {
      if(el[0].item.discountInPercent) {
        sum = total - (el[0].item.price - (el[0].item.price * el[0].item.discountInPercent / 100));
      }
      else {
        sum = total - el[0].item.price;
      }
      total = sum;
      el[0].quantity--;
      if(el[0].quantity <= 0) {
        var index;
        cartProducts.filter(function(elm, idx) {
          if(elm.item.id === id) {
            return (index = idx);
          }
        });
        cartProducts.splice(index ,1);
      }
      
    }
    this.setState({cartProducts, total});
  }

  validateRemoveBtn = (name) => {
    let {cartProducts} = this.state;
    if(cartProducts.length > 0) {
      var el = cartProducts.filter(function(el) {
        return el.item.name === name;
      });
      if(el.length) {
        return true;
      }
      else return false;
    }
    return false;
  }

  searchByName = (event) => {
    let {products} = this.state;
    let name = [event.target.value][0];
    let result = [];
    let _this = this;
    return Object.keys(products).map(function(product, idx) {
      return products[product].filter((item) => {
          if(item.name.toLowerCase().indexOf(name) > -1) {
          result.push(item);
           _this.setState({renderedProducts: result});
        }
      })
    });
    
  }

  render() {
  const {classes} = this.props; 
  const {products, productTypes, selectedOption, renderedProducts, cartProducts, total} = this.state;
  if(productTypes && productTypes.length > 0 && products && Object.keys(products).length > 0) {
    return (
      <div className="flex">
     <div className="products-listing products-listing-container">
     
      <Paper className={classes.root}>
      <div className="products-listing__heading">
        <div>Big Bun</div>
        <FormControl className={classes.formControl, 'select-product-type'}>
          <Select
            value={selectedOption}
            onChange={this.fetchProductsByType}
          >
          {productTypes.map(function(type, idx) {
            return (
              <MenuItem key={idx} value={type}>{type}</MenuItem>
              )
          })}
          </Select>
        </FormControl>
        <TextField
          id="name"
          className={classes.textField, 'textfield-search'}
          value={this.state.name}
          onChange={(event) => this.searchByName(event)}
          margin="normal"
        />
      </div>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Ingredients</TableCell>
              <TableCell numeric>Discount (%)</TableCell>
              <TableCell numeric>Price (₹)</TableCell>
              <TableCell>Quantity</TableCell>
            </TableRow>
          </TableHead>
          {renderedProducts && renderedProducts.length > 0 && <TableBody>
            {renderedProducts.map((n, idx) => {
              return (
                <TableRow key={idx}>
                  <TableCell component="th" scope="row">
                    {n.name}
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell numeric>{n.discountInPercent ? n.discountInPercent : 0}</TableCell>
                  <TableCell numeric>
                    <span className={n.discountInPercent ? 'strike-text' : ''}>₹ {n.price ? n.price : '-'}</span>&nbsp;
                    {n.discountInPercent && <span>{n.price - (n.price * n.discountInPercent / 100).toFixed()}</span>}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => this.addProduct(n, n.id)} color="primary" className={classes.button} aria-label="add">
                      <Add />
                    </IconButton>
                    {this.validateRemoveBtn(n.name) && 
                      <IconButton onClick={() => this.removeProduct(n, n.id, idx)} color="primary" className={classes.button} aria-label="add">
                        <Remove />
                    </IconButton>}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>}
        </Table>
      </Paper>
     </div>
     <OrderSummary total={total} cartProducts={cartProducts}/>
   </div>
      )
  }
  else {
    return (
    <div className="overlay loader">
      <img alt="loading" className="loading-img" src="./assets/loading.gif" /> 
    </div>)
  }
  }
}

export default withStyles(styles)(ProductsListing);