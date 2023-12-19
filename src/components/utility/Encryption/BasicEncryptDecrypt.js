export const basicEncrypt = (stringToEncrypt) => {
    let encryptedString = CryptoJS.AES.encrypt(stringToEncrypt, process.env.REACT_APP_ENCRYPTION_PHRASE)

    return encryptedString;
}

export const basicDecrypt = (stringToDecrypt) => {
    let decryptedString = CryptoJS.AES.decrypt(stringToDecrypt, process.env.REACT_APP_ENCRYPTION_PHRASE)

    return decryptedString;
}