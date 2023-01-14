function slugify(text) {
  let slugifiedText = text;
  const trMap = {
    çÇ: 'c',
    ğĞ: 'g',
    şŞ: 's',
    üÜ: 'u',
    ıİ: 'i',
    öÖ: 'o',
  };

  Object.keys(trMap).forEach((key) => {
    slugifiedText = slugifiedText.replace(new RegExp(`[${key}]`, 'g'), trMap[key]);
  });

  // for (const key in trMap) {
  //   text = text.replace(new RegExp('[' + key + ']', 'g'), trMap[key]);
  // }
  return text
    .replace(/[^-a-zA-Z0-9\s]+/gi, '') // remove non-alphanumeric chars
    .replace(/\s/gi, '-') // convert spaces to dashes
    .replace(/[-]+/gi, '-') // trim repeated dashes
    .toLowerCase();
}

module.exports = slugify;
