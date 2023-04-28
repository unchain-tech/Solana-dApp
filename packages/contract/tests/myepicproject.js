const anchor = require('@project-serum/anchor');
const { assert } = require('chai');
const { SystemProgram } = anchor.web3;

describe('myepicproject', () => {
  it('Is initialized!', async () => {
    // Configure the client to use the local cluster.
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.Myepicproject;
    const baseAccount = anchor.web3.Keypair.generate();
    await program.rpc.startStuffOff({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });

    let account = await program.account.baseAccount.fetch(
      baseAccount.publicKey,
    );
    // console.log('👀 GIF Count', account.totalGifs.toString());
    assert.equal(
      account.totalGifs.toString(),
      '0',
      'number of gifs should be 0',
    );

    // GIFリンクと送信ユーザーのアドレスを渡します。
    await program.rpc.addGif(
      'https://media.giphy.com/media/R6gvnAxj2ISzJdbA63/giphy-downsized-large.gif',
      {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        },
      },
    );

    // アカウントを呼び出します。
    account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    // console.log('👀 GIF Count', account.totalGifs.toString());
    assert.equal(
      account.totalGifs.toString(),
      '1',
      'number of gifs should be 1',
    );

    // console.log('👀 GIF List', account.gifList);
    assert.equal(
      account.gifList[0].gifLink,
      'https://media.giphy.com/media/R6gvnAxj2ISzJdbA63/giphy-downsized-large.gif',
      'wrong gif information is added',
    );
  });
});
