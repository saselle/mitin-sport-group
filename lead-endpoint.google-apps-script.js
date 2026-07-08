const EMAIL_TO = 'grigmitin@yandex.ru';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const kind = data['Тип'] || 'Заявка с сайта Mitin Sport Group';
    const text = formatLead_(data, kind);

    MailApp.sendEmail({
      to: EMAIL_TO,
      subject: kind,
      body: text
    });

    sendTelegram_(text);

    return json_({ ok: true });
  } catch (error) {
    return json_({ ok: false, error: String(error) });
  }
}

function sendTelegram_(text) {
  const props = PropertiesService.getScriptProperties();
  const token = props.getProperty('TELEGRAM_BOT_TOKEN');
  const chatId = props.getProperty('TELEGRAM_CHAT_ID');

  if (!token || !chatId) return;

  UrlFetchApp.fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'post',
    muteHttpExceptions: true,
    payload: {
      chat_id: chatId,
      text: text.slice(0, 3900)
    }
  });
}

function formatLead_(data, kind) {
  const order = [
    'Имя',
    'Контакт',
    'Email',
    'Организация',
    'Тип мероприятия',
    'Вид спорта',
    'Город',
    'Даты',
    'Количество',
    'Бюджет',
    'Задача',
    'Согласие',
    'Страница',
    'Время заявки'
  ];

  const lines = [kind, ''];
  const seen = new Set(['Тип']);

  order.forEach((key) => {
    if (data[key]) { lines.push(`${key}: ${data[key]}`); seen.add(key); }
  });

  Object.keys(data).forEach((key) => {
    if (!seen.has(key) && data[key]) lines.push(`${key}: ${data[key]}`);
  });

  return lines.join('\n');
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function setupTelegramSecrets() {
  PropertiesService.getScriptProperties().setProperties({
    TELEGRAM_BOT_TOKEN: 'PASTE_BOT_TOKEN_HERE',
    TELEGRAM_CHAT_ID: 'PASTE_CHAT_ID_HERE'
  });
}
