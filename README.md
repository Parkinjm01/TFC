# TFC Volunteer Automation

Google Sheets + Apps Script automation for managing charity volunteers:
registration of interest, follow-up, allocation to teams/activities, and
progress milestone tracking — built on tools most small charities already
have (Google Workspace), no separate hosting required.

## What it does

- **Registration of interest** — a public Google Form feeds straight into a
  `Volunteers` sheet; each submission auto-emails a confirmation to the
  volunteer and notifies the relevant coordinator/manager.
- **Follow-up management** — a daily automated check emails a reminder to
  the assigned manager for any volunteer whose follow-up is overdue, and
  logs every reminder to a `Follow-Up Log`.
- **Allocation to a team/activity** — a sidebar in the spreadsheet lets a
  coordinator allocate a selected volunteer to a team; this updates their
  record and emails both the volunteer and the team's manager.
- **Progress milestone tracking** — volunteers move through a standard
  pipeline (Registered → Contacted → Interviewed → Allocated → Onboarded →
  Active), tracked via a sidebar and a full `Milestone Log` history.
- **Manager views** — each team manager gets their own live, filtered,
  comment-only spreadsheet showing just their team's volunteers, so they can
  discuss candidates without editing the master data.
- **Coordinator dashboard** — a small web app (deployed straight from Apps
  Script) showing live counts by status and team, and how many follow-ups
  are overdue.

## Structure

```
src/                   Apps Script project (push this to a bound script)
  Config.gs            Sheet names, columns, status/milestone pipelines, settings
  SheetSetup.gs         Creates tabs, headers, validation
  Menu.gs               Custom spreadsheet menu
  FormHandler.gs        Creates the registration form + handles submissions
  FollowUp.gs           Daily overdue-follow-up check + reminder emails
  Allocation.gs          Allocate a volunteer to a team
  Milestones.gs          Advance a volunteer's milestone stage
  TeamViews.gs           Per-team filtered, comment-only manager views
  Emails.gs              All outbound email templates
  Triggers.gs            Installs the time-driven automation trigger
  Dashboard.gs/.html     Web app dashboard
  AllocationSidebar.html Sidebar UI for allocation
  MilestoneSidebar.html  Sidebar UI for milestone updates
  appsscript.json        Apps Script manifest
docs/
  SETUP.md              Step-by-step setup instructions
  DATA-MODEL.md         Sheet/column reference
```

## Quick start

See [`docs/SETUP.md`](docs/SETUP.md) for the full walkthrough (create the
sheet, add the script, configure, initialize, create the form, turn on
automation, share manager views, deploy the dashboard).

## Why Apps Script + Sheets

This keeps everything in tools your team can already open, edit, and share
without new logins, hosting, or a database to maintain — while still giving
you real automation (triggers, emails, a dashboard) instead of a static
spreadsheet. If you outgrow it later, the `Volunteers` sheet is a clean,
exportable source of truth to migrate from.
