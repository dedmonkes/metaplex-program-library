/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as web3 from '@solana/web3.js';
import * as beet from '@metaplex-foundation/beet';
import * as beetSolana from '@metaplex-foundation/beet-solana';

/**
 * Arguments used to create {@link MintingAccountRecordPlugin}
 * @category Accounts
 * @category generated
 */
export type MintingAccountRecordPluginArgs = {
  roadmap: web3.PublicKey;
  programId: web3.PublicKey;
  mintingAccount: web3.PublicKey;
  maxSupply: beet.bignum;
  price: beet.bignum;
  quantityLeft: beet.bignum;
  goLiveDate: beet.COption<beet.bignum>;
  isClosed: boolean;
  collectionMint: beet.COption<web3.PublicKey>;
  collectionAuthorityRecordSigner: beet.COption<web3.PublicKey>;
  bump: number;
};

export const mintingAccountRecordPluginDiscriminator = [5, 19, 142, 209, 27, 2, 70, 130];
/**
 * Holds the data for the {@link MintingAccountRecordPlugin} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
export class MintingAccountRecordPlugin implements MintingAccountRecordPluginArgs {
  private constructor(
    readonly roadmap: web3.PublicKey,
    readonly programId: web3.PublicKey,
    readonly mintingAccount: web3.PublicKey,
    readonly maxSupply: beet.bignum,
    readonly price: beet.bignum,
    readonly quantityLeft: beet.bignum,
    readonly goLiveDate: beet.COption<beet.bignum>,
    readonly isClosed: boolean,
    readonly collectionMint: beet.COption<web3.PublicKey>,
    readonly collectionAuthorityRecordSigner: beet.COption<web3.PublicKey>,
    readonly bump: number,
  ) {}

  /**
   * Creates a {@link MintingAccountRecordPlugin} instance from the provided args.
   */
  static fromArgs(args: MintingAccountRecordPluginArgs) {
    return new MintingAccountRecordPlugin(
      args.roadmap,
      args.programId,
      args.mintingAccount,
      args.maxSupply,
      args.price,
      args.quantityLeft,
      args.goLiveDate,
      args.isClosed,
      args.collectionMint,
      args.collectionAuthorityRecordSigner,
      args.bump,
    );
  }

  /**
   * Deserializes the {@link MintingAccountRecordPlugin} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(
    accountInfo: web3.AccountInfo<Buffer>,
    offset = 0,
  ): [MintingAccountRecordPlugin, number] {
    return MintingAccountRecordPlugin.deserialize(accountInfo.data, offset);
  }

  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link MintingAccountRecordPlugin} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(
    connection: web3.Connection,
    address: web3.PublicKey,
  ): Promise<MintingAccountRecordPlugin> {
    const accountInfo = await connection.getAccountInfo(address);
    if (accountInfo == null) {
      throw new Error(`Unable to find MintingAccountRecordPlugin account at ${address}`);
    }
    return MintingAccountRecordPlugin.fromAccountInfo(accountInfo, 0)[0];
  }

  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(
    programId: web3.PublicKey = new web3.PublicKey('cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ'),
  ) {
    return beetSolana.GpaBuilder.fromStruct(programId, mintingAccountRecordPluginBeet);
  }

  /**
   * Deserializes the {@link MintingAccountRecordPlugin} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf: Buffer, offset = 0): [MintingAccountRecordPlugin, number] {
    return mintingAccountRecordPluginBeet.deserialize(buf, offset);
  }

  /**
   * Serializes the {@link MintingAccountRecordPlugin} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize(): [Buffer, number] {
    return mintingAccountRecordPluginBeet.serialize({
      accountDiscriminator: mintingAccountRecordPluginDiscriminator,
      ...this,
    });
  }

  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link MintingAccountRecordPlugin} for the provided args.
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   */
  static byteSize(args: MintingAccountRecordPluginArgs) {
    const instance = MintingAccountRecordPlugin.fromArgs(args);
    return mintingAccountRecordPluginBeet.toFixedFromValue({
      accountDiscriminator: mintingAccountRecordPluginDiscriminator,
      ...instance,
    }).byteSize;
  }

  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link MintingAccountRecordPlugin} data from rent
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(
    args: MintingAccountRecordPluginArgs,
    connection: web3.Connection,
    commitment?: web3.Commitment,
  ): Promise<number> {
    return connection.getMinimumBalanceForRentExemption(
      MintingAccountRecordPlugin.byteSize(args),
      commitment,
    );
  }

  /**
   * Returns a readable version of {@link MintingAccountRecordPlugin} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      roadmap: this.roadmap.toBase58(),
      programId: this.programId.toBase58(),
      mintingAccount: this.mintingAccount.toBase58(),
      maxSupply: (() => {
        const x = <{ toNumber: () => number }>this.maxSupply;
        if (typeof x.toNumber === 'function') {
          try {
            return x.toNumber();
          } catch (_) {
            return x;
          }
        }
        return x;
      })(),
      price: (() => {
        const x = <{ toNumber: () => number }>this.price;
        if (typeof x.toNumber === 'function') {
          try {
            return x.toNumber();
          } catch (_) {
            return x;
          }
        }
        return x;
      })(),
      quantityLeft: (() => {
        const x = <{ toNumber: () => number }>this.quantityLeft;
        if (typeof x.toNumber === 'function') {
          try {
            return x.toNumber();
          } catch (_) {
            return x;
          }
        }
        return x;
      })(),
      goLiveDate: this.goLiveDate,
      isClosed: this.isClosed,
      collectionMint: this.collectionMint,
      collectionAuthorityRecordSigner: this.collectionAuthorityRecordSigner,
      bump: this.bump,
    };
  }
}

/**
 * @category Accounts
 * @category generated
 */
export const mintingAccountRecordPluginBeet = new beet.FixableBeetStruct<
  MintingAccountRecordPlugin,
  MintingAccountRecordPluginArgs & {
    accountDiscriminator: number[] /* size: 8 */;
  }
>(
  [
    ['accountDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['roadmap', beetSolana.publicKey],
    ['programId', beetSolana.publicKey],
    ['mintingAccount', beetSolana.publicKey],
    ['maxSupply', beet.u64],
    ['price', beet.u64],
    ['quantityLeft', beet.u64],
    ['goLiveDate', beet.coption(beet.i64)],
    ['isClosed', beet.bool],
    ['collectionMint', beet.coption(beetSolana.publicKey)],
    ['collectionAuthorityRecordSigner', beet.coption(beetSolana.publicKey)],
    ['bump', beet.u8],
  ],
  MintingAccountRecordPlugin.fromArgs,
  'MintingAccountRecordPlugin',
);
