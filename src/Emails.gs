/**
 * Email notifications sent at each stage of the volunteer lifecycle.
 * Uses MailApp (simple quota, no extra OAuth scopes needed) rather than
 * GmailApp.
 */
function sendVolunteerConfirmationEmail_(email, name) {
  if (!email) return;
  const subject = `Thanks for your interest in volunteering with ${CHARITY_NAME}!`;
  const body = `Hi ${name || 'there'},\n\n` +
    `Thank you for registering your interest in volunteering with ${CHARITY_NAME}. ` +
    `We've received your details and someone from our team will be in touch within a few days.\n\n` +
    `In the meantime, if you have any questions, just reply to this email.\n\n` +
    `Warm regards,\n${CHARITY_NAME} Volunteering Team`;
  MailApp.sendEmail(email, subject, body);
}

function notifyCoordinatorOfNewInterest_(name, email, preferredTeam, managerEmail) {
  const recipient = managerEmail || DEFAULT_COORDINATOR_EMAIL;
  if (!recipient) return;
  const subject = `New volunteer interest: ${name}`;
  const body = `${name} (${email}) has registered interest in volunteering` +
    (preferredTeam ? ` for ${preferredTeam}` : '') + `.\n\n` +
    `Please follow up and update their record in the Volunteers sheet.\n\n${getSpreadsheet_().getUrl()}`;
  MailApp.sendEmail(recipient, subject, body);
}

function sendFollowUpReminderEmail_(managerEmail, name, volunteerEmail, status, dueDate) {
  if (!managerEmail) return;
  const subject = `Follow-up due: ${name} (${status})`;
  const body = `${name} (${volunteerEmail}) is due for follow-up ` +
    `(was due ${Utilities.formatDate(dueDate, Session.getScriptTimeZone(), 'yyyy-MM-dd')}).\n\n` +
    `Current status: ${status}\n\n` +
    `Update their record here: ${getSpreadsheet_().getUrl()}`;
  MailApp.sendEmail(managerEmail, subject, body);
}

function sendAllocationConfirmationEmail_(email, name, teamName) {
  if (!email) return;
  const subject = `You've been allocated to ${teamName}!`;
  const body = `Hi ${name},\n\nGreat news — you've been allocated to the ${teamName} team at ${CHARITY_NAME}. ` +
    `The team lead will be in touch shortly with next steps.\n\n` +
    `Thanks again for volunteering with us!\n\n${CHARITY_NAME} Volunteering Team`;
  MailApp.sendEmail(email, subject, body);
}

function notifyManagerOfAllocation_(managerEmail, name, teamName) {
  const subject = `New volunteer allocated to ${teamName}: ${name}`;
  const body = `${name} has been allocated to your team (${teamName}). ` +
    `Their full record is in the Volunteers sheet:\n\n${getSpreadsheet_().getUrl()}`;
  MailApp.sendEmail(managerEmail, subject, body);
}

function sendMilestoneUpdateEmail_(email, name, newStage) {
  if (!email) return;
  if (!['Onboarded', 'Active'].includes(newStage)) return; // only email the volunteer for milestones that matter to them
  const subject = `Update on your volunteering with ${CHARITY_NAME}`;
  const body = `Hi ${name},\n\nJust a quick update — your volunteering status has moved to "${newStage}". ` +
    `Thank you for everything you're doing with us!\n\n${CHARITY_NAME} Volunteering Team`;
  MailApp.sendEmail(email, subject, body);
}
