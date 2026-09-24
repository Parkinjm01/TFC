/**
 * Allocation of a volunteer to a team/activity.
 */
function showAllocationSidebar() {
  const row = getSelectedVolunteerRow_();
  if (!row) return;
  const html = HtmlService.createTemplateFromFile('AllocationSidebar');
  html.rowNum = row.rowNum;
  html.name = row.name;
  html.teams = getTeamNames_();
  SpreadsheetApp.getUi().showSidebar(html.evaluate().setTitle('Allocate Volunteer'));
}

function allocateVolunteer(rowNum, teamName) {
  const sheet = getSheet_(SHEET_VOLUNTEERS);
  const managerEmail = getManagerEmailForTeam_(teamName);
  const name = sheet.getRange(rowNum, COL['Full Name']).getValue();
  const email = sheet.getRange(rowNum, COL['Email']).getValue();
  const currentStage = sheet.getRange(rowNum, COL['Milestone Stage']).getValue();
  const id = sheet.getRange(rowNum, COL['ID']).getValue();

  sheet.getRange(rowNum, COL['Assigned Team']).setValue(teamName);
  sheet.getRange(rowNum, COL['Assigned Manager Email']).setValue(managerEmail);
  sheet.getRange(rowNum, COL['Status']).setValue(STATUS.ALLOCATED);
  sheet.getRange(rowNum, COL['Milestone Stage']).setValue('Allocated');
  sheet.getRange(rowNum, COL['Milestone Date']).setValue(new Date());

  logMilestone_(id, name, currentStage, 'Allocated', `Allocated to ${teamName}`);
  logFollowUp_(id, name, 'Allocated', `Assigned to team: ${teamName}`, Session.getActiveUser().getEmail());

  sendAllocationConfirmationEmail_(email, name, teamName);
  if (managerEmail) notifyManagerOfAllocation_(managerEmail, name, teamName);

  return `${name} allocated to ${teamName}.`;
}
