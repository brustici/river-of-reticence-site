/**
 * Google side of the "Send Geri a Note" form on riverofreticence.com.
 *
 * One-time setup:
 *   1. script.google.com -> New project -> replace Code.gs with this file.
 *   2. Optionally add Geri's address to NOTIFY below.
 *   3. Pick `setup` in the function menu -> Run -> approve the permissions.
 *   4. Copy the `noteForm` block from the execution log into
 *      src/data/site.ts (lovedTheBook.noteForm).
 *
 * setup() creates the form (questions in the order the website posts them),
 * a linked Sheet that keeps every note, and a trigger that emails each new
 * note. Run it once only: a second run makes a second form.
 */

// Extra addresses to email each note to (e.g. Geri's). The account that runs
// setup always gets a copy. Edit any time; the next note uses the new list.
const NOTIFY = [];

const OK_TO_QUOTE = 'Yes';

function setup() {
  const form = FormApp.create('Notes for Geri - River of Reticence');
  form.setDescription('Receives notes from the "Send Geri a Note" form on riverofreticence.com.');
  form.setCollectEmail(false);
  form.setLimitOneResponsePerUser(false);
  form.setAllowResponseEdits(false);
  // Workspace accounts default to "only people in this domain"; readers are outside it.
  try { form.setRequireLogin(false); } catch (err) { /* consumer account: not applicable */ }
  // Newer forms can start unpublished; make sure this one accepts responses.
  try { if (form.setPublished) form.setPublished(true); } catch (err) { /* older API */ }
  form.setAcceptingResponses(true);

  const name = form.addTextItem().setTitle('Your name').setRequired(true);
  const town = form.addTextItem().setTitle('Town');
  const email = form.addTextItem().setTitle('Email');
  const note = form.addParagraphTextItem().setTitle('Your note').setRequired(true);
  const ok = form.addCheckboxItem().setTitle('OK to quote').setChoiceValues([OK_TO_QUOTE]);

  const sheet = SpreadsheetApp.create('Notes for Geri - responses');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  ScriptApp.newTrigger('emailNote').forForm(form).onFormSubmit().create();

  // The website posts to entry.<id> fields, which only a pre-filled link reveals.
  const prefilled = form.createResponse()
    .withItemResponse(name.createResponse('x'))
    .withItemResponse(town.createResponse('x'))
    .withItemResponse(email.createResponse('x'))
    .withItemResponse(note.createResponse('x'))
    .withItemResponse(ok.createResponse([OK_TO_QUOTE]))
    .toPrefilledUrl();
  const ids = (prefilled.match(/entry\.\d+/g) || []);
  if (ids.length !== 5) throw new Error('Expected 5 entry ids, got: ' + prefilled);

  const action = form.getPublishedUrl().replace(/\/viewform.*$/, '/formResponse');
  Logger.log('Form (edit):  ' + form.getEditUrl());
  Logger.log('Sheet:        ' + sheet.getUrl());
  // Must be false on Workspace, or readers outside the domain can't send notes.
  // (requiresLogin is deprecated; if it's gone, check Settings -> Responses by hand.)
  try { Logger.log('Domain-only:  ' + form.requiresLogin()); } catch (err) { Logger.log('Domain-only:  unknown, check Settings -> Responses'); }
  Logger.log('Paste this into src/data/site.ts as lovedTheBook.noteForm:\n' +
    "  noteForm: {\n" +
    "    action: '" + action + "',\n" +
    "    fields: { name: '" + ids[0] + "', town: '" + ids[1] + "', email: '" + ids[2] +
    "', note: '" + ids[3] + "', okToQuote: '" + ids[4] + "' },\n" +
    "    okToQuoteValue: '" + OK_TO_QUOTE + "',\n" +
    "  },");
}

// ---------------------------------------------------------------------------
// Spam filtering
//
// The website sends two hidden fields with every note:
//   Website     a trap the reader never sees; bots that fill every field fill it.
//   Form check  set by the page's script at send time to "v1.<seconds on page>".
//               Bots that post straight to the form (no page, no script) leave it
//               empty or malformed.
// emailNote() also scores the text itself. A note judged spam is not emailed;
// it stays in the Sheet with the reason in the "Spam filter" column.
//
// One-time upgrade for a form made before spam filtering: pick `addSpamFields`
// -> Run, then copy the two new entry ids from the log into src/data/site.ts
// (lovedTheBook.noteForm.fields.trap / .check).
// ---------------------------------------------------------------------------

const TRAP_TITLE = 'Website';
const CHECK_TITLE = 'Form check';
const MIN_SECONDS = 3; // faster than this is a bot, not a reader

function noteForm_() {
  const trigger = ScriptApp.getProjectTriggers().filter((t) => t.getHandlerFunction() === 'emailNote')[0];
  if (!trigger) throw new Error('No emailNote trigger: run setup first.');
  return FormApp.openById(trigger.getTriggerSourceId());
}

