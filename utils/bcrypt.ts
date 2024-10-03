import * as bcrypt from 'bcrypt';

export class Bcrypt {
    private static async generateSalt(rounds: number): Promise<string> {
        return bcrypt.genSalt(rounds);
    }

    /**
     * Hashes a raw string using bcrypt with a generated salt.
     * 
     * This function generates a salt and hashes the provided raw data using bcrypt.
     * 
     * @param {string} data - The plain text to be hashed.
     * @returns {Promise<string>} - A promise that resolves to the hashed data.
     * @example
     * // Result = $2b$10$gtPt7eX4m4WLOU4bbUizuO1cjibNdVmKOhaXurcXFOxnc./Qf4AbG
     * hash(asdqwe123)
    */
    static async hash(data: string): Promise<string> {
        const salt = await this.generateSalt(10);
        return bcrypt.hash(data, salt);
    }

    /**
     * Compares a raw data with a hashed to check if they match.
     * 
     * This function uses bcrypt to compare the raw data with the hashed data.
     * 
     * @param {string} data - The plain text to compare.
     * @param {string} hash - The hashed data to compare against.
     * @returns {Promise<boolean>} - A promise that resolves to `true` if the data and hash match, `false` otherwise.
    */
    static async compare(data: string, hash: string): Promise<Boolean> {
        return await bcrypt.compare(data, hash);
    }
}