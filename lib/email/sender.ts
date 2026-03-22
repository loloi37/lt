export async function sendEmail({
    to,
    subject,
    html
}: {
    to: string;
    subject: string;
    html: string;
}) {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'api-key': process.env.BREVO_API_KEY!,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            sender: {
                name: 'Legacy Vault',
                email: 'jejfhdhf19@gmail.com'
            },
            to: [{ email: to }],
            subject: subject,
            htmlContent: html
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(
            `Brevo error: ${JSON.stringify(error)}`
        );
    }

    return response.json();
}