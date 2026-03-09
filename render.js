(async function () {
  const res = await fetch('content.md');
  if (!res.ok) {
    document.getElementById('article').innerHTML = '<p>Article not found.</p>';
    return;
  }
  let md = await res.text();

  // Parse YAML frontmatter
  const meta = {};
  const fmMatch = md.match(/^---\n([\s\S]*?)\n---\n/);
  if (fmMatch) {
    md = md.slice(fmMatch[0].length);
    fmMatch[1].split('\n').forEach(line => {
      const idx = line.indexOf(':');
      if (idx > -1) {
        meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
      }
    });
  }

  // Build header from frontmatter
  const article = document.getElementById('article');
  let headerHtml = '';
  if (meta.title) {
    headerHtml += `<h2>${meta.title}</h2>`;
    document.title = meta.title;
  }
  if (meta.author) headerHtml += `<p class="author">${meta.author}</p>`;
  if (meta.email) headerHtml += `<p class="email"><a href="mailto:${meta.email}">${meta.email}</a></p>`;
  if (meta.date) headerHtml += `<p class="date">${meta.date}</p>`;

  // Render markdown
  article.innerHTML = headerHtml + marked.parse(md);

  // Fix relative image paths (assets/ stays relative, works as-is)

  // Render LaTeX with KaTeX
  renderMathInElement(article, {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$', right: '$', display: false },
      { left: '\\[', right: '\\]', display: true },
      { left: '\\(', right: '\\)', display: false },
    ],
    throwOnError: false,
  });
})();
