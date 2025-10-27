// drafts.js - Local draft storage
let drafts = [];
let nextId = 1;

export function saveDraft(draft) {
  const id = draft.id || nextId++;
  const existingIndex = drafts.findIndex((d) => d.id === id);

  const draftToSave = {
    ...draft,
    id,
    savedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    drafts[existingIndex] = draftToSave;
  } else {
    drafts.push(draftToSave);
  }

  return draftToSave;
}

export function getDrafts() {
  return drafts;
}

export function getDraft(id) {
  return drafts.find((d) => d.id === id);
}

export function deleteDraft(id) {
  drafts = drafts.filter((d) => d.id !== id);
}

export function clearDrafts() {
  drafts = [];
  nextId = 1;
}
