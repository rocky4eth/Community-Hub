import crypto, { CipherCCMTypes, CipherGCM, DecipherCCM } from "crypto";
import dotenv from 'dotenv';
dotenv.config();

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY!, "hex");
const ALGORITHM = process.env.ENCRYPTION_ALGORITHM as CipherCCMTypes;
const IV_LENGTH = 12;

export interface EncryptedValue {
  ciphertext: string,
  iv: string,
  tag: string
}

export interface DecryptedValue {
  aes_key: string,
  private_key: string,
  public_key: string,
  address: string,
  counter?: string,
  timestamp?: number
}

export type ECCValue = {
  address: string;
  contract: string;
  chainId: bigint;
  private_key: string
};

export const Vault = {

  encrypt(plaintext: string): EncryptedValue {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv) as CipherGCM;
    const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();

    return {
      ciphertext: encrypted.toString("hex"),
      iv: iv.toString("hex"),
      tag: tag.toString("hex"),
    };
  },

  decrypt({ ciphertext, iv, tag }: EncryptedValue) {
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, Buffer.from(iv, "hex")) as DecipherCCM;
    decipher.setAuthTag(Buffer.from(tag, "hex"));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(ciphertext, "hex")),
      decipher.final(),
    ]);

    return decrypted.toString("utf8");
  }

};
