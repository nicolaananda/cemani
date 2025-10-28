require("./setting.js")
const { downloadContentFromMessage } = require('@dappaoffc/baileys');
const fs = require("fs");
const speed = require("performance-now");
const moment = require("moment-timezone");
const fetch = require('node-fetch');
const toMs = require('ms');
const ms = require('parse-ms');
const os = require('os');
const { sizeFormatter } = require('human-readable');
const path = require('path');
const { exec, execSync } = require("child_process");
const util = require('util');
const crypto = require("crypto");
const axios = require('axios')
const jimp_1 = require('jimp');
const cron = require("node-cron");
const { createCanvas, loadImage } = require("canvas");


const { OrderKuota } = require("./function/orderkuota")
const { getGroupAdmins, runtime, sleep } = require("./function/myfunc");
const { color } = require('./function/console');
const { addResponList, delResponList, isAlreadyResponList, isAlreadyResponListGroup, sendResponList, updateResponList, getDataResponList } = require('./function/respon-list');
const { addResponTesti, delResponTesti, isAlreadyResponTesti, updateResponTesti, getDataResponTesti } = require('./function/respon-testi');
const { expiredCheck, getAllSewa } = require("./function/sewa");
const { TelegraPh } = require('./function/uploader');
const { getUsernameMl, getUsernameFf, getUsernameCod, getUsernameGi, getUsernameHok, getUsernameSus, getUsernamePubg, getUsernameAg, getUsernameHsr, getUsernameHi, getUsernamePb, getUsernameSm, getUsernameValo, getUsernamePgr, getUsernameZzz, getUsernameAov } = require("./function/stalker");
const { qrisDinamis } = require("./function/dinamis");
const { createPaymentLink, getPaymentLinkStatus, isPaymentCompleted, createQRISCore, createQRISPayment, getTransactionStatusByOrderId, getTransactionStatusByTransactionId } = require('./config/midtrans');
const BASE_QRIS_DANA = "00020101021126570011id.bmri.livinmerchant.WWW011893600915317777611502091777761150303UMI51440014ID.CO.QRIS.WWW0215ID10211049592540303UMI5204899953033605802ID5910gigihadiod6011Kab. Kediri610564154630406C2";
const usePg = String(process.env.USE_PG || '').toLowerCase() === 'true'
const { core, isProduction } = require('./config/midtrans');
const USE_POLLING = true; // true = pakai polling status Midtrans; false = andalkan webhook saja
const FEATURE_DISABLE_TOPUP = true; // Nonaktifkan fitur topup/deposit/saldo/listharga/upgrade/buy/stok
const FEATURE_ONLY_INTAKE = true; // Hanya jalankan alur template order DM → forward ke grup

// Performance optimization: Cache for user saldo
const saldoCache = new Map();
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

// External DB reload watcher removed by request (single-app usage)

// Cache management functions
function getCachedSaldo(userId) {
  const cached = saldoCache.get(userId);
  if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
    return cached.saldo;
  }
  return null;
}

function setCachedSaldo(userId, saldo) {
  saldoCache.set(userId, {
    saldo: saldo,
    timestamp: Date.now()
  });
}

function clearExpiredCache() {
  const now = Date.now();
  for (const [userId, data] of saldoCache.entries()) {
    if (now - data.timestamp > CACHE_EXPIRY) {
      saldoCache.delete(userId);
    }
  }
}

// Clear expired cache every 10 minutes
setInterval(clearExpiredCache, 10 * 60 * 1000);

global.prefa = ['', '.']

moment.tz.setDefault("Asia/Jakarta").locale("id");
const tanggal = moment.tz('Asia/Jakarta').format('DD MMMM YYYY')

