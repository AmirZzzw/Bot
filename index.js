// index.js const express = require("express"); const axios = require("axios"); const bodyParser = require("body-parser"); const { botToken, adminId, botUsername, sponsorChannel, channelWithAt } = require("./config"); const store = require("./dataStore");

const app = express(); app.use(bodyParser.json());

const TELEGRAM_API = https://api.telegram.org/bot${botToken};

app.post("/", async (req, res) => { const update = req.body; const msg = update.message || update.callback_query?.message; if (!msg) return res.sendStatus(200);

const chatId = msg.chat.id; const fromId = update.message?.from?.id || update.callback_query?.from?.id; const text = update.message?.text;

// عضویت در کانال چک شود (فقط برای کاربران غیرادمین) if (parseInt(fromId) !== parseInt(adminId)) { const check = await axios.get( ${TELEGRAM_API}/getChatMember?chat_id=@${sponsorChannel}&user_id=${fromId} ); const status = check.data?.result?.status; if (!["member", "administrator", "creator"].includes(status)) { await sendMessage( chatId, ▫️شما در کانال اسپانسر عضو نیستید ⚜️\n◼️عضو شوید و سپس /start را بفرستید, { inline_keyboard: [ [ { text: @${sponsorChannel}, url: https://t.me/${sponsorChannel}, }, ], ], } ); return res.sendStatus(200); } }

// هندل دستور start با کد کانفیگ if (/^/start (\d+)$/.test(text)) { const code = text.split(" ")[1]; const config = store.getConfig(code);

if (!config || config.downloads >= config.limit) {
  return sendMessage(chatId, "متاسفانه ظرفیت دانلود این کانفیگ به اتمام رسیده است.");
}

if (config.downloadedBy.includes(fromId)) {
  return sendMessage(chatId, "شما یکبار این اکانت را دریافت کردین.");
}

config.downloads++;
config.downloadedBy.push(fromId);

await sendMessage(
  chatId,
  `کد کانکشن مد نظر شما :\n\`${config.text}\`\nتعداد دانلود این سرور : ${config.downloads} تا`,
  null,
  "Markdown"
);
return res.sendStatus(200);

}

// ادمین: افزودن کانفیگ جدید if (fromId == adminId && text === "/start") { store.setStep(fromId, "waiting_config"); return sendMessage(chatId, "لطفاً کانفیگ جدید را ارسال کنید:"); }

const step = store.getStep(fromId); if (fromId == adminId && step === "waiting_config") { const code = store.saveNewConfig(text); store.setStep(fromId, null); await sendMessage(chatId, کانفیگ با کد ${code} ذخیره شد.); }

res.sendStatus(200); });

async function sendMessage(chat_id, text, keyboard = null, mode = "HTML") { await axios.post(${TELEGRAM_API}/sendMessage, { chat_id, text, parse_mode: mode, reply_markup: keyboard ? JSON.stringify({ inline_keyboard: keyboard }) : undefined, }); }

const PORT = process.env.PORT || 3000; app.listen(PORT, () => console.log("Bot server running on port " + PORT));

