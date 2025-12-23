/**
 * Simulates a signup request with a random delay and a small chance of failure.
 */
export async function mockSignup(email: string, name: string): Promise<{ success: boolean; message?: string }> {
    return new Promise((resolve, reject) => {
        // Random delay between 700ms and 900ms
        const delay = Math.floor(Math.random() * 200) + 700;

        setTimeout(() => {
            // 10% chance of failure
            const shouldFail = Math.random() < 0.1;

            if (shouldFail) {
                reject(new Error("Something went wrong. Please try again."));
            } else {
                resolve({ success: true, message: "Check your email for a sign-in link" });
            }
        }, delay);
    });
}
