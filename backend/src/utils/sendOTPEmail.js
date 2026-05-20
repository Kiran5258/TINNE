const mailjet = require("../config/mailjet");

exports.sendOTPEmail = async (email, fullName, otp) => {
  try {
    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAIL_FROM,
            Name: "Tinne Organics",
          },
          To: [
            {
              Email: email,
              Name: fullName,
            },
          ],
          Subject: `Verify Your Account - Tinne Organics`,
          HTMLPart: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background:#f5f5f5;">
              <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:6px;overflow:hidden;border: 1px solid #ddd;">
                <div style="background:#111;color:#fff;padding:20px;text-align:center;">
                  <h1 style="margin:0;font-size:24px;">Tinné Organics</h1>
                </div>
                <div style="padding:30px;">
                  <p style="font-size:16px;color:#333;">Hi <strong>${fullName}</strong>,</p>
                  <p style="font-size:14px;color:#555;line-height:1.6;">
                    Thank you for signing up with Tinné Organics! To complete your registration and verify your email address, please use the 6-digit verification code below:
                  </p>
                  <div style="margin:30px 0;text-align:center;">
                    <span style="display:inline-block;background:#f0f0f0;color:#111;font-size:32px;font-weight:bold;letter-spacing:6px;padding:12px 30px;border-radius:6px;border: 1px dashed #999;">
                      ${otp}
                    </span>
                  </div>
                  <p style="font-size:12px;color:#777;line-height:1.6;">
                    This verification code is valid for <strong>10 minutes</strong>. If you did not request this code, you can safely ignore this email.
                  </p>
                  <p style="font-size:14px;color:#333;margin-top:20px;">
                    Best Regards,<br/>
                    <strong>Tinne Organics Team</strong>
                  </p>
                </div>
              </div>
            </div>
          `,
        },
      ],
    });
    console.log(`OTP verification email sent to: ${email}`);
  } catch (err) {
    console.error("Mailjet OTP Email Error:", err?.message || err);
    throw err;
  }
};
