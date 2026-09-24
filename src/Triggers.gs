/**
 * Installs the time-driven trigger that powers automated follow-up
 * reminders. (The form-submission trigger is created automatically by
 * createRegistrationForm() in FormHandler.gs.)
 */
function installTriggers() {
  removeTrigger_('checkFollowUps');
  ScriptApp.newTrigger('checkFollowUps')
    .timeBased()
    .everyDays(1)
    .atHour(8)
    .create();

  SpreadsheetApp.getUi().alert(
    'Daily follow-up check installed (runs ~8am each day).\n\n' +
    'Note: the form-submission trigger is created automatically when you use "Create Registration Form".'
  );
}
