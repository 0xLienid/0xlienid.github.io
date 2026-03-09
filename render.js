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

  // Protect math blocks from markdown parser by replacing with placeholders
  const mathBlocks = [];
  // Display math ($$...$$) - must come before inline
  md = md.replace(/\$\$([\s\S]*?)\$\$/g, (match, tex) => {
    mathBlocks.push({ tex: tex.trim(), display: true });
    return `\n\nMATHBLOCK_${mathBlocks.length - 1}\n\n`;
  });
  // Inline math ($...$)
  md = md.replace(/\$([^\$\n]+?)\$/g, (match, tex) => {
    mathBlocks.push({ tex: tex.trim(), display: false });
    return `MATHBLOCK_${mathBlocks.length - 1}`;
  });

  // Build header from frontmatter
  const article = document.getElementById('article');
  let headerHtml = '';
  if (meta.title) {
    headerHtml += `<h2>${meta.title}</h2>`;
    document.title = meta.title;
  }
  if (meta.date) headerHtml += `<p class="date">${meta.date}</p>`;

  // Render markdown
  let html = headerHtml + marked.parse(md);

  // Restore math blocks, rendering with KaTeX
  html = html.replace(/MATHBLOCK_(\d+)/g, (match, idx) => {
    const block = mathBlocks[parseInt(idx)];
    try {
      return katex.renderToString(block.tex, {
        displayMode: block.display,
        throwOnError: false,
      });
    } catch (e) {
      return block.tex;
    }
  });

  article.innerHTML = html;
})();
