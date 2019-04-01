/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import types from '../types';
import TransactionAnalysis from '../../helpers/TransactionAnalysis';

const initialState = () => ({
  developerKey: '',
  compareOption: TransactionAnalysis.GetCompareOptions()[0].key,
});

const state = initialState();
const getters = {
  developerKey: state => state.developerKey,
  compareOption: state => state.compareOption,
};
const actions = {};
const mutations = {

  /**
   * @param state
   * @param developerKey
   */
  [types.SET_DEVELOPER_KEY](state, developerKey) {
    state.developerKey = developerKey;
  },

  /**
   * @param state
   * @param compareOption
   */
  [types.SET_COMPARE_OPTION](state, compareOption) {
    state.compareOption = compareOption;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
