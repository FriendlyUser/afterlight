// Browser file helpers: save a text file to the player's downloads, and let the
// player pick a text file to read back. Used for exporting / importing saves.

/** Download `text` as a file called `name`. */
export function downloadText(name, text, type = 'application/json') {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Whether the page may open a file picker right now. Browsers only allow it shortly
 * after a keyboard or mouse action (gamepad buttons don't count).
 */
export function canPickFile() {
  return navigator.userActivation ? navigator.userActivation.isActive : true;
}

/** Ask the player for a file; resolves with its text, or null if they cancel. */
export function pickTextFile(accept = '.json,application/json') {
  return new Promise((resolve) => {
    const input = Object.assign(document.createElement('input'), { type: 'file', accept });
    input.style.display = 'none';
    const finish = (value) => { input.remove(); resolve(value); };
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) return finish(null);
      file.text().then(finish, () => finish(null));
    });
    input.addEventListener('cancel', () => finish(null));
    document.body.appendChild(input);
    input.click();
  });
}
