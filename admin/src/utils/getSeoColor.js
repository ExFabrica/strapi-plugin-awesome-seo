
const getSeoWarningLevelColor = () =>  'danger200'

const getSeoErrorLevelColor = ()=>  'danger600'

const getBadgeTextColor = ( backgroundColor) => ['600', '700', '800', '900'].some(i => backgroundColor.includes(i)) ? 'neutral0' : 'neutral900'

module.exports ={ getSeoWarningLevelColor,getSeoErrorLevelColor, getBadgeTextColor}
