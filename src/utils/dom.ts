export function getInputValue(sel: string) {
  const el = document.querySelector(sel) as HTMLInputElement;
  return el ? el.value : ''
}

