import React from "react";
import { CgSpinner } from 'react-icons/cg';

export default function YoutubeEmbed({ youtube_link }) {
  const [loaded, setLoaded] = React.useState(false)
  
  return (
    <div className="flex items-center justify-center relative">
      {!loaded ? <CgSpinner size={64} className="animate-spin absolute self-center" /> : null}
      <div className={`${loaded ? '' : 'invisible'} video-responsive`}>
        <iframe
          src={`https://www.youtube.com/embed/${youtube_link?.slice(-11)}?rel=0&autoplay=1&mute=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setLoaded(true)}
          title="Embedded youtube"
        />
      </div>
    </div>
  )
}