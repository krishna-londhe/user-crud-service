import { InputValidationError } from './input.validation.error';

///////////////////////////////////////////////////////////////////////////////////////

export class Helper {

    static isStr(obj: any): boolean {
        return typeof obj === 'string' || obj instanceof String;
    }

    static getDigitsOnly(phone: string): string {
        return phone ? phone.replace(/\D/g, '') : phone;
    }

    static handleValidationError = (result): void => {
        let index = 1;
        const errorMessages = [];
        for (const er of result.errors) {
            errorMessages.push(` ${index}. ${er.msg} - <${er.value}> for <${er.param}> in ${er.location}`);
            index++;
        }
        throw new InputValidationError(errorMessages);
    };

    // Expected phone format: '<countryCode>-<number>', e.g. '+91-9876543210'
    static sanitizePhone(phone: string): string {
        if (!phone) {
            return phone;
        }
        if (!phone.includes('-')) {
            return phone;
        }
        const tokens = phone.split('-');
        const countryCode = '+' + Helper.getDigitsOnly(tokens[0]);
        const phoneNumber = Helper.getDigitsOnly(tokens.slice(1).join(''));
        return `${countryCode}-${phoneNumber}`;
    }

    static validatePhone(phone: string): Promise<boolean> {
        if (!phone) {
            return Promise.resolve(true);
        }
        const tokens = phone.split('-');
        const countryCode = tokens[0];
        const phoneNumber = tokens[1];
        const validCountryCode = Helper.isStr(countryCode) && countryCode.startsWith('+') && countryCode.length > 1;
        if (!validCountryCode) {
            return Promise.reject('Invalid country code');
        }
        const validPhoneNumber = Helper.isStr(phoneNumber) && phoneNumber.length >= 7 && phoneNumber.length <= 15;
        if (!validPhoneNumber) {
            return Promise.reject('Invalid phone number');
        }
        return Promise.resolve(true);
    }

}
