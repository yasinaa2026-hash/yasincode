/** YasinCode language engine, version 0.1.0.
 * Commands: site/موقع, heading/عنوان, text/نص, button/زر,
 * background/خلفية, run/تشغيل. Comments start with # or //.
 */

const COMMANDS = [
  { type: "site", pattern: /^(?:site|website|create\s+website|موقع|أنشئ\s+موقع|انشئ\s+موقع)\s+"([^"]*)"$/i },
  { type: "heading", pattern: /^(?:heading|title|add\s+heading|عنوان|أضف\s+عنوان|اضف\s+عنوان)\s+"([^"]*)"$/i },
  { type: "text", pattern: /^(?:text|paragraph|add\s+text|نص|أضف\s+نص|اضف\s+نص)\s+"([^"]*)"$/i },
  { type: "button", pattern: /^(?:button|add\s+button|زر|أضف\s+زر|اضف\s+زر)\s+"([^"]*)"$/i },
  { type: "background", pattern: /^(?:background|set\s+background|خلفية|اجعل\s+الخلفية)\s+"(#[0-9a-f]{3}(?:[0-9a-f]{3})?)"$/i },
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function parseYasin(source) {
  const instructions = [];
  const errors = [];
  const lines = String(source).replaceAll("\r\n", "\n").replaceAll("\r", "\n").split("\n");

  lines.forEach((rawLine, index) => {
    const lineNumber = index + 1;
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || line.startsWith("//")) return;
    if (/^(?:run|تشغيل)$/i.test(line)) return;

    let matched = false;
    for (const command of COMMANDS) {
      const result = line.match(command.pattern);
      if (result) {
        instructions.push({ type: command.type, value: result[1], line: lineNumber });
        matched = true;
        break;
      }
    }

    if (!matched) {
      errors.push({
        line: lineNumber,
        message: `Unknown or invalid command: "${line}". Check the spelling and quotation marks.`,
      });
    }
  });

  const sites = instructions.filter((item) => item.type === "site");
  if (sites.length === 0) {
    errors.push({ line: 0, message: 'Your program needs a site command, for example: site "My website".' });
  } else if (sites.length > 1) {
    errors.push({ line: sites[1].line, message: "Only one site command is allowed in this first version." });
  }

  return { instructions, errors };
}

export function compileToHtml(source) {
  const { instructions, errors } = parseYasin(source);
  if (errors.length > 0) return { html: "", errors, instructions };

  const siteTitle = instructions.find((item) => item.type === "site").value;
  const background = instructions.find((item) => item.type === "background")?.value ?? "#f4f7fb";

  const content = instructions
    .filter((item) => item.type !== "site" && item.type !== "background")
    .map((item) => {
      const text = escapeHtml(item.value);
      if (item.type === "heading") return `      <h1 dir="auto">${text}</h1>`;
      if (item.type === "text") return `      <p dir="auto">${text}</p>`;
      if (item.type === "button") return `      <button type="button" dir="auto">${text}</button>`;
      return "";
    })
    .join("\n");

  const safeTitle = escapeHtml(siteTitle);
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 32px 18px;
      background: ${background};
      color: #172033;
      font-family: Arial, Tahoma, sans-serif;
    }
    main {
      width: min(100%, 760px);
      padding: clamp(28px, 6vw, 64px);
      border-radius: 24px;
      background: #ffffff;
      box-shadow: 0 18px 60px rgba(25, 40, 70, .10);
      text-align: center;
    }
    h1 { margin: 0 0 18px; font-size: clamp(30px, 5vw, 48px); }
    p { color: #586174; font-size: 18px; line-height: 1.8; }
    button {
      margin-top: 14px;
      border: 0;
      border-radius: 12px;
      padding: 13px 24px;
      background: #315efb;
      color: white;
      font-size: 16px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <main>
${content}
  </main>
</body>
</html>
`;

  return { html, errors: [], instructions };
}
