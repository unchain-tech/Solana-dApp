const assert = require('assert');
const anchor = require('@project-serum/anchor');
const { SystemProgram } = anchor.web3;

describe('Solana-dApp-test', async () => {
  it("It adds a GIF to the account's list", async () => {
    console.log('🚀 Starting test...');
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.Myepicproject;

    const baseAccount = anchor.web3.Keypair.generate();

    const tx = await program.rpc.startStuffOff({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });

    console.log('📝 Your transaction signature', tx);

    let account = await program.account.baseAccount.fetch(
      baseAccount.publicKey,
    );
    const _initialGifs = account.totalGifs;
    const initialGifs = parseInt(_initialGifs);
    console.log('👀 GIF Count', initialGifs.toString());
    assert.ok(typeof initialGifs === 'number');

    // GIFリンクと送信ユーザーのアドレスを渡します。
    await program.rpc.addGif('insert_a_gif_link_here', {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    });

    // アカウントを呼び出します。
    account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    assert.ok(parseInt(account.totalGifs) === initialGifs + 1);

    // アカウントでgif_listにアクセスします。
    console.log('👀 GIF List', account.gifList);
  });
});
