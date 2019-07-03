const deviceWidth = wx.getSystemInfoSync().windowWidth

export default function (pic, width = deviceWidth, height = deviceWidth, mode = 0) {
  if (width || height) {
    return `${pic}?imageView/${mode}${width ? '/w/' + width * 2 : ''}`
  } else {
    return `${pic}?imageslim`
  }
}
