const EMAIL_TO = 'grigmitin@yandex.ru';
const EMAIL_SUBJECT = 'Заявка с сайта Mitin Sport Group';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const text = formatLead_(data);

    MailApp.sendEmail({
      to: EMAIL_TO,
      subject: EMAIL_SUBJECT,
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

function formatLead_(data) {
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

  const lines = ['Новая заявка с сайта Mitin Sport Group', ''];

  order.forEach((key) => {
    if (data[key]) lines.push(`${key}: ${data[key]}`);
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
