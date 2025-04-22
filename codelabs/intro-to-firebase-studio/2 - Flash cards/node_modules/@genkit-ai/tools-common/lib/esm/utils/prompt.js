import { stringify } from 'yaml';
export function fromMessages(frontmatter, messages) {
    let renderedMessages = '';
    messages.forEach((message) => {
        renderedMessages += `{{role "${message.role}"}}\n`;
        renderedMessages += message.content.map(partToString);
        renderedMessages += '\n\n';
    });
    return `---
${stringify(frontmatter)}
---

${renderedMessages}`;
}
function partToString(part) {
    if (part.text) {
        return part.text;
    }
    else if (part.media) {
        return `{{media url:${part.media.url}}}`;
    }
    else if (part.toolRequest) {
        return '<< tool request omitted >>';
    }
    else if (part.toolResponse) {
        return '<< tool response omitted >>';
    }
    else {
        return '';
    }
}
//# sourceMappingURL=prompt.js.map