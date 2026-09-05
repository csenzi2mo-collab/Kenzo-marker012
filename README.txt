KENZO MARKET - VERCEL + MIDTRANS

1. Upload project ini ke GitHub.
2. Import repository tersebut ke Vercel.
3. Di Vercel buka Project Settings -> Environment Variables.
4. Tambahkan:
   MIDTRANS_SERVER_KEY = Server Key Midtrans Anda

5. index.html saat ini memakai Midtrans SANDBOX.
   Ganti GANTI_DENGAN_CLIENT_KEY_MIDTRANS pada index.html dengan Client Key Sandbox Anda.

6. Untuk testing gunakan:
   https://app.sandbox.midtrans.com

7. Setelah transaksi berhasil diuji, ubah script Snap di index.html menjadi:
   https://app.midtrans.com/snap/snap.js
   lalu gunakan Client Key Production dan Server Key Production.

8. Di Midtrans atur HTTP Notification URL ke:
   https://DOMAIN-VERCEL-ANDA.vercel.app/api/notification

CATATAN:
- Jangan pernah memasukkan Server Key ke index.html.
- Harga divalidasi ulang di server.
- Endpoint notification memverifikasi signature Midtrans.
- Sistem ini belum menyimpan pesanan ke database. Notification saat ini hanya memvalidasi dan mencatat status ke log Vercel.
