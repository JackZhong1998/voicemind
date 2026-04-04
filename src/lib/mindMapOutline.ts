import type { MindMapNode } from '../types';

function escapeMd(s: string): string {
  return s.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

export function mindMapToMarkdownOutline(root: MindMapNode): string {
  const lines: string[] = [`# ${escapeMd(root.label)}`];
  if (root.notes) {
    lines.push('');
    lines.push(escapeMd(root.notes));
  }

  const walk = (nodes: MindMapNode[] | undefined, depth: number) => {
    if (!nodes?.length) return;
    for (const n of nodes) {
      const indent = '  '.repeat(Math.max(0, depth - 1));
      const bullet = depth === 1 ? '- ' : `${indent}- `;
      lines.push(`${bullet}${escapeMd(n.label)}`);
      if (n.notes) {
        lines.push(`${indent}  - *${escapeMd(n.notes)}*`);
      }
      walk(n.children, depth + 1);
    }
  };

  walk(root.children, 1);
  return lines.join('\n');
}

export function mindMapToJsonExport(root: MindMapNode): string {
  return JSON.stringify({ root }, null, 2);
}
