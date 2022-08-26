use anchor_lang::prelude::*;


/// Candy machine state and config data.
#[account]
#[derive(Default, Debug)]
pub struct CandyMachine {
    pub authority: Pubkey,
    pub wallet: Pubkey,
    pub roadmap : Pubkey,
    pub token_mint: Option<Pubkey>,
    pub items_redeemed: u64,
    pub data: CandyMachineData,
    // there's a borsh vec u32 denoting how many actual lines of data there are currently (eventually equals items available)
    // There is actually lines and lines of data after this but we explicitly never want them deserialized.
    // here there is a borsh vec u32 indicating number of bytes in bitmask array.
    // here there is a number of bytes equal to ceil(max_number_of_lines/8) and it is a bit mask used to figure out when to increment borsh vec u32
}

/// Collection PDA account
#[account]
#[derive(Default, Debug)]
pub struct CollectionPDA {
    pub mint: Pubkey,
    pub candy_machine: Pubkey,
}

/// Candy machine settings data.
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, Debug)]
pub struct CandyMachineData {
    pub uuid: String,
    pub price: u64,
    /// The symbol for the asset
    pub symbol: String,
    /// Royalty basis points that goes to creators in secondary sales (0-10000)
    pub seller_fee_basis_points: u16,
    pub max_supply: u64,
    pub is_mutable: bool,
    pub retain_authority: bool,
    pub go_live_date: Option<i64>,
    pub end_settings: Option<EndSettings>,
    pub creators: Vec<Creator>,
    pub hidden_settings: Option<HiddenSettings>,
    pub whitelist_mint_settings: Option<WhitelistMintSettings>,
    pub items_available: u64,
    /// If [`Some`] requires gateway tokens on mint
    pub gatekeeper: Option<GatekeeperConfig>,
}

/// Individual config line for storing NFT data pre-mint.
#[derive(AnchorSerialize, AnchorDeserialize, Debug)]
pub struct ConfigLine {
    pub name: String,
    /// URI pointing to JSON representing the asset
    pub uri: String,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct EndSettings {
    pub end_setting_type: EndSettingType,
    pub number: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub enum EndSettingType {
    Date,
    Amount,
}

// Unfortunate duplication of token metadata so that IDL picks it up.
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct Creator {
    pub address: Pubkey,
    pub verified: bool,
    // In percentages, NOT basis points ;) Watch out!
    pub share: u8,
}

/// Hidden Settings for large mints used with offline data.
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, Debug)]
pub struct HiddenSettings {
    pub name: String,
    pub uri: String,
    pub hash: [u8; 32],
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct WhitelistMintSettings {
    pub mode: WhitelistMintMode,
    pub mint: Pubkey,
    pub presale: bool,
    pub discount_price: Option<u64>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Debug)]
pub enum WhitelistMintMode {
    // Only captcha uses the bytes, the others just need to have same length
    // for front end borsh to not crap itself
    // Holds the validation window
    BurnEveryTime,
    NeverBurn,
}

/// Configurations options for the gatekeeper.
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct GatekeeperConfig {
    /// The network for the gateway token required
    pub gatekeeper_network: Pubkey,
    /// Whether or not the token should expire after minting.
    /// The gatekeeper network must support this if true.
    pub expire_on_use: bool,
}
/**
 * Phase plugin interface for using different minting contracts
 * The program plugin will implement this interface so we can get the needed
 * information to jusdge progress and setup of mint
 *
 */
#[account]
pub struct MintingAccountRecordPlugin {
    pub roadmap: Pubkey,
    /*
        Mint Program address
    */
    pub program_id: Pubkey,
    /*
        Mint pda account
    */
    pub minting_account: Pubkey,

    pub max_supply: u64,
    pub price: u64,
    pub quantity_left: u64,
    pub go_live_date: Option<i64>,
    /*
        Signifies that the minting has completed, either by minting
        out completly or being closed due to time restriction or
        decision by launchpad/team
        Only after this has been flipped can the roadmap be unlocked into
        either resolution or actioned
    */
    pub is_closed: bool,

    /*
        Collection mint associated to the minted nfts
        this is set by the team on the front end
    */
    pub collection_mint: Option<Pubkey>,

    /*
        Account used to delegate authority for the collection to the minting program to verify collection items
        as they are minted
        Suggested to make it the address of this plugin pda account
    */
    pub collection_authority_record_signer: Option<Pubkey>,

    pub bump: u8,
}

impl MintingAccountRecordPlugin {
    pub fn space() -> usize {
        8 +
        4 + std::mem::size_of::<Pubkey>() + // roadmap
        4 + std::mem::size_of::<Pubkey>() + // program_id
        4 + std::mem::size_of::<Pubkey>() +  // minting account
        16 + // max supply
        16 + //price
        16 + //quantity left
        16 + // go live
        1 + //is_closed
        4 + std::mem::size_of::<Pubkey>() + // collection_mint
        4 + std::mem::size_of::<Pubkey>() + // collection_authority_record_signer
        1 // bump
    }
}

pub fn get_minting_account_record_plugin(roadmap: &Pubkey, program_id: &Pubkey) -> Pubkey {
    Pubkey::find_program_address(
        &[b"phase_minting_account_record", roadmap.as_ref()],
        &program_id,
    )
    .0
}


