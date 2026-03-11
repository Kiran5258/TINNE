const mailjet = require("../config/mailjet");

exports.sendWelcomeEmail = async (user) => {
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
              Email: user.email,
              Name: user.fullName,
            },
          ],
          Subject: `Welcome to Tinne Organics!`,
          HTMLPart: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background:#f5f5f5;">
              <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:6px;overflow:hidden;border: 1px solid #ddd;">
                <div style="background:#111;color:#fff;padding:20px;text-align:center;">
                  <h1 style="margin:0;font-size:24px;">Welcome to Tinné</h1>
                </div>
                <div style="padding:30px;">
                  <p style="font-size:16px;color:#333;">Hi <strong>${user.fullName}</strong>,</p>
                  <p style="font-size:14px;color:#555;line-height:1.6;">
                    Thank you for joining <strong>Tinne Organics</strong>! We're excited to have you as part of our community. 
                    From Grandma's Thinnai directly to your doorstep, we bring you the purest traditional millets, nuts, and spices.
                  </p>
                  <div style="margin:30px 0;text-align:center;">
                    <a href="${process.env.CLIENT_URL || '#'}" style="background:#111;color:#fff;padding:12px 24px;text-decoration:none;border-radius:4px;font-weight:bold;">Start Shopping</a>
                  </div>
                  <p style="font-size:14px;color:#555;">
                    If you have any questions, feel free to contact us at any time.
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
    console.log(`Welcome email sent to: ${user.email}`);
  } catch (err) {
    console.error("Mailjet Welcome Email Error:", err?.message || err);
  }
};
