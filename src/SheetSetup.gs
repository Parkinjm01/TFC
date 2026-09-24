/**
 * One-time (and re-runnable) initialization of the spreadsheet:
 * creates tabs, headers, and data validation.
 */
function initializeSpreadsheet() {
  const ss = getSpreadsheet_();

  const volunteers = ss.getSheetByName(SHEET_VOLUNTEERS) || ss.insertSheet(SHEET_VOLUNTEERS);
  setHeaders_(volunteers, VOLUNTEERS_HEADERS);
  applyVolunteerValidation_(volunteers);

  const teams = ss.getSheetByName(SHEET_TEAMS) || ss.insertSheet(SHEET_TEAMS);
  setHeaders_(teams, TEAMS_HEADERS);

  const followUp = ss.getSheetByName(SHEET_FOLLOWUP_LOG) || ss.insertSheet(SHEET_FOLLOWUP_LOG);
  setHeaders_(followUp, FOLLOWUP_LOG_HEADERS);

  const milestoneLog = ss.getSheetByName(SHEET_MILESTONE_LOG) || ss.insertSheet(SHEET_MILESTONE_LOG);
  setHeaders_(milestoneLog, MILESTONE_LOG_HEADERS);

  const defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && ss.getSheets().length > 1) {
    ss.deleteSheet(defaultSheet);
  }

  SpreadsheetApp.getUi().alert(
    'Spreadsheet initialized.\n\nNext steps:\n' +
    '1. Add your teams + manager emails to the "Teams" tab.\n' +
    '2. Menu > Create Registration Form.\n' +
    '3. Menu > Install Automation Triggers.'
  );
}

function setHeaders_(sheet, headers) {
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#4a6fa5')
    .setFontColor('#ffffff');
  sheet.autoResizeColumns(1, headers.length);
}

function applyVolunteerValidation_(sheet) {
  const maxRows = 1000;

  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(STATUS_VALUES, true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, COL['Status'], maxRows, 1).setDataValidation(statusRule);

  const milestoneRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(MILESTONE_STAGES, true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, COL['Milestone Stage'], maxRows, 1).setDataValidation(milestoneRule);

  sheet.getRange(2, COL['Timestamp'], maxRows, 1).setNumberFormat('yyyy-mm-dd hh:mm');
  sheet.getRange(2, COL['Last Contacted'], maxRows, 1).setNumberFormat('yyyy-mm-dd');
  sheet.getRange(2, COL['Next Follow-Up Due'], maxRows, 1).setNumberFormat('yyyy-mm-dd');
  sheet.getRange(2, COL['Milestone Date'], maxRows, 1).setNumberFormat('yyyy-mm-dd');
}
