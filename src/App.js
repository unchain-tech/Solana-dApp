
import React, { useEffect } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// 定数を宣言します。
const TWITTER_HANDLE = 'あなたのTwitterハンドル';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {


    // Confirm connection to Phantom Wallet
    const checkIfWalletIsConnected = async () => {
	try {
	    const { solana } = window;

	    if (solana && solana.isPhantom) {
		console.log('Pnantom wallet found!');
	    } else {
		alert('Solana object not found! Get a Pantom Wallet 👻');
	    }
	} catch (error) {
	    console.error(error);
	}
    };

    // Confirm Phantom Wallet is connected, only on the first rendering
    useEffect(() => {
	const onLoad = async () => {
	    await checkIfWalletIsConnected();
	};
	window.addEventListener('load', onLoad);
	return () => window.removeEventListener('load', onLoad);
    }, []);
    
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection ✨
          </p>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
