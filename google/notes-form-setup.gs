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

// Runs on every new note: emails it, with Reply going to the reader when they
// left an address.
function emailNote(e) {
  const answers = {};
  e.response.getItemResponses().forEach((r) => { answers[r.getItem().getTitle()] = r.getResponse(); });
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
