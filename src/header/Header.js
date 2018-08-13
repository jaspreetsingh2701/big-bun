/*
* @Author: jas
* @Date:   2018-08-12 19:00:51
* @Last Modified by:   jas
* @Last Modified time: 2018-08-13 09:34:20
*/
import React from 'react';
import './../styles/Header.css';

const Header = () => (
 <header className="header">
	 	<div className="header__wrapper">
	 		<img className="header__logo" src="../assets/big-bun-logo.png" />
	 		<div className="header__text">Big Bun</div>
 	</div>
 </header>
);

export default Header;
