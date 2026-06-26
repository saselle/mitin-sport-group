# Настройка отправки заявок

Форма на сайте готова к отправке заявок через защищённый endpoint. Для GitHub Pages нужен внешний обработчик, потому что Telegram bot token нельзя хранить в `index.html`.

## 1. Google Apps Script

1. Откройте https://script.google.com/.
2. Создайте новый проект.
3. Вставьте код из `lead-endpoint.google-apps-script.js`.
4. В функции `setupTelegramSecrets` замените:
   - `PASTE_BOT_TOKEN_HERE` на token Telegram-бота.
   - `PASTE_CHAT_ID_HERE` на chat id получателя или группы.
5. Запустите `setupTelegramSecrets` один раз.
6. Разверните проект: `Deploy` -> `New deployment` -> `Web app`.
7. В доступе выберите `Anyone`.
8. Скопируйте Web app URL.

## 2. Подключение на сайте

В `index.html` найдите форму:

```html
<form class="lead-form" ... data-endpoint="">
```

Вставьте Web app URL:

```html
data-endpoint="https://script.google.com/macros/s/.../exec"
```

После этого заявка будет отправляться на `Grigmit@yandex.ru` и дублироваться в Telegram.