module.exports = async (ronzz, m, mek) => {
  try {
    const { isQuotedMsg, fromMe } = m
    if (fromMe) return
    const jamwib = moment.tz('Asia/Jakarta').format('HH:mm:ss')
    const dt = moment.tz('Asia/Jakarta').format('HH')
    const content = JSON.stringify(mek.message)
    const type = Object.keys(mek.message)[0];
    const from = m.chat
    const chats = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') && m.message.buttonsResponseMessage.selectedButtonId ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') && m.message.listResponseMessage.singleSelectReply.selectedRowId ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') && m.message.templateButtonReplyMessage.selectedId ? m.message.templateButtonReplyMessage.selectedId : (m.mtype == 'interactiveResponseMessage') && JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id : (m.mtype == 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ""
    const toJSON = j => JSON.stringify(j, null, '\t')
    const prefix = prefa ? /^[°•π÷×¶∆£¢€¥®=????+✓_=|~!?@#%^&.©^]/gi.test(chats) ? chats.match(/^[°•π÷×¶∆£¢€¥®=????+✓_=|~!?@#%^&.©^]/gi)[0] : "" : prefa ?? '#'
    const isGroup = m.isGroup
    const sender = m.isGroup ? (mek.key.participant ? mek.key.participant : mek.participant) : mek.key.remoteJid
    const isOwner = [ronzz.user.id, ...owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(sender) ? true : false
    const pushname = m.pushName
    const budy = (typeof m.text == 'string' ? m.text : '')
    const args = chats.trim().split(/ +/).slice(1);
    const q = args.join(" ");
    const command = chats.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
    const botNumber = ronzz.user.id.split(':')[0] + '@s.whatsapp.net'
    const groupMetadata = isGroup ? await ronzz.groupMetadata(from) : ''
    const groupName = isGroup ? groupMetadata.subject : ''
    const groupId = isGroup ? groupMetadata.id : ''
    const groupMembers = isGroup ? groupMetadata.participants : ''
    const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
    const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
    const isGroupAdmins = groupAdmins.includes(sender)
    const participants = isGroup ? await groupMetadata.participants : ''
    
    const isImage = (m.mtype == 'imageMessage')
    const isQuotedImage = isQuotedMsg ? content.includes('imageMessage') ? true : false : false
    const isVideo = (m.mtype == 'videoMessage')
    const isQuotedVideo = isQuotedMsg ? content.includes('videoMessage') ? true : false : false
    const isSewa = db.data.sewa[from] ? true : false

    function parseMention(text = '') {
      return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
    }

    const reply = (teks, options = {}) => ronzz.sendMessage(from, { text: teks, ...options }, { quoted: m })
    let cachedThumbnailBuffer = null
    function getThumbnailBuffer() {
      if (!cachedThumbnailBuffer) {
        try {
          cachedThumbnailBuffer = fs.readFileSync(thumbnail)
        } catch (e) {
          cachedThumbnailBuffer = undefined
        }
      }
      return cachedThumbnailBuffer
    }
    const Reply = (teks) => ronzz.sendMessage(from, { text: Styles(teks), contextInfo: { mentionedJid: parseMention(teks), externalAdReply: { showAdAttribution: true, title: `${botName} © ${ownerName}`, body: ownerName + botName, thumbnail: getThumbnailBuffer(), sourceUrl: linkGroup, mediaType: 1, renderLargerThumbnail: true } } }, { quoted: m })

    const mentionByTag = m.mtype == "extendedTextMessage" && m.message.extendedTextMessage.contextInfo != null ? m.message.extendedTextMessage.contextInfo.mentionedJid : []
    const mentionByReply = m.mtype == "extendedTextMessage" && m.message.extendedTextMessage.contextInfo != null ? m.message.extendedTextMessage.contextInfo.participant || "" : ""
    const mention = typeof (mentionByTag) == 'string' ? [mentionByTag] : mentionByTag
    mention != undefined ? mention.push(mentionByReply) : []

    try {
      var ppuser = await ronzz.profilePictureUrl(sender, "image")
    } catch {
      var ppuser = "https://telegra.ph/file/8dcf2bc718248d2dd189b.jpg"
    }
    
    async function downloadAndSaveMediaMessage(type_file, path_file) {
      if (type_file === 'image') {
        var stream = await downloadContentFromMessage(m.message.imageMessage || m.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk])
        }
        fs.writeFileSync(path_file, buffer)
        return path_file
      }
      else if (type_file === 'video') {
        var stream = await downloadContentFromMessage(m.message.videoMessage || m.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video')
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk])
        }
        fs.writeFileSync(path_file, buffer)
        return path_file
      } else if (type_file === 'sticker') {
        var stream = await downloadContentFromMessage(m.message.stickerMessage || m.message.extendedTextMessage?.contextInfo.quotedMessage.stickerMessage, 'sticker')
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk])
        }
        fs.writeFileSync(path_file, buffer)
        return path_file
      } else if (type_file === 'audio') {
        var stream = await downloadContentFromMessage(m.message.audioMessage || m.message.extendedTextMessage?.contextInfo.quotedMessage.audioMessage, 'audio')
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk])
        }
        fs.writeFileSync(path_file, buffer)
        return path_file
      }
    }

    // ====== Customer DM Intake Flow for Food Orders ======
    try {
      if (!isGroup) {
        // Ensure intake state exists in DB
        if (!global.db || !global.db.data) {
          // If database not ready, skip intake flow
        } else {
          if (!global.db.data.intakeState) global.db.data.intakeState = {}
          const userId = sender
          const userState = global.db.data.intakeState[userId] || { step: 'idle' }
          const INTAKE_TIMEOUT_MS = 2 * 60 * 60 * 1000 // 2 hours

          // Auto-expire stale intake session so users can trigger again later
          if (userState && userState.step !== 'idle' && userState.promptedAt && (Date.now() - userState.promptedAt > INTAKE_TIMEOUT_MS)) {
            delete global.db.data.intakeState[userId]
            await global.db.save()
          }

          // Helper: parse order form from free text
          function parseOrderForm(text) {
            if (!text) return null
            const rawLines = String(text).split(/\r?\n/)
            const lines = rawLines.map(l => l.trim()).filter(Boolean)
            const result = {
              nama: '',
              pesanan: '',
              addon: '',
              pengambilan: '',
              diambilOleh: '',
              pembayaran: '',
              ambilJam: '',
              complete: false
            }
            let currentKey = null
            for (const line of lines) {
              const hasColon = line.includes(':')
              if (hasColon) {
                const [keyRaw, ...rest] = line.split(':')
                if (!keyRaw || rest.length === 0) continue
                // Normalize key by removing common decorations (e.g., *, _, -, emojis) and extra spaces
                const key = keyRaw
                  .trim()
                  .toLowerCase()
                  .replace(/[\*`_~\-\p{Emoji_Presentation}\p{Emoji}\p{Extended_Pictographic}]/gu, '')
                  .replace(/\s+/g, ' ')
                  .trim()
                const value = rest.join(':').trim()
                  .replace(/^[\-\*`_~]+\s*/, '') // leading decorations before value
                currentKey = key
                if (key === 'nama') result.nama = value
                else if (key === 'pesanan') result.pesanan = value
                else if (key === 'add on' || key === 'addon' || key === 'add-on') result.addon = value
                else if (key === 'pengambilan') result.pengambilan = value
                else if (key === 'diambil oleh' || key === 'diambil') result.diambilOleh = value
                else if (key === 'pembayaran') result.pembayaran = value
                else if (key === 'ambil jam' || key === 'jam') result.ambilJam = value
                else currentKey = null
                continue
              }
              // Continuation lines (e.g., bullet items) for previous key
              if (currentKey === 'pesanan') {
                const cont = line.replace(/^[\-•\*·\s]+/, '').trim()
                if (cont) result.pesanan = result.pesanan ? `${result.pesanan}, ${cont}` : cont
              } else if (currentKey === 'add on' || currentKey === 'addon' || currentKey === 'add-on') {
                const cont = line.replace(/^[\-•\*·\s]+/, '').trim()
                if (cont) result.addon = result.addon ? `${result.addon}, ${cont}` : cont
              }
            }
            // Wajib semua kecuali Add On
            result.complete = !!(result.nama && result.pesanan && result.pengambilan && result.diambilOleh && result.pembayaran && result.ambilJam)
            return result
          }

          // Helper: normalize pickup option and find target group JID (may be link)
          function resolvePickupGroup(pickupRaw) {
            if (!pickupRaw) return null
            const raw = String(pickupRaw)
            const normalized = raw
              .toLowerCase()
              .replace(/[^a-z0-9\s]/g, ' ')
              .replace(/\s+/g, ' ')
              .trim()
            const options = Array.isArray(global.tenantPickupOptions) ? global.tenantPickupOptions : []
            const groups = global.tenantGroups || {}
            // Require exact case-insensitive match only
            const matched = options.find(opt => opt.toLowerCase() === normalized)
            if (!matched) return { error: 'invalid_option' }
            const groupTarget = groups[matched]
            if (!groupTarget) return { error: 'missing_group' }
            return { option: matched, groupTarget }
          }

          // Helper: resolve link invite to JID and ensure bot is in group
          async function resolveGroupJidIfNeeded(groupTarget) {
            try {
              if (/@g\.us$/.test(groupTarget)) {
                return groupTarget
              }
              // Extract invite code from link
              const match = String(groupTarget).match(/chat\.whatsapp\.com\/(\w+)/i)
              if (!match) return null
              const code = match[1]
              // Try get info first; if not in group, accept invite
              let info
              try {
                info = await ronzz.groupGetInviteInfo(code)
              } catch {}
              if (!info) {
                try {
                  const jid = await ronzz.groupAcceptInvite(code)
                  return jid || null
                } catch {
                  return null
                }
              }
              // If have info, prefer id
              if (info && info.id) return info.id
              return null
            } catch {
              return null
            }
          }

          // If user sends any non-command text and no form expected yet, send template
          const isCommand = typeof command === 'string' && command.length > 0 && prefix && chats.startsWith(prefix)
          if (userState.step === 'idle') {
            if ( (budy || chats) && !isCommand) {
              const textLower = String(chats || budy || '').toLowerCase()
              const triggers = Array.isArray(global.orderTriggers) ? global.orderTriggers : ['halo kak','kak','mau order','order','beli','pesen','pesan','halo']
              // Ignore trigger if user pasted the auto template header
              const containsAutoHeader = /\[\s*p(es)?an\s+otomatis\s*\]/i.test(textLower) || /format order serasa/i.test(textLower)
              const shouldPrompt = !containsAutoHeader && triggers.some(t => textLower.includes(t))
              if (!shouldPrompt) {
                // Ignore non-trigger chat completely
              } else {
                const compactTpl = global.orderFormCompactTemplate || global.orderFormTemplate || 'Silakan kirim format order.'
                await reply(compactTpl)
                global.db.data.intakeState[userId] = { step: 'awaiting_form', promptedAt: Date.now() }
                await global.db.save()
                return
              }
            }
          } else if (userState.step === 'awaiting_form') {
            const textLower = String(chats || budy || '').toLowerCase()

            // If user sends trigger again while in awaiting_form, resend template and refresh session
            const reTriggerList = Array.isArray(global.orderTriggers) ? global.orderTriggers : ['halo kak','kak','mau order','order','beli','pesen','pesan','halo']
            // Only treat as retrigger when message is short and matches whole word/phrase
            const isRetrigger = !(/\[\s*p(es)?an\s+otomatis\s*\]/i.test(textLower) || /format order serasa/i.test(textLower)) && reTriggerList.some(t => {
              const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
              const re = new RegExp(`(^|\\s)${escaped}(\\s|$)`, 'i')
              return re.test(textLower)
            }) && (textLower.length <= 30)
            if (isRetrigger) {
              const compactTpl = global.orderFormCompactTemplate || global.orderFormTemplate || 'Silakan kirim format order.'
              await reply(compactTpl)
              global.db.data.intakeState[userId] = { step: 'awaiting_form', promptedAt: Date.now() }
              await global.db.save()
              return
            }

            // Allow user to cancel the intake flow with common cancel words
            const cancelWords = Array.isArray(global.orderCancelWords) ? global.orderCancelWords : ['batal', 'cancel', 'gausa', 'gak usah', 'tidak jadi', 'nggak jadi', 'ga usah', 'stop']
            if (cancelWords.some(w => textLower.includes(w))) {
              await reply('Oke, proses order dibatalkan. Kalau butuh bantuan lagi, tinggal chat ya kak.')
              delete global.db.data.intakeState[userId]
              await global.db.save()
              return
            }

            // Only attempt to parse when the message looks like the structured form
            const looksLikeForm = /(^|\n)\s*[\*`_~\-]*\s*(nama|pesanan|add\s*-?\s*on|addon|pengambilan|diambil(\s*oleh)?|pembayaran|ambil\s*jam|jam)\s*:/i.test(chats || budy || '') || /:\s*.+/.test(chats || budy || '')
            if (!looksLikeForm) {
              // Ignore casual messages while awaiting form to avoid spamming the user
              return
            }

            // Try to parse the incoming message as order form
            const parsed = parseOrderForm(chats || budy)
            if (!parsed || !parsed.complete) {
              // Jika pengambilan diisi tapi tidak termasuk opsi, beri tahu pilihan yang valid
              if (parsed && parsed.pengambilan) {
                const checkPickup = resolvePickupGroup(parsed.pengambilan)
                if (checkPickup && checkPickup.error === 'invalid_option') {
                  await reply(
                    `Pengambilan tidak valid. Pilihan yang tersedia: ${Array.isArray(global.tenantPickupOptions) ? global.tenantPickupOptions.join(', ') : '-'}`
                  )
                  return
                }
              }
              const compactTpl = global.orderFormCompactTemplate || global.orderFormTemplate || 'Silakan kirim format order.'
              await reply(`Format tidak sesuai. Mohon ikuti contoh berikut:\n\n${compactTpl}`)
              return
            }

            // Validate pickup and find destination group
            const resolved = resolvePickupGroup(parsed.pengambilan)
            if (resolved && resolved.error === 'invalid_option') {
              await reply(
                `Pickup tidak valid. Pilihan yang tersedia: ${Array.isArray(global.tenantPickupOptions) ? global.tenantPickupOptions.join(', ') : '-'}`
              )
              return
            } else if (resolved && resolved.error === 'missing_group') {
              await reply('Pickup valid, namun grup tujuan belum disetel. Hubungi admin untuk melengkapi konfigurasi tenantGroups.')
              return
            }

            const { option, groupTarget } = resolved || {}
            if (!groupTarget) {
              await reply('Terjadi kesalahan saat menentukan grup tujuan.')
              return
            }

            const groupJid = await resolveGroupJidIfNeeded(groupTarget)
            if (!groupJid) {
              await reply('Tidak dapat mengakses grup tujuan. Pastikan bot dapat join/akses grup tersebut.')
              return
            }

            const customerNumber = userId.split('@')[0]
            // Format list fields (Pesanan/Add On) as bullet points if multiple items
            const formatListField = (label, raw) => {
              const text = String(raw || '').trim()
              if (!text) return `${label}: -`
              const parts = text
                .split(/[\n,]/)
                .map(s => s.trim())
                .filter(Boolean)
              if (parts.length <= 1) return `${label}: ${parts[0] || text}`
              return `${label}:
- ${parts.join('\n- ')}`
            }
            const forwardLines = [
              `[PESAN OTOMATIS] - ${tanggal} ${jamwib} WIB`,
              `JIKA INGIN ORDER SEGERA ISI LENGKAP!`,
              `Format Order Serasa Lidah🥟🥢`,
              parsed.nama ? `Nama: ${parsed.nama}` : `Nama: -`,
              formatListField('Pesanan', parsed.pesanan),
              formatListField('Add On', parsed.addon),
              `Pengambilan: ${option}`,
              parsed.diambilOleh ? `Diambil oleh: ${parsed.diambilOleh}` : `Diambil oleh: -`,
              parsed.pembayaran ? `Pembayaran: ${parsed.pembayaran}` : `Pembayaran: -`,
              `Ambil jam: ${parsed.ambilJam}`
            ]
            const forwardText = forwardLines.join('\n')

            try {
              await ronzz.sendMessage(groupJid, { text: forwardText })
              // Save order into database.json
              try {
                if (!global.db.data.orders) global.db.data.orders = []
                global.db.data.orders.push({
                  createdAt: Date.now(),
                  tanggal,
                  jam: jamwib,
                  customer: userId,
                  customerNumber,
                  groupJid,
                  pengambilan: option,
                  nama: parsed.nama || '',
                  pesanan: parsed.pesanan || '',
                  addon: parsed.addon || '',
                  diambilOleh: parsed.diambilOleh || '',
                  pembayaran: parsed.pembayaran || '',
                  ambilJam: parsed.ambilJam
                })
                await global.db.save()
              } catch (e2) {
                console.error('[IntakeFlow] Gagal simpan order:', e2.message)
              }
              await reply('Terima kasih! Pesanan kamu sudah diteruskan ke Cabang terkait. Anda dapat mengambil pesanan sesuai jam, Terimakasih.')
            } catch (e) {
              await reply('Gagal meneruskan pesan ke grup tenant. Coba lagi nanti atau hubungi admin.')
            }

            // Clear state after forwarding
            delete global.db.data.intakeState[userId]
            await global.db.save()
            return
          }
        }
      }
    } catch (e) {
      // Fail-safe: do not block main handler
      console.error('[IntakeFlow] Error:', e.message)
    }
    // ====== End Intake Flow ======
    if (FEATURE_ONLY_INTAKE) {
      return;
    }

    async function pepe(media) {
      const jimp = await jimp_1.read(media)
      const min = jimp.getWidth()
      const max = jimp.getHeight()
      const cropped = jimp.crop(0, 0, min, max)
      return {
        img: await cropped.scaleToFit(720, 720).getBufferAsync(jimp_1.MIME_JPEG),
        preview: await cropped.normalize().getBufferAsync(jimp_1.MIME_JPEG)
      }
    }

    function wrapText(text, maxLineLength) {
      const lines = [];
      while (text.length > maxLineLength) {
        let spaceIndex = text.lastIndexOf(" ", maxLineLength);
        if (spaceIndex === -1) {
          spaceIndex = maxLineLength;
        }
        lines.push(text.substring(0, spaceIndex));
        text = text.substring(spaceIndex).trim();
      }
      lines.push(text);
      return lines;
    }

    async function generateInvoiceWithBackground(data, backgroundPath) {
      const canvas = createCanvas(600, 400);
      const ctx = canvas.getContext("2d");

      if (backgroundPath && fs.existsSync(backgroundPath)) {
        const backgroundImage = await loadImage(backgroundPath);
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 10px Arial";

      ctx.fillText(`${data.invoice}`, 275, 134);
      ctx.fillText(`${data.product}`, 177, 188);
      ctx.fillText(`${data.tujuan}`, 177, 228);
      ctx.fillText(`${data.nickname}`, 177, 270);
      ctx.fillText(`${data.waktu}`, 86, 134);

      ctx.fillStyle = "#FCD201";
      const snLines = wrapText(data.sn, 40);
      let startY = 313;
      const lineSpacing = 20;

      snLines.forEach((line, index) => {
        ctx.fillText(line, 177, startY + (index * lineSpacing));
      });

      const outputPath = `./options/sticker/${data.invoice}.png`
      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(outputPath, buffer);

      return outputPath;
    }

    function digit() {
      let unik = (Math.floor(Math.random() * 200)).toFixed()
      while (db.data.unik.includes(unik) || unik == undefined) {
        unik = (Math.floor(Math.random() * 200)).toFixed()
      }
      db.data.unik.push(unik)
      return Number(unik)
    }

    const formatp = sizeFormatter({
      std: 'JEDEC',
      decimalPlaces: 2,
      keepTrailingZeroes: false,
      render: (literal, symbol) => `${literal} ${symbol}B`,
    })

    //Ucapan waktu
    if (dt >= 0) {
      var ucapanWaktu = ('Selamat Malam🌃')
    }
    if (dt >= 4) {
      var ucapanWaktu = ('Selamat Pagi🌄')
    }
    if (dt >= 12) {
      var ucapanWaktu = ('Selamat Siang☀️')
    }
    if (dt >= 16) {
      var ucapanWaktu = ('️ Selamat Sore🌇')
    }
    if (dt >= 23) {
      var ucapanWaktu = ('Selamat Malam🌙')
    }

    if (!db.data.orkut) db.data.orkut = {
      username: "",
      authToken: ""
    }
    if (!db.data.unik || db.data.unik.length >= 199) db.data.unik = ['0']
    if (!db.data.users[sender]) db.data.users[sender] = {
      saldo: 0,
      role: "bronze"
    }
    if (!db.data.persentase["feeDepo"]) db.data.persentase["feeDepo"] = feeDepo
    if (!db.data.persentase["bronze"]) db.data.persentase["bronze"] = bronze
    if (!db.data.persentase["silver"]) db.data.persentase["silver"] = silver
    if (!db.data.persentase["gold"]) db.data.persentase["gold"] = gold
    if (!db.data.profit["bronze"]) db.data.profit["bronze"] = nBronze
    if (!db.data.profit["silver"]) db.data.profit["silver"] = nSilver
    if (!db.data.profit["gold"]) db.data.profit["gold"] = nGold
    if (!db.data.setting[botNumber]) db.data.setting[botNumber] = {
      autoread: true,
      autoketik: false,
      anticall: true
    }
    if (isGroup && !db.data.chat[from]) db.data.chat[from] = {
      welcome: false,
      antilink: false,
      antilink2: false,
      sDone: "",
      sProses: ""
    }

    function Styles(text, style = 2) {
      var xStr = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
      var yStr = Object.freeze({
        1: 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘqʀꜱᴛᴜᴠᴡxʏᴢ1234567890',
        2: '𝖺 𝖻 𝖼 𝖽 𝖾 𝖿 𝗀 𝗁 𝗂 𝗃 𝗄 𝗅 𝗆 𝗇 𝗈 𝗉 𝗊 𝗋 𝗌 𝗍 𝗎 𝗏 𝗐 𝗑 𝗒 𝗓 𝖠 𝖡 𝖢 𝖣 𝖤 𝖥 𝖦 𝖧 𝖨 𝖩 𝖪 𝖫 𝖬 𝖭 𝖮 𝖯 𝖰 𝖱 𝖲 𝖳 𝖴 𝖵 𝖶 𝖷 𝖸 𝖹 1 2 3 4 5 6 7 8 9 0'
      });
      var replacer = [];
      xStr.map((v, i) => replacer.push({
        original: v,
        convert: style == 2 ? yStr[style].split(' ')[i] : yStr[style].split('')[i]
      }));
      var str = text.split('');
      var output = [];
      str.map(v => {
        const find = replacer.find(x => x.original == v);
        find ? output.push(find.convert) : output.push(v);
      });
      return output.join('');
    }

    function toRupiah(angka) {
      var saldo = '';
      var angkarev = angka.toString().split('').reverse().join('');
      for (var i = 0; i < angkarev.length; i++)
        if (i % 3 == 0) saldo += angkarev.substr(i, 3) + '.';
      return '' + saldo.split('', saldo.length - 1).reverse().join('');
    }

    function hargaSetelahProfit(harga, role, kategori) {
      if (db.data.customProfit[kategori.toLowerCase()] !== undefined) {
        if (db.data.customProfit[kategori.toLowerCase()] == "persen") {
          let fee = (db.data.persentase[role] / 100) * Number(harga)
          let total = Number(harga) + Number(Math.ceil(fee))
          return total
        } else if (db.data.customProfit[kategori.toLowerCase()] == "nominal") {
          let total = Number(harga) + Number(db.data.profit[role])
          return total
        }
      } else if (kategori.includes("PULSA") && db.data.customProfit["pulsa"] !== undefined) {
        if (db.data.customProfit["pulsa"] == "persen") {
          let fee = (db.data.persentase[role] / 100) * Number(harga)
          let total = Number(harga) + Number(Math.ceil(fee))
          return total
        } else if (db.data.customProfit["pulsa"] == "nominal") {
          let total = Number(harga) + Number(db.data.profit[role])
          return total
        }
      } else if (kategori.includes("KUOTA") && db.data.customProfit["kuota"] !== undefined) {
        if (db.data.customProfit["kuota"] == "persen") {
          let fee = (db.data.persentase[role] / 100) * Number(harga)
          let total = Number(harga) + Number(Math.ceil(fee))
          return total
        } else if (db.data.customProfit["kuota"] == "nominal") {
          let total = Number(harga) + Number(db.data.profit[role])
          return total
        }
      } else if (db.data.type == "persen") {
        let fee = (db.data.persentase[role] / 100) * Number(harga)
        let total = Number(harga) + Number(Math.ceil(fee))
        return total
      } else if (db.data.type == "nominal") {
        let total = Number(harga) + Number(db.data.profit[role])
        return total
      }
    }
    
    function hargaProduk(id, role) {
      if (role == "bronze") return db.data.produk[id].priceB
      if (role == "silver") return db.data.produk[id].priceS
      if (role == "gold") return db.data.produk[id].priceG
    }
    expiredCheck(ronzz, m, groupId)

    if (!FEATURE_DISABLE_TOPUP && db.data.topup[sender]) {
      if (!fromMe) {
        if (db.data.topup[sender].session == "INPUT-TUJUAN") {
          if (chats == "") return
          axios.get("https://okeconnect.com/harga/json?id=905ccd028329b0a").then(async res => {
            let product = res.data.find(i => i.kode == db.data.topup[sender].data.code)

            if (product.produk == "TPG Diamond Mobile Legends" || product.produk == "TPG Genshin Impact Crystals") {
              if (!chats.split(" ")[1]) return reply("Untuk produk ML atau yang ada server id penggunaannya seperti dibawah ini\nContoh:\n12345678 (12345) ❌\n12345678 12345 ✅")

              let nickname = ""
              if (product.produk == "TPG Diamond Mobile Legends") {
                nickname = await getUsernameMl(chats.split(" ")[0], chats.split(" ")[1])
              } else if (product.produk == "TPG Genshin Impact Crystals") {
                nickname = await getUsernameGi(chats.split(" ")[0], chats.split(" ")[1])
              }

              let teks = `*🧾 KONFIRMASI TOPUP 🧾*\n\n*Produk ID:* ${product.kode}\n*User Id:* ${chats.split(" ")[0]}\n*Zone Id:* ${chats.split(" ")[1]}\n*Nickname:* ${nickname}\n\n「  DETAIL PRODUCT ✅  」\n*Kategori:* ${product.kategori}\n*Produk:* ${product.keterangan}\n*Harga:* Rp${toRupiah(hargaSetelahProfit(product.harga, db.data.users[sender].role, product.kategori))}\n\nPeriksa apakah inputan sudah benar, jika salah maka akan gagal.`
              ronzz.sendMessage(from, {
                footer: `${botName} © ${ownerName}`,
                buttons: [
                  {
                    buttonId: 'lanjut', buttonText: { displayText: 'Lanjut' }, type: 1,
                  }, {
                    buttonId: 'batal', buttonText: { displayText: 'Batal' }, type: 1,
                  }
                ],
                headerType: 1,
                viewOnce: true,
                image: fs.readFileSync(thumbnail),
                caption: teks,
                contextInfo: {
                  forwardingScore: 999,
                  isForwarded: true,
                  mentionedJid: parseMention(teks),
                  externalAdReply: {
                    title: botName,
                    body: `By ${ownerName}`,
                    thumbnailUrl: ppuser,
                    sourceUrl: '',
                    mediaType: 1,
                    renderLargerThumbnail: false
                  }
                }
              }, { quoted: m });
              db.data.topup[sender].data.id = chats.split(" ")[0]
              db.data.topup[sender].data.zone = chats.split(" ")[1]
              db.data.topup[sender].data.nickname = nickname
            } else if (product.kategori == "DIGITAL") {
              let nickname = ""
              if (product.produk == "TPG Diamond Free Fire") {
                nickname = await getUsernameFf(chats)
              } else if (product.produk == "TPG Game Mobile PUBG") {
                nickname = await getUsernamePubg(chats)
              } else if (product.produk == "TPG Goldstar Super Sus") {
                nickname = await getUsernameSus(chats)
              } else if (product.produk == "TPG Arena of Valor") {
                nickname = await getUsernameAov(chats)
              } else if (product.produk == "TPG Honor of Kings") {
                nickname = await getUsernameHok(chats)
              } else if (product.produk == "TPG Call Of Duty") {
                nickname = await getUsernameCod(chats)
              } else if (product.produk == "TPG Point Blank Zepetto") {
                nickname = await getUsernamePb(chats)
              } else {
                nickname = ""
              }

              let teks = `*🧾 KONFIRMASI TOPUP 🧾*\n\n*Produk ID:* ${product.kode}\n*User Id:* ${chats}\n*Nickname:* ${nickname}\n\n「  DETAIL PRODUCT ✅  」\n*Kategori:* ${product.kategori}\n*Produk:* ${product.keterangan}\n*Harga:* Rp${toRupiah(hargaSetelahProfit(product.harga, db.data.users[sender].role, product.kategori))}\n\nPeriksa apakah inputan sudah benar, jika salah maka akan gagal.`
              ronzz.sendMessage(from, {
                footer: `${botName} © ${ownerName}`,
                buttons: [
                  {
                    buttonId: 'lanjut', buttonText: { displayText: 'Lanjut' }, type: 1,
                  }, {
                    buttonId: 'batal', buttonText: { displayText: 'Batal' }, type: 1,
                  }
                ],
                headerType: 1,
                viewOnce: true,
                image: fs.readFileSync(thumbnail),
                caption: teks,
                contextInfo: {
                  forwardingScore: 999,
                  isForwarded: true,
                  mentionedJid: parseMention(teks),
                  externalAdReply: {
                    title: botName,
                    body: `By ${ownerName}`,
                    thumbnailUrl: ppuser,
                    sourceUrl: '',
                    mediaType: 1,
                    renderLargerThumbnail: false
                  }
                }
              }, { quoted: m });
              db.data.topup[sender].data.id = chats
              db.data.topup[sender].data.nickname = nickname
            } else {
              let teks = `*🧾 KONFIRMASI TOPUP 🧾*\n\n*Produk ID:* ${product.kode}\n*Tujuan:* ${chats}\n\n「  DETAIL PRODUCT ✅  」\n*Kategori:* ${product.kategori}\n*Produk:* ${product.keterangan}\n*Harga:* Rp${toRupiah(hargaSetelahProfit(product.harga, db.data.users[sender].role, product.kategori))}\n\nPeriksa apakah inputan sudah benar, jika salah maka akan gagal.`
              ronzz.sendMessage(from, {
                footer: `${botName} © ${ownerName}`,
                buttons: [
                  {
                    buttonId: 'lanjut', buttonText: { displayText: 'Lanjut' }, type: 1,
                  }, {
                    buttonId: 'batal', buttonText: { displayText: 'Batal' }, type: 1,
                  }
                ],
                headerType: 1,
                viewOnce: true,
                image: fs.readFileSync(thumbnail),
                caption: teks,
                contextInfo: {
                  forwardingScore: 999,
                  isForwarded: true,
                  mentionedJid: parseMention(teks),
                  externalAdReply: {
                    title: botName,
                    body: `By ${ownerName}`,
                    thumbnailUrl: ppuser,
                    sourceUrl: '',
                    mediaType: 1,
                    renderLargerThumbnail: false
                  }
                }
              }, { quoted: m });
              db.data.topup[sender].data.id = chats
            }
            db.data.topup[sender].data.price = hargaSetelahProfit(product.harga, db.data.users[sender].role, product.kategori)
            db.data.topup[sender].session = "KONFIRMASI-TOPUP"
          })
        } else if (db.data.topup[sender].session == "KONFIRMASI-TOPUP") {
          if (chats.toLowerCase() == "lanjut") {
            axios.get("https://okeconnect.com/harga/json?id=905ccd028329b0a").then(async res => {
              let product = res.data.find(i => i.kode == db.data.topup[sender].data.code)
              if (db.data.users[sender].saldo < db.data.topup[sender].data.price) {
                reply("Saldo kamu tidak mencukupi untuk melakukan transaksi ini, sesaat lagi bot akan mengirimkan Pembayaran Otomatis.")

                let amount = Number(db.data.topup[sender].data.price) + Number(digit())

                let pay = await qrisDinamis(`${amount}`, "./options/sticker/qris.jpg")
                let time = Date.now() + toMs("5m");
                let expirationTime = new Date(time);
                let timeLeft = Math.max(0, Math.floor((expirationTime - new Date()) / 60000));
                let currentTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
                let expireTimeJakarta = new Date(currentTime.getTime() + timeLeft * 60000);
                let hours = expireTimeJakarta.getHours().toString().padStart(2, '0');
                let minutes = expireTimeJakarta.getMinutes().toString().padStart(2, '0');
                let formattedTime = `${hours}:${minutes}`

                await sleep(500)
                let cap
                if (product.produk == "TPG Diamond Mobile Legends" || product.produk == "TPG Genshin Impact Crystals") {
                  cap = `*🧾 MENUNGGU PEMBAYARAN 🧾*\n\n*Produk ID:* ${product.kode}\n*User Id:* ${db.data.topup[sender].data.id}\n*Zone Id:* ${db.data.topup[sender].data.zone}\n*Nickname:* ${db.data.topup[sender].data.nickname}\n\n「  DETAIL PRODUCT ✅  」\n*Kategori:* ${product.kategori}\n*Produk:* ${product.keterangan}\n*Harga:* Rp${toRupiah(db.data.topup[sender].data.price)} + 2 digit acak\n*Total Harga:* Rp${toRupiah(amount)}\n*Waktu:* ${timeLeft} menit\n\nSilahkan scan Qris di atas sebelum ${formattedTime} untuk melakukan pembayaran.\n`;
                } else if (product.kategori == "DIGITAL") {
                  cap = `*🧾 MENUNGGU PEMBAYARAN 🧾*\n\n*Produk ID:* ${product.kode}\n*User Id:* ${db.data.topup[sender].data.id}\n*Nickname:* ${db.data.topup[sender].data.nickname}\n\n「  DETAIL PRODUCT ✅  」\n*Kategori:* ${product.kategori}\n*Produk:* ${product.keterangan}\n*Harga:* Rp${toRupiah(db.data.topup[sender].data.price)} + 2 digit acak\n*Total Harga:* Rp${toRupiah(amount)}\n*Waktu:* ${timeLeft} menit\n\nSilahkan scan Qris di atas sebelum ${formattedTime} untuk melakukan pembayaran.\n`;
                } else {
                  cap = `*🧾 MENUNGGU PEMBAYARAN 🧾*\n\n*Produk ID:* ${product.kode}\n*Tujuan:* ${db.data.topup[sender].data.id}\n\n「  DETAIL PRODUCT ✅  」\n*Kategori:* ${product.kategori}\n*Produk:* ${product.keterangan}\n*Harga:* Rp${toRupiah(db.data.topup[sender].data.price)} + 2 digit acak\n*Total Harga:* Rp${toRupiah(amount)}\n*Waktu:* ${timeLeft} menit\n\nSilahkan scan Qris di atas sebelum ${formattedTime} untuk melakukan pembayaran.\n`;
                }
                let mess = await ronzz.sendMessage(from, { image: fs.readFileSync(pay), caption: Styles(cap) }, { quoted: m })

                let statusPay = false;

                while (!statusPay) {
                  await sleep(10000)
                  if (Date.now() >= time) {
                    statusPay = true

                    await ronzz.sendMessage(from, { delete: mess.key })
                    reply("Pembayaran dibatalkan karena telah melewati batas expired.")
                    delete db.data.topup[sender]
                  }
                  try {
                    let orkut = new OrderKuota(db.data.orkut["username"], db.data.orkut["authToken"])
                    let response = await orkut.getTransactionQris()
                    let result = response.qris_history.results.find(i => i.status == "IN" && Number(i.kredit.replace(/[.]/g, '')) == parseInt(amount))

                    if (result !== undefined) {
                      statusPay = true;

                      await ronzz.sendMessage(from, { delete: mess.key })
                      axios.get(`https://b2b.okeconnect.com/trx-v2?product=${product.kode}&dest=${db.data.topup[sender].data.id}${db.data.topup[sender].data.zone}&refID=${db.data.topup[sender].id}&memberID=${memberId}&pin=${pin}&password=${pw}`).then(async ress => {
                        if (ress.data.status == "GAGAL") {
                          ronzz.sendMessage(from, {
                            footer: `${botName} © ${ownerName}`,
                            buttons: [
                              {
                                buttonId: 'saldo', buttonText: { displayText: 'Saldo' }, type: 1,
                              }
                            ],
                            headerType: 1,
                            viewOnce: true,
                            image: fs.readFileSync(thumbnail),
                            caption: `Pesanan dibatalkan!\nAlasan: ${ress.data.message}\n\nUang akan dimasukkan ke saldo Anda`,
                            contextInfo: {
                              forwardingScore: 999,
                              isForwarded: true,
                              externalAdReply: {
                                title: botName,
                                body: `By ${ownerName}`,
                                thumbnailUrl: ppuser,
                                sourceUrl: '',
                                mediaType: 1,
                                renderLargerThumbnail: false
                              }
                            }
                          }, { quoted: m });
                          await dbHelper.updateUserSaldo(sender, db.data.topup[sender].data.price, 'add')
                          delete db.data.topup[sender]
                        } else {
                          if (product.produk == "TPG Diamond Mobile Legends" || product.produk == "TPG Genshin Impact Crystals") {
                            await Reply(`*⏳「 TRANSAKSI PENDING 」⏳*\n*${product.keterangan}*\n\n*» Reff Id:* ${db.data.topup[sender].id}\n*» User Id:* ${db.data.topup[sender].data.id}\n*» Zone Id:* ${db.data.topup[sender].data.zone}\n*» Nickname:* ${db.data.topup[sender].data.nickname}\n*» Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n\n_Harap ditunggu ya kak._`)
                          } else if (product.kategori == "DIGITAL") {
                            await Reply(`*⏳「 TRANSAKSI PENDING 」⏳*\n*${product.keterangan}*\n\n*» Reff Id:* ${db.data.topup[sender].id}\n*» User Id:* ${db.data.topup[sender].data.id}\n*» Nickname:* ${db.data.topup[sender].data.nickname}\n*» Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n\n_Harap ditunggu ya kak._`)
                          } else {
                            await Reply(`*⏳「 TRANSAKSI PENDING 」⏳*\n*${product.keterangan}*\n\n*» Reff Id:* ${db.data.topup[sender].id}\n*» Tujuan:* ${db.data.topup[sender].data.id}\n*» Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n\n_Harap ditunggu ya kak._`)
                          }
                        }

                        let status = ress.data.status
                        while (status !== "SUKSES") {
                          await sleep(5000)
                          let responsed = await axios.get(`https://b2b.okeconnect.com/trx-v2?product=${product.kode}&dest=${db.data.topup[sender].data.id}${db.data.topup[sender].data.zone}&refID=${db.data.topup[sender].id}&memberID=${memberId}&pin=${pin}&password=${pw}`)
                          let responses = await responsed.data
                          status = responses.status

                          if (responses.status == "GAGAL") {
                            ronzz.sendMessage(from, {
                              footer: `${botName} © ${ownerName}`,
                              buttons: [
                                {
                                  buttonId: 'saldo', buttonText: { displayText: 'Saldo' }, type: 1,
                                }
                              ],
                              headerType: 1,
                              viewOnce: true,
                              image: fs.readFileSync(thumbnail),
                              caption: `Pesanan dibatalkan!\nAlasan: ${ress.data.message}\n\nUang akan dimasukkan ke saldo Anda`,
                              contextInfo: {
                                forwardingScore: 999,
                                isForwarded: true,
                                externalAdReply: {
                                  title: botName,
                                  body: `By ${ownerName}`,
                                  thumbnailUrl: ppuser,
                                  sourceUrl: '',
                                  mediaType: 1,
                                  renderLargerThumbnail: false
                                }
                              }
                            }, { quoted: m });
                            await dbHelper.updateUserSaldo(sender, db.data.topup[sender].data.price, 'add')
                            delete db.data.topup[sender]
                            break
                          }
                          if (responses.status == "SUKSES") {
                            if (product.produk == "TPG Diamond Mobile Legends" || product.produk == "TPG Genshin Impact Crystals") {
                              let data = {
                                invoice: db.data.topup[sender].id,
                                product: product.keterangan,
                                tujuan: `${db.data.topup[sender].data.id} (${db.data.topup[sender].data.zone})`,
                                nickname: db.data.topup[sender].data.nickname,
                                waktu: tanggal,
                                sn: responses.sn
                              }
                              let invoice = await generateInvoiceWithBackground(data, "./options/image/bg.jpg")
                              await sleep(200)
                              await ronzz.sendMessage(from, { image: fs.readFileSync(invoice), caption: `*✅「 TRANSAKSI SUKSES 」✅*\n*${product.keterangan}*\n\n*» Reff Id:* ${db.data.topup[sender].id}\n*» User Id:* ${db.data.topup[sender].data.id}\n*» Zone Id:* ${db.data.topup[sender].data.zone}\n*» Nickname:* ${db.data.topup[sender].data.nickname}\n*» Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n*» Fee Qris:* Rp${Number(amount) - Number(db.data.topup[sender].data.price)}\n*» Total Bayar:* Rp${toRupiah(amount)}\n\n*» SN:*\n${responses.sn}\n\n_Terimakasih kak sudah order.️_` }, { quoted: m })
                              fs.unlinkSync(invoice)
                            } else if (product.kategori == "DIGITAL") {
                              let data = {
                                invoice: db.data.topup[sender].id,
                                product: product.keterangan,
                                tujuan: db.data.topup[sender].data.id,
                                nickname: db.data.topup[sender].data.nickname,
                                waktu: tanggal,
                                sn: responses.sn
                              }
                              let invoice = await generateInvoiceWithBackground(data, "./options/image/bg.jpg")
                              await sleep(200)
                              await ronzz.sendMessage(from, { image: fs.readFileSync(invoice), caption: `*✅「 TRANSAKSI SUKSES 」✅*\n*${product.keterangan}*\n\n*» Reff Id:* ${db.data.topup[sender].id}\n*» User Id:* ${db.data.topup[sender].data.id}\n*» Nickname:* ${db.data.topup[sender].data.nickname}\n*» Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n*» Fee Qris:* Rp${Number(amount) - Number(db.data.topup[sender].data.price)}\n*» Total Bayar:* Rp${toRupiah(amount)}\n\n*» SN:*\n${responses.sn}\n\n_Terimakasih kak sudah order.️_` }, { quoted: m })
                              fs.unlinkSync(invoice)
                            } else {
                              let data = {
                                invoice: db.data.topup[sender].id,
                                product: product.keterangan,
                                tujuan: db.data.topup[sender].data.id,
                                nickname: "",
                                waktu: tanggal,
                                sn: responses.sn
                              }
                              let invoice = await generateInvoiceWithBackground(data, "./options/image/bg.jpg")
                              await sleep(200)
                              await ronzz.sendMessage(from, { image: fs.readFileSync(invoice), caption: `*✅「 TRANSAKSI SUKSES 」✅*\n*${product.keterangan}*\n\n*» Reff Id:* ${db.data.topup[sender].id}\n*» Tujuan:* ${db.data.topup[sender].data.id}\n*» Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n*» Fee Qris:* Rp${Number(amount) - Number(db.data.topup[sender].data.price)}\n*» Total Bayar:* Rp${toRupiah(amount)}\n\n*» SN:*\n${responses.sn}\n\n_Terimakasih kak sudah order.️_` }, { quoted: m })
                              fs.unlinkSync(invoice)
                            }
                            delete db.data.topup[sender]
                            break
                          }
                        }
                      })
                    }
                  } catch (error) {
                    statusPay = true

                    reply("Pesanan dibatalkan!")
                    console.log("Error checking transaction status:", error);
                    delete db.data.topup[sender]
                  }
                }
              } else if (db.data.users[sender].saldo >= db.data.topup[sender].data.price) {
                axios.get(`https://b2b.okeconnect.com/trx-v2?product=${product.kode}&dest=${db.data.topup[sender].data.id}${db.data.topup[sender].data.zone}&refID=${db.data.topup[sender].id}&memberID=${memberId}&pin=${pin}&password=${pw}`).then(async ress => {
                  if (ress.data.status == "GAGAL") {
                    reply(`Pesanan dibatalkan!\nAlasan: ${ress.data.message}`)
                    delete db.data.topup[sender]
                  } else {
                    if (product.produk == "TPG Diamond Mobile Legends" || product.produk == "TPG Genshin Impact Crystals") {
                      await Reply(`*⏳「 TRANSAKSI PENDING 」⏳*\n*${product.keterangan}*\n\n*» Reff Id:* ${db.data.topup[sender].id}\n*» User Id:* ${db.data.topup[sender].data.id}\n*» Zone Id:* ${db.data.topup[sender].data.zone}\n*» Nickname:* ${db.data.topup[sender].data.nickname}\n*» Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n\n_Harap ditunggu ya kak._`)
                    } else if (product.kategori == "DIGITAL") {
                      await Reply(`*⏳「 TRANSAKSI PENDING 」⏳*\n*${product.keterangan}*\n\n*» Reff Id:* ${db.data.topup[sender].id}\n*» User Id:* ${db.data.topup[sender].data.id}\n*» Nickname:* ${db.data.topup[sender].data.nickname}\n*» Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n\n_Harap ditunggu ya kak._`)
                    } else {
                      await Reply(`*⏳「 TRANSAKSI PENDING 」⏳*\n*${product.keterangan}*\n\n*» Reff Id:* ${db.data.topup[sender].id}\n*» Tujuan:* ${db.data.topup[sender].data.id}\n*» Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n\n_Harap ditunggu ya kak._`)
                    }
                  }

                  let status = ress.data.status
                  while (status !== "SUKSES") {
                    await sleep(5000)
                    let responsed = await axios.get(`https://b2b.okeconnect.com/trx-v2?product=${product.kode}&dest=${db.data.topup[sender].data.id}${db.data.topup[sender].data.zone}&refID=${db.data.topup[sender].id}&memberID=${memberId}&pin=${pin}&password=${pw}`)
                    let responses = await responsed.data
                    status = responses.status

                    if (responses.status == "GAGAL") {
                      reply(`Pesanan dibatalkan!\nAlasan: ${responses.message}`)
                      delete db.data.topup[sender]
                      break
                    }
                    if (responses.status == "SUKSES") {
                      if (product.produk == "TPG Diamond Mobile Legends" || product.produk == "TPG Genshin Impact Crystals") {
                        let data = {
                          invoice: db.data.topup[sender].id,
                          product: product.keterangan,
                          tujuan: `${db.data.topup[sender].data.id} (${db.data.topup[sender].data.zone})`,
                          nickname: db.data.topup[sender].data.nickname,
                          waktu: tanggal,
                          sn: responses.sn
                        }
                        let invoice = await generateInvoiceWithBackground(data, "./options/image/bg.jpg")
                        await sleep(200)
                        await ronzz.sendMessage(from, { image: fs.readFileSync(invoice), caption: `*✅「 TRANSAKSI SUKSES 」✅*\n*${product.keterangan}*\n\n*» Reff Id:* ${db.data.topup[sender].id}\n*» User Id:* ${db.data.topup[sender].data.id}\n*» Zone Id:* ${db.data.topup[sender].data.zone}\n*» Nickname:* ${db.data.topup[sender].data.nickname}\n*» Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n\n*» SN:*\n${responses.sn}\n\n_Terimakasih kak sudah order.️_` }, { quoted: m })
                        fs.unlinkSync(invoice)
                      } else if (product.kategori == "DIGITAL") {
                        let data = {
                          invoice: db.data.topup[sender].id,
                          product: product.keterangan,
                          tujuan: db.data.topup[sender].data.id,
                          nickname: db.data.topup[sender].data.nickname,
                          waktu: tanggal,
                          sn: responses.sn
                        }
                        let invoice = await generateInvoiceWithBackground(data, "./options/image/bg.jpg")
                        await sleep(200)
                        await ronzz.sendMessage(from, { image: fs.readFileSync(invoice), caption: `*✅「 TRANSAKSI SUKSES 」✅*\n*${product.keterangan}*\n\n*» Reff Id:* ${db.data.topup[sender].id}\n*» User Id:* ${db.data.topup[sender].data.id}\n*» Nickname:* ${db.data.topup[sender].data.nickname}\n*» Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n\n*» SN:*\n${responses.sn}\n\n_Terimakasih kak sudah order.️_` }, { quoted: m })
                        fs.unlinkSync(invoice)
                      } else {
                        let data = {
                          invoice: db.data.topup[sender].id,
                          product: product.keterangan,
                          tujuan: db.data.topup[sender].data.id,
                          nickname: "",
                          waktu: tanggal,
                          sn: responses.sn
                        }
                        let invoice = await generateInvoiceWithBackground(data, "./options/image/bg.jpg")
                        await sleep(200)
                        await ronzz.sendMessage(from, { image: fs.readFileSync(invoice), caption: `*✅「 TRANSAKSI SUKSES 」✅*\n*${product.keterangan}*\n\n*» Reff Id:* ${db.data.topup[sender].id}\n*» Tujuan:* ${db.data.topup[sender].data.id}\n*» Harga:* Rp${toRupiah(db.data.topup[sender].data.price)}\n\n*» SN:*\n${responses.sn}\n\n_Terimakasih kak sudah order.️_` }, { quoted: m })
                        fs.unlinkSync(invoice)
                      }
                      await dbHelper.updateUserSaldo(sender, db.data.topup[sender].data.price, 'subtract')
                      delete db.data.topup[sender]
                      break
                    }
                  }
                })
              }
            })
          } else if (chats.toLowerCase() == "batal") {
            reply(`Baik kak, topup dengan id *${db.data.topup[sender].id}* dibatalkan.`)
            delete db.data.topup[sender]
          }
        }
      }
    }

    // Short-circuit commands yang dinonaktifkan
    if (["payqris","paywallet","deposit","saldo","listharga","upgrade","buy","stok"].includes(command)) {
      return reply('Fitur ini sementara dinonaktifkan.');
    }

    if (command === "payqris") {
      if (!db.data.deposit[sender]) {
        db.data.deposit[sender] = {
          ID: crypto.randomBytes(5).toString("hex").toUpperCase(),
          session: "amount",
          name: pushname,
          date: moment.tz('Asia/Jakarta').format('DD MMMM YYYY'),
          number: sender,
          payment: "QRIS",
          data: {
            amount_deposit: "",
            total_deposit: ""
          }
        }
        reply("Oke kak mau deposit berapa?\n\nContoh: 15000")
      } else {
        reply("Proses deposit kamu masih ada yang belum terselesaikan.\n\nKetik *batal* untuk membatalkan.")
      }
    } else if (command === "paywallet") {
      if (!db.data.deposit[sender]) {
        db.data.deposit[sender] = {
          ID: crypto.randomBytes(5).toString("hex").toUpperCase(),
          session: "amount",
          name: pushname,
          date: moment.tz('Asia/Jakarta').format('DD MMMM YYYY'),
          number: sender,
          payment: "E-WALLET",
          data: {
            amount_deposit: "",
            total_deposit: ""
          }
        }
        reply("Oke kak mau deposit berapa?\n\nContoh: 15000")
      } else {
        reply("Proses deposit kamu masih ada yang belum terselesaikan.\n\nKetik *batal* untuk membatalkan.")
      }
    }

    if (!FEATURE_DISABLE_TOPUP && db.data.deposit[sender]) {
      if (!m.key.fromMe) {
        if (db.data.deposit[sender].session === "amount") {
          if (isNaN(chats)) return reply("Masukan hanya angka ya")
          if (chats == "") return
          let pajakny = (Number(db.data.persentase["feeDepo"]) / 100) * Number(chats)
          let pajak2 = Number(Math.ceil(pajakny)) + Number(digit())
          db.data.deposit[sender].data.amount_deposit = Number(chats);
          db.data.deposit[sender].data.total_deposit = Number(chats) + Number(pajak2)
          db.data.deposit[sender].session = "konfirmasi_deposit";

          let teks = `*🧾 KONFIRMASI DEPOSIT 🧾*\n\n*ID:* ${db.data.deposit[sender].ID}\n*Nomor:* ${db.data.deposit[sender].number.split('@')[0]}\n*Payment:* ${db.data.deposit[sender].payment}\n*Jumlah Deposit:* Rp${toRupiah(db.data.deposit[sender].data.amount_deposit)}\n*Pajak:* Rp${toRupiah(Number(pajak2))}\n*Total Pembayaran:* Rp${toRupiah(db.data.deposit[sender].data.total_deposit)}\n\n_Deposit akan dibatalkan otomatis apabila terdapat kesalahan input._`
          ronzz.sendMessage(from, {
            footer: `${botName} © ${ownerName}`,
            buttons: [
              {
                buttonId: 'lanjut', buttonText: { displayText: 'Lanjut' }, type: 1,
              }, {
                buttonId: 'batal', buttonText: { displayText: 'Batal' }, type: 1,
              }
            ],
            headerType: 1,
            viewOnce: true,
            image: fs.readFileSync(thumbnail),
            caption: teks,
            contextInfo: {
              forwardingScore: 999,
              isForwarded: true,
              mentionedJid: parseMention(teks),
              externalAdReply: {
                title: botName,
                body: `By ${ownerName}`,
                thumbnailUrl: ppuser,
                sourceUrl: '',
                mediaType: 1,
                renderLargerThumbnail: false
              }
            }
          }, { quoted: m });
        } else if (db.data.deposit[sender].session === "konfirmasi_deposit") {
          if (chats.toLowerCase() === "lanjut") {
            if (db.data.deposit[sender].payment === "QRIS") {
              let pay = await qrisDinamis(`${db.data.deposit[sender].data.total_deposit}`, "./options/sticker/qris.jpg")
              let time = Date.now() + toMs("30m");
              let expirationTime = new Date(time);
              let timeLeft = Math.max(0, Math.floor((expirationTime - new Date()) / 60000));
              let currentTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
              let expireTimeJakarta = new Date(currentTime.getTime() + timeLeft * 60000);
              let hours = expireTimeJakarta.getHours().toString().padStart(2, '0');
              let minutes = expireTimeJakarta.getMinutes().toString().padStart(2, '0');
              let formattedTime = `${hours}:${minutes}`

              await sleep(1000)
              let pyqrs = `*🧾 MENUNGGU PEMBAYARAN 🧾*
 
*A/N:* ${payment.qris.an}

_Silahkan scan dan transfer dengan nominal yang benar, jika sudah bot akan otomatis konfirmasi deposit._`
              let mess = await ronzz.sendMessage(from, { image: fs.readFileSync(pay), caption: pyqrs }, { quoted: m })

              while (db.data.deposit[sender] !== undefined) {
                await sleep(10000)
                if (Date.now() >= time) {
                  await ronzz.sendMessage(from, { delete: mess.key })
                  reply("Deposit dibatalkan karena telah melewati batas expired.")
                  delete db.data.deposit[sender]
                }
                try {
                  let orkut = new OrderKuota(db.data.orkut["username"], db.data.orkut["authToken"])
                  let response = await orkut.getTransactionQris()
                  let result = response.qris_history.results.find(i => i.status == "IN" && Number(i.kredit.replace(/[.]/g, '')) == parseInt(db.data.deposit[sender].data.total_deposit))

                  if (result !== undefined) {
                    await ronzz.sendMessage(from, { delete: mess.key })

                    let text_sukses = `*✅「 DEPOSIT SUKSES 」✅*

ID: ${db.data.deposit[sender].ID}
Nomer: @${db.data.deposit[sender].number.split('@')[0]}
Payment: ${db.data.deposit[sender].payment}
Tanggal: ${db.data.deposit[sender].date.split(' ')[0]}
Jumlah Deposit: Rp${toRupiah(db.data.deposit[sender].data.amount_deposit)}
Pajak: Rp${toRupiah(Number(db.data.deposit[sender].data.total_deposit) - Number(db.data.deposit[sender].data.amount_deposit))}
Total Bayar: Rp${toRupiah(db.data.deposit[sender].data.total_deposit)}`
                    await ronzz.sendMessage(from, {
                      footer: `${botName} © ${ownerName}`,
                      buttons: [
                        {
                          buttonId: 'saldo', buttonText: { displayText: 'Saldo' }, type: 1,
                        }
                      ],
                      headerType: 1,
                      viewOnce: true,
                      image: fs.readFileSync(thumbnail),
                      caption: `${text_sukses}\n\n_Deposit kamu telah dikonfirmasi otomatis oleh bot, silahkan cek saldo Anda.`,
                      contextInfo: {
                        forwardingScore: 999,
                        isForwarded: true,
                        mentionedJid: parseMention(text_sukses),
                        externalAdReply: {
                          title: botName,
                          body: `By ${ownerName}`,
                          thumbnailUrl: ppuser,
                          sourceUrl: '',
                          mediaType: 1,
                          renderLargerThumbnail: false
                        }
                      }
                    }, { quoted: m });
                    

                    await dbHelper.updateUserSaldo(sender, Number(db.data.deposit[sender].data.amount_deposit), 'add')
                    delete db.data.deposit[sender]
                  }
                } catch (error) {
                  reply("Deposit dibatalkan!")
                  console.log("Error checking transaction status:", error);
                  delete db.data.deposit[sender]
                }
              }
              fs.unlinkSync(pay)
            } else if (db.data.deposit[sender].payment === "E-WALLET") {
              let py_dana = `*PAYMENT E-WALLET*

*DANA*
NOMER: ${payment.dana.nope}
A/N: ${payment.dana.an}

*GOPAY*
NOMER: ${payment.gopay.nope}
A/N: ${payment.gopay.an}

*OVO*
NOMER: ${payment.ovo.nope}
A/N: ${payment.ovo.an}

_Silahkan transfer dengan nomor yang sudah tertera, jika sudah harap kirim bukti foto dengan caption *bukti* untuk di acc oleh Admin._`
              reply(py_dana)
            }
          } else if (chats.toLowerCase() === "batal") {
            reply(`Baik kak, deposit dengan ID: ${db.data.deposit[sender].ID} dibatalkan`)
            delete db.data.deposit[sender]
          }
        }
      }
    }

    if (isGroup && isAlreadyResponList(from, chats.toLowerCase())) {
      let get_data_respon = getDataResponList(from, chats.toLowerCase())
      if (get_data_respon.isImage === false) {
        ronzz.sendMessage(from, { text: sendResponList(from, chats.toLowerCase()) }, {
          quoted: m
        })
      } else {
        ronzz.sendMessage(from, { image: { url: get_data_respon.image_url }, caption: get_data_respon.response }, {
          quoted: m
        })
      }
    }

    if (isAlreadyResponTesti(chats.toLowerCase())) {
      var get_data_respon = getDataResponTesti(chats.toLowerCase())
      ronzz.sendMessage(from, { image: { url: get_data_respon.image_url }, caption: get_data_respon.response }, { quoted: m })
    }

    if (isGroup && db.data.chat[from].antilink) {
      let gc = await ronzz.groupInviteCode(from)
      if (chats.match(/(`https:\/\/chat.whatsapp.com\/${gc}`)/gi)) {
        if (!isBotGroupAdmins) return
        reply(`*GROUP LINK DETECTOR*\n\nAnda tidak akan dikick oleh bot, karena yang anda kirim adalah link group ini.`)
      } else if ((chats.match("http://") || chats.match("https://") || chats.match("wa.me") || chats.match("t.me")) && !chats.match(`https://chat.whatsapp.com/${gc}`)) {
        if (!isBotGroupAdmins) return
        if (!isOwner && !isGroupAdmins) {
          await ronzz.sendMessage(from, { delete: m.key })
          ronzz.sendMessage(from, { text: `*LINK DETECTOR*\n\nMaaf @${sender.split('@')[0]}, sepertinya kamu mengirimkan link, maaf kamu akan di kick.`, mentions: [sender] })
          await sleep(500)
          ronzz.groupParticipantsUpdate(from, [sender], "remove")
        }
      }
    }

    if (isGroup && db.data.chat[from].antilink2) {
      let gc = await ronzz.groupInviteCode(from)
      if ((chats.match("http://") || chats.match("https://") || chats.match("wa.me") || chats.match("t.me")) && !chats.match(`https://chat.whatsapp.com/${gc}`)) {
        if (!isBotGroupAdmins) return
        if (!isOwner && !isGroupAdmins) {
          await ronzz.sendMessage(from, { delete: m.key })
          ronzz.sendMessage(from, { text: `*LINK DETECTOR*\n\nMaaf @${sender.split('@')[0]}, sepertinya kamu mengirimkan link, lain kali jangan kirim link yaa.`, mentions: [sender] })
        }
      }
    }

    if (db.data.setting[botNumber].autoread) ronzz.readMessages([m.key])
    if (db.data.setting[botNumber].autoketik) ronzz.sendPresenceUpdate('composing', from)
    if (chats) console.log('->[\x1b[1;32mCMD\x1b[1;37m]', color(moment(m.messageTimestamp * 1000).format('DD/MM/YYYY HH:mm:ss'), 'yellow'), color(`${prefix + command} [${args.length}]`), 'from', color(pushname), isGroup ? 'in ' + color(groupName) : '')

    switch (command) {    case 'testmsg':
      if (!isOwner) return reply('❌ Hanya owner yang dapat menggunakan command ini')
      
      if (!q) return reply('❌ Format: .testmsg <nomor_whatsapp>\nContoh: .testmsg 6281234567890')
      
      const testNumber = q.trim() + '@s.whatsapp.net'
      console.log('🧪 Testing message delivery to:', testNumber)
      
      try {
        // Test 1: Simple message
        await ronzz.sendMessage(testNumber, { text: '🧪 Test 1: Pesan sederhana - apakah sampai?' })
        console.log('✅ Test 1 sent')
        
        await sleep(2000)
        
        // Test 2: Formatted message
        const testMsg = `*🧪 TEST MESSAGE 2*
*Format:* Test dengan format
*Tanggal:* ${tanggal}
*Jam:* ${jamwib} WIB

📧 Test: example@test.com
🔐 Test: password123

Jika pesan ini sampai, sistem berfungsi normal.`
        
        await ronzz.sendMessage(testNumber, { text: testMsg })
        console.log('✅ Test 2 sent')
        
        reply(`✅ Test messages sent to ${q}. Check if received.`)
        
      } catch (error) {
        console.error('❌ Test message failed:', error)
        reply(`❌ Failed to send test message: ${error.message}`)
      }
    break
    }
  } catch (err) {
    console.log(color('[ERROR]', 'red'), err)
  }
}