## 💬 Solana-dApp(prototype)

本レポジトリは Solana-dApp の完成版を示したものになります。

以下の手順を実行することで Solana-dApp の挙動を確認できます。

### レポジトリのクローン

[こちら](https://github.com/unchain-tech/Solana-dApp.git)から Solana-dApp をクローンします。

その後下のコマンドを実行することで必要なパッケージをインストールしましょう。

```
yarn
```

## コントラクトのテスト、デプロイ

まずは[こちら](https://app.unchain.tech/learn/Solana-dApp/ja/3/1/)を参考に、devnet にデプロイする準備をしましょう。

準備ができたら下のコマンドを実行させることで devnet にコントラクトをデプロイしましょう。

```
anchor deploy
```

これでコントラクトの準備は終了です。

## フロントの立ち上げ

`packages/client/src`に`idl.json`というディレクトリを作成して、その中に先ほど migrate した際に得た`packages/contract/target/idl/myepicproject.json`の内容をコピー　& ペーストしましょう。

準備が整ったら、下のコマンドを実行してフロントを立ち上げ動作確認をしましょう。

```
yarn client start
```