function addSpamFields() {
  const form = noteForm_();
  const byTitle = {};
  form.getItems().forEach((item) => { byTitle[item.getTitle()] = item; });
  const trap = (byTitle[TRAP_TITLE] || form.addTextItem().setTitle(TRAP_TITLE)
    .setHelpText('Hidden on the website. Should always be empty.')).asTextItem();
  const check = (byTitle[CHECK_TITLE] || form.addTextItem().setTitle(CHECK_TITLE)
    .setHelpText('Filled in by the website. Do not edit.')).asTextItem();

  const prefilled = form.createResponse()
    .withItemResponse(trap.createResponse('x'))
    .withItemResponse(check.createResponse('x'))
    .toPrefilledUrl();
  const ids = (prefilled.match(/entry\.\d+/g) || []);
  if (ids.length !== 2) throw new Error('Expected 2 entry ids, got: ' + prefilled);
  Logger.log('Add these to lovedTheBook.noteForm.fields in src/data/site.ts:\n' +
    "  trap: '" + ids[0] + "', check: '" + ids[1] + "'");
}

// Returns the reason a note looks like spam, or '' if it looks like a reader.
function spamReason_(answers) {
  if (String(answers[TRAP_TITLE] || '').trim()) return 'hidden field filled';
  const check = String(answers[CHECK_TITLE] || '').trim();
  const m = check.match(/^v1\.(\d+)$/);
  if (!m) return 'not sent from the website form';
  if (Number(m[1]) < MIN_SECONDS) return 'sent ' + m[1] + 's after the page loaded';

  const note = String(answers['Your note'] || '');
  const name = String(answers['Your name'] || '').trim();
  const reasons = [];
  let score = 0;
  const words = note.match(/[a-z]+/gi) || [];
  const longWords = words.filter((w) => w.length > 11).length;
  // Keyboard-mash text: a run of 6+ consonants is near-certain; mostly very long
  // "words" is only a hint, since short real notes can be ("Extraordinarily
  // atmospheric").
  if (/[bcdfghjklmnpqrstvwxyz]{6,}/i.test(note)) {
    score += 2; reasons.push('gibberish text');
  } else if (words.length && longWords / words.length >= 0.5) {
    score += 1; reasons.push('mostly very long words');
  }
  if (/https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|info|ru|xyz|top|biz)\b/i.test(note)) {
    score += 1; reasons.push('link in note');
  }
  // Generated names such as "LeonardstomeBJ": one word ending in two capitals.
  if (/^[A-Z][a-z]{3,}[A-Z]{2,}$/.test(name)) { score += 1; reasons.push('bot-style name'); }
  return score >= 2 ? reasons.join(', ') : '';
}

// Writes the spam reason next to the response's row in the linked Sheet.
function markSpam_(form, reason) {
  try {
    const sheet = SpreadsheetApp.openById(form.getDestinationId()).getSheets()[0];
    const lastCol = sheet.getLastColumn();
    const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    let col = headers.indexOf('Spam filter') + 1;
    if (!col) { col = lastCol + 1; sheet.getRange(1, col).setValue('Spam filter'); }
    sheet.getRange(sheet.getLastRow(), col).setValue(reason);
  } catch (err) { /* the note is still in the Sheet; only the label is missing */ }
}

// Runs on every new note: emails it, with Reply going to the reader when they
// left an address. Notes that look like spam are labelled in the Sheet instead.
function emailNote(e) {
  const answers = {};
  e.response.getItemResponses().forEach((r) => { answers[r.getItem().getTitle()] = r.getResponse(); });
  const spam = spamReason_(answers);
  if (spam) return markSpam_(e.source, 'Spam: ' + spam);
  const name = answers['Your name'] || 'A reader';
  const town = answers['Town'] || '';
  const from = String(answers['Email'] || '').trim();
  const ok = Array.isArray(answers['OK to quote']) && answers['OK to quote'].indexOf(OK_TO_QUOTE) !== -1;

  const to = [Session.getEffectiveUser().getEmail()].concat(NOTIFY).filter(Boolean).join(',');
  const body = [
    answers['Your note'] || '',
    '',
    '- ' + name + (town ? ', ' + town : ''),
    'Email: ' + (from || 'not given'),
    'OK to quote on the website: ' + (ok ? 'YES' : 'no'),
    '',
    'Sent from the "Send Geri a Note" form on riverofreticence.com.',
  ].join('\n');

  const message = {
    to: to,
    subject: 'New note from ' + name + (town ? ' (' + town + ')' : '') + ' - River of Reticence',
    body: body,
    name: 'River of Reticence website',
  };
  if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(from)) message.replyTo = from;
  MailApp.sendEmail(message);
}
