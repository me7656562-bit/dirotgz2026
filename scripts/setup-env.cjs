/**
 * יוצר/מעדכן .env: AUTH_SECRET אוטומטי, שאר הערכים נשמרים אם כבר מילאתם.
 */
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const envExample = path.join(root, ".env.example");
const envPath = path.join(root, ".env");

const defaultPostgresLocal =
  'DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/dirotgz?schema=public"';

/** אם נשאר SQLite ישן — מחליפים לכתובת Docker מקומית */
function ensurePostgresDatabaseUrl(content) {
  const lines = content.split(/\r?\n/);
  let changed = false;
  const out = lines.map((line) => {
    if (/^DATABASE_URL\s*=/.test(line) && /file:/.test(line)) {
      changed = true;
      return defaultPostgresLocal;
    }
    return line;
  });
  return { content: out.join("\n"), changed };
}

function ensureAuthSecret(content) {
  const secret = crypto.randomBytes(32).toString("base64url");
  const lines = content.split(/\r?\n/);
  let idx = -1;
  let hasValue = false;
  for (let i = 0; i < lines.length; i++) {
    if (/^AUTH_SECRET\s*=/.test(lines[i])) {
      idx = i;
      const v = lines[i].replace(/^AUTH_SECRET\s*=\s*/, "").trim();
      if (v.length > 0) hasValue = true;
      break;
    }
  }
  if (hasValue) return { content, changed: false };
  if (idx >= 0) {
    lines[idx] = `AUTH_SECRET=${secret}`;
    return { content: lines.join("\n"), changed: true };
  }
  const sep = content.endsWith("\n") ? "" : "\n";
  return { content: `${content}${sep}AUTH_SECRET=${secret}\n`, changed: true };
}

function readInitial() {
  if (fs.existsSync(envPath)) {
    return { raw: fs.readFileSync(envPath, "utf8"), fromExisting: true };
  }
  if (!fs.existsSync(envExample)) {
    console.error("Missing .env.example — cannot bootstrap.");
    process.exit(1);
  }
  return { raw: fs.readFileSync(envExample, "utf8"), fromExisting: false };
}

const { raw, fromExisting } = readInitial();
const afterSecret = ensureAuthSecret(raw);
const afterDb = ensurePostgresDatabaseUrl(afterSecret.content);
const finalContent = afterDb.content;
const anyChange = afterSecret.changed || afterDb.changed || !fromExisting;

if (anyChange) {
  fs.writeFileSync(envPath, finalContent, "utf8");
  if (!fromExisting) console.log("נוצר .env מתוך .env.example + AUTH_SECRET.");
  else {
    if (afterSecret.changed) console.log("עודכן .env (הוגדר AUTH_SECRET).");
    if (afterDb.changed) {
      console.log("עודכן DATABASE_URL ל-PostgreSQL (היה SQLite).");
      console.log("הריצו: npm run db:up   (דורש Docker Desktop)");
    }
  }
} else {
  console.log(".env כבר מעודכן — לא שיניתי.");
}

console.log("");
console.log("מסד נתונים: npm run db:up   ואז: npm run go");
console.log("להתחברות עם גוגל: מלאו AUTH_GOOGLE_ID ו־AUTH_GOOGLE_SECRET ב־.env (פעם אחת).");
