import { get } from './constants'

export default {
  [get.BID_CONFIG_BY_STYLE_ID]: (state, getters) => styleID => {
    return (
      getters[get.UPDATED_BID_CONFIG_BY_STYLE_ID](styleID) ||
      getters[get.CURRENT_BID_CONFIG_BY_STYLE_ID](styleID)
    )
  },
  [get.UPDATED_BID_CONFIG_BY_STYLE_ID]: state => styleID => {
    return state.bidConfig.configurations.updated.find(
      configuration => configuration.style_id === styleID
    )
  },
  [get.CURRENT_BID_CONFIG_BY_STYLE_ID]: state => styleID => {
    const filteredConfigurations = state.bidConfig.configurations.current.filter(
      configuration => configuration.style_id === styleID
    )
    return filteredConfigurations[filteredConfigurations.length - 1]
  },
  [get.LEAD_BY_ID]: state => id => {
    return state.leads.find(lead => lead.id === id)
  }
}
