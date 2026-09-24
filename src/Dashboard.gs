/**
 * Coordinator dashboard, deployed as a web app (Deploy > New deployment >
 * Web app). Shows live counts pulled straight from the Volunteers sheet.
 */
function doGet() {
  const template = HtmlService.createTemplateFromFile('Dashboard');
  template.data = getDashboardData_();
  template.charityName = CHARITY_NAME;
  return template.evaluate()
    .setTitle(`${CHARITY_NAME} Volunteer Dashboard`)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getDashboardData_() {
  const sheet = getSheet_(SHEET_VOLUNTEERS);
  const lastRow = sheet.getLastRow();
  const byStatus = {};
  const byTeam = {};
  let overdue = 0;
  const today = stripTime_(new Date());
  const skipStatuses = [STATUS.ACTIVE, STATUS.INACTIVE, STATUS.DECLINED];

  if (lastRow >= 2) {
    const data = sheet.getRange(2, 1, lastRow - 1, VOLUNTEERS_HEADERS.length).getValues();
    data.forEach(row => {
      const status = row[COL['Status'] - 1] || 'Unknown';
      byStatus[status] = (byStatus[status] || 0) + 1;

      const team = row[COL['Assigned Team'] - 1] || 'Unassigned';
      byTeam[team] = (byTeam[team] || 0) + 1;

      const due = row[COL['Next Follow-Up Due'] - 1];
      if (due && stripTime_(new Date(due)) <= today && !skipStatuses.includes(status)) {
        overdue++;
      }
    });
  }

  return {
    total: lastRow > 1 ? lastRow - 1 : 0,
    byStatus,
    byTeam,
    overdue,
    generatedAt: new Date().toString()
  };
}
