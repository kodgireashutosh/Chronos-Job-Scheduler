import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const SECRET = process.env.SETTINGS_SECRET!; // 32 chars
const IV_LENGTH = 16;

export function encrypt(text: string) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(
        ALGORITHM,
        Buffer.from(SECRET),
        iv
    );
    const encrypted = Buffer.concat([
        cipher.update(text),
        cipher.final()
    ]);

    return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(text: string) {
    const [ivHex, encryptedHex] = text.split(":");
    const decipher = crypto.createDecipheriv(
        ALGORITHM,
        Buffer.from(SECRET),
        Buffer.from(ivHex, "hex")
    );
    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptedHex, "hex")),
        decipher.final()
    ]);

    return decrypted.toString();
}
