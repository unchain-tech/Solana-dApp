const anchor = require("@project-serum/anchor");


describe("solana-d-app", () => {
  const { SystemProgram } = anchor.web3;

  // フロントエンドと通信するためにプロバイダを再度作成して設定します。
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.SolanaDApp;
  const baseAccount = anchor.web3.Keypair.generate();

  it("Is initialized!", async () => {
    const tx = await program.methods.initialize({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,},
      signers: [baseAccount]
    }).rpc();
    console.log("Your transaction signature: ", tx);
  });

  it("Can add a gif!", async () => {
    let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('👀 GIF Count: ', account.totalGifs.toString())

    // add_gif関数を呼び出します。
    await program.rpc.addGif("https://media.tenor.com/x8v1oNUOmg4AAAAM/rickroll-roll.gif", {
      accounts: { baseAccount: baseAccount.publicKey },
    });

    account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('👀 GIF Count: ', account.totalGifs.toString())

    console.log('👀 GIF List: ', account.gifList)
  })


});
