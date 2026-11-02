import { readingFields, readingsContact, validateReadings } from './readings-domain.js?v=20261027-complete';

const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fieldLabels = { meter_number: 'Номер счётчика', meter_value_S: 'Общие показания', meter_value_1: 'Тариф 1', meter_value_2: 'Тариф 2', meter_value_3: 'Тариф 3' };
function readingSummary(values) {
  return '<dl class="reading-summary">' + readingFields.filter(key => values[key] !== '').map(key => `<div><dt>${fieldLabels[key]}</dt><dd>${escapeHTML(values[key])}${key !== 'meter_number' ? '<span> кВт·ч</span>' : ''}</dd></div>`).join('') + '</dl>';
}

export function readingsPage({ icon, link }) {
  return `<div id="readings-app"><section class="readings-hero"><div class="container"><nav class="breadcrumbs" aria-label="Путь к странице"><a href="/">Главная</a>${icon('chevron')}<span class="current">Передача показаний</span></nav><div class="readings-title-row"><div><div class="eyebrow">Сервис для потребителей</div><h1>Передача показаний</h1><p>Введите показания электросчётчика.<br>Проверьте данные и подтвердите отправку.</p></div><div class="readings-hero-mark" aria-hidden="true">${icon('meter')}<span>Электроэнергия<small>кВт·ч</small></span></div></div></div></section>
  <div class="container readings-layout"><div class="readings-main"><section class="reading-form-card" aria-labelledby="reading-form-title"><ol class="reading-steps" aria-label="Этапы передачи"><li data-reading-step="1" class="current" aria-current="step"><span>1</span><strong>Показания</strong></li><li data-reading-step="2"><span>2</span><strong>Проверка</strong></li><li data-reading-step="3"><span>3</span><strong>Готово</strong></li></ol>
    <div class="reading-card-body"><div class="reading-form-heading"><span class="reading-heading-icon">${icon('meter')}</span><div><h2 id="reading-form-title" tabindex="-1">Данные счётчика</h2><p id="reading-form-subtitle">Номер и общие показания — обязательные поля.</p></div></div>
    <div class="reading-period-message" id="reading-period-message" role="status"><span class="reading-status-dot"></span><div><strong id="reading-period-title">Проверяем период приёма…</strong><p id="reading-period-description">Показания принимаются с 20 по 25 число каждого месяца.</p><button type="button" id="reading-refresh-status" hidden>Обновить статус</button></div></div>
    <div class="reading-stage" data-reading-stage="1"><form id="reading-form" novalidate><div class="reading-field"><label for="reading-meter">Номер электросчётчика <span aria-hidden="true">*</span></label><input id="reading-meter" name="meter_number" type="text" inputmode="numeric" autocomplete="off" maxlength="64" required aria-describedby="reading-meter-hint reading-error-meter_number" placeholder="Укажите заводской номер"><p class="reading-hint" id="reading-meter-hint">Номер указан на корпусе счётчика и в квитанции. Сохраните нули в начале номера.</p><p class="reading-field-error" id="reading-error-meter_number" hidden></p></div>
    <div class="reading-field reading-total"><label for="reading-total">Общие показания · сумма <span aria-hidden="true">*</span></label><div class="reading-input-unit"><input id="reading-total" name="meter_value_S" type="text" inputmode="numeric" autocomplete="off" maxlength="64" required aria-describedby="reading-total-hint reading-error-meter_value_S" placeholder="Например, 12345"><span>кВт·ч</span></div><p class="reading-hint" id="reading-total-hint">Введите целую часть показаний с прибора — без цифр после запятой или точки.</p><p class="reading-field-error" id="reading-error-meter_value_S" hidden></p></div>
    <label class="reading-tariff-toggle"><input id="reading-multi-tariff" type="checkbox" aria-controls="reading-tariff-fields" aria-expanded="false"><span><strong>У меня многотарифный счётчик</strong><small>Дополнительно указать показания Т1, Т2 или Т3</small></span>${icon('down')}</label>
    <div id="reading-tariff-fields" class="reading-tariff-fields" hidden><p>Заполните только тарифы, которые показывает ваш счётчик. Общие показания выше также нужны.</p><div class="reading-tariff-grid">${[1,2,3].map(n => `<div class="reading-field"><label for="reading-t${n}">Тариф ${n} <span class="reading-optional">Т${n}</span></label><div class="reading-input-unit"><input id="reading-t${n}" name="meter_value_${n}" type="text" inputmode="numeric" autocomplete="off" maxlength="64" placeholder="0" disabled aria-describedby="reading-error-meter_value_${n}"><span>кВт·ч</span></div><p class="reading-field-error" id="reading-error-meter_value_${n}" hidden></p></div>`).join('')}</div></div>
    <div class="reading-form-bottom"><button class="button button-primary reading-next" type="submit">Проверить показания ${icon('arrow')}</button><p>На следующем шаге вы проверите данные перед отправкой.</p></div></form></div>
    <div class="reading-stage" data-reading-stage="2" hidden><div id="reading-review"></div><p class="reading-review-note">Сверьте номер и все показания с вашим счётчиком. После нажатия кнопки данные будут переданы в АО «ППЭС».</p><div class="reading-submit-error" id="reading-submit-error" role="alert" tabindex="-1" hidden></div><div class="reading-review-actions"><button class="button reading-back" id="reading-edit" type="button">Изменить данные</button><button class="button button-primary" id="reading-send" type="button" disabled>Передать показания ${icon('arrow')}</button></div><p class="reading-send-status" id="reading-send-status" role="status" aria-live="polite"></p></div>
    <div class="reading-stage" data-reading-stage="3" hidden><div class="reading-success"><span>${icon('shield')}</span><h3>Показания отправлены</h3><p>Сервис предприятия подтвердил получение данных.</p><time id="reading-received-time"></time></div><div id="reading-receipt"></div><button type="button" id="reading-another" class="button button-primary">Передать за другой счётчик ${icon('arrow')}</button></div>
    </div><div class="reading-form-footnote">${icon('info')}<span>Данные отправляются только после вашего подтверждения.</span></div></section>
    <section class="reading-faq" aria-labelledby="reading-faq-title"><div class="eyebrow">Полезно знать</div><h2 id="reading-faq-title">Помощь с передачей показаний</h2><details><summary>Где найти номер счётчика? ${icon('down')}</summary><p>Найдите заводской номер на корпусе прибора или в квитанции. Введите его полностью, включая нули в начале. Если номер содержит буквы, уточните порядок передачи по телефону ${readingsContact.phone}.</p></details><details><summary>Нужно ли заполнять все тарифы? ${icon('down')}</summary><p>Общие показания обязательны. Т1, Т2 и Т3 заполняются дополнительно, только если ваш прибор ведёт учёт по этим тарифам. Для обычного однотарифного счётчика достаточно общих показаний.</p></details><details><summary>Какие цифры нужно вводить? ${icon('down')}</summary><p>Введите целую часть текущих накопленных показаний в кВт·ч. Цифры после запятой или точки не указывайте. Не рассчитывайте расход за месяц — передайте значение с самого прибора.</p></details><details><summary>Как убедиться, что показания отправлены? ${icon('down')}</summary><p>Дождитесь сообщения «Показания отправлены». Если подтверждение не появилось или связь прервалась, уточните результат по телефону ${readingsContact.phone} перед повторной отправкой.</p></details></section></div>
    <aside class="readings-aside" aria-label="Период приёма и помощь"><section class="reading-window"><div class="reading-window-top">${icon('file')}<span>Каждый месяц</span></div><div class="reading-window-dates">20<span>—</span>25</div><h2>Период передачи<br>показаний</h2><p>По местному времени<br>Комсомольска-на-Амуре</p><div class="reading-window-badge" id="reading-period-badge">Проверяем статус…</div></section><section class="reading-phone-panel"><span class="reading-contact-label">Приём показаний по телефону</span><a href="${readingsContact.href}" class="reading-phone">${readingsContact.phone}</a>${link(readingsContact.href,'Позвонить','button reading-phone-button','phone')}<p>Поможем с номером прибора, заполнением и результатом отправки.</p></section><section class="reading-tip"><div class="reading-tip-heading">${icon('info')}<h3>Перед заполнением</h3></div><p>Снимите показания со счётчика и держите квитанцию под рукой.</p><div class="reading-meter-example" aria-hidden="true"><span>ЭЛЕКТРОСЧЁТЧИК</span><div>0 1 2 3 4 5 <small>кВт·ч</small></div><i></i><small>Условный пример показаний</small></div></section></aside></div><noscript><p class="container">Для отправки показаний включите JavaScript или .</p></noscript></div>`;
}

