const mailjet = require("../config/mailjet");

exports.sendOrderEmail = async (user, order) => {
  try {
    const itemsHTML = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 6px 0; border-bottom:1px solid #eee;">
            ${item.productName} (${item.sizeLabel})
          </td>
          <td style="padding: 6px 0; border-bottom:1px solid #eee; text-align:center;">
            ${item.quantity}
          </td>
          <td style="padding: 6px 0; border-bottom:1px solid #eee; text-align:right;">
            ₹${Number(item.subtotal).toFixed(2)}
          </td>
        </tr>
      `
      )
      .join("");

    const shipping = order.shippingAddress || {};
    const paymentText =
      order.paymentMethod === "cod"
        ? "Cash on Delivery"
        : "Online Payment (Razorpay)";
    const createdAt = order.createdAt
      ? new Date(order.createdAt).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

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
          Subject: `Order #${order._id} Confirmed`,
          HTMLPart: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background:#f5f5f5;">
              <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:6px;overflow:hidden;">
                
                <!-- Header -->
                <div style="background:#111;color:#fff;padding:16px 20px;">
                  <h2 style="margin:0;font-size:20px;">
                    Order #${order._id} Confirmed
                  </h2>
                  ${
                    createdAt
                      ? `<p style="margin:4px 0 0;font-size:13px;">Placed on ${createdAt}</p>`
                      : ""
                  }
                </div>

                <!-- Body -->
                <div style="padding:20px;">
                  <p style="margin:0 0 10px;font-size:15px;">
                    Hi <strong>${user.fullName}</strong>,
                  </p>
                  <p style="margin:0 0 16px;font-size:14px;line-height:1.5;">
                    Thank you for shopping with <strong>Tinne Organics</strong>! This email is to confirm your recent order.
                  </p>

                  <!-- Order Summary -->
                  <h3 style="margin:16px 0 8px;font-size:16px;border-bottom:1px solid #eee;padding-bottom:4px;">
                    Order Details
                  </h3>
                  <p style="margin:4px 0;font-size:14px;">
                    <strong>Order ID:</strong> ${order._id}
                  </p>
                  <p style="margin:4px 0;font-size:14px;">
                    <strong>Payment method:</strong> ${paymentText}
                  </p>
                  <p style="margin:4px 0 12px;font-size:14px;">
                    <strong>Total:</strong> ₹${Number(order.totalAmount).toFixed(
                      2
                    )}
                  </p>

                  <!-- Items Table -->
                  <h3 style="margin:16px 0 8px;font-size:16px;border-bottom:1px solid #eee;padding-bottom:4px;">
                    Items
                  </h3>
                  <table width="100%" style="border-collapse:collapse;font-size:14px;">
                    <thead>
                      <tr>
                        <th style="text-align:left;padding:6px 0;border-bottom:1px solid #ddd;">Product</th>
                        <th style="text-align:center;padding:6px 0;border-bottom:1px solid #ddd;">Qty</th>
                        <th style="text-align:right;padding:6px 0;border-bottom:1px solid #ddd;">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsHTML}
                    </tbody>
                  </table>

                  <!-- Address Section -->
                  <h3 style="margin:20px 0 8px;font-size:16px;border-bottom:1px solid #eee;padding-bottom:4px;">
                    Shipping Address
                  </h3>
                  <p style="margin:4px 0;font-size:14px;line-height:1.5;">
                    ${shipping.fullName || ""}<br/>
                    ${shipping.address1 || ""}<br/>
                    ${
                      shipping.district || shipping.state
                        ? `${shipping.district || ""}${
                            shipping.district && shipping.state ? ", " : ""
                          }${shipping.state || ""}<br/>`
                        : ""
                    }
                    ${shipping.pincode || ""}<br/>
                    ${
                      shipping.phone
                        ? `Phone: ${shipping.phone}<br/>`
                        : ""
                    }
                  </p>

                  <!-- Footer note -->
                  <p style="margin:20px 0 6px;font-size:13px;color:#555;">
                    We will notify you once your order has been shipped. Orders are usually delivered within 5–7 working days.
                  </p>
                  <p style="margin:0 0 10px;font-size:13px;color:#777;">
                    If you have any questions, just reply to this email.
                  </p>

                  <p style="margin:10px 0 0;font-size:14px;">
                    Regards,<br/>
                    <strong>Tinne Organics</strong>
                  </p>
                </div>
              </div>
            </div>
          `,
        },
      ],
    });
  } catch (err) {
    console.error("Mailjet error:", err?.message || err);
  }
};
