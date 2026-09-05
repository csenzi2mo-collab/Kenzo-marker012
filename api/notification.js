export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method tidak diizinkan" });
  }

  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) {
    return res.status(500).json({ error: "MIDTRANS_SERVER_KEY belum dikonfigurasi" });
  }

  try {
    const body = req.body || {};
    const { order_id, status_code, gross_amount, signature_key } = body;

    const crypto = await import("node:crypto");
    const expected = crypto
      .createHash("sha512")
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest("hex");

    if (!signature_key || signature_key !== expected) {
      return res.status(401).json({ error: "Signature tidak valid" });
    }

    console.log("Midtrans notification:", {
      order_id,
      transaction_status: body.transaction_status,
      fraud_status: body.fraud_status
    });

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Gagal memproses notifikasi" });
  }
}