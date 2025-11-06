const tg = window.Telegram?.WebApp;
const usp = new URLSearchParams(location.search);
const aid = parseInt(usp.get("aid") || "0", 10);
const chat_id = parseInt(usp.get("chat_id") || "0", 10);
const msg_id = parseInt(usp.get("mid") || "0", 10);


if (tg){
tg.expand();
const u = tg.initDataUnsafe?.user;
document.getElementById("who").textContent = u ? `@${u.username || ''} (${u.id})` : '—';
}


document.getElementById("lot").textContent = aid && chat_id
? `Лот #${aid} • чат ${chat_id} • msg ${msg_id}`
: "Нет параметров лота (aid/chat_id). Открой через кнопку под аукционом.";


function send(action, extra){
if(!tg){ alert("Открой через Telegram."); return; }
const payload = {action, aid, chat_id, msg_id, ...extra};
try{
tg.sendData(JSON.stringify(payload));
tg.HapticFeedback?.impactOccurred?.("light");
tg.showAlert?.("Отправлено боту. Проверь сообщение в чате.");
}catch(e){
alert("Не удалось отправить: " + e);
}
}


[50,100,500,1000].forEach(v=>{
const el = document.getElementById("b"+v);
el?.addEventListener("click", ()=> send("bid", {inc:v}));
});


document.getElementById("bcustom")?.addEventListener("click", ()=>{
const v = parseInt(document.getElementById("custom").value, 10);
if(!v || v<=0){ tg?.showAlert?.("Укажи положительное число"); return; }
send("bid", {inc:v});
});


document.getElementById("auth")?.addEventListener("click", ()=>{
const url = document.getElementById("profile").value.trim();
if(!url){ tg?.showAlert?.("Вставь ссылку профиля ReManga"); return; }
send("auth_remanga", {url});
});