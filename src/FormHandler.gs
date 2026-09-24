/**
 * Registration of interest: creates the public Google Form and handles
 * each submission by writing a new row into the Volunteers sheet.
 */
function createRegistrationForm() {
  const ss = getSpreadsheet_();
  const form = FormApp.create(`${CHARITY_NAME} – Volunteer Registration of Interest`);
  form.setDescription(
    `Thanks for your interest in volunteering with ${CHARITY_NAME}! ` +
    `Tell us a bit about yourself and we'll be in touch.`
  );
  form.setCollectEmail(false);

  form.addTextItem().setTitle('Full Name').setRequired(true);
  form.addTextItem().setTitle('Email').setRequired(true);
  form.addTextItem().setTitle('Phone');
  form.addParagraphTextItem().setTitle('Availability (days/times)');
  form.addParagraphTextItem().setTitle('Skills / Interests');

  const teamNames = getTeamNames_();
  form.addListItem()
    .setTitle('Preferred Team')
    .setChoiceValues(teamNames.length ? teamNames.concat('Not sure yet') : ['Not sure yet']);

  form.addTextItem().setTitle('How Heard About Us');

  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  removeTrigger_('onVolunteerFormSubmit');
  ScriptApp.newTrigger('onVolunteerFormSubmit')
    .forForm(form)
    .onFormSubmit()
    .create();

  const props = PropertiesService.getScriptProperties();
  props.setProperty('REGISTRATION_FORM_URL', form.getPublishedUrl());
  props.setProperty('REGISTRATION_FORM_EDIT_URL', form.getEditUrl());

  SpreadsheetApp.getUi().alert(
    'Form created!\n\nPublic link (share this with prospective volunteers):\n' + form.getPublishedUrl()
  );
}

function onVolunteerFormSubmit(e) {
  const responses = e.namedValues;
  const get = (key) => (responses[key] && responses[key][0]) ? responses[key][0] : '';

  const id = Utilities.getUuid();
  const now = new Date();
  const fullName = get('Full Name');
  const email = get('Email');
  const preferredTeam = get('Preferred Team');
  const assignedManager = getManagerEmailForTeam_(preferredTeam);

  const row = [];
  row[COL['ID'] - 1] = id;
  row[COL['Timestamp'] - 1] = now;
  row[COL['Full Name'] - 1] = fullName;
  row[COL['Email'] - 1] = email;
  row[COL['Phone'] - 1] = get('Phone');
  row[COL['Availability'] - 1] = get('Availability (days/times)');
  row[COL['Skills / Interests'] - 1] = get('Skills / Interests');
  row[COL['Preferred Team'] - 1] = preferredTeam;
  row[COL['How Heard About Us'] - 1] = get('How Heard About Us');
  row[COL['Status'] - 1] = STATUS.NEW;
  row[COL['Assigned Team'] - 1] = '';
  row[COL['Assigned Manager Email'] - 1] = assignedManager;
  row[COL['Last Contacted'] - 1] = '';
  row[COL['Next Follow-Up Due'] - 1] = addDays_(now, FOLLOW_UP_DAYS);
  row[COL['Follow-Up Notes'] - 1] = '';
  row[COL['Milestone Stage'] - 1] = 'Registered';
  row[COL['Milestone Date'] - 1] = now;
  row[COL['Notes'] - 1] = '';

  getSheet_(SHEET_VOLUNTEERS).appendRow(row);
  logMilestone_(id, fullName, '', 'Registered', 'Auto-logged on form submission');

  sendVolunteerConfirmationEmail_(email, fullName);
  notifyCoordinatorOfNewInterest_(fullName, email, preferredTeam, assignedManager);
}

function addDays_(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function getTeamNames_() {
  const sheet = getSpreadsheet_().getSheetByName(SHEET_TEAMS);
  if (!sheet || sheet.getLastRow() < 2) return [];
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues().flat().filter(String);
}

function getManagerEmailForTeam_(teamName) {
  if (!teamName) return '';
  const sheet = getSpreadsheet_().getSheetByName(SHEET_TEAMS);
  if (!sheet || sheet.getLastRow() < 2) return '';
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 3).getValues();
  const match = data.find(r => r[0] === teamName);
  return match ? match[2] : '';
}

function removeTrigger_(handlerName) {
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === handlerName) ScriptApp.deleteTrigger(t);
  });
}
