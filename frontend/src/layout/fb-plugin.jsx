import { useEffect } from "react"

const FbPlugin = ({ width }) => {

  useEffect(() => {
    if (window.FB) window.FB.XFBML.parse()
  }, [width])

  return (
    <div
      key={width}
      className="fb-page mt-4 me-3 p-0"
      data-href="https://www.facebook.com/paivakotiyhdistyspirttiry"
      data-tabs="timeline"
      data-height={window.innerHeight + 100}
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