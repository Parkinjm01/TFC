/**
 * Progress milestone tracking: advances a volunteer through the standard
 * pipeline (Registered -> Contacted -> Interviewed -> Allocated ->
 * Onboarded -> Active) and logs every change.
 */
function logMilestone_(id, name, fromStage, toStage, notes) {
  getSheet_(SHEET_MILESTONE_LOG).appendRow([new Date(), id, name, fromStage, toStage, notes || '']);
}

function showMilestoneSidebar() {
  const row = getSelectedVolunteerRow_();
  if (!row) return;
  const html = HtmlService.createTemplateFromFile('MilestoneSidebar');
  html.rowNum = row.rowNum;
  html.name = row.name;
  html.currentStage = row.milestoneStage;
  html.stages = MILESTONE_STAGES;
  SpreadsheetApp.getUi().showSidebar(html.evaluate().setTitle('Advance Milestone'));
}

function advanceMilestone(rowNum, newStage, notes) {
  const sheet = getSheet_(SHEET_VOLUNTEERS);
  const currentStage = sheet.getRange(rowNum, COL['Milestone Stage']).getValue();
  const id = sheet.getRange(rowNum, COL['ID']).getValue();
  const name = sheet.getRange(rowNum, COL['Full Name']).getValue();
  const email = sheet.getRange(rowNum, COL['Email']).getValue();

  sheet.getRange(rowNum, COL['Milestone Stage']).setValue(newStage);
  sheet.getRange(rowNum, COL['Milestone Date']).setValue(new Date());

  logMilestone_(id, name, currentStage, newStage, notes);

  if (newStage === 'Active') {
    sheet.getRange(rowNum, COL['Status']).setValue(STATUS.ACTIVE);
  }

  sendMilestoneUpdateEmail_(email, name, newStage);
  return `Updated ${name} to "${newStage}".`;
}

function getSelectedVolunteerRow_() {
  const sheet = getSheet_(SHEET_VOLUNTEERS);
  const active = SpreadsheetApp.getActiveSheet();
  if (active.getName() !== SHEET_VOLUNTEERS) {
    SpreadsheetApp.getUi().alert('Select a volunteer row on the Volunteers sheet first.');
    return null;
  }
  const rowNum = active.getActiveRange().getRow();
  if (rowNum < 2) {
    SpreadsheetApp.getUi().alert('Select a volunteer row (not the header row).');
    return null;
  }
  return {
    rowNum,
    name: sheet.getRange(rowNum, COL['Full Name']).getValue(),
    milestoneStage: sheet.getRange(rowNum, COL['Milestone Stage']).getValue()
  };
}
