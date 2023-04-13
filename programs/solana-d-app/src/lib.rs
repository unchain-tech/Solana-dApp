use anchor_lang::prelude::*;

declare_id!("SomeHashMpGXkYsWTK6W2BkgFidsLeZ7F476zPEfcYn");
#[program]
pub mod solana_d_app {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        // アカウントへのリファレンスを取得します。
        let base_account = &mut ctx.accounts.base_account;
        // total_gifsを初期化します。
        base_account.total_gifs = 0;
        Ok(())
    }

    // アカウントを参照し、total_gifsをインクリメントします。
    pub fn add_gif(ctx: Context<AddGif>, gif_link: String) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;
        let user = &mut ctx.accounts.user;

        // gif_linkとuser_addressを格納するための構造体を作成します。
        let item = ItemStruct {
            gif_link: gif_link.to_string(),
            user_address: *user.to_account_info().key,
        };

        // gif_listにitemを追加します。
        base_account.gif_list.push(item);
        base_account.total_gifs += 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 9000)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddGif<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub gif_link: String,
    pub user_address: Pubkey,
}

#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
    pub gif_list: Vec<ItemStruct>,
}
