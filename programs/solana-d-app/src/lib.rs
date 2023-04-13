use anchor_lang::prelude::*;

declare_id!("SomeHashMpGXkYsWTK6W2BkgFidsLeZ7F476zPEfcYn");

#[program]
pub mod solana_d_app {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
