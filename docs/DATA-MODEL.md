# Data model

Everything lives in one Google Sheet (the "master" spreadsheet), plus one
auto-generated read/comment-only sheet per team.

## `Volunteers` (master record)

| Column | Notes |
|---|---|
| ID | UUID, generated automatically |
| Timestamp | When they registered |
| Full Name | |
| Email | |
| Phone | |
| Availability | Free text (days/times) |
| Skills / Interests | Free text |
| Preferred Team | What they picked on the form |
| How Heard About Us | Free text |
| Status | One of: New, Contacted, Interviewing, Allocated, Active, On Hold, Inactive, Declined |
| Assigned Team | Set when allocated |
| Assigned Manager Email | Looked up from the `Teams` sheet |
| Last Contacted | Manually updated by whoever follows up |
| Next Follow-Up Due | Drives the daily reminder automation |
| Follow-Up Notes | Free text |
| Milestone Stage | One of: Registered, Contacted, Interviewed, Allocated, Onboarded, Active |
| Milestone Date | Date of the last milestone change |
| Notes | Free text |

Status and Milestone Stage are dropdown-validated (see `SheetSetup.gs`).

## `Teams`

| Column | Notes |
|---|---|
| Team Name | Must match the values offered on the registration form and used for allocation |
| Manager Name | |
| Manager Email | Receives new-interest, follow-up, and allocation notifications for this team |
| Description | Free text |
| Team View Sheet URL | Filled in automatically by "Sync Team Views" |

Populate this sheet **before** running "Create Registration Form" and
"Sync Team Views" so the team dropdown and manager views are correct.

## `Follow-Up Log`

Append-only audit trail: every reminder sent and every manual allocation,
one row per event (`Timestamp`, `Volunteer ID`, `Volunteer Name`, `Action`,
`Notes`, `Performed By`).

## `Milestone Log`

Append-only history of every milestone transition (`Timestamp`,
`Volunteer ID`, `Volunteer Name`, `From Stage`, `To Stage`, `Notes`) — this
is your progress-tracking timeline per volunteer.

## Per-team views

`syncTeamViews()` creates a separate Google Sheet per team named
`"<Charity> Volunteers – <Team>"`, containing a live `QUERY(IMPORTRANGE(...))`
formula filtered to that team's rows, and shares it with the team's manager
as a **commenter**. Managers can see and discuss their own volunteers without
being able to edit the master data.
