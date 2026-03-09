#!/bin/bash
# Usage: ./new-article.sh "my-article-slug" "My Article Title"

SLUG="$1"
TITLE="$2"

if [ -z "$SLUG" ] || [ -z "$TITLE" ]; then
  echo "Usage: ./new-article.sh <slug> <title>"
  echo "Example: ./new-article.sh my-new-post \"My New Post Title\""
  exit 1
fi

DIR="articles/$SLUG"

if [ -d "$DIR" ]; then
  echo "Error: $DIR already exists"
  exit 1
fi

mkdir -p "$DIR/assets"
cp article.html "$DIR/index.html"

cat > "$DIR/content.md" << EOF
---
title: "$TITLE"
email: mfirth117@gmail.com
date: $(date +%Y-%m-%d)
---

Write your article here. Images go in the assets/ folder and can be referenced as:

![Alt text](assets/my-image.png)

LaTeX works with dollar signs: \$E = mc^2\$ for inline, or double dollars for display:

\$\$
\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\epsilon_0}
\$\$
EOF

echo "Created $DIR/"
echo "  - Edit $DIR/content.md to write your article"
echo "  - Put images in $DIR/assets/"
echo "  - Add an entry to articles.json to list it on the homepage"
