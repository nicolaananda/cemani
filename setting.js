//Pairing Code
global.pairingCode = true //true = gausah scan qr cukup 1 hp || false = harus scan qr dan 2 hp

//Backup otomatis 
global.jamBackup = 12 //Contoh: 12, berarti setiap 12 jam otomatis backup script

//Setting order kuota
global.memberId = "OK2596040" //Untuk cara mendapatkannya cek di file panduan.txt
global.pin = "" //Pin order kuota
global.pw = "" //Password order kuota
global.codeqr = "00020101021126690021ID.CO.BANKMANDIRI.WWW01189360000801903662320211719036623250303UMI51440014ID.CO.QRIS.WWW0215ID10254355825370303UMI5204508553033605802ID5925gh store Perlengkapan Ind6012Kediri (Kab)61056415462070703A0163044DC9" //Code QR lu

//Persentase fee deposit
global.feeDepo = 2

//Type profit
global.type = "persen" //persen = profit menggunakan persentase || nominal = profit menggunakan nominal

//Persentase default || Jika type profit menggunakan persentase
global.bronze = 2 //Persentase keuntungan Bronze
global.silver = 1, 5 //Persentase keuntungan Silver
global.gold = 1 //Persentase keuntungan Gold

//Profit nominal default || Jika type profit menggunakan nominal
global.nBronze = 1000 //Nominal keuntungan Bronze
global.nSilver = 500 //Nominal keuntungan Silver
global.nGold = 200 //Nominal keuntungan Gold

//Harga upgrade role
global.uSilver = 100000
global.uGold = 200000

//Other
global.botName = "GiHa Smart Bot" //Nama bot
global.owner = ["6287777657944", "6281389592985", "6287887842985"] //Ganti agar fitur owner bisa digunakan
global.ownerNomer = "6287777657944" //Nomor lu
global.ownerName = "Owner" //Nama lu
global.packname = "" //Seterah
global.author = "Owner" //Seterah
global.sessionName = "session" //Ngga usah di ganti
global.linkGroup = ["https://chat.whatsapp.com/L0LR1HBOFKJAiQv5Busd9t?mode=ems_copy_t", "https://chat.whatsapp.com/KwBA0yxcwl0JGpL6uN7L9i?mode=ems_copy_t", "https://chat.whatsapp.com/GO2a2ty2n5JAz5b6E9HpEs?mode=ems_copy_c"] //Link gc lu

//Image
global.thumbnail = "./options/image/payment.jpg"

//Message
global.mess = {
  sukses: "Done🤗",
  admin: "Command ini hanya bisa digunakan oleh Admin Grup",
  botAdmin: "Bot Harus menjadi admin",
  owner: "Command ini hanya dapat digunakan oleh owner bot",
  prem: "Command ini khusus member premium",
  group: "Command ini hanya bisa digunakan di grup",
  private: "Command ini hanya bisa digunakan di Private Chat",
  wait: "⏳ Mohon tunggu sebentar...",
  error: {
    lv: "Link yang kamu berikan tidak valid",
    api: "Maaf terjadi kesalahan"
  }
}

// Tenant pickup options and destination groups (JID)
// NOTE: Isi JID grup WhatsApp dari masing-masing tenant. Contoh JID: "120363419470324991@g.us"
// Kamu bisa dapat JID dengan menjalankan bot di grup tersebut (bot harus sudah join),
// lalu cek log/backup database, atau tambahkan command untuk echo group id.
global.tenantPickupOptions = [
  "MOJOSONGO",
  "LAWEYAN",
  "UMS"
]

global.tenantGroups = {
  // Kamu bisa isi JID langsung (xxx@g.us) atau link undangan grup WhatsApp.
  // Bot akan mencoba resolve link menjadi JID saat forward.
  "MOJOSONGO": "https://chat.whatsapp.com/IpyqyVemRuV9IIdwFcBznb?mode=ems_wa_t",
  "LAWEYAN": "https://chat.whatsapp.com/JPTYnkgmw112toJvbJSdJ8?mode=ems_wa_t",
  "UMS": "https://chat.whatsapp.com/L3ozeq2p42G1k0WqVBZbrN?mode=ems_wa_t"
}

