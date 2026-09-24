# Setup guide

## 1. Create the master spreadsheet

Create a new Google Sheet (e.g. "TFC Volunteers"). This becomes your single
source of truth.

## 2. Add the Apps Script project

Open **Extensions > Apps Script** from the sheet.

**Option A — copy/paste (no tooling required):**
Delete the default `Code.gs`, then create each file listed under `src/` in
this repo (matching filenames, including the `.html` files) and paste in its
contents. Also replace the manifest: click the gear icon > show
`appsscript.json` in the editor, and paste in `src/appsscript.json`.

**Option B — [clasp](https://github.com/google/clasp) (recommended if you're
comfortable with the command line):**

```
npm install
npx clasp login
cp .clasp.json.example .clasp.json   # then edit scriptId
npx clasp push
```

To get a `scriptId`: in the Apps Script editor, **Project Settings** shows
it, or `npx clasp create --title "TFC Volunteers" --type sheets` from this
repo will create a fresh bound script and write `.clasp.json` for you
(reopen your existing spreadsheet's script instead if you already made one
in step 2).

## 3. Configure

Edit `Config.gs` in the Apps Script editor (or `src/Config.gs` locally +
`clasp push`):

- `DEFAULT_COORDINATOR_EMAIL` — fallback recipient for new-interest and
  follow-up emails when a volunteer has no team/manager yet.
- `CHARITY_NAME` — used in emails and the dashboard title.
- `FOLLOW_UP_DAYS` — how many days after registration (or after a reminder)
  before the next follow-up is due.

Also set your timezone in the manifest (`appsscript.json` → `timeZone`), e.g.
`"Europe/London"`.

## 4. Initialize the spreadsheet

Reload the spreadsheet, then use the new **TFC Volunteers** menu (appears
after a few seconds; you'll be asked to authorize the script the first time)
→ **Initialize Spreadsheet**. This creates the `Volunteers`, `Teams`,
`Follow-Up Log`, and `Milestone Log` tabs with headers and validation.

## 5. Add your teams

Fill in the `Teams` sheet: `Team Name`, `Manager Name`, `Manager Email`,
`Description`. Do this before the next two steps so the registration form's
team dropdown and manager notifications are correct.

## 6. Create the public registration form

Menu → **Create Registration Form**. This creates a Google Form (title,
description, and fields wired to your team list), links it to the
spreadsheet, and installs the submit trigger. Copy the public link from the
confirmation dialog and share it (charity website, social media, posters,
etc.).

## 7. Turn on automation

Menu → **Install Automation Triggers**. This installs a daily 8am check for
overdue follow-ups. (The form-submission trigger from step 6 is already
active.)

## 8. Share team views with managers

Menu → **Sync Team Views**. For each team with a manager email, this creates
a separate spreadsheet showing only that team's volunteers (live-updating)
and shares it with the manager as a commenter, so they can see and discuss
their own candidates without touching the master sheet.

The first time each new team sheet loads its `IMPORTRANGE` formula, open it
once and click **Allow access** to connect it to the master spreadsheet.

## 9. Deploy the coordinator dashboard

In the Apps Script editor: **Deploy > New deployment**, type **Web app**,
execute as **Me**, access to whoever should see it (e.g. "Anyone within
[your domain]"). Share the resulting URL with coordinators — it shows live
counts by status and team, plus how many follow-ups are overdue.

## Day-to-day use

- **New interest** comes in automatically via the form; the volunteer and
  the default coordinator (or team manager, if they picked a team) get an
  email.
- **Follow-up**: update `Status`, `Last Contacted`, and `Next Follow-Up Due`
  as you work a volunteer through the pipeline. The daily job emails a
  reminder to the assigned manager for anything overdue.
- **Allocation**: select a volunteer's row on the `Volunteers` sheet, then
  menu → **Allocate Selected Volunteer…**, pick a team. This updates their
  record, logs it, and emails both the volunteer and the team manager.
- **Milestones**: select a row, menu → **Advance Milestone for Selected
  Volunteer…**, pick the new stage. Logged to `Milestone Log`; reaching
  "Onboarded" or "Active" also emails the volunteer.
