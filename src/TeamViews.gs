/**
 * Gives each team's manager a live, filtered view of only their team's
 * volunteers, shared with "commenter" access so they can discuss
 * candidates without being able to edit the master sheet.
 */
function syncTeamViews() {
  const ss = getSpreadsheet_();
  const teamsSheet = ss.getSheetByName(SHEET_TEAMS);
  if (!teamsSheet || teamsSheet.getLastRow() < 2) {
    SpreadsheetApp.getUi().alert('Add teams (name + manager email) to the Teams sheet first.');
    return;
  }

  const teams = teamsSheet.getRange(2, 1, teamsSheet.getLastRow() - 1, TEAMS_HEADERS.length).getValues();
  const masterId = ss.getId();
  let created = 0;

  teams.forEach((row, i) => {
    const [teamName, managerName, managerEmail, description, existingUrl] = row;
    if (!teamName || !managerEmail) return;
    if (existingUrl) return; // already synced; re-run after clearing the URL cell to recreate

    const teamSpreadsheet = SpreadsheetApp.create(`${CHARITY_NAME} Volunteers – ${teamName}`);
    const sheet = teamSpreadsheet.getSheets()[0];
    sheet.setName(teamName);
    sheet.getRange(1, 1, 1, VOLUNTEERS_HEADERS.length).setValues([VOLUNTEERS_HEADERS]).setFontWeight('bold');

    const teamCol = COL['Assigned Team']; // used to build the QUERY's Col reference below
    const formula = `=QUERY(IMPORTRANGE("${masterId}", "${SHEET_VOLUNTEERS}!A2:R"), "select * where Col${teamCol} = '${teamName}'", 0)`;
    sheet.getRange(2, 1).setFormula(formula);

    DriveApp.getFileById(teamSpreadsheet.getId()).addCommenter(managerEmail);

    teamsSheet.getRange(i + 2, 5).setValue(teamSpreadsheet.getUrl());
    created++;
  });

  SpreadsheetApp.getUi().alert(
    `Team views synced. ${created} new team sheet(s) created and shared as commenter.\n\n` +
    `Note: the first time IMPORTRANGE runs in each new sheet, open it and click ` +
    `"Allow access" to connect it to the master spreadsheet.`
  );
}
