// @ts-ignore
import { aesCmac } from 'node-aes-cmac';
import { maxDurationWindow, nxpStaticPrefix } from '../config'
import { Database } from './db'
import { DecryptedValue, ECCValue, Vault } from './vault';

const calculateFinalCMAC = (cmac: Buffer): Buffer => {
    // Extract odd-indexed bytes
    const finalCMAC = Buffer.alloc(8);
    let j = 0;
    for (let i = 0; i < cmac.length; i++) {
        if (i % 2 !== 0) {
            finalCMAC[j++] = cmac[i];
        }
    }

    return finalCMAC;
}

const convertCTR = (ctr: Buffer): Buffer => {
    const finalCtr = Buffer.alloc(3);
    let j = 0;
    for (let i = 0; i < ctr.length; i++) {
        if (ctr[i] !== 0) {
            finalCtr[j++] = ctr[i]
        }
    }

    return finalCtr;
}

export const generateCmac = async (uid: string, counter: string, key: string): Promise<string> => {
    console.log("Request params: ", { uid, counter });

    const numberBuffer =  Buffer.from(nxpStaticPrefix, 'hex');
    const uidBuffer =  Buffer.from(uid, 'hex');
    const counterBuffer =  convertCTR(Buffer.from(counter, 'hex'));
    const aesKeyBuffer = Buffer.from(key, 'hex');
    const challengeBuffer = Buffer.concat([numberBuffer, uidBuffer, counterBuffer]);

    const sessionCMACString = aesCmac(aesKeyBuffer, challengeBuffer);
    const sessionCMAC = Buffer.from(sessionCMACString, 'hex');
    const cmacString = aesCmac(sessionCMAC, Buffer.alloc(0));
    const cmac = Buffer.from(cmacString, 'hex');
    const finalCMAC = calculateFinalCMAC(cmac);

    // Generate CMAC tag
    console.log('CMAC:', finalCMAC.toString('hex').toUpperCase());  

    return finalCMAC.toString('hex').toUpperCase();
}

export const verifyCmacFromChip = async (uid: string, counter: string, cmacFromTag: string): Promise<ECCValue> => {
    console.log("Request params: ", { uid, counter, cmacFromTag });

    const keyEntry = await Database.findKey(uid);
    if (!keyEntry) {
        throw Error(`No found keys for tag uid ${uid} in database`);
    }

    const keysString = Vault.decrypt(keyEntry);
    const keys = JSON.parse(keysString) as DecryptedValue;

    if (keys.counter !== undefined) { 
        if (keys.counter > counter) {
            throw Error(`Counter for ${uid} expired`);
        }

        if (keys.counter === counter) {
            const currentTimestamp = Date.now();
            if (keys.timestamp !== undefined) {
                const lastScanWindow = currentTimestamp - keys.timestamp;
                if (lastScanWindow > maxDurationWindow) {
                    throw Error(`Max duration window ${maxDurationWindow} expired for ${uid}`);
                }
            }
        }
    }

    // This algorithm is described in NXP documentation in point 3.4.4.2.1
    // and Table 4. Steps to do it:
    // 1. SV2 = 3CC300010080 [UID] [SDMReadCtr] [Zero Padding]
    // There is a fix prefix 3CC300010080 which has be added to calculate SV2
    // If CTR number has the first bytes 0x00 then it is going to the end after number
    //
    // 2. KSesSDMFileReadMAC = MAC(KSDMFileRead; SV2)
    // KSDMFileRead is a AES key injected into NFC chip
    //
    // 3. SDMMAC = MACt(KSesSDMFileReadMAC; zero length input)
    // It is tricky because only even bytes are used to calculate final CMAC

    const numberBuffer =  Buffer.from(nxpStaticPrefix, 'hex');
    const uidBuffer =  Buffer.from(uid, 'hex');
    const counterBuffer =  convertCTR(Buffer.from(counter, 'hex'));
    const aesKeyBuffer = Buffer.from(keys.aes_key, 'hex');
    const challengeBuffer = Buffer.concat([numberBuffer, uidBuffer, counterBuffer]);

    const sessionCMACString = aesCmac(aesKeyBuffer, challengeBuffer);
    const sessionCMAC = Buffer.from(sessionCMACString, 'hex');
    const cmacString = aesCmac(sessionCMAC, Buffer.alloc(0));
    const cmac = Buffer.from(cmacString, 'hex');
    const finalCMAC = calculateFinalCMAC(cmac);
    const finalCMACString = finalCMAC.toString('hex')

    console.log('CMAC:', finalCMACString);
    if (finalCMACString.toUpperCase() !== cmacFromTag.toUpperCase()) {
        throw Error(`CMAC for ${uid} is invalid`);
    }

    if (keys.timestamp === undefined || keys.counter === undefined || keys.counter < counter) {
        // Update counter if CMAC validated to avoid copy chip
        await Database.saveKey({
            ...keyEntry,
            ...Vault.encrypt(JSON.stringify({
                ...keys,
                counter,
                timestamp: Date.now()
            } as DecryptedValue))
        });
    }

    return {
        address: keys.address,
        private_key: keys.private_key,
        contract: keyEntry.contract,
        chainId: keyEntry.chainId
    };
}
