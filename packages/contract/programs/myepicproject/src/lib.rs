use anchor_lang::prelude::*;

declare_id!("95HW14UjQR6eQKaTwFLupKcFLjG54v2CyByFWrT9jsoK");

#[program]
pub mod myepicproject {
    use super::*;
    pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;
        base_account.total_gifs = 0;
        Ok(())
    }

    // add_gif関数はgif_linkを受け取れるようになりました。
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
pub struct StartStuffOff<'info> {
    #[account(init, payer = user, space = 9000)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// AddGifメソッドを呼び出した署名者を構造体に追加し、保存できるようにします。
#[derive(Accounts)]
pub struct AddGif<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
}

// カスタム構造体を作成します。
#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub gif_link: String,
    pub user_address: Pubkey,
}

#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
    // ItemStruct型のVectorをアカウントにアタッチします。
    pub gif_list: Vec<ItemStruct>,
}
