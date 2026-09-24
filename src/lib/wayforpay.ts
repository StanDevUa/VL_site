import crypto from "crypto";

/** WayForPay підписує поля через ';' у фіксованому порядку, алгоритм HMAC_MD5. */
export function signWayForPay(fields: (string | number)[]): string {
  const message = fields.join(";");
  return crypto
    .createHmac("md5", process.env.WAYFORPAY_MERCHANT_SECRET_KEY!)
    .update(message)
    .digest("hex");
}
