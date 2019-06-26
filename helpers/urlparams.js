import queryString from 'query-string';

function getParam(name) {
  return queryString.parse(location.search)[name];
}

function setParam(name, value) {
  const newParams = Object.assign(queryString.parse(location.search), {
    [name]: value
  });
  history.replaceState(
    newParams,
    'Title',
    `${location.pathname}?${queryString.stringify(newParams)}`
  );
}

export { getParam, setParam };
