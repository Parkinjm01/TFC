/**
 * Central configuration for the volunteer management automation.
 * Edit the values below to match your charity's setup.
 */

// ---- Coordinator / defaults ----
const DEFAULT_COORDINATOR_EMAIL = 'volunteers@example-charity.org'; // TODO: set this
const CHARITY_NAME = 'Your Charity';                                // TODO: set this
const FOLLOW_UP_DAYS = 3; // days after registration (or after a reminder) before the next follow-up is due

// ---- Sheet / tab names ----
const SHEET_VOLUNTEERS = 'Volunteers';
const SHEET_TEAMS = 'Teams';
const SHEET_FOLLOWUP_LOG = 'Follow-Up Log';
const SHEET_MILESTONE_LOG = 'Milestone Log';

// ---- Volunteers sheet schema ----
const VOLUNTEERS_HEADERS = [
  'ID', 'Timestamp', 'Full Name', 'Email', 'Phone', 'Availability',
  'Skills / Interests', 'Preferred Team', 'How Heard About Us',
  'Status', 'Assigned Team', 'Assigned Manager Email',
  'Last Contacted', 'Next Follow-Up Due', 'Follow-Up Notes',
  'Milestone Stage', 'Milestone Date', 'Notes'
];

// 1-based column lookup, e.g. COL['Status']
const COL = VOLUNTEERS_HEADERS.reduce((map, name, i) => {
  map[name] = i + 1;
  return map;
}, {});

// ---- Teams sheet schema ----
const TEAMS_HEADERS = ['Team Name', 'Manager Name', 'Manager Email', 'Description', 'Team View Sheet URL'];

// ---- Status pipeline ----
const STATUS = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  INTERVIEWING: 'Interviewing',
  ALLOCATED: 'Allocated',
  ACTIVE: 'Active',
  ON_HOLD: 'On Hold',
  INACTIVE: 'Inactive',
  DECLINED: 'Declined'
};
const STATUS_VALUES = Object.values(STATUS);

// ---- Milestone pipeline ----
const MILESTONE_STAGES = ['Registered', 'Contacted', 'Interviewed', 'Allocated', 'Onboarded', 'Active'];

// ---- Log sheet schemas ----
const FOLLOWUP_LOG_HEADERS = ['Timestamp', 'Volunteer ID', 'Volunteer Name', 'Action', 'Notes', 'Performed By'];
const MILESTONE_LOG_HEADERS = ['Timestamp', 'Volunteer ID', 'Volunteer Name', 'From Stage', 'To Stage', 'Notes'];

function getSpreadsheet_() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

function getSheet_(name) {
  const sheet = getSpreadsheet_().getSheetByName(name);
  if (!sheet) throw new Error(`Sheet "${name}" not found. Run "TFC Volunteers > Initialize Spreadsheet" first.`);
  return sheet;
}
