export const getvideoPageList = (state) => {
  return state.videoPageList && state.videoPageList.data.slice()
}
