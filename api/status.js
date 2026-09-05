
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method tidak diizinkan" });
  }

  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const orderId = req.query?.order_id;

  if (!serverKey || !orderId) {
    return res.status(400).json({ error: "MIDTRANS_SERVER_KEY atau order_id belum tersedia" });
  }

  try {
    const auth = Buffer.from(`${serverKey}:`).toString("base64");
    const response = await fetch(
      `https://api.sandbox.midtrans.com/v2/${encodeURIComponent(orderId)}/status`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: "application/json"
        }
      }
    );

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch {
    return res.status(500).json({ error: "Gagal mengecek status transaksi" });
  }
}
