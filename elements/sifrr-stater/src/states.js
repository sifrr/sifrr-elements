import { html, createTemplateFromString } from '@sifrr/template';

const prettyJSON = json => {
  json = JSON.stringify(json, null, 4);
  json = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    function(match) {
      let cls = 'number';
      if (/:$/.test(match)) {
        cls = 'key';
        return '<span class="' + cls + '">' + match + '</span>';
      } else if (/^"/.test(match)) {
        cls = 'string';
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    }
  );
};

const State = html`
  <div class="${({ isActive }) => (isActive ? 'stateContainer on' : 'stateContainer off')}">
    <div
      class="dotC"
      data-target="${({ parentIndex }) => parentIndex}"
      data-state-index="${({ index }) => index}"
    >
      <div class="dot"></div>
    </div>
    <div class="state">
      ${({ data }) => createTemplateFromString(prettyJSON(data)).content.childNodes}
    </div>
    <div
      class="delete"
      data-target="${({ parentIndex }) => parentIndex}"
      data-state-index="${({ index }) => index}"
    >
      X
    </div>
  </div>
`;

const States = html`
  <div data-target="${el => el.index}">
    <button class="btn3 commit" type="button" name="commit">Commit</button>
    <button class="btn3 reset" type="button" name="reset">Reset</button>
    <button class="btn3 remove" type="button" name="remove">Remove</button>
    ${(el, oldV) =>
      el.states.map((jsn, j) =>
        State(
          { data: jsn, parentIndex: el.index, index: j, isActive: j <= el.activeState },
          oldV[j]
        )
      )}
  </div>
`;

export default States;
