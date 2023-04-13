import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';

// import idl from '../target/idl/solana_d_app.json';
// import kp from './keypair.json'

// 定数を宣言します。
const TWITTER_HANDLE = 'elonmusk';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

// SystemProgramはSolanaランタイムへの参照です。
const { SystemProgram, Keypair } = web3;

// GIFデータを保持するアカウントのキーペアを作成します。
const arr = Object.values(kp._keypair.secretKey)
const secret = new Uint8Array(arr)
const baseAccount = web3.Keypair.fromSecretKey(secret)

// IDLファイルからプログラムIDを取得します。
const programID = new PublicKey(idl.metadata.address);

// ネットワークをDevnetに設定します。
const network = clusterApiUrl('devnet');

// トランザクションが完了したときに通知方法を制御します。
const opts = {
  preflightCommitment: "processed"
}

const App = () => {
  const TEST_GIFS = [
    'https://media.giphy.com/media/ZqlvCTNHpqrio/giphy.gif',
    'https://media.giphy.com/media/bC9czlgCMtw4cj8RgH/giphy.gif',
    'https://media.giphy.com/media/kC8N6DPOkbqWTxkNTe/giphy.gif',
    'https://media.giphy.com/media/26n6Gx9moCgs1pUuk/giphy.gif'
  ];
  /*
   * Phantom Walletが接続されているかどうかを確認するための関数です。
   */
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };
  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(
      connection, window.solana, opts.preflightCommitment,
    );
    return provider;
  }
  const createGifAccount = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      console.log("ping")
      await program.methods.initialize({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount]
      });
      console.log("Created a new BaseAccount w/ address:", baseAccount.publicKey.toString())
      await getGifList();

    } catch(error) {
      console.log("Error creating BaseAccount account:", error)
    }
  }

  const sendGif = async () => {
    if (inputValue.length === 0) {
      console.log("No gif link given!")
      return
    }
    setInputValue('');
    console.log('Gif link:', inputValue);
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);

      await program.rpc.addGif(inputValue, {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        },
      });
      console.log("GIF successfully sent to program", inputValue)

      await getGifList();
    } catch (error) {
      console.log("Error sending GIF:", error)
    }
  };
  /*
   * 「Connect to Wallet」ボタンを押したときに動作する関数です。（移行のSectionで変更するので、現状は内部処理がないまま進みます。）
   */
  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log("Connected with Public Key:", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  /*
   * ユーザーがWebアプリケーションをウォレットに接続していないときに表示するUIです。
   */
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={ connectWallet }
    >
      Connect to Wallet
    </button>
  );
  const renderConnectedContainer = () => {
    // プログラムアカウントが初期化されているかどうかチェックします。
    if (gifList === null) {
      return (
        <div className="connected-container">
          <button className="cta-button submit-gif-button" onClick={createGifAccount}>
            Do One-Time Initialization For GIF Program Account
          </button>
        </div>
      )
    }
    // アカウントが存在した場合、ユーザーはGIFを投稿することができます。
    else {
      return(
        <div className="connected-container">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendGif();
            }}
          >
            <input
              type="text"
              placeholder="Enter gif link!"
              value={inputValue}
              onChange={onInputChange}
            />
            <button type="submit" className="cta-button submit-gif-button">
              Submit
            </button>
          </form>
          <div className="gif-grid">
            {/* indexをキーとして使用し、GIFイメージとしてitem.gifLinkに変更しました。 */}
            {gifList.map((item, index) => (
              <div className="gif-item" key={index}>
                <img src={item.gifLink} />
              </div>
            ))}
          </div>
        </div>
      )
    }
  }

  /*
   * 初回のレンダリング時にのみ、Phantom Walletが接続されているかどうか確認します。
   */
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  const getGifList = async() => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);

      console.log("Got the account", account)
      setGifList(account.gifList)

    } catch (error) {
      console.log("Error in getGifList: ", error)
      setGifList(null);
    }
  }

  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching GIF list...');
      getGifList()
    }
  }, [walletAddress]);

  return (
    <div className="App">
      <div className={ walletAddress ? 'authed-container' : 'container' }>
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection ✨
          </p>
          {/* ここでウォレットへの接続ボタンをレンダリングします。 */ }
          { !walletAddress && renderNotConnectedContainer() }
        </div>
        <main className="main">
          {/* ウォレットが接続されている場合にrenderConnectedContainer関数を実行します。 */ }
          { walletAddress && renderConnectedContainer() }
        </main>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={ twitterLogo } />
          <a
            className="footer-text"
            href={ TWITTER_LINK }
            target="_blank"
            rel="noreferrer"
          >{ `built on @${TWITTER_HANDLE}` }</a>
        </div>
      </div>
    </div>
  );
};

export default App;
