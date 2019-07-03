export default {
  isAuthorized: (state) => !!state.token,
  PointCoords: (state) => {
    return state.pointCoords
  }
}
