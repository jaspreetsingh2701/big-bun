import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Header from "./header/Header";
import ProductsListing from "./products-listing/ProductsListing";
import './App.css';


const theme = createMuiTheme({
  palette: {
    primary: { 
      main: '#F2784B',
      contrastText: '#FFF' 
    },
  },
});

class App extends Component {

  componentDidMount() {
    // console.log("check");
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Header />
        <div className="content-wrapper">
          <ProductsListing />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
