function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('TFC Volunteers')
    .addItem('Initialize Spreadsheet', 'initializeSpreadsheet')
    .addItem('Create Registration Form', 'createRegistrationForm')
    .addSeparator()
    .addItem('Install Automation Triggers', 'installTriggers')
    .addSeparator()
    .addItem('Allocate Selected Volunteer…', 'showAllocationSidebar')
    .addItem('Advance Milestone for Selected Volunteer…', 'showMilestoneSidebar')
    .addSeparator()
    .addItem('Sync Team Views (share with managers)', 'syncTeamViews')
    .addItem('Check Follow-Ups Now', 'checkFollowUps')
    .addToUi();
}
