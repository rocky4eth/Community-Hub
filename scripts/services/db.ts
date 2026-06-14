// db.ts (or .js)
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { databaseFilePath } from '../config';

type Data = {
  keys: KeyEntry[];
};

enum ChipType {
  NTAG424DNA
}

type KeyEntry = {
  uid: string;
  contract: string;
  chainId: bigint;
  chipType: ChipType;
  ciphertext: string;
  iv: string;
  tag: string;
  created: string;
};

const adapter = new JSONFile<Data>(databaseFilePath);
const defaultData: Data = { keys: [] }; // 👈 required!
const db = new Low<Data>(adapter, defaultData);

export const Database = {

  async saveKey(entry: Omit<KeyEntry, 'created'>) {
    await db.read();

    const existing = db.data!.keys.find(k => k.uid === entry.uid);
    if (existing) {
      console.log(`Update key for uid ${entry.uid}`);
      Object.assign(existing, entry);
    } else {
      console.log(`Save key for uid ${entry.uid}`);
      db.data!.keys.push({ ...entry, created: new Date().toISOString() });
    }
    await db.write();
  },

  async findKey(uid: string): Promise<KeyEntry | undefined> {
    await db.read();
    return db.data!.keys.find(k => k.uid === uid);
  },

}
