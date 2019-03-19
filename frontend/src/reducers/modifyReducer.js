const initalState = '5';

const modifyReducer = (state = initalState, action) => {
  switch (action.type) {
    case 'CLICK_MODIFY':
      return action.value;
    default:
      return state;
  }
};

export default modifyReducer;
