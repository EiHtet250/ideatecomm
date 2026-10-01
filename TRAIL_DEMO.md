# Discovery Trail trial

The visitor home page has separate **Discovery Trail** and **Toy Game** cards. Discovery Trail opens `/visitor/trail`, which is currently a placeholder. Toy Game opens `/visitor/game` and runs **The Toy Time Machine**: visitors repair three dials—Launch, Direction, Home. Each dial is one game and contains five questions, for fifteen total. A new run selects four or five toys per level, asks no toy more than twice, includes all four formats (find and scan, multiple choice, fill in a fact, and type the toy name), and randomly chooses the fifth format. All three levels use MINT's **Outerspace collection**. The exact physical floor and display positions are deliberately unset.

## Visitor flow

1. See a photo clue and find the toy.
2. Each level asks five questions across four or five randomly selected toys. Question order and format assignments are randomized for a new run and saved with progress.
3. Scan the toy's QR, select a multiple-choice answer, type its name, or fill in a missing fact. An unrelated QR does not count.
4. Complete all five questions on a level to receive its stamp. Three stamps unlock **20 points total** and a sample Toy Time Keeper badge. Points are derived from progress, so repeated answers cannot add more points. The points and stamps also appear in a lavender card on `/visitor/profile`.

The three game entries and candidate question formats are in `src/data/trailStops.ts`. Three real exhibits and two fictional demo toys provide the question content. Replace the demo toys with approved museum exhibits before an on-site trial. Edit the question bank to change prompts, choices, formats, and accepted answers. Keep question IDs unique. All three levels use the Outerspace collection.

## Content to prepare with the museum

- The three real exhibits use images published on MINT's site. They need internet access and may change or fail to load; the game shows a fallback if that happens. Before an on-site trial, get approved image files, put them under `public/toys/`, and replace each real exhibit's `imageUrl` in `src/data/exhibits.ts`, for example with `/toys/moon-rocket.jpg`.
- Confirm each toy is on the same physical level and note its actual position. Add those locations only after checking the floor plan.
- Confirm the exact wording on each physical display label. The demo facts come from [MINT's Outerspace collection page](https://emint.com/outerspace/), but its web text may differ from the labels beside the toys. Adjust each fill-in-the-blank question accordingly.
- Create one unique QR per real toy. For example, the Moon Rocket QR destination would be `https://YOUR-DOMAIN/visitor/game?scan=MINT-SPACE-001`. Demo toy identifiers are in `src/services/trailGame.ts`. The QR should open the app in the same browser used for the game.
- Decide whether the final 20 points are only a digital achievement or can be redeemed. If redeemable, have a server record completion once per visitor instead of trusting the browser's local storage.

The `Scan the correct toy` and `Scan a different toy` buttons are demo controls. A real installation can remove them after the physical QRs have been tested. The demo exhibit-information panel lets reviewers try the questions without standing at the display; remove it when using confirmed physical labels.

## Run and verify

Install packages with `npm ci` if needed, then run `npm run dev` and open `/visitor`. Click **Open Toy Game** to play and the profile badge to see points. Run `npm run build` to check TypeScript and generate the production bundle. The original ZIP and its environment file were left untouched; this working copy has no `.env.local`, so integrations that need secrets must be configured separately.

The prototype creates a local **Demo Visitor** record (`demo-visitor-001`) with randomized question IDs, completed question IDs, collected stamps, and points in browser storage. It also imports progress from the previous trial if present. It validates names with case, punctuation, and dash variations ignored. QR codes require an exact identifier. The account is a demo record, not login or server storage; it is suitable for trying the flow, not for protecting valuable rewards.
