export const parseCsv = (raw: string) => {
  let i = 0;
  const rows = [];
  let row = [];
  while (i < raw.length) {
    switch (raw[i]) {
      case ",":
        // Empty cell.
        row.push("");
        i++;
        break;
      case '"':
        // Quoted cell.
        i++;
        let cell = "";
        while (i < raw.length) {
          let len = raw.slice(i).indexOf('"');
          if (len == -1) {
            len = raw.length - 1;
          }
          cell += raw.slice(i, (i += len));
          // `i` is now at a double quote character or raw.length.
          i++;
          if (raw[i] !== '"') {
            break;
          }
          cell += '"';
          i++;
        }
        row.push(cell);
        if (raw[i] === ",") {
          i++;
        }
        break;
      case "\r":
        if (raw[i - 1] == ",") {
          // Empty cell at end of line.
          row.push("");
        }
        i++;
        if (raw[i] == "\n") {
          i++;
        }
        rows.push(row);
        row = [];
        break;
      case "\n":
        if (raw[i - 1] == ",") {
          // Empty cell at end of line.
          row.push("");
        }
        i++;
        rows.push(row);
        row = [];
        break;
      default:
        // Unquoted cell.
        const len = /[,\r\n]/.exec(raw.slice(i))?.index ?? raw.length - i;
        row.push(raw.slice(i, (i += len)));
        if (raw[i] === ",") {
          i++;
        }
        break;
    }
  }
  rows.push(row);
  return rows;
};
