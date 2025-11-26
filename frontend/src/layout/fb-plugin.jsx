import { useEffect } from "react"

const FbPlugin = ({ width, height }) => {

  useEffect(() => {
    if (window.FB) window.FB.XFBML.parse()
  }, [width])

  return (
    <div
      key={width}
      className="fb-page p-0"
      data-href="https://www.facebook.com/paivakotiyhdistyspirttiry"
      data-show-posts="true"
      data-height={height}
      data-width={(width / 6).toFixed(0)}
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