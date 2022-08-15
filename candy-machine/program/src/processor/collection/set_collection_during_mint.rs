use anchor_lang::prelude::*;
use mpl_token_metadata::{instruction::set_and_verify_sized_collection_item, utils::assert_derivation};
use solana_program::{
    program::invoke_signed, sysvar, sysvar::instructions::get_instruction_relative,
};
use mpl_token_metadata::state::TokenMetadataAccount;
use crate::{cmp_pubkeys, CandyMachine, CollectionPDA, MintingAccountRecordPlugin};

/// Sets and verifies the collection during a candy machine mint
#[derive(Accounts)]
pub struct SetCollectionDuringMint<'info> {
    #[account(has_one = authority)]
    candy_machine: Account<'info, CandyMachine>,
    /// CHECK: account checked in CPI/instruction sysvar
    #[account(mut)]
    metadata: UncheckedAccount<'info>,
    payer: Signer<'info>,
    #[account(mut, seeds = [b"collection".as_ref(), candy_machine.to_account_info().key.as_ref()], bump)]
    collection_pda: Account<'info, CollectionPDA>,
    /// CHECK: account constraints checked in account trait
    #[account(address = mpl_token_metadata::id())]
    token_metadata_program: UncheckedAccount<'info>,
    /// CHECK: account constraints checked in account trait
    #[account(address = sysvar::instructions::id())]
    instructions: UncheckedAccount<'info>,
    /// CHECK: account checked in CPI
    collection_mint: UncheckedAccount<'info>,
    /// CHECK: account checked in CPI
     #[account(mut)]
    collection_metadata: UncheckedAccount<'info>,
    /// CHECK: account checked in CPI
    collection_master_edition: UncheckedAccount<'info>,
    /// CHECK: authority can be any account and is checked in CPI
    authority: UncheckedAccount<'info>,
    /// CHECK: account checked in CPI
    collection_authority_record: UncheckedAccount<'info>,
    #[account(
        seeds = [b"phase_minting_account_record", minting_account_record_plugin.roadmap.as_ref()],
        bump,
        constraint = minting_account_record_plugin.is_closed == false,
    )]
    pub minting_account_record_plugin: Box<Account<'info, MintingAccountRecordPlugin>>,

}

pub fn handle_set_collection_during_mint(ctx: Context<SetCollectionDuringMint>) -> Result<()> {
    let ixs = &ctx.accounts.instructions;
    let previous_instruction = get_instruction_relative(-1, ixs)?;
    if !cmp_pubkeys(&previous_instruction.program_id, &crate::id()) {
        msg!(
            "Transaction had ix with program id {}",
            &previous_instruction.program_id
        );
        return Ok(());
    }
    // Check if the metadata account has data if not bot fee
    if !cmp_pubkeys(ctx.accounts.metadata.owner, &mpl_token_metadata::id())
        || ctx.accounts.metadata.data_len() == 0
    {
        return Ok(());
    }

    let discriminator = &previous_instruction.data[0..8];
    if discriminator != [211, 57, 6, 167, 15, 219, 35, 251] {
        msg!("Transaction had ix with data {:?}", discriminator);
        return Ok(());
    }

    let mint_ix_accounts = previous_instruction.accounts;
    let mint_ix_cm = mint_ix_accounts[0].pubkey;
    let mint_ix_metadata = mint_ix_accounts[5].pubkey;
    let signer = mint_ix_accounts[7].pubkey;
    let candy_key = ctx.accounts.candy_machine.key();
    let metadata = ctx.accounts.metadata.key();
    let payer = ctx.accounts.payer.key();

    if !cmp_pubkeys(&signer, &payer) {
        msg!(
            "Signer with pubkey {} does not match the mint ix Signer with pubkey {}",
            mint_ix_cm,
            candy_key
        );
        return Ok(());
    }
    if !cmp_pubkeys(&mint_ix_cm, &candy_key) {
        msg!(
            "Candy Machine with pubkey {} does not match the mint ix Candy Machine with pubkey {}",
            mint_ix_cm,
            candy_key
        );
        return Ok(());
    }
    if !cmp_pubkeys(&mint_ix_metadata, &metadata) {
        msg!(
            "Metadata with pubkey {} does not match the mint ix metadata with pubkey {}",
            mint_ix_metadata,
            metadata
        );
        return Ok(());
    }

    let collection_pda = &ctx.accounts.collection_pda;
    let collection_mint = ctx.accounts.collection_mint.to_account_info();
    if !cmp_pubkeys(&collection_pda.mint, &collection_mint.key()) {
        return Ok(());
    }
    let seeds = [b"collection".as_ref(), candy_key.as_ref()];
    let bump = assert_derivation(&crate::id(), &collection_pda.to_account_info(), &seeds)?;
    let signer_seeds = [b"collection".as_ref(), candy_key.as_ref(), &[bump]];
    let set_collection_infos = vec![
        ctx.accounts.metadata.to_account_info(),
        collection_pda.to_account_info(),
        ctx.accounts.payer.to_account_info(),
        ctx.accounts.authority.to_account_info(),
        collection_mint.to_account_info(),
        ctx.accounts.collection_metadata.to_account_info(),
        ctx.accounts.collection_master_edition.to_account_info(),
        ctx.accounts.collection_authority_record.to_account_info(),
    ];
    invoke_signed(
        &set_and_verify_sized_collection_item(
            ctx.accounts.token_metadata_program.key(),
            ctx.accounts.metadata.key(),
            collection_pda.key(),
            ctx.accounts.payer.key(),
            ctx.accounts.authority.key(),
            collection_mint.key(),
            ctx.accounts.collection_metadata.key(),
            ctx.accounts.collection_master_edition.key(),
            Some(ctx.accounts.collection_authority_record.key()),
        ),
        set_collection_infos.as_slice(),
        &[&signer_seeds],
    )?;
    Ok(())
}
