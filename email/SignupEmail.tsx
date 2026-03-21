export const verificationTemplate = ({
  username,
  otp,
}: {
  username: string;
  otp: string;
}) => {
  return `
  <!DOCTYPE html>
  <html>
    <body style="background-color:#ffffff; font-family:sans-serif; margin:0; padding:0;">
      <div style="max-width:580px; margin:0 auto; padding:20px;">
        
        <h1 style="text-align:center; font-size:24px;">
          Verify your account
        </h1>

        <p>Hi ${username},</p>

        <p>
          Welcome to our anonymous messaging platform! Use the code below:
        </p>

        <div style="background:#f3f3f3; border-radius:4px; margin:16px auto; width:280px; text-align:center;">
          <span style="font-size:32px; font-weight:700; letter-spacing:6px;">
            ${otp}
          </span>
        </div>

        <p>This code will expire in 10 minutes.</p>

        <hr />

        <p style="font-size:12px; color:#888;">
          Your identity is always protected.
        </p>

      </div>
    </body>
  </html>
  `;
};
