# Classroom Analytics

A responsive student performance analytics dashboard for educators. Explore class-level trends, monitor a 24-student sample roster, review individual student profiles, and record classroom updates.

## Demo features

- Classroom overview with live KPIs, a performance and attendance chart, and students flagged for a check-in
- Searchable roster with class and support-status filters
- Click-through student profiles with performance indicators and a recent activity timeline
- Class comparison and student wellbeing reports
- Add assessments, attendance, assignments, and behavior notes
- CSV export of the currently filtered student roster
- Local browser storage for teacher-entered records
- Responsive navigation, accessible dialogs, and reduced-motion support

This is a portfolio demo. The roster and trend charts use illustrative sample data; record changes are stored in the current browser only. There is no sign-in, database, cross-device sync, or predictive model. Do not enter real or sensitive student information.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```

GitHub Actions runs these checks for pushes and pull requests to `main` and `master`.

## Deploy from GitHub to Vercel

1. Push this project to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import that GitHub repository.
3. Keep the detected **Next.js** framework settings and select **Deploy**.
4. Vercel builds the production deployment and gives you a public `*.vercel.app` URL. Subsequent pushes to the production branch trigger new deployments automatically.

No environment variables or external services are required for the demo. Add your final Vercel URL to the project section of your CV after deployment.
