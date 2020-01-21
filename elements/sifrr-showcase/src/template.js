import { html, memo, createTemplateFromString } from '@sifrr/template';

export const Li = html`
  <li
    class="${({ isActive }) => (isActive ? 'font showcase small current' : 'font showcase small')}"
    draggable="true"
  >
    ${({ name }) => name}<span>X</span>
  </li>
`;

export default html`
  <div class="container">
    <div class="flex-column" id="sidebar">
      <div class="box">
        <h3 class="font head">Variants</h3>
        <input
          id="variantName"
          type="text"
          name="variantName"
          :value="${el => el.store.getActiveValue().name || ''}"
          :_input="${memo(el => el.store.bindUpdate('name'))}"
        />
        <button
          class="font"
          type="button"
          name="createVariant"
          :_click="${memo(el => el.createNewVariant.bind(el))}"
        >
          Create new variant
        </button>
        <div id="variants">
          <div>
            ${(el, oldValue) => el.store.getValues().map((v, i) => Li(v, oldValue[i]))}
          </div>
        </div>
      </div>
      <div class="box">
        <label class="font small" for="style">Element CSS Styles</label>
        <sifrr-code-editor
          id="css"
          lang="css"
          :value="${el => el.store.getActiveValue().style || ''}"
          :_change="${memo(el => el.store.bindUpdate('style'))}"
        ></sifrr-code-editor>
      </div>
      <div class="box">
        <label class="font small" for="elState">JavaScript (this is element itself)</label>
        <sifrr-code-editor
          id="elState"
          lang="javascript"
          :value="${el => el.store.getActiveValue().elState || ''}"
          :_change="${memo(el => el.store.bindUpdate('elState'))}"
        ></sifrr-code-editor>
      </div>
    </div>
    <div class="flex-column" id="main">
      <div class="box" id="element" :sifrr-html="true">
        ${el => createTemplateFromString(el.store.getActiveValue().code).content.childNodes}
      </div>
      <i id="fs">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-maximize"
        >
          <path
            d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"
          />
        </svg>
      </i>
      <div class="box" id="code">
        <label class="font small" for="elementName">Element Name</label>
        <input
          type="text"
          name="elementName"
          placeholder="Enter element name here..."
          :value="${el => el.store.getActiveValue().element || ''}"
          :_input="${memo(el => el.updateHtml.bind(el))}"
        />
        <label class="font small" for="customUrl">Custom Url</label>
        <input
          type="text"
          name="customUrl"
          placeholder="Enter element url here..."
          :value="${el => el.store.getActiveValue().elementUrl || ''}"
          :_input="${memo(el => el.store.bindUpdate('elementUrl'))}"
        />
        <label class="font small" for="elementName">Is JS File</label>
        <span class="font" id="error"></span>
        <br />
        <label class="font small" for="htmlcode">HTML Code</label>
        <sifrr-code-editor
          id="elCode"
          :_change="${memo(el => el.store.bindUpdate('code'))}"
          :value="${el => el.store.getActiveValue().code || ''}"
        ></sifrr-code-editor>
      </div>
    </div>
  </div>
`;