export function enhanceReadingsPage() {
  const root = document.querySelector('#readings-app');
  if (!root) return;
  const $ = selector => root.querySelector(selector);
  const form = $('#reading-form'), send = $('#reading-send'), edit = $('#reading-edit');
  let values = null, period = null, pending = false;
  function stage(number) {
    root.querySelectorAll('[data-reading-stage]').forEach(el => { el.hidden = Number(el.dataset.readingStage) !== number; });
    root.querySelectorAll('[data-reading-step]').forEach(el => {
      const n = Number(el.dataset.readingStep); el.classList.toggle('current', n === number); el.classList.toggle('complete', n < number);
      if (n === number) el.setAttribute('aria-current', 'step'); else el.removeAttribute('aria-current');
    });
    $('#reading-form-title').textContent = ['Данные счётчика', 'Проверьте показания', 'Готово'][number - 1];
    $('#reading-form-subtitle').textContent = ['Номер и общие показания — обязательные поля.', 'Убедитесь, что всё указано верно.', 'Подтверждение передачи показаний'][number - 1];
    $('#reading-period-message').hidden = number === 3;
    $('#reading-form-title').focus({ preventScroll: true });
    $('.reading-form-card').scrollIntoView({ block: 'start', behavior: 'smooth' });
  }
  function setPeriod(next) {
    period = next;
    $('#reading-period-message').classList.toggle('is-open', !!next?.open);
    $('#reading-refresh-status').hidden = !!next;
    send.disabled = pending || !next?.open;
    if (!next) {
      $('#reading-period-title').textContent = 'Не удалось проверить период приёма';
      $('#reading-period-description').textContent = 'Можно заполнить и проверить данные. Для отправки обновите статус или воспользуйтесь телефоном.';
      $('#reading-period-badge').textContent = 'Статус недоступен';
    } else {
      $('#reading-period-title').textContent = next.open ? 'Приём показаний открыт' : 'Приём откроется ' + next.nextOpenLabel;
      $('#reading-period-description').textContent = next.open ? 'Период: 20–25 число · ' + next.monthLabel : 'Пока можно заполнить и проверить данные. Отправка доступна с 20 по 25 число.';
      $('#reading-period-badge').textContent = next.open ? 'Приём открыт' : 'Следующий приём — ' + next.nextOpenLabel;
    }
    $('#reading-period-badge').classList.toggle('is-open', !!next?.open);
  }
  async function refreshStatus() {
    const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 10000);
    $('#reading-refresh-status').disabled = true;
    try {
      const response = await fetch('/api/readings', { cache: 'no-store', signal: controller.signal });
      const data = await response.json();
      if (!response.ok || typeof data.period?.open !== 'boolean') throw new Error();
      setPeriod(data.period);
    } catch { setPeriod(null); }
    finally { clearTimeout(timer); $('#reading-refresh-status').disabled = false; }
  }
  $('#reading-refresh-status').addEventListener('click', refreshStatus);
  $('#reading-multi-tariff').addEventListener('change', event => {
    const active = event.target.checked;
    $('#reading-tariff-fields').hidden = !active;
    event.target.setAttribute('aria-expanded', String(active));
    $('#reading-tariff-fields').querySelectorAll('input').forEach(input => { input.disabled = !active; });
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const checked = validateReadings(data);
    for (const field of readingFields) {
      const input = form.elements.namedItem(field), error = $('#reading-error-' + field);
      error.textContent = checked.errors[field] || ''; error.hidden = !checked.errors[field];
      if (checked.errors[field]) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    }
    if (!checked.valid) { form.elements.namedItem(Object.keys(checked.errors)[0]).focus(); return; }
    values = checked.values;
    $('#reading-review').innerHTML = readingSummary(values);
    $('#reading-submit-error').hidden = true; $('#reading-send-status').textContent = '';
    send.textContent = 'Передать показания'; stage(2);
  });
  edit.addEventListener('click', () => { if (!pending) stage(1); });
  send.addEventListener('click', async () => {
    if (pending || !period?.open || !values) return;
    pending = true; send.disabled = true; edit.disabled = true;
    root.setAttribute('aria-busy', 'true'); send.textContent = 'Отправляем…';
    $('#reading-submit-error').hidden = true;
    $('#reading-send-status').textContent = 'Дождитесь ответа. Не закрывайте страницу и не отправляйте показания повторно.';
    const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 35000);
    try {
      const response = await fetch('/api/readings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values), signal: controller.signal });
      const result = await response.json();
      if (!response.ok || result.ok !== true) {
        if (result.period) setPeriod(result.period);
        throw new Error(result.error || 'Не удалось получить подтверждение. Уточните результат по телефону ' + readingsContact.phone + ' перед повторной отправкой.');
      }
      $('#reading-receipt').innerHTML = readingSummary(values);
      const received = new Date(result.receivedAt);
      $('#reading-received-time').textContent = Number.isNaN(received.getTime()) ? '' : new Intl.DateTimeFormat('ru-RU', { timeZone: 'Asia/Vladivostok', dateStyle: 'long', timeStyle: 'short' }).format(received) + ' · местное время';
      $('#reading-send-status').textContent = ''; stage(3);
    } catch (error) {
      $('#reading-submit-error').textContent = error.name === 'AbortError' || error instanceof TypeError || error instanceof SyntaxError ? 'Подтверждение не получено. Показания могли быть приняты. Уточните результат по телефону ' + readingsContact.phone + ' перед повторной отправкой.' : error.message;
      $('#reading-submit-error').hidden = false; $('#reading-submit-error').focus();
      $('#reading-send-status').textContent = ''; send.textContent = 'Повторить отправку';
    } finally {
      clearTimeout(timer); pending = false; send.disabled = !period?.open; edit.disabled = false; root.removeAttribute('aria-busy');
    }
  });
  $('#reading-another').addEventListener('click', () => {
    form.reset(); values = null;
    $('#reading-tariff-fields').hidden = true;
    $('#reading-tariff-fields').querySelectorAll('input').forEach(input => { input.disabled = true; });
    $('#reading-multi-tariff').setAttribute('aria-expanded', 'false');
    stage(1); refreshStatus();
  });
  refreshStatus();
}
