export * from './CandyMachine';
export * from './CollectionPDA';
export * from './MintingAccountRecordPlugin';

import { CandyMachine } from './CandyMachine';
import { CollectionPDA } from './CollectionPDA';
import { MintingAccountRecordPlugin } from './MintingAccountRecordPlugin';

export const accountProviders = { CandyMachine, CollectionPDA, MintingAccountRecordPlugin };
