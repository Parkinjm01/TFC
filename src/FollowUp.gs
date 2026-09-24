/**
 * Follow-up management: scans the Volunteers sheet daily for anyone whose
 * "Next Follow-Up Due" date has passed and reminds the assigned manager
 * (falling back to the default coordinator).
 */
function checkFollowUps() {
  const sheet = getSheet_(SHEET_VOLUNTEERS);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const data = sheet.getRange(2, 1, lastRow - 1, VOLUNTEERS_HEADERS.length).getValues();
  const today = stripTime_(new Date());
  const skipStatuses = [STATUS.ACTIVE, STATUS.INACTIVE, STATUS.DECLINED];
  let remindersSent = 0;

  data.forEach((row, i) => {
    const status = row[COL['Status'] - 1];
    const dueRaw = row[COL['Next Follow-Up Due'] - 1];
    if (!dueRaw || skipStatuses.includes(status)) return;

    const due = stripTime_(new Date(dueRaw));
    if (due > today) return;

    const rowNum = i + 2;
    const id = row[COL['ID'] - 1];
    const name = row[COL['Full Name'] - 1];
    const email = row[COL['Email'] - 1];
    const manager = row[COL['Assigned Manager Email'] - 1] || DEFAULT_COORDINATOR_EMAIL;

    sendFollowUpReminderEmail_(manager, name, email, status, due);
    logFollowUp_(id, name, 'Reminder sent', `Follow-up reminder emailed to ${manager}`, 'Automation');

    // Push the due date forward so this row doesn't re-fire daily; the
    // coordinator can pull it back in after they actually make contact.
    sheet.getRange(rowNum, COL['Next Follow-Up Due']).setValue(addDays_(today, FOLLOW_UP_DAYS));
    remindersSent++;
  });

  if (remindersSent > 0) Logger.log(`Sent ${remindersSent} follow-up reminder(s).`);
}

function stripTime_(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function logFollowUp_(id, name, action, notes, performedBy) {
  getSheet_(SHEET_FOLLOWUP_LOG).appendRow([new Date(), id, name, action, notes, performedBy]);
}