// Template format order untuk DM customer
// Variasi template agar tidak monoton dan lebih jelas
const pickupChoices = `Pengambilan: ${global.tenantPickupOptions.join('/')}`

// global.orderFormTemplates = [
//   (
//     "*_[PESAN OTOMATIS]_*
// *JIKA INGIN ORDER SEGERA ISI LENGKAP!*\n" +
//     "*Format Order Serasa Lidah🥟🥢*\n" +
//     "*Nama:* \n" +
//     "*Pesanan:* \n" +
//     "_Add On (opsional):_ \n" +
//     `*${pickupChoices}*\n` +
//     "*Diambil oleh:* Sendiri/Ojek Online\n" +
//     "*Pembayaran:* Transfer/Cash\n" +
//     "*Ambil jam:* (wajib tulis jam)\n\n" +
//     "_Contoh:_\n" +
//     "*Nama:* alya\n" +
//     "*Pesanan:* mentai isi 6 2 porsi, mentai isi 3 1 porsi\n" +
//     "_Add On:_ chili oil 2\n" +
//     "*Pengambilan:* Mojosongo\n" +
//     "*Diambil oleh:* Sendiri\n" +
//     "*Pembayaran:* Transfer\n" +
//     "*Ambil jam:* 21.00"
//   ),
//   (
//     "*_[PESAN OTOMATIS]_*
// *Mohon isi format berikut* (semua wajib kecuali _Add On_):\n" +
//     "— — — — — — — — — —\n" +
//     "*Nama:* \n" +
//     "*Pesanan:* \n" +
//     "_Add On (opsional):_ \n" +
//     `*${pickupChoices}*\n` +
//     "*Diambil oleh:* Sendiri/Ojek Online\n" +
//     "*Pembayaran:* Transfer/Cash\n" +
//     "*Ambil jam:* hh.mm\n" +
//     "— — — — — — — — — —\n" +
//     "*Contoh cepat:*\n" +
//     "*Nama:* Budi\n" +
//     "*Pesanan:* mentai isi 6 1 porsi\n" +
//     "_Add On:_ -\n" +
//     "*Pengambilan:* UMS\n" +
//     "*Diambil oleh:* Ojek Online\n" +
//     "*Pembayaran:* Cash\n" +
//     "*Ambil jam:* 19.30"
//   ),
//   (
//     "*_[PESAN OTOMATIS]_*
// *Gunakan format ini ya* 👇 (semua wajib, _Add On_ opsional)\n\n" +
//     "1) *Nama:* \n" +
//     "2) *Pesanan:* \n" +
//     "3) _Add On (opsional):_ \n" +
//     `4) *${pickupChoices}*\n` +
//     "5) *Diambil oleh:* Sendiri/Ojek Online\n" +
//     "6) *Pembayaran:* Transfer/Cash\n" +
//     "7) *Ambil jam:* hh.mm\n\n" +
//     "*Contoh:*\n" +
//     "1) *Nama:* Alya\n" +
//     "2) *Pesanan:* mentai isi 3 2 porsi\n" +
//     "3) _Add On:_ chili oil 1\n" +
//     "4) *Pengambilan:* Cemani\n" +
//     "5) *Diambil oleh:* Sendiri\n" +
//     "6) *Pembayaran:* Transfer\n" +
//     "7) *Ambil jam:* 20.15"
//   )
// ]

// // Fallback single template for backward compatibility
// global.orderFormTemplate = global.orderFormTemplates[0]

