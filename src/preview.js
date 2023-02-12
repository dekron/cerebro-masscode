
const Highlight = require('react-highlight').default;
require('!!style-loader!css-loader!../node_modules/highlight.js/styles/solarized-dark.css');
require('./styles.css');

export default ({ content, language }) => (
    <Highlight language={language}>
        {content}
    </Highlight>
);