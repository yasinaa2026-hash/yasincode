import { compileToHtml } from "../src/engine.js";

const example = `# My first YasinCode program
site "My first website"
heading "Welcome to YasinCode!"
text "I am building my own programming language."
button "Get started"
background "#eef3ff"
run`;

const arabicExample = `# مثال باللغة العربية
موقع "موقعي الأول"
عنوان "أهلاً بك في YasinCode"
نص "أنا أبني لغتي البرمجية الخاصة."
زر "ابدأ الآن"
خلفية "#eef3ff"
تشغيل`;

const editor = document.querySelector("#code");
const preview = document.querySelector("#preview");
const status = document.querySelector("#status");

editor.value = example;

function runProgram() {
  const result = compileToHtml(editor.value);
  if (result.errors.length > 0) {
    preview.srcdoc = "";
    status.className = "status error";
    status.textContent = result.errors
      .map((error) => `${error.line ? `Line ${error.line}: ` : "Program: "}${error.message}`)
      .join(" | ");
    return;
  }

  preview.srcdoc = result.html;
  status.className = "status success";
  status.textContent = `Success! YasinCode understood ${result.instructions.length} instruction(s).`;
}

document.querySelector("#run-button").addEventListener("click", runProgram);
document.querySelector("#reset-button").addEventListener("click", () => {
  editor.value = example;
  runProgram();
});

// Start with a working preview as soon as the playground opens.
runProgram();

// Keep the Arabic example available in the browser console for this early version.
window.yasinCodeArabicExample = arabicExample;
