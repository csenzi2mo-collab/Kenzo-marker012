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
    const { product, gross_amount, name, email, whatsapp } = body;

    if (!product || !name || !email || !whatsapp) {
      return res.status(400).json({ error: "Data transaksi belum lengkap" });
    }

    const prices = {
      "Panel Private 1GB - Rp 3.000": 3000,
      "Panel Private 2GB - Rp 5.000": 5000,
      "Panel Private 3GB - Rp 7.000": 7000,
      "Panel Private 4GB - Rp 8.000": 8000,
      "Panel Private 5GB - Rp 9.000": 9000,
      "Panel Private 6GB - Rp 10.000": 10000,
      "Panel Private 10GB - Rp 15.000": 15000,
      "Bot Plus Panel Unlimited Permanen - Rp 30.000": 30000,
      "Panel Unlimited - Rp 15.000": 15000,
      "Panel Unlimited Selamanya - Rp 30.000": 30000,
      "Admin Panel 2 Bulan - Rp 20.000": 20000,
      "Admin Panel Permanen - Rp 25.000": 25000
    };

    const amount = prices[product];
    if (!amount || Number(gross_amount) !== amount) {
      return res.status(400).json({ error: "Produk atau harga tidak valid" });
    }

    const orderId = `KENZO-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const auth = Buffer.from(`${serverKey}:`).toString("base64");

    const midtrans = await fetch("https://app.sandbox.midtrans.com/snap/v1/transactions", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        transaction_details: {
          order_id: orderId,
          gross_amount: amount
        },
        item_details: [{
          id: product,
          price: amount,
          quantity: 1,
          name: product
        }],
        customer_details: {
          first_name: name,
          email,
          phone: whatsapp
        },
        callbacks: {
          finish: `${req.headers["x-forwarded-proto"] || "https"}://${req.headers.host}/?payment=finish&order_id=${encodeURIComponent(orderId)}`
        }
      })
    });

    const data = await midtrans.json();

    if (!midtrans.ok || !data.token) {
      return res.status(502).json({
        error: data.error_messages?.join(", ") || data.status_message || "Midtrans menolak transaksi"
      });
    }

    return res.status(200).json({
      token: data.token,
      order_id: orderId
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error saat membuat transaksi" });
  }
}