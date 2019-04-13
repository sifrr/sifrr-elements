# sifrr-stater

-   Load `sifrr-stater` element in your sifrr webapp
-   Add tag to HTML

```html
<sifrr-stater></sifrr-stater>
```

-   There will be a blue square on top right side of webpage. Click on it to show/hide the stater.

### Controls

<img src='./images/all_controls.png' title='controls' width='400'>

-   Fill in css selector of element you want to track sifrrState of. Hit ender or click `Add Target`, this will add taget element as a target in stater and add a tab in UI.

<img src='./images/individual_controls.png' title='individual controls' width='400'>

-   **Individual Tab Controls**
    -   `commit` - Keeps last state of element in stater and removes all other states.
    -   `reset` - Keeps first state of element in stater and resets element to this state.
    -   `remove` - Removes stater tracking for the element.
    -   When state changes new states will be added to that element's tab (if you have added that element as target)  
    -   Each state can be expanded by clicking on the state.
    -   Each state has a white circle on left, if you click on it, target will be set to this state. This way you can move to previous states easily.
-   `Commit All` - `commit`s all elements.
-   `Reset All` - `reset`s all elements.
-   `Remove All` - `remove`s all elements.
-   `Save Data` - save data in browser storage using Sifrr.Storage. (saves all tracked states and current active states)
-   `Load Data` - load previous saved data in browser storage and changes state of elements to saved active states.
    **Note**: Load and save data works using current urls of page. It will load data if data was saved on same url previously.
