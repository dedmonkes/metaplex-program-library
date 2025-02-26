/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet';
import * as web3 from '@solana/web3.js';

/**
 * @category Instructions
 * @category SetCollection
 * @category generated
 */
export const setCollectionStruct = new beet.BeetArgsStruct<{
  instructionDiscriminator: number[] /* size: 8 */;
}>(
  [['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)]],
  'SetCollectionInstructionArgs',
);
/**
 * Accounts required by the _setCollection_ instruction
 *
 * @property [_writable_] candyMachine
 * @property [**signer**] authority
 * @property [_writable_] mintingAccountRecordPlugin
 * @property [_writable_] collectionPda
 * @property [**signer**] payer
 * @property [] metadata
 * @property [] mint
 * @property [] edition
 * @property [_writable_] collectionAuthorityRecord
 * @property [] tokenMetadataProgram
 * @category Instructions
 * @category SetCollection
 * @category generated
 */
export type SetCollectionInstructionAccounts = {
  candyMachine: web3.PublicKey;
  authority: web3.PublicKey;
  mintingAccountRecordPlugin: web3.PublicKey;
  collectionPda: web3.PublicKey;
  payer: web3.PublicKey;
  systemProgram?: web3.PublicKey;
  rent?: web3.PublicKey;
  metadata: web3.PublicKey;
  mint: web3.PublicKey;
  edition: web3.PublicKey;
  collectionAuthorityRecord: web3.PublicKey;
  tokenMetadataProgram: web3.PublicKey;
};

export const setCollectionInstructionDiscriminator = [192, 254, 206, 76, 168, 182, 59, 223];

/**
 * Creates a _SetCollection_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category SetCollection
 * @category generated
 */
export function createSetCollectionInstruction(
  accounts: SetCollectionInstructionAccounts,
  programId = new web3.PublicKey('eERFprSmhDX7an71Kqg5ZjG3JoeMqLAZN4DGkvmqr3M'),
) {
  const [data] = setCollectionStruct.serialize({
    instructionDiscriminator: setCollectionInstructionDiscriminator,
  });
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.candyMachine,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.authority,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: accounts.mintingAccountRecordPlugin,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.collectionPda,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.payer,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: accounts.systemProgram ?? web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.rent ?? web3.SYSVAR_RENT_PUBKEY,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.metadata,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.mint,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.edition,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.collectionAuthorityRecord,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.tokenMetadataProgram,
      isWritable: false,
      isSigner: false,
    },
  ];

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  });
  return ix;
}
