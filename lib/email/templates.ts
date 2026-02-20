// lib/email/templates.ts

export function getWitnessInvitationEmail(
  inviterName: string,
  deceasedName: string,
  inviteLink: string,
  personalMessage?: string
): string {
  return `
    <div style="background-color: #f4f1ea; padding: 50px; font-family: 'Georgia', serif; color: #2c3e50; line-height: 1.8;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #fdfbf7; padding: 60px; border: 1px solid #d7ccc8; border-radius: 4px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        
        <div style="text-align: center; margin-bottom: 40px;">
          <h2 style="font-weight: normal; font-style: italic; color: #a0522d; margin: 0; font-size: 24px;">An Invitation to Bear Witness</h2>
        </div>

        <p style="font-size: 16px; margin-bottom: 25px;">
          ${inviterName} has entrusted you with a portion of the memory of 
          <strong style="color: #2c3e50;">${deceasedName}</strong>.
        </p>

        <p style="font-size: 16px; margin-bottom: 25px; font-style: italic; border-left: 3px solid #8a9a5b; padding-left: 20px; color: #555;">
          "This is not a request for photos. This is an invitation to bear witness. Your contribution will become part of the permanent historical archives."
        </p>

        ${personalMessage ? `
        <div style="margin: 30px 0; padding: 20px; background-color: #f9f7f3; border: 1px dashed #d7ccc8; font-size: 15px;">
          <strong>Message from ${inviterName}:</strong><br/>
          ${personalMessage}
        </div>
        ` : ''}

        <div style="text-align: center; margin-top: 50px;">
          <a href="${inviteLink}" style="background-color: #2c3e50; color: #f9f7f3; padding: 18px 35px; text-decoration: none; border-radius: 2px; font-size: 14px; letter-spacing: 0.1em; display: inline-block; text-transform: uppercase;">
            Accept and Bear Witness
          </a>
        </div>

        <div style="margin-top: 60px; padding-top: 30px; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #999;">
          <p>This invitation was sent by Legacy Vault on behalf of the family.</p>
          <p>Preserving the essence of a life, forever.</p>
        </div>
      </div>
    </div>
  `;
}


export function getSuccessorInvitationEmail(
  ownerName: string,
  successorName: string,
  acceptLink: string
): string {
  return `
    <div style="background-color: #f4f1ea; padding: 50px; font-family: 'Georgia', serif; color: #2c3e50; line-height: 1.8;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 60px; border: 2px solid #2c3e50; border-radius: 4px;">
        
        <div style="text-align: center; margin-bottom: 40px;">
          <h2 style="font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; font-size: 18px; color: #2c3e50; border-bottom: 1px solid #ddd; padding-bottom: 20px;">
            Legacy Vault Stewardship
          </h2>
        </div>

        <p style="font-size: 16px;">Dear ${successorName},</p>

        <p style="font-size: 16px;">
          <strong>${ownerName}</strong> has designated you as their <strong>Archive Steward</strong>.
        </p>

        <p style="font-size: 16px;">
          This is a position of significant trust. It means that in the event of their passing, you will be granted full control and legal authority over their family archives stored within Legacy Vault.
        </p>

        <div style="background-color: #f8f9fa; padding: 20px; margin: 30px 0; font-size: 14px; border-left: 4px solid #2c3e50;">
          <strong>Responsibilities include:</strong>
          <ul style="margin-top: 10px; padding-left: 20px;">
            <li>Preserving the family history</li>
            <li>Managing access for future generations</li>
            <li>Resolving any disputes regarding content</li>
          </ul>
        </div>

        <p style="font-size: 16px;">
          To accept this responsibility, please confirm your identity below.
        </p>

        <div style="text-align: center; margin-top: 40px;">
          <a href="${acceptLink}" style="background-color: #2c3e50; color: #ffffff; padding: 16px 30px; text-decoration: none; font-family: sans-serif; font-weight: bold; font-size: 14px;">
            I Accept This Responsibility
          </a>
        </div>

      </div>
    </div>
  `;
}

export function getProofOfLifeEmail(userName: string, checkInLink: string): string {
  return `
    <div style="background-color: #f9f7f3; padding: 40px; font-family: sans-serif; color: #2c3e50;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; border: 1px solid #d7ccc8;">
        <h2 style="font-family: serif; color: #2c3e50; font-size: 24px; margin-bottom: 20px;">
          Legacy Vault: Annual Verification
        </h2>
        <p>Dear ${userName},</p>
        <p>
          This is your annual check-in from Legacy Vault. You have enabled the 
          <strong>Dead Man's Switch</strong> for your archive.
        </p>
        <p>
          We are verifying that you are still active and in control of your account. 
          If you do not respond within <strong>90 days</strong>, we will notify your designated successor.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${checkInLink}" style="background-color: #8a9a5b; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            I am here - Reset Timer
          </a>
        </div>
        <p style="font-size: 12px; color: #999;">
          If you no longer wish to receive these checks, you can disable this feature in your account settings.
        </p>
      </div>
    </div>
  `;
}

export function getSuccessorAlertEmail(
  successorName: string,
  ownerName: string,
  claimLink: string
): string {
  return `
    <div style="background-color: #f9f7f3; padding: 40px; font-family: sans-serif; color: #2c3e50;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; border: 2px solid #a0522d;">
        <h2 style="font-family: serif; color: #a0522d; font-size: 24px; margin-bottom: 20px; text-transform: uppercase;">
          Urgent: Archive Status Alert
        </h2>
        <p>Dear ${successorName},</p>
        <p>
          You are the designated Archive Steward for <strong>${ownerName}</strong>.
        </p>
        <p>
          We have not received a response from ${ownerName} regarding their annual verification check for over 90 days. 
          Per their instructions, we are notifying you to investigate their status.
        </p>
        <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #a0522d; margin: 20px 0;">
          <strong>Next Steps:</strong><br/>
          If ${ownerName} has passed away or is incapacitated, please use the link below to begin the archive transfer process.
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${claimLink}" style="background-color: #2c3e50; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            View Options & Report Status
          </a>
        </div>
      </div>
    </div>
  `;
}