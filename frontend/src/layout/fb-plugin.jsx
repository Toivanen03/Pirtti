import { useEffect } from "react"

const FbPlugin = ({ width, height }) => {

  useEffect(() => {
    if (window.FB) window.FB.XFBML.parse()
  }, [width])

  return (
    <div
      key={width}
      className="fb-page me-3"
      data-href="https://www.facebook.com/paivakotiyhdistyspirttiry"
      data-show-posts="true"
      data-height={width >= 1600 ? height + 20 : height + 400}
      data-width={width >= 1600 ? (width / 6).toFixed(0) : (width / 5).toFixed(0)}
      style={width < 1600 ? {transform: 'translateX(18%)'} : {}}
    >
      <blockquote
        cite="https://www.facebook.com/paivakotiyhdistyspirttiry"
        className="fb-xfbml-parse-ignore"
      >
        <a href="https://www.facebook.com/paivakotiyhdistyspirttiry">
          Päiväkotiyhdistys Pirtti ry
        </a>
      </blockquote>
    </div>
  )
}


export default FbPlugin