// Compact template (tanpa penjelasan) untuk prompt singkat / invalid format
global.orderFormCompactTemplate = (
  "*[PESAN OTOMATIS]*\n" +
  "JIKA INGIN ORDER SEGERA ISI LENGKAP!\n\n" +
  "Format Order Serasa Lidah🥟🥢\n" +
  "Nama: \n" +
  "Pesanan: \n" +
  "Add On: \n" +
  "Pengambilan: MOJOSONGO/LAWEYAN/UMS\n" +
  "Diambil oleh: Sendiri/Driver\n" +
  "Pembayaran: QRIS/Cash\n" +
  "Ambil jam: (wajib tulis jam)\n\n" +
  "*pengambilan by driver dipesan oleh customer"
)

// Kata pemicu untuk mengirim template order (DM only)
// Edit sesuai kebutuhan; bot hanya akan kirim template jika chat mengandung salah satu dari kata ini
global.orderTriggers = [
  'halo kak', 'kak', 'mau order', 'order', 'beli', 'pesen', 'pesan', 'halo'
]

// Kata untuk membatalkan flow order
global.orderCancelWords = [
  'batal', 'cancel', 'gausa', 'gak usah', 'tidak jadi', 'nggak jadi', 'ga usah', 'stop'
]

//Payment
global.payment = {
  qris: {
    an: "GIGIHADIOD" //Atas nama qris
  },
  dana: {
    nope: "085235540944",
    an: "BRI****"
  },
  gopay: {
    nope: "085235540944",
    an: "BRI****"
  },
  ovo: {
    nope: "085235540944",
    an: "BRI****"
  }
}

// Listener backend for notification-based payment detection
global.listener = {
  baseUrl: "https://api-pg.nicola.id",
  apiKey: "kodeku"
}

//Function buat menu
const fs = require("fs");
const chalk = require('chalk');
const moment = require("moment-timezone");
const { runtime } = require("./function/myfunc");

