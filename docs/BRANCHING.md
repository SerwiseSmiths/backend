# Backend – Branch strategy

## Remotes

- **origin:** https://github.com/SerwiseSmiths/backend.git

## Branches

| Branch        | Purpose                          | Default |
|---------------|----------------------------------|---------|
| **production** | Production code                  | Yes     |
| **pre-prod**  | Final staging before production  | No      |
| **development** | Core dev branch; merge features here | No   |

## Workflow

- Do feature work in branches (e.g. `feature/xyz`), then merge into **development**.
- When ready for staging, merge **development** → **pre-prod**.
- When ready for release, merge **pre-prod** → **production**.

## First-time setup (already done locally)

- Origin set to `https://github.com/SerwiseSmiths/backend.git`
- **main** renamed to **production**
- **pre-prod** and **development** created from **production**

After the first push, in GitHub: **Settings → General → Default branch** → set to **production**.
