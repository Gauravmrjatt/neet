export function getLexicalText(answer: any): string {
  if (!answer?.root?.children) return ''
  return answer.root.children
    .map((node: any) => {
      if (node.type === 'text') return node.text
      if (node.children) return getLexicalText({ root: node })
      return ''
    })
    .join(' ')
}
