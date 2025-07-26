export const TextBold = ({text}: {text: string}) => {
    const parts = text.split(/(\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.match(/^\*[^*]+\*$/)) {
        return <b key={ i }> { part.slice(1, -1) } </b>;
      }
      return part;
    });
  }
  