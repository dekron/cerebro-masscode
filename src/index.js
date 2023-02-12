const pluginIcon = require('./icon.png');
const axios = require('axios');
const Preview = require('./preview').default;

const REGEXP = /mass\s(.*)/;

const search = async (term, actions) => {
    try {
      const { data } = await axios.get(
        'http://localhost:3033/snippets/embed-folder'
      )
      const options = data
        .filter(i => !i.isDeleted && (term.length && i.name.toLowerCase().includes(term.toLowerCase())))
        .sort((a, b) => a.createdAt > b.createdAt ? -1 : 1)
        .reduce((acc, snippet, ij) => {
          const fragments = snippet.content.map((fragment, ii) => {
            const previewContent = fragment.value || '';
            return {
              title: snippet.name || 'Untitled snippet',
              id: `${ij}-${ii}`,
              icon: pluginIcon,
              subtitle:  `${fragment.language} • ${snippet.folder?.name || 'Inbox'}`,
              onSelect: () => {
                actions.copyToClipboard(fragment.value);
              },
              getPreview: () => (
                <Preview language={fragment.language} content={previewContent} />
              ),
              clipboard: fragment.value,
            }
          })
          acc.push(...fragments)
          return acc
        }, [])
      return options;
    } catch (err) {
    }
  }

/**
 *
 * @param  {String} options.term
 * @param  {Function} options.display
 */
const fn = ({ term, display, actions }) => {
  const match = term.match(REGEXP);
  const searchName = match?.[1];
  if (!searchName) {
    return;
  }
  search(searchName, actions).then((list) => {
    if(list.length) {
      display(list)
    }
  })
};

module.exports = {
  name: 'massCode snippet',
  keyword: 'mass',
  icon: pluginIcon,
  fn
};