const d = new Date(new Date + 3600000)
const dateIslam = Intl.DateTimeFormat('id' + '-TN-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }).format(d)

//Tampilan menu
global.menu = (prefix, sender, pushname) => {
  let more = String.fromCharCode(8206)
  let readmore = more.repeat(4001)
  return `*🤖 BOT INFO 🤖*
• Bot Name: ${botName}
• Runtime: ${runtime(process.uptime())}
• Owner: @${ownerNomer}

*👤 USER INFO 👤*
• Tag: @${sender.split("@")[0]}
• Name: ${pushname}

*📆 DATE INFO 📆*
• Masehi: ${moment.tz("Asia/Jakarta").format("DD MMMM YYYY")}
• Hijriah: ${dateIslam}

*⏰ TIME INFO ⏰*
• WIB: ${moment.tz('Asia/Jakarta').format('HH:mm:ss')}
• WITA: ${moment.tz('Asia/Makassar').format('HH:mm:ss')}
• WIT: ${moment.tz('Asia/Jayapura').format('HH:mm:ss')}

*☘ ᴛʜᴀɴᴋs ᴛᴏ ☘*
• ${ownerName} (Owner)
• All pengguna bot`
}

// #ALL MENU
global.allmenu = (prefix, sender, pushname) => {
  let more = String.fromCharCode(8206)
  let readmore = more.repeat(4001)
  return `*🤖 BOT INFO 🤖*
• Bot Name: ${botName}
• Runtime: ${runtime(process.uptime())}
• Owner: @${ownerNomer}

*👤 USER INFO 👤*
• Tag: @${sender.split("@")[0]}
• Name: ${pushname}

*📆 DATE INFO 📆*
• Masehi: ${moment.tz("Asia/Jakarta").format("DD MMMM YYYY")}
• Hijriah: ${dateIslam}

*⏰ TIME INFO ⏰*
• WIB: ${moment.tz('Asia/Jakarta').format('HH:mm:ss')}
• WITA: ${moment.tz('Asia/Makassar').format('HH:mm:ss')}
• WIT: ${moment.tz('Asia/Jayapura').format('HH:mm:ss')}
${readmore}
╭─────╼「 *GROUP MENU* 」
│☛ ${prefix}ceksewa
│☛ ${prefix}kick
│☛ ${prefix}open
│☛ ${prefix}close
│☛ ${prefix}tagall
│☛ ${prefix}hidetag
│☛ ${prefix}delete
│☛ ${prefix}revoke
│☛ ${prefix}antilink
│☛ ${prefix}antilinkv2
│☛ ${prefix}welcome
│☛ ${prefix}promote
│☛ ${prefix}demote
│☛ ${prefix}setdesc
│☛ ${prefix}linkgc
│☛ ${prefix}setppgc
╰─────╼

╭─────╼「 *INFO BOT* 」
│☛ ${prefix}creator
│☛ ${prefix}owner
│☛ ${prefix}ping
│☛ ${prefix}runtime
│☛ ${prefix}script
╰─────╼

╭─────╼「 *ORDER MENU* 」
│☛ ${prefix}stok
│☛ ${prefix}buy
╰─────╼

╭─────╼「 *OWNER MENU* 」
│☛ ${prefix}cekip
│☛ ${prefix}ceksaldo
│☛ ${prefix}loginorkut 
│☛ ${prefix}verifotp
│☛ ${prefix}settype (Type profit)
│☛ ${prefix}setprofittop
│☛ ${prefix}customprofit
│☛ ${prefix}delcustomprofit
│☛ ${prefix}setrole
│☛ ${prefix}ubahrole
│☛ ${prefix}addproduk
│☛ ${prefix}delproduk
│☛ ${prefix}setkode
│☛ ${prefix}setharga
│☛ ${prefix}setjudul
│☛ ${prefix}setdesk
│☛ ${prefix}setsnk
│☛ ${prefix}setprofit
│☛ ${prefix}rekap
│☛ ${prefix}addstok
│☛ ${prefix}delstok
│☛ ${prefix}addsaldo
│☛ ${prefix}minsaldo
│☛ ${prefix}addsewa
│☛ ${prefix}delsewa
│☛ ${prefix}listsewa
│☛ ${prefix}block
│☛ ${prefix}unblock
│☛ ${prefix}backup
╰─────╼

╭─────╼「 *STALKER MENU* 」
│☛ ${prefix}cekml
│☛ ${prefix}cekff
│☛ ${prefix}cekpubg
│☛ ${prefix}cekgi
│☛ ${prefix}cekhok
│☛ ${prefix}cekhsr
│☛ ${prefix}cekhi
│☛ ${prefix}cekvalo
│☛ ${prefix}cekaov
│☛ ${prefix}cekcodm
│☛ ${prefix}cekzzz
│☛ ${prefix}ceksus
│☛ ${prefix}ceksm
│☛ ${prefix}cekpb
│☛ ${prefix}cekpgr
╰─────╼

╭─────╼「 *STORE MENU* 」
│☛ ${prefix}list
│☛ ${prefix}addlist
│☛ ${prefix}dellist
│☛ ${prefix}setlist
│☛ ${prefix}testi
│☛ ${prefix}addtesti
│☛ ${prefix}deltesti
│☛ ${prefix}settesti
│☛ ${prefix}kalkulator
│☛ ${prefix}done
│☛ ${prefix}setdone
│☛ ${prefix}deldone
│☛ ${prefix}changedone
│☛ ${prefix}proses
│☛ ${prefix}setproses
│☛ ${prefix}delproses
│☛ ${prefix}changeproses
╰─────╼

╭─────╼「 *TOPUP MENU* 」
│☛ ${prefix}deposit
│☛ ${prefix}saldo
│☛ ${prefix}listharga
│☛ ${prefix}upgrade
╰─────╼

╭─────╼「 *TRACKING MENU* 」
│☛ ${prefix}riwayat <nomor>
│☛ ${prefix}cari <reff_id>
│☛ ${prefix}statistik
│☛ ${prefix}export <format>
│☛ ${prefix}ubahrole
│☛ ${prefix}dashboard
╰─────╼

*☘ ᴛʜᴀɴᴋs ᴛᴏ ☘*
• ${ownerName} (Owner)
• All pengguna bot`
}

// GROUP MENU
global.groupmenu = (prefix, sender, pushname) => {
  let more = String.fromCharCode(8206)
  let readmore = more.repeat(4001)
  return `*🤖 BOT INFO 🤖*
• Bot Name: ${botName}
• Runtime: ${runtime(process.uptime())}
• Owner: @${ownerNomer}

*👤 USER INFO 👤*
• Tag: @${sender.split("@")[0]}
• Name: ${pushname}

*📆 DATE INFO 📆*
• Masehi: ${moment.tz("Asia/Jakarta").format("DD MMMM YYYY")}
• Hijriah: ${dateIslam}

*⏰ TIME INFO ⏰*
• WIB: ${moment.tz('Asia/Jakarta').format('HH:mm:ss')}
• WITA: ${moment.tz('Asia/Makassar').format('HH:mm:ss')}
• WIT: ${moment.tz('Asia/Jayapura').format('HH:mm:ss')}
${readmore}
╭─────╼「 *GROUP MENU* 」
│☛ ${prefix}ceksewa
│☛ ${prefix}kick
│☛ ${prefix}open
│☛ ${prefix}close
│☛ ${prefix}tagall
│☛ ${prefix}hidetag
│☛ ${prefix}delete
│☛ ${prefix}revoke
│☛ ${prefix}antilink
│☛ ${prefix}antilinkv2
│☛ ${prefix}welcome
│☛ ${prefix}promote
│☛ ${prefix}demote
│☛ ${prefix}setdesc
│☛ ${prefix}linkgc
│☛ ${prefix}setppgc
│☛ ${prefix}setnamegc
╰─────╼

*☘ ᴛʜᴀɴᴋs ᴛᴏ ☘*

• ${ownerName} (Owner)
• All pengguna bot`
}

global.infobot = (prefix, sender, pushname) => {
  let more = String.fromCharCode(8206)
  let readmore = more.repeat(4001)
  return `*🤖 BOT INFO 🤖*
• Bot Name: ${botName}
• Runtime: ${runtime(process.uptime())}
• Owner: @${ownerNomer}

*👤 USER INFO 👤*
• Tag: @${sender.split("@")[0]}
• Name: ${pushname}

*📆 DATE INFO 📆*
• Masehi: ${moment.tz("Asia/Jakarta").format("DD MMMM YYYY")}
• Hijriah: ${dateIslam}

*⏰ TIME INFO ⏰*
• WIB: ${moment.tz('Asia/Jakarta').format('HH:mm:ss')}
• WITA: ${moment.tz('Asia/Makassar').format('HH:mm:ss')}
• WIT: ${moment.tz('Asia/Jayapura').format('HH:mm:ss')}
${readmore}
╭─────╼「 *INFO BOT* 」
│☛ ${prefix}creator
│☛ ${prefix}owner
│☛ ${prefix}ping
│☛ ${prefix}runtime
│☛ ${prefix}script
╰─────╼

*☘ ᴛʜᴀɴᴋs ᴛᴏ ☘*

• ${ownerName} (Owner)
• All pengguna bot`
}

global.ownermenu = (prefix, sender, pushname) => {
  let more = String.fromCharCode(8206)
  let readmore = more.repeat(4001)
  return `*🤖 BOT INFO 🤖*
• Bot Name: ${botName}
• Runtime: ${runtime(process.uptime())}
• Owner: @${ownerNomer}

*👤 USER INFO 👤*
• Tag: @${sender.split("@")[0]}
• Name: ${pushname}

*📆 DATE INFO 📆*
• Masehi: ${moment.tz("Asia/Jakarta").format("DD MMMM YYYY")}
• Hijriah: ${dateIslam}

*⏰ TIME INFO ⏰*
• WIB: ${moment.tz('Asia/Jakarta').format('HH:mm:ss')}
• WITA: ${moment.tz('Asia/Makassar').format('HH:mm:ss')}
• WIT: ${moment.tz('Asia/Jayapura').format('HH:mm:ss')}
${readmore}
╭─────╼「 *OWNER MENU* 」
│☛ ${prefix}cekip
│☛ ${prefix}ceksaldo
│☛ ${prefix}loginorkut 
│☛ ${prefix}verifotp
│☛ ${prefix}settype (Type profit)
│☛ ${prefix}setprofittop
│☛ ${prefix}customprofit
│☛ ${prefix}delcustomprofit
│☛ ${prefix}setrole
│☛ ${prefix}ubahrole
│☛ ${prefix}addproduk
│☛ ${prefix}delproduk
│☛ ${prefix}setkode
│☛ ${prefix}setharga
│☛ ${prefix}setjudul
│☛ ${prefix}setdesk
│☛ ${prefix}setsnk
│☛ ${prefix}setprofit
│☛ ${prefix}rekap
│☛ ${prefix}addstok
│☛ ${prefix}delstok
│☛ ${prefix}addsaldo
│☛ ${prefix}minsaldo
│☛ ${prefix}addsewa
│☛ ${prefix}delsewa
│☛ ${prefix}listsewa
│☛ ${prefix}block
│☛ ${prefix}unblock
│☛ ${prefix}backup
╰─────╼

*☘ ᴛʜᴀɴᴋs ᴛᴏ ☘*

• ${ownerName} (Owner)
• All pengguna bot`
}

global.stalkermenu = (prefix, sender, pushname) => {
  let more = String.fromCharCode(8206)
  let readmore = more.repeat(4001)
  return `*🤖 BOT INFO 🤖*
• Bot Name: ${botName}
• Runtime: ${runtime(process.uptime())}
• Owner: @${ownerNomer}

*👤 USER INFO 👤*
• Tag: @${sender.split("@")[0]}
• Name: ${pushname}

*📆 DATE INFO 📆*
• Masehi: ${moment.tz("Asia/Jakarta").format("DD MMMM YYYY")}
• Hijriah: ${dateIslam}

*⏰ TIME INFO ⏰*
• WIB: ${moment.tz('Asia/Jakarta').format('HH:mm:ss')}
• WITA: ${moment.tz('Asia/Makassar').format('HH:mm:ss')}
• WIT: ${moment.tz('Asia/Jayapura').format('HH:mm:ss')}
${readmore}
╭─────╼「 *STALKER MENU* 」
│☛ ${prefix}cekml
│☛ ${prefix}cekff
│☛ ${prefix}cekpubg
│☛ ${prefix}cekgi
│☛ ${prefix}cekhok
│☛ ${prefix}cekhsr
│☛ ${prefix}cekhi
│☛ ${prefix}cekvalo
│☛ ${prefix}cekaov
│☛ ${prefix}cekcodm
│☛ ${prefix}cekzzz
│☛ ${prefix}ceksus
│☛ ${prefix}ceksm
│☛ ${prefix}cekpb
│☛ ${prefix}cekpgr
╰─────╼

*☘ ᴛʜᴀɴᴋs ᴛᴏ ☘*

• ${ownerName} (Owner)
• All pengguna bot`
}

global.storemenu = (prefix, sender, pushname) => {
  let more = String.fromCharCode(8206)
  let readmore = more.repeat(4001)
  return `*🤖 BOT INFO 🤖*
• Bot Name: ${botName}
• Runtime: ${runtime(process.uptime())}
• Owner: @${ownerNomer}

*👤 USER INFO 👤*
• Tag: @${sender.split("@")[0]}
• Name: ${pushname}

*📆 DATE INFO 📆*
• Masehi: ${moment.tz("Asia/Jakarta").format("DD MMMM YYYY")}
• Hijriah: ${dateIslam}

*⏰ TIME INFO ⏰*
• WIB: ${moment.tz('Asia/Jakarta').format('HH:mm:ss')}
• WITA: ${moment.tz('Asia/Makassar').format('HH:mm:ss')}
• WIT: ${moment.tz('Asia/Jayapura').format('HH:mm:ss')}
${readmore}
╭─────╼「 *STORE MENU* 」
│☛ ${prefix}list
│☛ ${prefix}addlist
│☛ ${prefix}dellist
│☛ ${prefix}setlist
│☛ ${prefix}testi
│☛ ${prefix}addtesti
│☛ ${prefix}deltesti
│☛ ${prefix}settesti
│☛ ${prefix}kalkulator
│☛ ${prefix}done
│☛ ${prefix}setdone
│☛ ${prefix}deldone
│☛ ${prefix}changedone
│☛ ${prefix}proses
│☛ ${prefix}setproses
│☛ ${prefix}delproses
│☛ ${prefix}changeproses
╰─────╼

*☘ ᴛʜᴀɴᴋs ᴛᴏ ☘*

• ${ownerName} (Owner)
• All pengguna bot`
}

global.topupmenu = (prefix, sender, pushname) => {
  let more = String.fromCharCode(8206)
  let readmore = more.repeat(4001)
  return `*🤖 BOT INFO 🤖*
• Bot Name: ${botName}
• Runtime: ${runtime(process.uptime())}
• Owner: @${ownerNomer}

*👤 USER INFO 👤*
• Tag: @${sender.split("@")[0]}
• Name: ${pushname}

*📆 DATE INFO 📆*
• Masehi: ${moment.tz("Asia/Jakarta").format("DD MMMM YYYY")}
• Hijriah: ${dateIslam}

*⏰ TIME INFO ⏰*
• WIB: ${moment.tz('Asia/Jakarta').format('HH:mm:ss')}
• WITA: ${moment.tz('Asia/Makassar').format('HH:mm:ss')}
• WIT: ${moment.tz('Asia/Jayapura').format('HH:mm:ss')}
${readmore}
╭─────╼「 *TOPUP MENU* 」
│☛ ${prefix}deposit
│☛ ${prefix}saldo
│☛ ${prefix}listharga
│☛ ${prefix}upgrade
╰─────╼

*☘ ᴛʜᴀɴᴋs ᴛᴏ ☘*
• ${ownerName} (Owner)
• All pengguna bot`
}

global.ordermenu = (prefix, sender, pushname, bio) => {
  let more = String.fromCharCode(8206)
  let readmore = more.repeat(4001)
  return `*🤖 BOT INFO 🤖*
• Bot Name: ${botName}
• Runtime: ${runtime(process.uptime())}
• Owner: @${ownerNomer}

*👤 USER INFO 👤*
• Tag: @${sender.split("@")[0]}
• Name: ${pushname}
• Bio: ${bio ? bio : "-"}

*📆 DATE INFO 📆*
• Masehi: ${moment.tz("Asia/Jakarta").format("DD MMMM YYYY")}
• Hijriah: ${dateIslam}

*⏰ TIME INFO ⏰*
• WIB: ${moment.tz('Asia/Jakarta').format('HH:mm:ss')}
• WITA: ${moment.tz('Asia/Makassar').format('HH:mm:ss')}
• WIT: ${moment.tz('Asia/Jayapura').format('HH:mm:ss')}
${readmore}
╭─────╼「 *ORDER MENU* 」
│☛ ${prefix}stok
│☛ ${prefix}buy
╰─────╼

*☘ ᴛʜᴀɴᴋs ᴛᴏ ☘*
• ${ownerName} (Owner)
• All pengguna bot`
}

let time = moment(new Date()).format('HH:mm:ss DD/MM/YYYY')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.greenBright(`[ ${botName} ]  `) + time + chalk.cyanBright(` "${file}" Telah diupdate!`))
  delete require.cache[file]
  require(file)
})
